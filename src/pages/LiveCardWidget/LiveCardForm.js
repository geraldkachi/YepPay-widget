import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Payment from "payment";
import {
	formatCreditCardNumber,
	formatCVC,
	formatExpirationDate,
} from "../../utils";
import { resolveFeesCard } from "../../services/card";
import FormError from "../../utils/form/FormError";
import { usePaymentContext } from "../../context/PaymentContext";
import { getIssuerType } from "../../utils/getIssuerType";
import ActionButton from "../../components/Button/ActionButton";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import Spinner from "../../components/Spinner";
import countryDB from "countrycitystatejson";
import { useFormik } from "formik";

const LiveCardForm = ({
	paymentDetail,
	rememberedCards,
	isLoading,
	setSelectedCard,
	setShowPin,
	setShowLocationDetails, 
	setShowCyberSource,
	onCardTypeChange,
}) => {
	const [cachedBin, setCachedBin] = useState("");
	const [showRedirecting, setShowRedirecting] = useState(false);
	const [showCvv, setShowCvv] = useState(false);
	const { accessCode } = useParams();
	const paymentContext = usePaymentContext();

	const shouldResolveFees = paymentDetail.bearer !== "account";

	const resolvedFeesForInputtedCard = useFetchWithParams(
		[
			"resolveFeesCardInputtedCard",
			{ bin: cachedBin, accessCode, payment_channel: "card" },
		],
		resolveFeesCard,
		{
			onSuccess: (data) => {
				paymentContext.setAdditionalFee(data?.fee_formatted ?? null);
			},
			onError: () => {
			},
			enabled: cachedBin ? true : false,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		}
		
	);

	const formik = useFormik({
		initialValues: {
			card_number: "",
			expiry: "",
			cvv: "",
			first_name: "",
			last_name: "",
		},
		onSubmit: async (values) => {
			const expiryInfo = values.expiry.split("/");
			const fullName = `${values.first_name} ${values.last_name}`.trim();
			
			const payload = {
				access_code: paymentDetail.access_code,
				...values,
				name: fullName,
				first_name: values.first_name,
				last_name: values.last_name,
				remember_card: false,
				card_number: values.card_number.split(" ").join(""),
				expiry_month: expiryInfo[0],
				expiry_year: expiryInfo[1].substring(0, 2),
			};
			paymentContext.setCardPayDetails(payload)

			const issuer = Payment.fns.cardType(values.card_number);
			if (issuer === "verve" || issuer === "maestro") {
				setShowPin(true);
			} else {
				setShowCyberSource(true);
				paymentContext.setCardPayDetails({
					access_code: paymentDetail.access_code,
					...values,
					name: fullName,
					first_name: values.first_name,
					last_name: values.last_name,
					remember_card: false,
					card_number: values.card_number.split(" ").join(""),
					expiry_month: expiryInfo[0],
					expiry_year: expiryInfo[1].substring(0, 2),
				  });
			}
		},
	});

	const handleSelectCard = (card) => {
		setSelectedCard(card);
		formik.resetForm();
		if (shouldResolveFees) {
			setCachedBin("");
			paymentContext.setAdditionalFee(null);
		}
	};

	const handleSubmit = () => {
		return formik.handleSubmit();
	};

	const { card_number, expiry, cvv, first_name, last_name } = formik.values;
	const issuer = Payment.fns.cardType(card_number);
	const canMakePayment =
		formik.values.card_number.trim() &&
		formik.values.card_number.split(" ").join("").length > 8 &&
		formik.values.expiry.trim().length === 5 &&
		formik.values.cvv.trim().length === 3 &&
		formik.values.first_name.trim() &&
		formik.values.last_name.trim();

	React.useEffect(() => {
		if (issuer) {
			onCardTypeChange(issuer);
		}
	}, [issuer, onCardTypeChange]);

	return (
		<>
			<div className="cardpaymentwidget">
				{showRedirecting && (
					<div className="card-redirect-loader">
						<div className="center">
							<div>
								<Spinner
									height="40"
									width="40"
									colour="#0066FF"
								/>
							</div>
							<h1 className="text-center">...Redirecting...</h1>
						</div>
					</div>
				)}
				<h1 className="text-center">
					Enter your card details correctly to make payment
				</h1>
				
				{paymentDetail.currency === "USD" && (issuer === "verve" || issuer === "maestro") && (
					<h1 className="text-center" style={{color: '#0066FF', marginTop: '10px'}}>
						You can't use a Verve or Maestro type card to make this payment for USD transactions
					</h1>
				)}

				<form>
					<div className="input-wrapper">
						<input
							type="tel"
							name="card_number"
							autoComplete="off"
							className="form-control input-cardnumber"
							placeholder="0000 0000 0000 0000 0000"
							pattern="[\d| ]{16,22}"
							value={formatCreditCardNumber(card_number)}
							onChange={formik.handleChange}
							onBlur={() => {
								if (shouldResolveFees) {
									if (
										!cachedBin &&
										formik.values.card_number.trim()
											.length >= 8
									) {
										setCachedBin(
											formik.values.card_number
												.split(" ")
												.join("")
												.slice(0, 6)
										);
										return;
									}

									if (
										cachedBin &&
										formik.values.card_number.trim()
											.length >= 8 &&
										cachedBin !==
											formik.values.card_number.slice(
												0,
												6
											)
									) {
										setCachedBin(
											formik.values.card_number
												.split(" ")
												.join("")
												.slice(0, 6)
										);
										return;
									}

									if (
										!formik.values.card_number.trim() ||
										formik.values.card_number.trim()
											.length < 6
									) {
										setCachedBin("");
										paymentContext.setAdditionalFee(null);
									}
								}
							}}
							autocompletetype="cc-number"
						/>
						<label
							htmlFor="cardNumber"
							className="label label--floating"
						>
							Card Number
						</label>
						<div className="cardtype">
							<img src={getIssuerType(issuer)} alt="Card Type" />
						</div>
					</div>
					<FormError formik={formik} inputName="card_number" />

					{/* First and Last Name Row */}
					<div className="flex-input name-row">
						<div style={{ flex: 1, marginRight: '10px' }}>
							<div className="input-wrapper">
								<input
									type="text"
									name="first_name"
									autoComplete="off"
									className="form-control input-cardnumber"
									placeholder="First Name"
									value={first_name}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								<label htmlFor="firstName" className="label label--floating">
									First Name
								</label>
							</div>
							<FormError formik={formik} inputName="first_name" />
						</div>
						
						<div style={{ flex: 1 }}>
							<div className="input-wrapper">
								<input
									type="text"
									name="last_name"
									autoComplete="off"
									className="form-control input-cardnumber"
									placeholder="Last Name"
									value={last_name}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								<label htmlFor="lastName" className="label label--floating">
									Last Name
								</label>
							</div>
							<FormError formik={formik} inputName="last_name" />
						</div>
					</div>

					<div className="flex-input">
						<div>
							<div className="input-wrapper">
								<input
									type="text"
									name="expiry"
									className="form-control input-cardexpiry"
									value={formatExpirationDate(expiry)}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder="MM/YY"
									autoComplete="off"
									pattern="\d\d/\d\d"
									autocompletetype="cc-exp"
									required
								/>
								<label
									htmlFor="cardNumber"
									className="label label--floating"
								>
									Card Expiry
								</label>
							</div>
							<FormError formik={formik} inputName="expiry" />
						</div>
						<div>
							<div className="input-wrapper">
								<input
									type={showCvv ? "text" : "password"}
									name="cvv"
									className="form-control input-cvv"
									value={formatCVC(cvv)}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder="123"
									pattern="\d{3,4}"
									autoComplete="off"
									autocompletetype="cc-csc"
									required
								/>
								<label
									htmlFor="cardNumber"
									className="label label--floating"
								>
									CVV
								</label>
								<span
									tabIndex={0}
									role="button"
									className="eye-icon"
									onClick={() => setShowCvv(!showCvv)}
									onKeyDown={(e) => e.key === "Enter" && setShowCvv(!showCvv)}
									aria-label="Toggle CVV visibility"
								>
									{showCvv ? 
										<img src="/eye.svg" alt="eye" />
										: 
										<img src="/close-eye.svg" alt="close eye" />
									}
								</span>
								<button className="infobtn" type="button">
									Info?
								</button>
								<div className="hidden-cvv-info">
									<span>
										The 3 digits number behind your atm card
									</span>
								</div>
							</div>
							<FormError formik={formik} inputName="cvv" />
						</div>
					</div>
				</form>
			</div>
			<ActionButton
				type="button"
				className="submitbutton"
				onClick={handleSubmit}
				disabled={!canMakePayment || formik.isSubmitting || (paymentDetail.currency === "USD" && (issuer === "verve" || issuer === "maestro"))}
				loading={formik.isSubmitting}
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
				<span>
					Pay{" "}
					{shouldResolveFees &&
						paymentContext.additionalFee !== null && (
							<span>
								{paymentDetail.currency ? (paymentDetail.currency === "NGN" ? "₦" : paymentDetail.currency === "USD" ? "$" : paymentDetail.currency) : "₦"}{" "}

								{paymentDetail.amount +
									+paymentContext.additionalFee}
							</span>
						)}
					{!shouldResolveFees &&
						paymentContext.additionalFee === null && (
							<span>
								{paymentDetail.currency ? (paymentDetail.currency === "NGN" ? "₦" : paymentDetail.currency === "USD" ? "$" : paymentDetail.currency) : "₦"}

								{paymentDetail.amount}
							</span>
						)}
				</span>
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
		</>
	);
};

export default LiveCardForm;