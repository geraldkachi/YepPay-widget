import React, { useState, useEffect } from "react";
import withInitiatePayment from "../../components/HOC/withInitiatePayment";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import ConfirmOfflinePayment from "./ConfirmOfflinePayment";
import { useMutation } from "react-query";
import SendMoney from "./SendMoney";
import { generateDynamicAccountNumber } from "../../services/offline_transfer";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import { resolveFeesCard } from "../../services/card";
import { usePaymentContext } from "../../context/PaymentContext";

const OfflineWidget = ({ paymentDetail }) => {
	const { accessCode } = useParams();
	const [activeTab, setActive] = useState(1);
	const [accountNumber, setAccountNumber] = useState("");
	// const [accountNumber, setAccountNumber] = useState("7718839490");
	const [expiryTime, setExpiryTime] = useState(0);
	const [hasAccountNumber, setHasAccountNumber] = useState(false);
	const [resolveFees, setResolveFees] = useState(() => {
		return paymentDetail.bearer === "account";
	});
	const paymentContext = usePaymentContext();

	const renderView = hasAccountNumber && resolveFees;

	const resolveFeesForOffline = useFetchWithParams(
		["resolveFeesForOffline", { bin: null, accessCode }],
		resolveFeesCard,
		{
			onSuccess: (data) => {
				// console.log(data);
				// console.log(data?.fee_formatted ?? null);
				paymentContext.setAdditionalFee(data?.fee_formatted ?? null);
				setResolveFees(true);
			},
			onError: (error) => {
				console.log(error);
			},
			enabled: paymentDetail.bearer !== "account",
			keepPreviousData: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
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

	return (
		<div className="offlinewidget">
			{!renderView && (
				<div className="offlinewidget-loader">
					<div className="justify-center">
						<Spinner height="50" width="50" colour="#0066FF" />
					</div>
					<p>
						Please wait while we generate an account number for your transfer..
					</p>
				</div>
			)}
			{renderView && (
				<>
					{activeTab === 1 && (
						<SendMoney
							proceed={proceed}
							accountNumber={accountNumber}
							expiresIn={expiryTime}
							amount={
								paymentContext?.additionalFee
									? paymentDetail.amount + +paymentContext.additionalFee
									: paymentDetail.amount
							}
						/>
					)}
					{activeTab === 2 && (
						<ConfirmOfflinePayment
							reference={paymentDetail.reference}
							back={back}
						/>
					)}
				</>
			)}
		</div>
	);
};;

export default withInitiatePayment(OfflineWidget);
