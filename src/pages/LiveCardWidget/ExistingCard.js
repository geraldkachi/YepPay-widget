import React, { useState } from "react";
import { getIssuerType } from "../../utils/getIssuerType";
import SelectCheckmark from "../../components/SelectCheckmark";
import { usePaymentContext } from "../../context/PaymentContext";
import { urls } from "../../utils/urls";
import ActionButton from "../../components/Button/ActionButton";
import { useHistory, useParams, Link } from "react-router-dom";

import { payWithTokenizedCard } from "../../services/card";

const ExistingCard = ({
	selectedCard,
	setSelectedCard,
	paymentDetail,
	accessCode,
}) => {
	const paymentContext = usePaymentContext();
	const [loading, setLoading] = useState(false);

	const history = useHistory();

	const shouldResolveFees = paymentDetail.bearer !== "account";

	const handleSubmit = () => {
		const payload = {
			access_code: paymentDetail.access_code,
			token: selectedCard.token,
		};
		return handlePayWithTokenizedCard(payload);
	};

	const handlePayWithTokenizedCard = async (payload) => {
		setLoading(true);
		const response = await payWithTokenizedCard(payload);
		setLoading(false);
		if (response.status) {
			paymentContext.setPayment(response.data);
			return history.push(urls.success(accessCode));
		} else {
			paymentContext.setErrorMessage(response.message);
			return history.push(urls.failure(accessCode));
		}
	};

	return (
		<>
			<div className="cardpaymentwidget">
				<h1 className="text-center">
					Make payment with the selected card details
				</h1>
				<SelectCheckmark
					textContent={`${selectedCard?.first_6} xxxx xxxx ${selectedCard?.last_4}`}
					cardType={getIssuerType(selectedCard?.type)}
				/>
				<div className="existing-card-btn-wrapper">
					<button
						onClick={() => {
							setSelectedCard(null);
							paymentContext.setAdditionalFee(null);
						}}
						type="button"
						className="user-another-card-link"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 18 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M13.8391 4.83334C12.7053 3.23225 10.9946 2.33334 8.99996 2.33334C5.31806 2.33334 2.33329 5.31811 2.33329 9.00001C2.33329 12.6819 5.31806 15.6667 8.99996 15.6667C12.6819 15.6667 15.6666 12.6819 15.6666 9.00001H17.3333C17.3333 13.6024 13.6023 17.3333 8.99996 17.3333C4.39759 17.3333 0.666626 13.6024 0.666626 9.00001C0.666626 4.39763 4.39759 0.666672 8.99996 0.666672C11.3368 0.666672 13.3957 1.6521 14.8333 3.39196V0.666672H16.5V6.50001H10.6666V4.83334H13.8391Z"
								fill="black"
							/>
						</svg>
						Use another card
					</button>
				</div>
			</div>
			<ActionButton
				type="button"
				className="submitbutton"
				onClick={handleSubmit}
				disabled={false}
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

export default ExistingCard;
