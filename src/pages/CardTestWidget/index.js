import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import ActionButton from "../../components/Button/ActionButton";
import toast from "react-hot-toast";

import { useMutation } from "react-query";
import { payWithCard, resolveFeesCard } from "../../services/card";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import { usePaymentContext } from "../../context/PaymentContext";
import { urls } from "../../utils/urls";

const CardTestWidget = ({ paymentDetail }) => {
	const { accessCode } = useParams();
	const history = useHistory();
	const { setAdditionalFee, additionalFee, setReference } = usePaymentContext();

	const [checked, setChecked] = useState(null);
	const [cardDetails, setCardDetails] = useState(null);

	const shouldResolveFees = paymentDetail.bearer !== "account";

	const { isLoading } = useFetchWithParams(
		[
			"resolveFeesCard",
			{ bin: cardDetails?.card_number.slice(0, 6), accessCode },
		],
		resolveFeesCard,
		{
			onSuccess: (data) => {
				setAdditionalFee(data?.fee ?? null);
			},
			onError: (error) => {
				console.log(error);
			},
			enabled: cardDetails?.card_number ? true : false,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		}
	);

	const {
		isLoading: isSubmitting,

		mutate,
	} = useMutation(payWithCard, {
		onSuccess: (data) => {
			toast.success(data.message, {
				className: "text-center",
			});
			setReference(data.data.reference);
			history.push(urls.otp(accessCode, data.data.reference, "?type=card"));
		},
		onError: (error) => {
			console.log(error);

			// toast.error(`Operation failed, please try again.`, {
			// 	className: "text-center",
			// });
		},
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		const expiryInfo = cardDetails.expiry.split("/");
		const payload = {
			access_code: paymentDetail.access_code,
			cvv: cardDetails.cvv,
			pin: cardDetails.pin,
			remember_card: false, // true or false
			card_number: cardDetails.card_number,
			expiry_month: expiryInfo[0],
			expiry_year: expiryInfo[1].substring(0, 2),
		};

		mutate(payload);
	};

	return (
		<div className="testwidget-wrapper">
			<div className="testwidget">
				<div className="testcard-content">
					<p>
						Test your payment with the options <br /> listed below
					</p>
					<label
						className={`testcard-check success ${
							checked === "success" ? "test-card-active-green" : ""
						}`}
					>
						<span>Test Successful Payment </span>
						<input
							type="radio"
							onChange={() => {
								setChecked("success");
								setCardDetails(paymentDetail.test_cards["success"]);
							}}
							checked={checked === "success"}
							id="testcard-val"
						/>
						<span className="checkmark"></span>
					</label>
					<label
						className={`testcard-check failure ${
							checked === "failure" ? "test-card-active-red" : ""
						}`}
					>
						<span>Test Failed Payment</span>
						<input
							type="radio"
							onChange={() => {
								setChecked("failure");

								setCardDetails(paymentDetail.test_cards["insufficient funds"]);
							}}
							checked={checked === "failure"}
							id="testcard-val"
						/>
						<span className="checkmark"></span>
					</label>

					{/* <button className="testcard-btn">Pay NGN100</button> */}
				</div>
				<ActionButton
					type="submit"
					className="submitbutton"
					onClick={handleSubmit}
					loading={isSubmitting}
					spinColour="#FFFFFF"
					testId="card-payment"
					disabled={!cardDetails}
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
						Pay
						{shouldResolveFees && additionalFee !== null && (
							<span>
								{" "}
								{paymentDetail.currency}
								{paymentDetail.amount + additionalFee}
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
			</div>
		</div>
	);
};

export default CardTestWidget;
