import React, { useState, useRef } from "react";
import ActionButton from "../../components/Button/ActionButton";
import SucccessCheck from "../../assets/success-check-icon.svg";
import ArrowRight from "../../assets/arrow-right.svg";
import Spinner from "../../components/Spinner";
import useInterval from "../../hooks/useInterval";

function secondsToTime(secs) {
	// let hours = Math.floor(secs / (60 * 60));

	let divisor_for_minutes = secs % (60 * 60);
	let minutes = Math.floor(divisor_for_minutes / 60);

	let divisor_for_seconds = divisor_for_minutes % 60;
	let seconds = Math.ceil(divisor_for_seconds);

	let obj = {
		minutes,
		seconds,
	};
	return obj;
}

const timeBeforeOtpResend = 5;

const ConfirmOfflinePayment = ({ back }) => {
	const [buttonText, setButtonText] = useState("Wait for another 5mins?");
	const [paymentConfirmed, setPaymentConfirmed] = useState(false);
	// const [showButton, setShowButton] = useState(false);
	const [count, setCount] = useState(timeBeforeOtpResend);

	const [waitingCount, setWaitingCount] = useState(0);

	// const timeRef= useRef(0)

	const [delay, setDelay] = useState(1000);
	const [isCounting, setIsCounting] = useState(true);

	useInterval(
		() => {
			// Your custom logic here
			if (count > 0) {
				setCount(count - 1);
			}
			if (count === 1) {
				setIsCounting(false);

				if (waitingCount === 0) {
					setWaitingCount(1);
				}
				if (waitingCount === 1) {
					setButtonText("Keep Waiting");
					setWaitingCount(2);
				}
			}
		},
		// Delay in milliseconds or null to stop it
		isCounting && !paymentConfirmed ? delay : null
	);

	const { seconds, minutes } = secondsToTime(count);

	return (
		<div className="offline">
			<h4>
				We are confirming your transfer. This could take a couple of minutes.
			</h4>
			<div className="offline-confirmation-wrapper">
				<div className="money-sent">
					<p>You have sent the money</p>
					<img src={SucccessCheck} alt="" />
				</div>
				{!paymentConfirmed && (
					<>
						<div className="offline-confirming-payment">
							<p>Confirming payment</p>
							<div className="items-center loader">
								<p>
									{`${minutes < 10 ? "0" : ""}${minutes}`}:
									{`${seconds < 10 ? "0" : ""}${seconds}`}
								</p>
								{isCounting && (
									<Spinner height="20" width="20" colour={"#5D627B"} />
								)}
							</div>
						</div>
						<div onClick={back} className="show-details-again">
							<p>Show bank details again</p>
							<img src={ArrowRight} alt="" />
						</div>
					</>
				)}

				{paymentConfirmed && (
					<div className="offline-confirmed">
						<p>Payment confirmed</p>
						<img src={SucccessCheck} alt="" />
					</div>
				)}
			</div>

			{!paymentConfirmed && (
				<>
					<div className="">
						<div className="wait-section">
							<div className="wait-button-wrapper">
								{waitingCount > 0 && !isCounting && (
									<button
										onClick={() => {
											// setShowButton(false);
											setCount(timeBeforeOtpResend);
											setIsCounting(true);
										}}
									>
										{buttonText}
									</button>
								)}
							</div>
						</div>
					</div>
					<p className="support-content">
						If you have any issues with this transfer, please contact{" "}
						<span className="support">support@getyep.co</span>
					</p>
				</>
			)}

			{paymentConfirmed && (
				<div className="offline-dismiss-section">
					<ActionButton
						type="button"
						className="submitbutton justify-center"
						onClick={() => {}}
						disabled={false}
						loading={false}
						spinColour="#FFFFFF"
						testId="card-payment"
					>
						<span>Dismiss</span>
					</ActionButton>
				</div>
			)}
		</div>
	);
};

export default ConfirmOfflinePayment;
