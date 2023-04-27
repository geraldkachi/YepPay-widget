import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ActionButton from "../../components/Button/ActionButton";
import useFetchWithParams from "../../hooks/useFetchWithParams";
import { generateUssdCode, getAllBankUsdCode } from "../../services/ussd";
import UssdBankDropdown from "./UssdBankDropdown";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import ShowUssdCode from "./ShowUssdCode";
import Spinner from "../../components/Spinner";
import { resolveFeesCard } from "../../services/card";
import { usePaymentContext } from "../../context/PaymentContext";

const UssdPaymentWidget = ({ paymentDetail }) => {
	const { accessCode } = useParams();
	const paymentContext = usePaymentContext();
	const [step, setStep] = useState(1);
	const [hasResolvedFees, setHasResolvedFees] = useState(() => {
		return paymentDetail.bearer === "account";
	});

	const [submitting, setSubmitting] = useState(false);
	const selected = useState({
		bankName: "- Choose Bank",
		bankCode: "",
		status: false,
	});
	const bankList = useState([]);
	const traceId = useState("");
	const ussdCode = useState("");

	useFetchWithParams(
		[
			"resolveFeesForUssd",
			{ bin: null, accessCode, payment_channel: "ussd" },
		],
		resolveFeesCard,
		{
			onSuccess: (data) => {
				paymentContext.setAdditionalFee(data?.fee_formatted ?? null);
				setHasResolvedFees(true);
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

	const allBanksList = useQuery("ussdBankList", getAllBankUsdCode, {
		onSuccess: (response) => {
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
			{!hasResolvedFees && (
				<div style={{ height: "419px", width: "100%" }}>
					<div className="flex mt-20 justify-center">
						<Spinner height="50" width="50" colour="#0066FF" />
					</div>
				</div>
			)}
			{hasResolvedFees && (
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
			)}
		</>
	);
};

export default UssdPaymentWidget;
