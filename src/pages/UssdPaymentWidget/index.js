import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../../components/Button/ActionButton";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import { generateUssdCode, getAllBankUsdCode } from "../../services/ussd";
import UssdBankDropdown from "./UssdBankDropdown";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import ShowUssdCode from "./ShowUssdCode";

const UssdPaymentWidget = ({ paymentDetail }) => {
	const [step, setStep] = useState(1);

	const [submitting, setSubmitting] = useState(false);
	const selected = useState({
		bankName: "- Choose Bank",
		bankCode: "",
		status: false,
	});
	const bankList = useState([]);
	const traceId = useState("");
	const ussdCode = useState("");

	const allBanksList = useQuery("ussdBankList", getAllBankUsdCode, {
		onSuccess: (response) => {
			console.log(response.data.data);
			bankList[1](response?.data?.data ?? []);
		},
		onError: (error) => {
			console.log(error);
		},
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});

	const chooseADiffBank = () => {
		selected[1]({ bankName: "- Choose Bank", bankCode: "" });
		setStep(1);
	};

	const goToStep2 = () => {
		setStep(2);
	};

	const handleProceed = async () => {
		try {
			setSubmitting(true);
			const response = await generateUssdCode({
				payment_id: paymentDetail.id,
				bank_code: selected[0].bankCode,
			});
			if (!response.status) {
				toast.error(response?.message ?? "Error generating ussd code.");
			} else {
				traceId[1](response.data?.trace_id);
				ussdCode[1](response.data?.ussd_code);
				goToStep2();
			}
			setSubmitting(false);
		} catch (error) {
			setSubmitting(false);
			console.log(error);
		}
	};

	return (
		<>
			{step === 1 && (
				<>
					<div className="ussdwidget">
						<h1 className="text-center">
							Choose your bank to start payment
						</h1>
						<UssdBankDropdown
							list={bankList[0]}
							selected={selected}
						/>
					</div>
					<ActionButton
						type="button"
						className="submitbutton"
						onClick={() => {
							// setStep(2);
							handleProceed();
						}}
						disabled={
							submitting || selected[0].bankCode.trim()
								? false
								: true
						}
						loading={submitting}
						spinColour="#FFFFFF"
						testId="card-payment"
					>
						<span></span>
						<span>Proceed</span>
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
			)}
			{step === 2 && (
				<ShowUssdCode
					code={ussdCode[0]}
					traceId={traceId[0]}
					reference={paymentDetail.reference}
					chooseADiffBank={chooseADiffBank}
				/>
			)}
		</>
	);
};

export default UssdPaymentWidget;
