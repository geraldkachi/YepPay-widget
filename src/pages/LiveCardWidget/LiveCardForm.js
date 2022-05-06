import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import RememberCard from "../../components/CardPaymentWidget/RememberCard";
import Payment from "payment";

import { toast } from "react-hot-toast";
import { useFormik } from "formik";

import {
	formatCreditCardNumber,
	formatCVC,
	formatExpirationDate,
} from "../../utils";

import {
	getRememberedCards,
	payWithCard,
	payWithTokenizedCard,
	resolveFeesCard,
} from "../../services/card";

import FormError from "../../utils/form/FormError";

import { usePaymentContext } from "../../context/PaymentContext";
import { urls } from "../../utils/urls";

import { GET_REMEMBERED_CARDS } from "../../utils/constants/queryTypes";
import { getIssuerType } from "../../utils/getIssuerType";
import CardTestWidget from "../../pages/CardTestWidget";
// import RememberCard from "../../components/CardPaymentWidget/RememberCard";
import ActionButton from "../../components/Button/ActionButton";
import SelectCheckmark from "../../components/SelectCheckmark";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import Spinner from "../../components/Spinner";

const LiveCardForm = ({
	paymentDetail,
	rememberedCards,
	isLoading,
	setSelectedCard,
	setShowPin,
	setShowLocationDetails,
}) => {
	const [cachedBin, setCachedBin] = useState("");
	const [showRedirecting, setShowRedirecting] = useState(false);
	const history = useHistory();
	const { accessCode } = useParams();
	const paymentContext = usePaymentContext();

	const shouldResolveFees = paymentDetail.bearer !== "account";

	const resolvedFeesForInputtedCard = useFetchWithParams(
		["resolveFeesCardInputtedCard", { bin: cachedBin, accessCode }],
		resolveFeesCard,
		{
			onSuccess: (data) => {
				// console.log(data);
				// console.log(data?.fee_formatted ?? null);
				paymentContext.setAdditionalFee(data?.fee_formatted ?? null);
			},
			onError: (error) => {
				console.log(error);
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

			remember_card: paymentDetail.remember_card === 1 ? ["on"] : [],
		},
		onSubmit: async (values) => {
			const expiryInfo = values.expiry.split("/");
			const payload = {
				access_code: paymentDetail.access_code,
				...values,
				remember_card: Boolean(values.remember_card.length), // true or false
				card_number: values.card_number.split(" ").join(""),
				expiry_month: expiryInfo[0],
				expiry_year: expiryInfo[1].substring(0, 2),
			};

			try {
				const response = await payWithCard(payload);
				if (response.status) {
					if (response.data.authorization_mode === "pin") {
						const cardData = {
							...payload,
							authorization_mode: response.data.authorization_mode,
						};
						paymentContext.setPayment((prev) => cardData);
						setShowPin(true);
					} else if (response.data.authorization_mode === "redirect") {
						setShowRedirecting(true);
						window.location.replace(response.data.additional_information);
					} else if (response.data.authorization_mode === "avs_noauth") {
						const cardData = {
							...payload,
							authorization_mode: response.data.authorization_mode,
						};
						paymentContext.setPayment((prev) => cardData);
						setShowLocationDetails(true);
					}
				} else {
					paymentContext.setErrorMessage(response.message);
					return history.push(urls.failure(accessCode));
					// if (response.data.errors) {
					// 	toast.error(response.message);
					// 	return formik.setErrors(response.data.errors);
					// } else {
					// 	paymentContext.setErrorMessage(response.message);
					// 	return history.push(urls.failure(accessCode));
					// }
				}
			} catch (error) {
				paymentContext.setPayment((prev) => {
					return {};
				});
				paymentContext.setErrorMessage(
					"Operation failed due to poor network. Please try again"
				);
				return history.push(urls.failure(accessCode));
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

	const { card_number, expiry, cvv } = formik.values;
	const issuer = Payment.fns.cardType(card_number);

	const canMakePayment =
		formik.values.card_number.trim() &&
		formik.values.card_number.split(" ").join("").length > 8 &&
		formik.values.expiry.trim().length === 5 &&
		formik.values.cvv.trim().length === 3;

	return (
		<>
			{" "}
			<div className="cardpaymentwidget">
				{showRedirecting && (
					<div className="card-redirect-loader">
						<div className="center">
							<div>
								<Spinner height="40" width="40" colour="#0066FF" />
							</div>
							<h1 className="text-center">...Redirecting...</h1>
						</div>
					</div>
				)}
				<h1 className="text-center">Enter your card details to make payment</h1>

				<RememberCard
					cards={rememberedCards}
					handleSelectCard={handleSelectCard}
					loading={isLoading}
				/>

				<form>
					<div className="input-wrapper">
						<input
							type="tel"
							name="card_number"
							autocomplete="off"
							className="form-control input-cardnumber"
							placeholder="0000 0000 0000 0000 0000"
							pattern="[\d| ]{16,22}"
							value={formatCreditCardNumber(card_number)}
							onChange={formik.handleChange}
							onBlur={() => {
								// console.log("handled");

								if (shouldResolveFees) {
									if (
										!cachedBin &&
										formik.values.card_number.trim().length >= 8
									) {
										setCachedBin(
											formik.values.card_number.split(" ").join("").slice(0, 6)
										);
										return;
									}

									if (
										cachedBin &&
										formik.values.card_number.trim().length >= 8 &&
										cachedBin !== formik.values.card_number.slice(0, 6)
									) {
										setCachedBin(
											formik.values.card_number.split(" ").join("").slice(0, 6)
										);
										return;
									}

									if (
										!formik.values.card_number.trim() ||
										formik.values.card_number.trim().length < 6
									) {
										setCachedBin("");
										paymentContext.setAdditionalFee(null);
									}
								}

								// formik.handleBlur();
							}}
							autocompletetype="cc-number"
						/>
						<label htmlFor="cardNumber" className="label label--floating">
							Card Number
						</label>
						<div className="cardtype">
							<img src={getIssuerType(issuer)} alt="Card Type" />
						</div>
					</div>
					<FormError formik={formik} inputName="card_number" />
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
									autocomplete="off"
									pattern="\d\d/\d\d"
									autocompletetype="cc-exp"
									required
								/>
								<label htmlFor="cardNumber" className="label label--floating">
									Card Expiry
								</label>
							</div>
							<FormError formik={formik} inputName="expiry" />
						</div>
						<div>
							<div className="input-wrapper">
								<input
									type="text"
									name="cvv"
									className="form-control input-cvv"
									value={formatCVC(cvv)}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder="123"
									pattern="\d{3,4}"
									autocomplete="off"
									autocompletetype="cc-csc"
									required
								/>
								<label htmlFor="cardNumber" className="label label--floating">
									CVV
								</label>
								<button className="infobtn" type="button">
									Info?
								</button>
								<div className="hidden-cvv-info">
									<span>The 3 digits number behind your atm card</span>
								</div>
							</div>
							<FormError formik={formik} inputName="cvv" />
						</div>
					</div>

					<p className="remembercard-check">
						<input
							type="checkbox"
							id="remembercard"
							name="remember_card"
							checked={formik.values.remember_card.length > 0 ? true : false}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<label htmlFor="remembercard">Remember card</label>
					</p>
				</form>
			</div>
			<ActionButton
				type="button"
				className="submitbutton"
				onClick={handleSubmit}
				disabled={!canMakePayment || formik.isSubmitting}
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
					{shouldResolveFees && paymentContext.additionalFee !== null && (
						<span>
							{paymentDetail.currency}{" "}
							{paymentDetail.amount + +paymentContext.additionalFee}
						</span>
					)}
					{!shouldResolveFees && paymentContext.additionalFee === null && (
						<span>
							{paymentDetail.currency} {paymentDetail.amount}
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
