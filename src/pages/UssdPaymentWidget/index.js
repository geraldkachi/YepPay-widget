import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../../components/Button/ActionButton";
import UssdBankDropdown from "./UssdBankDropdown";

const UssdPaymentWidget = ({ paymentDetail }) => {
	const [step, setStep] = useState(1);
	const [copied, setCopied] = useState(false);
	const selected = useState({ name: "- Choose Bank", code: "" });

	const chooseADiffBank = () => {
		selected[1]({ name: "- Choose Bank", code: "" });
		setStep(1);
	};

	const goToStep2 = () => {
		setStep(2);
	};

	const copyText = async (val) => {
		const el = document.createElement("textarea");
		el.value = val;
		el.setAttribute("readonly", "");
		el.style.position = "absolute";
		el.style.opacity = 0;
		el.style.left = "-9999px";
		document.body.appendChild(el);
		el.select();
		el.setSelectionRange(0, 99999);
		document.execCommand("copy");
		document.body.removeChild(el);
		setCopied(true);
	};

	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 1500);
		}
	}, [copied]);

	return (
		<>
			{step === 1 && (
				<>
					<div className="ussdwidget">
						<h1 className="text-center">
							Choose your bank to start payment
						</h1>
						<UssdBankDropdown selected={selected} />
					</div>
					<ActionButton
						type="button"
						className="submitbutton"
						onClick={() => {
							setStep(2);
						}}
						disabled={selected[0].code.trim() ? false : true}
						// loading={formik.isSubmitting}
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
				<div className="ussdwidget">
					<p className="text-center primary-color font-500 f-13">
						Dial the code below on your mobile to <br /> complete
						this transaction
					</p>
					<p className="text-center f-20 font-500 cashenvoy-blue pt-20">
						*966*123456789#
					</p>
					<div className="centralize ussd-copy-container pt-20">
						{copied && (
							<span className="ussd-copied-text">
								Code Copied
							</span>
						)}
						<button
							onClick={() => {
								setCopied(true);
							}}
							className="copy-usd-code"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
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
						<button
							onClick={chooseADiffBank}
							className="cashenvoyred font-500"
						>
							Choose Another Bank
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default UssdPaymentWidget;
