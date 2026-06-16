import React, { useState, useEffect } from "react";
import withInitiatePayment from "../../components/HOC/withInitiatePayment";
import Spinner from "../../components/Spinner";
import { useParams, useHistory } from "react-router-dom";
import ConfirmOfflinePayment from "./ConfirmOfflinePayment";
import { useMutation } from "react-query";
import SendMoney from "./SendMoney";
import { generateDynamicAccountNumber, generateDynamicAccountNumberValidate, customerConfirmCode } from "../../services/offline_transfer";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import { resolveFeesCard } from "../../services/card";
import { usePaymentContext } from "../../context/PaymentContext";
import Pusher from "pusher-js";
import { urls } from "../../utils/urls";
import toast from "react-hot-toast";

const OfflineWidget = ({ paymentDetail }) => {
	const { accessCode } = useParams();
	const history = useHistory();
	const [activeTab, setActive] = useState(1);
	const [paymentConfirmed, setPaymentConfirmed] = useState(false);
	const [accountNumber, setAccountNumber] = useState("");
	const [accountName, setAccountName] = useState("");
	const [bank, setBank] = useState("");
	const [sessionId, setSessionId] = useState("");
	const [transactionRef, setTransactionRef] = useState("");
	const [expiryTime, setExpiryTime] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const [hasAccountNumber, setHasAccountNumber] = useState(false);
	const [resolveFees, setResolveFees] = useState(() => {
		return paymentDetail.bearer === "account";
	});
	const paymentContext = usePaymentContext();

	const renderView = hasAccountNumber && resolveFees;

	const { data: resolveFeesForOffline } = useFetchWithParams(
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
			onError: () => {
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
			if (response?.message == "Virtual account generated successfully.") {
				toast.success(response?.message);
			} else {
				toast.error(response?.message);
				setErrorMessage(response?.message);
			}
			if (response?.status) {
				setExpiryTime(response?.data?.expires_in);
				setHasAccountNumber(true);
				setAccountNumber(response?.data?.account_number);
				setAccountName(response?.data?.account_name);
				setBank(response?.data?.bank);
				setSessionId(response?.data?.session_id);
				setTransactionRef(response?.data?.transaction_reference);
			}
		},
		onError: (error) => {
			console.log(error, 'error from generateDynamicAccountNumber')
			if (response.code !== "00") {
				toast.error(response?.message);
			}
		},
	});

	// for validating the account number
	const mutationValidateFunction = async (body) => {
		const response = await generateDynamicAccountNumberValidate(body);
		return response;
	};
	const { mutate: mutateValidate } = useMutation(mutationValidateFunction, {
		onSuccess: (response) => {
			if (response?.status) {
				setExpiryTime(response?.data?.expires_in);
				setHasAccountNumber(true);
				setAccountNumber(response?.data?.account_number);
				setBank(response?.data?.bank);
			}
		},
		onError: () => {

		},
	});

	const proceed = () => {
		setActive(2);
		// to validate the payment
		// mutateValidate({
		// 	transaction_reference: transactionRef,
		// 	account_number: accountNumber,
		// 	session_id: sessionId
		// })
	};

	const back = () => {
		setActive(1);
	};

	useEffect(() => {
		if (resolveFees) {
			mutate({ payment_id: paymentDetail?.id });
		}
	}, [resolveFees]);

	useEffect(() => {
		const eventName = "transaction.attempted";
		const channelName = `transaction${paymentDetail?.reference}`;

		let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
			cluster: process.env.REACT_APP_CLUSTER,
		});

		if (accountNumber.trim()) {
			const channel = pusher.subscribe(channelName);

			channel.bind(eventName, async function (data) {
				if (data?.response) {
					if (data.response?.status) {
						const { customerCode } = paymentContext;
						if (customerCode) {
							try {
								const payload = {
									customer_code: customerCode,
									reference: paymentDetail.reference
								};
								const updateResponse = await customerConfirmCode(payload);

								if (updateResponse?.status) {
									toast.success('Customer code updated successfully.');
								} else {
									toast.error('Failed to update customer code.');
								}
							} catch (error) {
								console.error('❌ Error updating customer code:', error);
							}
						}

						setPaymentConfirmed(true);
						paymentContext.setPayment({
							currency: data?.response?.data?.currency,
							amount: data?.response?.data
								?.processed_amount_formatted,
							callback_url: data?.response?.data?.callback_url,
						});
						paymentContext.setSuccessMessage(data?.response?.message);
						return history.push(urls.success(data?.accessCode));
					} else {
						let errorMessage = "";
						if (data?.response?.message?.toLowerCase() === "error") {
							errorMessage = "Something went wrong. This might be due to poor network. Please try again.";
						} else {
							errorMessage = data?.response?.message;
						}
						paymentContext.setErrorCallback(
							data?.response?.data?.callback_url ?? ""
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
			pusher?.unsubscribe(channelName);
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
			channel.bind(eventName, function (data) {
				console.log(data, 'transaction.nuban-error')
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
				<div className="offlinewidget-loader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
					{!errorMessage && <div className="justify-center">
						<Spinner height="50" width="50" colour="#0066FF" />
					</div>}
					<p>
						{!errorMessage && "Please wait while we generate an account number for your transfer.."}
					</p>

					<br />
					<p style={{ color: '#0066FF', fontSize: 'bold' }}>{errorMessage && "Error"}:</p>
					<div className="wait-button-wrapper">
						<p style={{ color: '#0066FF', fontSize: 'bold' }}>{errorMessage}</p>
					</div>
					{errorMessage && <div className="" style={{ height: '100%', }}>

						<button className="submitbutton" style={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }} onClick={() => window.location.reload()}>
							<span>Retry</span>
						</button>
					</div>}
				</div>
			)}
			{renderView && (
				<>
					{activeTab === 1 && (
						<SendMoney
							proceed={proceed}
							bank={bank}
							accountNumber={accountNumber}
							accountName={accountName}
							expiresIn={expiryTime}
							amount={
								(paymentContext?.additionalFee || resolveFeesForOffline?.fee)
									? Number(
										resolveFeesForOffline?.total ||
										paymentDetail.amount +
										Number(paymentContext?.additionalFee || 0)
									)
									: Number(paymentDetail.amount)
							}
							currency={paymentDetail.currency}
						/>
					)}
					{activeTab === 2 && (
						<ConfirmOfflinePayment
							accountNumber={accountNumber}
							back={back}
							proceed={proceed}
							{...{ setExpiryTime, setHasAccountNumber, setAccountNumber, setBank, transactionRef, accountNumber, sessionId, paymentDetail, paymentConfirmed, setPaymentConfirmed }}
						/>
					)}
				</>
			)}
		</div>
	);
};;

export default withInitiatePayment(OfflineWidget);
