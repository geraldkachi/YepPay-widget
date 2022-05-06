import React, { useState, useEffect } from "react";
import withInitiatePayment from "../../components/HOC/withInitiatePayment";
import Spinner from "../../components/Spinner";
import ConfirmOfflinePayment from "./ConfirmOfflinePayment";
import { useMutation } from "react-query";
import SendMoney from "./SendMoney";
import { generateDynamicAccountNumber } from "../../services/offline_transfer";

const OfflineWidget = ({ paymentDetail }) => {
	const [activeTab, setActive] = useState(1);
	const [accountNumber, setAccountNumber] = useState("7718839490");
	const [expiryTime, setExpiryTime] = useState(0);
	const [hasAccountNumber, setHasAccountNumber] = useState(false);

	const mutationFunction = async (body) => {
		const response = await generateDynamicAccountNumber(body);
		return response;
	};
	const { mutate } = useMutation(mutationFunction, {
		onSuccess: (response) => {
			if (response.status) {
				setAccountNumber(response.data.account_number);
				setExpiryTime(response.data.expires_in);
				setHasAccountNumber(true);
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
		mutate({ payment_id: paymentDetail.id });
	}, []);

	return (
		<div className="offlinewidget">
			{!hasAccountNumber && (
				<div className="offlinewidget-loader">
					<div className="justify-center">
						<Spinner height="50" width="50" colour="#0066FF" />
					</div>
					<p>
						Please wait while we generate an account number for your transfer..
					</p>
				</div>
			)}
			{hasAccountNumber && (
				<>
					{activeTab === 1 && (
						<SendMoney
							proceed={proceed}
							accountNumber={accountNumber}
							expiresIn={expiryTime}
							amount={paymentDetail.amount_formatted}
						/>
					)}
					{activeTab === 2 && <ConfirmOfflinePayment back={back} />}
				</>
			)}
		</div>
	);
};

export default withInitiatePayment(OfflineWidget);
