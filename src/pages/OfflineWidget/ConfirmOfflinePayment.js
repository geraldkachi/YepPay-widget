import React, { useState, useRef, useEffect } from "react";
import ActionButton from "../../components/Button/ActionButton";
import SucccessCheck from "../../assets/success-check-icon.svg";
import ArrowRight from "../../assets/arrow-right.svg";
import Pusher from "pusher-js";
import { usePaymentContext } from "../../context/PaymentContext";
import Spinner from "../../components/Spinner";
import { useHistory, useParams, Link } from "react-router-dom";
import useInterval from "../../hooks/useInterval";
import { urls } from "../../utils/urls";
import { logAsDisputeToBackend } from "../../services/offline_transfer";

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

// Todo.. Listen to second event that handles unforseen circumstances


const waitingTime = 299;

const ConfirmOfflinePayment = ({ back, paymentConfirmed, accountNumber }) => {
	const [buttonText, setButtonText] = useState("Wait for another 5mins?");
	const [count, setCount] = useState(waitingTime);

	const [waitingCount, setWaitingCount] = useState(0);

	const [delay, setDelay] = useState(1000);
	const [isCounting, setIsCounting] = useState(true);
	const history = useHistory();
	const { accessCode } = useParams();
	const paymentContext = usePaymentContext();

	const logAsDispute = async (payload) => {
		try {
			const response = await logAsDisputeToBackend(payload);
			paymentContext.setErrorMessage(
				"This transaction is taking longer than usual to confirm. It has been logged for a refund, please retry the transaction."
			);
			history.push(urls.failure(accessCode));
		} catch (error) {
			paymentContext.setErrorMessage(
				"This transaction is taking longer than usual to confirm. It has been logged for a refund, please retry the transaction."
			);
			history.push(urls.failure(accessCode));
		}
	};

	useInterval(
		() => {
			if (count > 0) {
				setCount(count - 1);
			}
			if (count === 1) {
				setIsCounting(false);

				if (waitingCount === 0) {
					setWaitingCount(1);
				}
				if (waitingCount === 1) {
					setWaitingCount(2);
				}
			}
		},
		// Delay in milliseconds or null to stop it
		isCounting && !paymentConfirmed ? delay : null
	);

	useEffect(() => {
		if (waitingCount === 2) {
			logAsDispute({ account_number: accountNumber });
		}
	}, [waitingCount]);

	const { seconds, minutes } = secondsToTime(count);

	return (
		<div className="offline">
			<h4>
				We are confirming your transfer. This could take a couple of
				minutes.
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
									<Spinner
										height="20"
										width="20"
										colour={"#5D627B"}
									/>
								)}
							</div>
						</div>
						{/* {waitingCount === 2 && (
							<div onClick={back} className="show-details-again">
								<p>Show bank details again</p>
								<img src={ArrowRight} alt="" />
							</div>
						)} */}
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
								{waitingCount === 1 && !isCounting && (
									<button
										onClick={() => {
											// setShowButton(false);
											setCount(waitingTime);
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
						If you have any issues with this transfer, please
						contact{" "}
						<span className="support">support@getyep.co</span>
					</p>
				</>
			)}

			{paymentConfirmed && (
				<div className="offline-dismiss-section">
					<ActionButton
						type="button"
						className="submitbutton justify-center"
						onClick={() => {
							history.push(urls.home(accessCode));
						}}
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
};;

export default ConfirmOfflinePayment;
