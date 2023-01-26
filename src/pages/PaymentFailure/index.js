import React, { useState } from "react";
import { useHistory, useParams, Redirect } from "react-router";
import AnimatedFailureCheckmark from "../../components/AnimatedFailureCheckmark";
import WidgetFooter from "../../components/WidgetFooter";
import { usePaymentContext } from "../../context/PaymentContext";
import useInterval from "../../hooks/useInterval";

function secondsToTime(secs) {
	// let hours = Math.floor(secs / (60 * 60));

	let divisor_for_minutes = secs % (60 * 60);

	let divisor_for_seconds = divisor_for_minutes % 60;
	let seconds = Math.ceil(divisor_for_seconds);

	let obj = {
		seconds,
	};
	return obj;
}

const timeToRedirect = 4;

const PaymentFailure = () => {
	const history = useHistory();
	const paymentContext = usePaymentContext();
	const { errorCallback, setErrorCallback } = paymentContext;
	const [count, setCount] = useState(timeToRedirect);
	const [delay, setDelay] = useState(1000);
	const [isCounting, setIsCounting] = useState(() => {
		return !!errorCallback.trim();
	});

	const { accessCode } = useParams();

	const handleClick = () => {
		setErrorCallback("");
		return history.push(`/${accessCode}`);
	};
	const openCallbackUrl = () => {
		return window.location.replace(errorCallback);
	};

	useInterval(
		() => {
			// Your custom logic here
			if (count > 0) {
				setCount(count - 1);
			}
			if (count === 1) {
				openCallbackUrl();
			}
			if (count === 0) {
				setIsCounting(false);
			}
		},
		// Delay in milliseconds or null to stop it
		isCounting ? delay : null
	);

	if (
		!paymentContext.errorMessage ||
		!paymentContext.paymentDetail?.callback_url
	) {
		return <Redirect to={`/${accessCode}`} />;
	}

	const { seconds } = secondsToTime(count);

	return (
		<div className="h-full flex justify-center items-center">
			<div className="paymentstatus mt-50">
				<div className="w-full flex justify-center">
					<div className="icon-wrapper error">
						<AnimatedFailureCheckmark />
					</div>
				</div>
				<div className="paymentstatus-content error">
					<p>Payment Failed</p>
					<span>{paymentContext.errorMessage}</span>

					{!!errorCallback.trim() && (
						<div className="redirect-wrapper">
							<span className="redirect-button error">
								<span className="redirect-text">
									Redirects in :{" "}
								</span>
								<span className="redirect-timer">
									{`${seconds < 10 ? "0" : ""}${seconds}`}
								</span>
							</span>
						</div>
					)}

					{!errorCallback.trim() && (
						<button
							type="button"
							// to="/authorize_transaction"
							className="mt-15 btn block-btn success relative"
							onClick={handleClick}
						>
							<svg
								className="retry-svg-icon"
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M2.51584 3H4.8V4.2H0.6V0H1.8V1.96221C2.83506 0.709507 4.31746 0 6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6H1.2C1.2 8.65097 3.34903 10.8 6 10.8C8.65097 10.8 10.8 8.65097 10.8 6C10.8 3.34903 8.65097 1.2 6 1.2C4.56383 1.2 3.33212 1.84722 2.51584 3Z"
									fill="white"
								/>
							</svg>
							Try Again
						</button>
					)}
				</div>
				<div className="pt-120">
					<WidgetFooter
						verb="Dismiss"
						onClick={() => {
							!!errorCallback.trim()
								? openCallbackUrl()
								: handleClick();
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default PaymentFailure;
