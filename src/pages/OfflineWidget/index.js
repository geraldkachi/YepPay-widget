import React, { useState, useEffect } from "react";
import withInitiatePayment from "../../components/HOC/withInitiatePayment";
import Spinner from "../../components/Spinner";
import { useParams, useHistory } from "react-router-dom";
import ConfirmOfflinePayment from "./ConfirmOfflinePayment";
import { useMutation } from "react-query";
import SendMoney from "./SendMoney";
import { generateDynamicAccountNumber } from "../../services/offline_transfer";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import { resolveFeesCard } from "../../services/card";
import { usePaymentContext } from "../../context/PaymentContext";
import Pusher from "pusher-js";
import { urls } from "../../utils/urls";

const OfflineWidget = ({ paymentDetail }) => {
	const { accessCode } = useParams();
	const history = useHistory();
	const [activeTab, setActive] = useState(1);
	const [paymentConfirmed, setPaymentConfirmed] = useState(false);
	const [accountNumber, setAccountNumber] = useState("");
	const [bank, setBank] = useState("");
	const [expiryTime, setExpiryTime] = useState(0);
	const [hasAccountNumber, setHasAccountNumber] = useState(false);
	const [resolveFees, setResolveFees] = useState(() => {
		return paymentDetail.bearer === "account";
	});
	const paymentContext = usePaymentContext();

	const renderView = hasAccountNumber && resolveFees;

	const resolveFeesForOffline = useFetchWithParams(
		[
			"resolveFeesForOffline",
			{ bin: null, accessCode, payment_channel: "offline_transfer" },
		],
		resolveFeesCard,
		{
			onSuccess: (data) => {
				paymentContext.setAdditionalFee(data?.fee_formatted ?? null);
				setResolveFees(true);
			},
			onError: (error) => {
				console.log(error);
			},
			enabled: paymentDetail.bearer !== "account",
			keepPreviousData: false,
			refetchOnWindowFocus: false,
			refetchOnMount: true,
		}
	);

	const mutationFunction = async (body) => {
		const response = await generateDynamicAccountNumber(body);
		return response;
	};
	const { mutate } = useMutation(mutationFunction, {
		onSuccess: (response) => {
			if (response.status) {
				setExpiryTime(response.data.expires_in);
				setHasAccountNumber(true);
				setAccountNumber(response.data.account_number);
				setBank(response.data.bank);
			}
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const proceed = () => {
		setActive(2);
	};

	const back = () => {
		setActive(1);
	};

	useEffect(() => {
		if (resolveFees) {
			mutate({ payment_id: paymentDetail.id });
		}
	}, [resolveFees]);

	useEffect(() => {
		const eventName = "transaction.attempted";
		const channelName = `transaction${paymentDetail.reference}`;

		let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
			cluster: process.env.REACT_APP_CLUSTER,
		});

		if (accountNumber.trim()) {
			var channel = pusher.subscribe(channelName);
			// console.log("listening to 1", channel);

			channel.bind(eventName, function (data) {
				// console.log("DATA FROM EVENT1", data);
				if (data?.response) {
					if (data.response.status) {
						setPaymentConfirmed(true);
						paymentContext.setPayment({
							currency: data.response.data?.currency,
							amount: data.response.data
								?.processed_amount_formatted,
							callback_url: data.response.data?.callback_url,
						});
						paymentContext.setSuccessMessage(data.response.message);
						return history.push(urls.success(data.accessCode));
					} else {
						let errorMessage = "";
						if (data.response.message?.toLowerCase() === "error") {
							errorMessage =
								"Something went wrong. This might be due to poor network. Please try again.";
						} else {
							errorMessage = data.response.message;
						}
						paymentContext.setErrorCallback(
							data.response?.data?.callback_url ?? ""
						);
						paymentContext.setErrorMessage(errorMessage);
						return history.push(
							urls.failure(data?.accessCode ?? accessCode)
						);
					}
				}
			});
		}

		return () => {
			pusher.unsubscribe(channelName);
		};
	}, [accountNumber]);

	useEffect(() => {
		let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
			cluster: process.env.REACT_APP_CLUSTER,
		});

		if (accountNumber.trim()) {
			const eventName = "transaction.nuban-error";
			const channelName = `nuban-error${accountNumber}`;
			// const channelName = `nuban-error930340403930`;
			var channel = pusher.subscribe(channelName);
			// console.log("listening to second channel2", channel);

			channel.bind(eventName, function (data) {
				// console.log("DATA FROM EVENT2", data);
				if (data?.response) {
					if (!data.response.status) {
						const errorMessage = data.response?.message ?? "";
						paymentContext.setErrorMessage(errorMessage);
						return history.push(
							urls.failure(data.accessCode ?? accessCode)
						);
					}
				}
			});

			return () => {
				pusher.unsubscribe(channelName);
			};
		}
	}, [accountNumber]);

	return (
		<div className="offlinewidget">
			{!renderView && (
				<div className="offlinewidget-loader">
					<div className="justify-center">
						<Spinner height="50" width="50" colour="#0066FF" />
					</div>
					<p>
						Please wait while we generate an account number for your
						transfer..
					</p>
				</div>
			)}
			{renderView && (
				<>
					{activeTab === 1 && (
						<SendMoney
							proceed={proceed}
							bank={bank}
							accountNumber={accountNumber}
							expiresIn={expiryTime}
							amount={
								paymentContext?.additionalFee
									? paymentDetail.amount +
									  +paymentContext.additionalFee
									: paymentDetail.amount
							}
						/>
					)}
					{activeTab === 2 && (
						<ConfirmOfflinePayment
							accountNumber={accountNumber}
							back={back}
							paymentConfirmed={paymentConfirmed}
						/>
					)}
				</>
			)}
		</div>
	);
};;

export default withInitiatePayment(OfflineWidget);
