import React, { useState, useEffect } from "react";
import CopyIcon from "../../assets/copy-icon.svg";
import DisclaimerIcon from "../../assets/disclaimer.svg";
import ActionButton from "../../components/Button/ActionButton";

const SendMoney = ({ proceed, accountNumber, expiresIn, amount, bank }) => {
	const [copied, setCopied] = useState(false);

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
		<div className="offline">
			<h4>
				Transfer NGN{" "}
				{Number(amount).toLocaleString("en-NG", {
					minimumFractionDigits: 0,
				})}{" "}
				to the account details below
			</h4>
			<div className="offline-account-details-wrapper">
				<div className="offline-account-number-wrapper">
					<div className="">
						<h6 className="offline-account-number-title">
							Account Number
						</h6>
						<p className="offline-account-number-value">
							{accountNumber}
						</p>
					</div>
					<div className="offline-copy">
						{copied && (
							<span className="ussd-copied-text">
								Account Copied
							</span>
						)}
						<img
							onClick={() => {
								copyText(accountNumber);
							}}
							src={CopyIcon}
							alt=""
						/>
					</div>
				</div>
				<div className="offline-bank-name-wrapper">
					<h6 className="">Bank</h6>
					<p className="">{bank}</p>
				</div>

				<p className="offline-details">
					Use this account to complete this transaction only. Account
					expires in{" "}
					<span>{Math.ceil(expiresIn / (60 * 60))} hours</span>
				</p>
			</div>
			<div className="offline-disclaimer">
				<img src={DisclaimerIcon} alt="disclaimer icon" />
				<p className="disclaimer-content">
					Please ensure you transfer the exact amount requested.
					Transferring an amount higher or lower than the requested
					amount will result in a failed transaction.
				</p>
			</div>

			<div>
				<ActionButton
					type="button"
					className="submitbutton"
					onClick={proceed}
					disabled={false}
					loading={false}
					spinColour="#FFFFFF"
					testId="card-payment"
				>
					<span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="3.33331"
								y="7.33333"
								width="9.33333"
								height="6.66667"
								stroke="white"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M4.66669 5.33333C4.66669 3.49239 6.15907 2 8.00002 2V2C9.84097 2 11.3334 3.49238 11.3334 5.33333V7.33333H4.66669V5.33333Z"
								stroke="white"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</span>
					<span>I’ve sent the money</span>
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
			</div>
		</div>
	);
};

export default SendMoney;
