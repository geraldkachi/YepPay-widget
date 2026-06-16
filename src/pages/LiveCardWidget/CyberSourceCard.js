import React, { useEffect, useRef, useState, useMemo } from "react";
import { usePaymentContext } from "../../context/PaymentContext";
import { cyberSourceAuth, cyberSourceAuthPay, cyberSourceValidate } from "../../services/card";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput/SelectInput";
import ActionButton from "../../components/Button/ActionButton";
import countryDB from "countrycitystatejson";
import { useHistory } from "react-router-dom";
import { urls } from "../../utils/urls";
import { serbiaStates, serbiaCities, customStates, customCities } from "./data"; 

// Helper: get states for a country (custom data takes priority)
const getStatesForCountry = (countryShort) => {
    if (countryShort === "RS") return serbiaStates;
    if (customStates[countryShort]) return customStates[countryShort];
    return countryDB?.getStatesByShort(countryShort) || [];
};

// Helper: get cities for a country + state (custom data takes priority)
const getCitiesForState = (countryShort, stateName) => {
    if (countryShort === "RS") return serbiaCities[stateName] || [];
    if (customCities[countryShort]?.[stateName]) return customCities[countryShort][stateName];
    return countryDB?.getCities(countryShort, stateName) || [];
};

const CyberSourceCard = ({ accessCode, setShowCyberSource }) => {
    const paymentContext = usePaymentContext();
    const { cardInfo } = paymentContext;
    const [loading, setLoading] = useState(false);
    const [customerAuthInfo, setConsumerAuthInfo] = useState('');
    const [stepUpData, setStepUpData] = useState(null);
    const isAuthCalled = useRef(false);
    const isValidationCalled = useRef(false);
    const history = useHistory();

    // useMutation for cyberSourceAuth
    const { mutate: authenticateWithCyberSource, isLoading: authLoading } = useMutation(
        cyberSourceAuth,
        {
            retry: false,
            cacheTime: 0,
            onSuccess: (response) => {
                if (response?.data?.reason === "INVALID_ACCOUNT") {
                    paymentContext.setPayment({});
                    paymentContext.setErrorMessage(response?.data?.message);
                    history.push(urls.failure(accessCode));
                    return;
                }

                if (!response?.status) {
                    paymentContext.setPayment({});
                    paymentContext.setErrorMessage(response.message);
                    history.push(urls.failure(accessCode));
                    return;
                }

                if (response?.data?.consumerAuthenticationInformation?.accessToken) {
                    setConsumerAuthInfo(response.data.consumerAuthenticationInformation);
                }
            },
            onError: (error) => {
                console.error("Error calling cyberSourceAuth:", error);
                paymentContext.setErrorMessage("Authentication failed. Please try again.");
                history.push(urls.failure(accessCode));
            }
        }
    );

    // useMutation for cyberSourceValidate
    const { mutate: validateCyberSource, isLoading: validating } = useMutation(
        cyberSourceValidate,
        {
            mutationKey: ['cyberSourceValidate', accessCode],
            retry: false,
            cacheTime: 0,
            onMutate: async () => {
                isValidationCalled.current = true;
                console.log("Validation started - preventing duplicate calls");
            },
            onSuccess: (response) => {
                console.log("Validation completed successfully");
                if (response.status) {
                    paymentContext.setSuccessMessage(response?.message);
                    paymentContext.setPayment({
                        currency: response?.data?.currency,
                        amount: response?.data?.amount,
                        callback_url: response?.data?.callback_url,
                    });
                    history.push(urls.success(accessCode));
                } else {
                    paymentContext.setErrorMessage(response?.message);
                    history.push(urls.failure(accessCode));
                }
            },
            onError: (error) => {
                console.error("Validation error:", error);
                paymentContext.setErrorMessage("Validation failed due to poor network. Please try again");
                history.push(urls.failure(accessCode));
            },
            onSettled: () => {
                console.log("Validation settled - allowing future calls if needed");
            }
        }
    );

    // useMutation for cyberSourceAuthPay
    const { mutate: authPayCyberSource, isLoading: authPayLoading } = useMutation(
        cyberSourceAuthPay,
        {
            onSuccess: (response) => {
                if (!response.status) {
                    paymentContext.setCyberDetail(response?.data?.payload);
                    if (response?.data?.errors) {
                        paymentContext.setPayment({});
                        const errorParts = [
                            response?.message,
                            response?.data?.errors?.first_name,
                            response?.data?.errors?.last_name,
                            response?.data?.errors?.reference_id
                        ];
                        const errorMessage = errorParts.filter(part => part).join(' ');
                        paymentContext.setErrorMessage(errorMessage);
                        history.push(urls.failure(accessCode));
                    } else {
                        setStepUpData(response.data);
                    }
                } else {
                    paymentContext.setPayment({
                        currency: response.data?.currency,
                        amount: response.data?.amount,
                        callback_url: response.data?.callback_url,
                    });
                    paymentContext.setSuccessMessage(response?.message);
                    history.push(urls.success(accessCode));
                }
            },
            onError: (error) => {
                console.error("Auth pay error:", error);
                paymentContext.setPayment({});
                paymentContext.setErrorMessage("Operation failed due to poor network. Please try again");
            },
            onSettled: () => {
                setLoading(false);
            }
        }
    );

    // Call cyberSourceAuth only once
    useEffect(() => {
        if (cardInfo && !isAuthCalled.current && !customerAuthInfo) {
            isAuthCalled.current = true;
            authenticateWithCyberSource({
                expiry_month: cardInfo?.expiry_month,
                expiry_year: cardInfo?.expiry_year,
                card_number: cardInfo?.card_number,
            });
        }
    }, [cardInfo, customerAuthInfo]);

    // Automatically submit the form when the access token is available
    useEffect(() => {
        if (customerAuthInfo?.accessToken) {
            const cardinalCollectionForm = document.querySelector("#cardinal_collection_form");
            if (cardinalCollectionForm) {
                cardinalCollectionForm.submit();
            }
        }
    }, [customerAuthInfo?.accessToken]);

    // Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin === customerAuthInfo?.deviceDataCollectionUrl) {
                console.log("Valid response:", event.data);
                if (event.data) {
                    toast.success("Device data collection completed");
                } else {
                    toast.error("An error occurred: No data received from the iframe");
                    paymentContext.setErrorMessage("Network error. Please try again");
                    history.push(urls.failure(accessCode));
                }
            } else {
                console.warn("Ignored message from unknown origin:", event.origin);
            }
        };

        if (customerAuthInfo?.deviceDataCollectionUrl) {
            window.addEventListener("message", handleMessage, false);
            return () => window.removeEventListener("message", handleMessage);
        }
    }, [customerAuthInfo?.deviceDataCollectionUrl]);

    // Handle step-up authentication when stepUpData is available
    useEffect(() => {
        if (stepUpData) {
            const stepUpForm = document.getElementById("step-up-form");
            if (stepUpForm) {
                stepUpForm.submit();
            }
        }
    }, [stepUpData]);

    // Country, state, and city selection logic
    const [countryList] = useState(() =>
        countryDB.getCountries().map((each) => ({ value: each.shortName, label: each.name }))
    );
    const [country, setCountry] = useState({ value: "NG", label: "Nigeria" });
    const [stateList, setStateList] = useState(() => getStatesForCountry("NG"));
    const [state, setState] = useState({ value: "", label: "Select State" });
    const [cityList, setCityList] = useState([]);
    const [city, setCity] = useState({ value: "", label: "Select City" });
    const [address, setAddress] = useState("");
    const [zipcode, setZipcode] = useState("");

    // Check if currency is USD
    const isUSD = paymentContext?.paymentDetail?.currency === 'USD';

    const allowSubmission = useMemo(() => {
        const hasCountry = country?.value && country.value !== "";
        const hasState = state?.value && state.value !== "";
        const hasCity = city?.value && city.value !== "";
        const hasAddress = address?.trim() !== "";

        if (isUSD) {
            const hasValidZipcode = zipcode?.trim() !== "";
            return hasCountry && hasState && hasCity && hasAddress && hasValidZipcode;
        } else {
            return hasCountry && hasState && hasCity && hasAddress;
        }
    }, [country, state, city, address, zipcode, isUSD]);

    const handleCountryChange = (val) => {
        setCountry(val);
        setState({ value: "", label: "Select State" });
        setCity({ value: "", label: "Select City" });
        setStateList(getStatesForCountry(val.value));
        setCityList([]);
    };

    const handleStateChange = (val) => {
        const formattedState = val.label === "Abuja (Federal Capital Territory)"
            ? { value: "Abuja", label: "Abuja" }
            : val;
        setState(formattedState);
        setCity({ value: "", label: "Select City" });
        setCityList(getCitiesForState(country.value, val.value));
    };

    const handleCityChange = (val) => setCity(val);
    const handleAddressChange = (e) => setAddress(e.target.value);
    const handleZipcodeChange = (e) => setZipcode(e.target.value);

    const handleSubmit = async () => {
        if (!allowSubmission) return;

        setLoading(true);

        setTimeout(async () => {
            try {
                const ipResponse = await fetch("https://api64.ipify.org?format=json");
                const { ip } = await ipResponse.json();

                const fullName = paymentContext?.cardInfo?.name || "";
                const [firstName, ...lastNameParts] = fullName.split(" ");
                const lastName = lastNameParts.join(" ");

                const finalZipcode = isUSD && zipcode?.trim() ? zipcode.trim() : "101241";

                const payload = {
                    address: address,
                    zipcode: finalZipcode,
                    country: country.value,
                    state: state.value,
                    city: city.value,
                    ...paymentContext.cardInfo,
                    access_code: accessCode,
                    reference_id: customerAuthInfo?.referenceId,
                    return_url: `https://staging-business.ce-nextgen.com/confirm-otp`,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: "1234567890",
                    browser_info: {
                        ipAddress: ip,
                        httpAcceptContent: navigator?.languages?.join(", ") || "N/A",
                        httpBrowserLanguage: navigator.language || "N/A",
                        httpBrowserJavaEnabled: navigator.javaEnabled(),
                        httpBrowserJavaScriptEnabled: true,
                        httpBrowserColorDepth: screen.colorDepth.toString(),
                        httpBrowserScreenHeight: screen.height.toString(),
                        httpBrowserScreenWidth: screen.width.toString(),
                        httpBrowserTimeDifference: new Date().getTimezoneOffset().toString(),
                        userAgentBrowserValue: navigator.userAgent,
                    },
                };

                authPayCyberSource(payload);
            } catch (error) {
                console.error("Submit error:", error);
                paymentContext.setPayment({});
                paymentContext.setErrorMessage("Operation failed due to poor network. Please try again");
                setLoading(false);
            }
        }, 10000);
    };

    const handleValidation = () => {
        if (isValidationCalled.current) {
            console.log("Validation already called - preventing duplicate");
            return;
        }

        if (validating) {
            console.log("Validation already in progress - preventing duplicate");
            return;
        }

        if (!paymentContext?.cyberDetail) {
            toast.error("Authentication data missing. Please restart the process.");
            paymentContext.setErrorMessage("Authentication data missing. Please restart the process.");
            history.push(urls.failure(accessCode));
            return;
        }

        isValidationCalled.current = true;
        setStepUpData(null);

        console.log("Starting cyberSourceValidate call");
        validateCyberSource({
            access_code: accessCode,
            customer_code: paymentContext?.customerCode,
            payload: paymentContext?.cyberDetail
        });
    };

    // Show loading state while authenticating
    if (authLoading && !customerAuthInfo) {
        return (
            <div className="location-details-form" style={{
                display: 'flex',
                alignItems: "center",
                justifyContent: 'center',
                width: '100%',
                height: 400
            }}>
                <Spinner height="40" width="40" colour="#0066FF" />
                <span style={{ marginLeft: '10px' }}>Authenticating...</span>
            </div>
        );
    }

    // Render step-up iframe if step-up data is available
    if (stepUpData) {
        if (!stepUpData.stepUpUrl || !stepUpData.accessToken) {
            return (
                <div className="error-message" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: 400
                }}>
                    <p>Authentication failed due to missing data. Please try again.</p>
                    <button
                        className="submitbutton"
                        style={{
                            textAlign: 'center',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onClick={() => window.location.reload()}
                    >
                        <span>Retry</span>
                    </button>
                </div>
            );
        }

        return (
            <div className="ml-20">
                <iframe
                    name="step-up-iframe"
                    id="step-up-iframe"
                    height="400"
                    title="Step-Up Authentication"
                    style={{ width: '100%' }}
                ></iframe>

                <form
                    id="step-up-form"
                    target="step-up-iframe"
                    method="post"
                    action={stepUpData.stepUpUrl}
                >
                    <input type="hidden" name="JWT" value={stepUpData?.accessToken} />
                    <input type="hidden" name="MD" value={stepUpData?.payload?.consumerAuthenticationInformation?.authenticationTransactionId} />
                    <button type="submit" style={{ display: "none" }}>Submit</button>
                </form>

                {validating && (
                    <div className="location-details-form" style={{
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                        <Spinner height="40" width="40" colour="#0066FF" />
                        <span style={{ marginLeft: '10px' }}>Validating...</span>
                    </div>
                )}

                {!validating && !isValidationCalled.current && (
                    <ActionButton
                        type="button"
                        className="submitbutton"
                        onClick={handleValidation}
                        disabled={validating || isValidationCalled.current}
                        testId="card-payment"
                    >
                        <span></span>
                        <span>Proceed</span>
                        <span></span>
                    </ActionButton>
                )}

                {isValidationCalled.current && !validating && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Validation completed. Please wait...</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            {(loading && !stepUpData) && (
                <div className="card-pin-loader">
                    <Spinner height="40" width="40" colour="#0066FF" />
                </div>
            )}

            {validating && (
                <div className="location-details-form" style={{
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'center',
                    width: '100%',
                    height: 400
                }}>
                    <Spinner height="40" width="40" colour="#0066FF" />
                    <span style={{ marginLeft: '10px' }}>Validating...</span>
                </div>
            )}

            {/* Hidden iframe for device data collection */}
            {!validating && (
                <iframe
                    id="cardinal_collection_iframe"
                    name="collectionIframe"
                    height="10"
                    width="10"
                    style={{ display: "none" }}
                    title="Device Data Collection Iframe"
                ></iframe>
            )}

            {/* Form for device data collection */}
            <form
                id="cardinal_collection_form"
                method="POST"
                target="collectionIframe"
                action={customerAuthInfo?.deviceDataCollectionUrl}
            >
                <input type="hidden" name="JWT" value={customerAuthInfo?.accessToken || ""} readOnly />
                <button type="submit" style={{ display: "none" }}>Submit</button>
            </form>

            {!validating && (
                <div className="location-details-form">
                    <SelectInput
                        label="COUNTRY"
                        onChange={handleCountryChange}
                        value={country}
                        options={countryList}
                    />

                    <div className="address">
                        <TextInput
                            name="address"
                            onChange={handleAddressChange}
                            value={address}
                            placeholder="Enter your address"
                            required
                        />
                    </div>

                    {isUSD && (
                        <div className="zip">
                            <TextInput
                                name="zipcode"
                                onChange={handleZipcodeChange}
                                value={zipcode}
                                placeholder="Enter zip code"
                                required
                                label="ZIP CODE"
                                maxLength={9}
                            />
                        </div>
                    )}

                    <div className="grid">
                        <SelectInput
                            placeholder="Choose State"
                            label="STATE"
                            options={stateList.map((each) => ({ value: each, label: each }))}
                            onChange={handleStateChange}
                            value={state}
                            required
                        />
                        <SelectInput
                            placeholder="Choose City"
                            label="CITY"
                            onChange={handleCityChange}
                            value={city}
                            options={cityList.map((each) => ({ value: each, label: each }))}
                            required
                        />
                    </div>

                    <div className="submit">
                        <ActionButton
                            type="button"
                            className="submitbutton"
                            onClick={handleSubmit}
                            disabled={!allowSubmission || loading || authPayLoading}
                            loading={loading || authPayLoading}
                            spinColour="#FFFFFF"
                            testId="card-payment"
                        >
                            <span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        x="3.33331"
                                        y="7.33333"
                                        width="9.33333"
                                        height="6.66667"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4.66669 5.33333C4.66669 3.49239 6.15907 2 8.00002 2V2C9.84097 2 11.3334 3.49238 11.3334 5.33333V7.33333H4.66669V5.33333Z"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            <span>{loading || authPayLoading ? "Processing..." : "Proceed"}</span>
                            <span>
                                <svg
                                    width="8"
                                    height="13"
                                    viewBox="0 0 8 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.76438 6.5L0 1.05573L1.11781 0L8 6.5L1.11781 13L0 11.9443L5.76438 6.5Z"
                                        fill="white"
                                    />
                                </svg>
                            </span>
                        </ActionButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CyberSourceCard;