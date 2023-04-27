import React, { useEffect, useState } from "react";
// Components
import AnimatedSuccessCheckmark from "../../components/AnimatedSuccessCheckmark";
import WidgetFooter from "../../components/WidgetFooter";
import { usePaymentContext } from "../../context/PaymentContext";
import { delay } from "../../utils";
import { Redirect, useHistory, useParams } from "react-router-dom";
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

const PaymentSuccess = () => {
	const history = useHistory();
	const paymentContext = usePaymentContext();
	const { payment, paymentDetail, setPayment } = paymentContext;
	const { accessCode } = useParams();
	const [count, setCount] = useState(timeToRedirect);

	const [allowRedirect, setAllowRedirect] = useState(() => {
		if (paymentDetail?.callback_type !== undefined) {
			if (paymentDetail.callback_type === "webhook") {
				return false;
			} else if (paymentDetail.callback_type === "callback") {
				return true;
			}
		} else {
			return true;
		}
	});
	const [delay, setDelay] = useState(1000);

	const [isCounting, setIsCounting] = useState(true);

	const returnHome = () => {
		setPayment({});
		return history.push(`/${accessCode}`);
	};

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
		isCounting && allowRedirect ? delay : null
	);

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

					{allowRedirect && (
						<div className="redirect-wrapper">
							<span className="redirect-button">
								<span className="redirect-text">
									Redirects in :{" "}
								</span>
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
					<WidgetFooter
						onClick={() => {
							allowRedirect ? openCallbackUrl() : returnHome();
						}}
						verb="Dismiss"
					/>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccess;
