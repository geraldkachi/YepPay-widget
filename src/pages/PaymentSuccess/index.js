import React, { useEffect, useState } from "react";
// Components
import AnimatedSuccessCheckmark from "../../components/AnimatedSuccessCheckmark";
import WidgetFooter from "../../components/WidgetFooter";
import { usePaymentContext } from "../../context/PaymentContext";
import { delay } from "../../utils";
import { Redirect, useParams } from "react-router-dom";
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

const timeBeforeOtpResend = 4;

const PaymentSuccess = () => {
	const paymentContext = usePaymentContext();
	const { payment } = paymentContext;
	const { accessCode } = useParams();
	const [count, setCount] = useState(timeBeforeOtpResend);
	// Dynamic delay
	const [delay, setDelay] = useState(1000);
	// ON/OFF
	const [isCounting, setIsCounting] = useState(true);

	const openCallbackUrl = () => {
		return window.location.replace(payment.callback_url);
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

	// useEffect(() => {
	// 	(async () => {
	// 		if (payment?.amount) {
	// 			await delay(3500); // wait for user to see the success message
	// 			openCallbackUrl();
	// 		}
	// 	})();
	// }, [payment]);

	if (!payment?.amount) {
		return <Redirect to={`/${accessCode}`} />;
	}

	const { seconds } = secondsToTime(count);

	return (
		<div className="h-full flex justify-center items-center">
			<div className="paymentstatus mt-50">
				<div className="w-full flex justify-center">
					<div className="icon-wrapper">
						<AnimatedSuccessCheckmark />
					</div>
				</div>
				<div className="paymentstatus-content">
					<p>Payment Successful</p>
					<span>You have successfully completed the payment of</span>
					<h1>
						{payment.currency || "NGN"} {payment.amount}
					</h1>
					{true && (
						<div className="redirect-wrapper">
							<span className="redirect-button">
								<span className="redirect-text">Redirects in : </span>
								<span className="redirect-timer">
									{`${seconds < 10 ? "0" : ""}${seconds}`}
								</span>
							</span>
						</div>
					)}
					{/* <div className="centralize">
            <button type="button" to="/authorize_transaction" className="btn success w-200">
              <span>View Receipt</span>
            </button>
          </div> */}
				</div>
				<div className="pt-120">
					<WidgetFooter onClick={openCallbackUrl} verb="Dismiss" />
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccess;
