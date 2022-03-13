import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { useHistory } from "react-router-dom";
import { urls } from "../../utils/urls";

import Spinner from "../../components/Spinner";
import { usePaymentContext } from "../../context/PaymentContext";

import { payWithCard } from "../../services/card";

const CardPin = ({ accessCode }) => {
	const [pin, setPin] = useState("");
	const [loading, setLoading] = useState(false);

	const history = useHistory();
	const paymentContext = usePaymentContext();

	const handleChange = (val) => {
		setPin(val);
	};

	const submitPin = async (pin, otherVals) => {
		const payload = { pin, ...otherVals };
		setLoading(true);
		try {
			const response = await payWithCard(payload);
			if (response.status) {
				console.log(response);
				paymentContext.setPayment((prev) => {
					return { ...prev, pin };
				});
				paymentContext.setSuccessMessage(response.message);
				paymentContext.setReference(response.data.reference);
				history.push(
					urls.otp(accessCode, response.data.reference, "?type=card")
				);
			} else {
				if (response.data.errors) {
					toast.error(response.message);
				} else {
					paymentContext.setPayment((prev) => {
						return {};
					});
					paymentContext.setErrorMessage(response.message);
					return history.push(urls.failure(accessCode));
				}
			}
		} catch (error) {
			paymentContext.setPayment((prev) => {
				return {};
			});
			paymentContext.setErrorMessage(
				"Operation failed due to poor network. Please try again"
			);
		}
	};

	useEffect(() => {
		if (pin.trim().length === 4) {
			submitPin(pin, paymentContext.payment);
		} else {
			return;
		}
	}, [pin]);

	return (
		<div className="cardpaymentwidget">
			{loading && (
				<div className="card-pin-loader">
					<Spinner height="40" width="40" colour="#0066FF" />
				</div>
			)}
			<h1 style={{ textAlign: "center", width: "254px", margin: "0px auto" }}>
				Please enter your 4 digit card pin to authorize this transaction
			</h1>
			<OtpInput
				value={pin}
				onChange={handleChange}
				numInputs={4}
				separator={""}
				containerStyle="card-pin"
				isInputSecure={true}
				isInputNum={true}
				inputStyle="card-pin-input"
				// focusedStyle="card-pin-input-focused"
			/>
		</div>
	);
};

export default CardPin;
