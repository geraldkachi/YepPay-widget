import React, { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import Pusher from "pusher-js";
import { useLocation, useHistory } from "react-router-dom";
import { triggerPaymentConfirmation } from "../../services/card";
import { usePaymentContext } from "../../context/PaymentContext";
import AnimatedFailureCheckmark from "../../components/AnimatedFailureCheckmark";
import { urls } from "../../utils/urls";

const confirmSearchParams = (val) => {
	if (!val) {
		return false;
	} else {
		const url = new URLSearchParams(val);
		if (url.get("response") !== null) {
			const exists = JSON.parse(url.get("response"))?.["txRef"];

			return exists ? true : false;
		} else {
			return false;
		}
	}
};

const ConfirmPayment = () => {
	const history = useHistory();
	const paymentContext = usePaymentContext();
	const url = new URLSearchParams(useLocation().search);
	const params = useLocation().search;
	const [confirmed, setConfirmed] = useState(
		confirmSearchParams(useLocation().search ?? null)
	);

	const confirmPayment = async (params) => {
		if (confirmed) {
			try {
				const response = await triggerPaymentConfirmation(params);
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		if (confirmed) {
			const reference = JSON.parse(url.get("response"))?.["txRef"];

			const eventName = "transaction.attempted";
			const channelName = `transaction${reference}`;

			let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
				cluster: process.env.REACT_APP_CLUSTER,
			});
			var channel = pusher.subscribe(channelName);
			channel.bind(eventName, function (data) {
				if (data?.response) {
					if (data.response.status) {
						paymentContext.setPayment({
							currency: data.response.data?.currency,
							amount: data.response.data?.amount_formatted,
							callback_url: data.response.data?.callback_url,
						});
						paymentContext.setSuccessMessage(data.response.message);
						return history.push(urls.success(data.accessCode));
					} else {
						let errorMessage = "";
						if (data.response.message?.toLowerCase() === "error") {
							errorMessage =
								"Operation failed due to poor network or insufficient funds. Please try again or use another card";
						} else {
							errorMessage = data.response.message;
						}
						paymentContext.setErrorMessage(errorMessage);
						return history.push(urls.failure(data.accessCode));
					}
				}
			});

			// Ensure Pusher Connection has been established before calling API
			setTimeout(() => {
				confirmPayment(params);
			}, 5000);
		}
	}, []);

	return (
		<div className="confirm-payment-vwh">
			<div className="cashenvoypaymentwidget">
				<div className="confirm-payment">
					{confirmed && (
						<div className="confirm-payment-inner">
							<div className="confirm-payment-spinner-wrapper">
								<Spinner height="50" width="50" colour="#0066FF" />
							</div>
							<h4>Transaction in progress</h4>
							<h5>Do not close this tab</h5>
						</div>
					)}
					{!confirmed && (
						<div className="confirm-payment-inner">
							<div className="confirm-payment-spinner-wrapper">
								<AnimatedFailureCheckmark />
							</div>
							<h4>Something Went wrong</h4>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConfirmPayment;
