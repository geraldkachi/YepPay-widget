import React, { useState } from "react";
import ActionButton from "../../components/Button/ActionButton";
import SelectInput from "../../components/SelectInput/SelectInput";
import TextInput from "../../components/TextInput";
import { usePaymentContext } from "../../context/PaymentContext";
import { payWithCard } from "../../services/card";
import { customStates, customCities } from "./data"; // adjust path as needed
import { serbiaStates, serbiaCities } from "./data"; // adjust path as needed

const countryDB = require("countrycitystatejson");

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

const LocationDetails = ({ accessCode }) => {
  const paymentContext = usePaymentContext();

  const [countryList] = useState(() =>
    countryDB?.getCountries().map((each) => ({
      value: each.shortName,
      label: each.name,
    }))
  );

  const [loading, setLoading] = useState(false);

  const [country, setCountry] = useState({ value: "NG", label: "Nigeria" });

  const [stateList, setStateList] = useState(() => getStatesForCountry("NG"));
  const [state, setState] = useState({ value: stateList[0], label: stateList[0] });

  const [cityList, setCityList] = useState(() => getCitiesForState("NG", stateList[0]));
  const [city, setCity] = useState({ value: cityList[0], label: cityList[0] });

  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");

  const handleCountryChange = (val) => {
    setCountry(val);
    setState({ value: "", label: "Select State" });
    setCity({ value: "", label: "Select City" });

    const newStates = getStatesForCountry(val.value);
    setStateList(newStates);
    setCityList([]);
  };

  const handleStateChange = (val) => {
    setState(val);
    setCity({ value: "", label: "Select City" });

    const newCities = getCitiesForState(country.value, val.value);
    setCityList(newCities);
  };

  const handleCityChange = (val) => setCity(val);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleZipChange = (e) => setZip(e.target.value);

  const handleSubmit = async () => {
    const formData = {
      address,
      zipcode: zip,
      country: country.label,
      state: state.value,
      city: city.value,
    };

    const payload = { ...formData, ...paymentContext.payment };
    setLoading(true);

    try {
      const response = await payWithCard(payload);
      if (response.status) {
        if (response.data.authorization_mode === "redirect") {
          window.location.replace(response.data.additional_information);
        }
      } else {
        paymentContext.setPayment(() => ({}));
        paymentContext.setErrorMessage(response.message);
        return history.push(urls.failure(accessCode));
      }
    } catch (error) {
      paymentContext.setPayment(() => ({}));
      paymentContext.setErrorMessage(
        "Operation failed due to poor network. Please try again"
      );
    }
  };

  const allowSubmission =
    country.value &&
    state.value &&
    city.value &&
    address.trim() &&
    zip.trim().length >= 4;

  return (
    <div className="cardpaymentwidget">
      <h1 style={{ textAlign: "center", width: "254px", margin: "0px auto" }}>
        Kindly provide the information below
      </h1>
      <div className="location-details-form">
        <SelectInput
          label="COUNTRY"
          onChange={handleCountryChange}
          value={country}
          options={countryList}
        />
        {/* <div className="address">
          <TextInput
            name="address"
            onChange={handleAddressChange}
            value={address}
          />
        </div> */}
        {/* <div className="grid">
          <SelectInput
            placeholder="Choose State"
            label="STATE"
            options={stateList.map((each) => ({
              value: each,
              label: each,
            }))}
            onChange={handleStateChange}
            value={state}
          />
          <SelectInput
            placeholder="Choose City"
            label="CITY"
            onChange={handleCityChange}
            value={city}
            options={cityList.map((each) => ({
              value: each,
              label: each,
            }))}
          />
        </div> */}
        <div className="zip">
          <TextInput
            label="ZIPCODE"
            placeholder="Enter ZipCode"
            type="text"
            name="zip"
            onChange={handleZipChange}
            value={zip}
          />
        </div>

        <div className="submit">
          <ActionButton
            type="button"
            className="submitbutton"
            onClick={handleSubmit}
            disabled={!allowSubmission}
            loading={loading}
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
            <span>Proceed</span>
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
    </div>
  );
};

export default LocationDetails;