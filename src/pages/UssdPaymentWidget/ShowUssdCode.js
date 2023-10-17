import React, { useState, useEffect } from "react";
import { usePaymentContext } from "../../context/PaymentContext";
import { urls } from "../../utils/urls";
import Pusher from "pusher-js";
import { useParams, useHistory } from "react-router-dom";
import useCopyToClipboard from "../../hooks/useCopyToClickboard";

const ShowUssdCode = ({ chooseADiffBank, code, traceId, reference }) => {
	const { accessCode } = useParams();
	const history = useHistory();
	const paymentContext = usePaymentContext();

	const [, copy] = useCopyToClipboard("Code");

	useEffect(() => {
		const eventName = "transaction.attempted";
		const channelName = `transaction${reference}`;

		let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
			cluster: process.env.REACT_APP_CLUSTER,
		});

		var channel = pusher.subscribe(channelName);
		// console.log("listening to success Channel", channel);

		channel.bind(eventName, function (data) {
			// console.log("DATA FROM success Channel", data);
			if (data?.response) {
				if (data.response.status) {
					paymentContext.setPayment({
						currency: data.response.data?.currency,
						amount: data.response.data?.amount,
						callback_url: data.response.data?.callback_url,
					});
					paymentContext.setSuccessMessage(data.response.message);
					return history.push(urls.success(data.accessCode));
				} else {
					let errorMessage = "";
					if (data.response.message?.toLowerCase() === "error") {
						errorMessage = "Something went wrong. This might be due to poor network. Please try again.";
					} else {
						errorMessage = data.response.message;
					}
					paymentContext.setErrorCallback(data.response?.data?.callback_url ?? "");
					paymentContext.setErrorMessage(errorMessage);
					return history.push(urls.failure(data?.accessCode ?? accessCode));
				}
			}
		});

		return () => {
			pusher.unsubscribe(channelName);
		};
	}, []);

	useEffect(() => {
		const eventName = "transaction.ussd-error";
		const channelName = `ussd-error${traceId}`;

		let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
			cluster: process.env.REACT_APP_CLUSTER,
		});

		var channel = pusher.subscribe(channelName);
		// console.log("listening to failure channel", channel);

		channel.bind(eventName, function (data) {
			// console.log("DATA FROM failure channel", data);
			if (data?.response) {
				if (!data.response.status) {
					const errorMessage = data.response?.message ?? "";
					paymentContext.setErrorMessage(errorMessage);
					return history.push(urls.failure(data.accessCode ?? accessCode));
				}
			}
		});

		return () => {
			pusher.unsubscribe(channelName);
		};
	}, []);

	return (
		<div className="ussdwidget">
			<p className="text-center primary-color font-500 f-13">
				Dial the code below on your mobile to <br /> complete this transaction
			</p>
			<p className="text-center f-20 font-500 cashenvoy-blue pt-20">{code}</p>
			<div className="centralize ussd-copy-container pt-20">
				<button
					onClick={() => {
						copy(code);
					}}
					className="copy-usd-code"
				>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M6.5 0.5H14C14.8642 0.5 15.5 1.13579 15.5 2V9.5C15.5 10.3642 14.8642 11 14 11H11V14C11 14.8642 10.3642 15.5 9.5 15.5H2C1.13579 15.5 0.5 14.8642 0.5 14V6.5C0.5 5.63579 1.13579 5 2 5H5V2C5 1.13579 5.63579 0.5 6.5 0.5ZM5 6.5H2V14H9.5V11H6.5C5.63579 11 5 10.3642 5 9.5V6.5ZM6.5 2V9.5H14V2H6.5Z"
							fill="#8797B1"
						/>
					</svg>
					Click here to copy USSD code
				</button>
			</div>
			<div className="centralize pt-20">
				<button onClick={chooseADiffBank} className="cashenvoyred font-500">
					Choose Another Bank
				</button>
			</div>
		</div>
	);
};

export default ShowUssdCode;
