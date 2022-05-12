import { useFormik } from 'formik';
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";
import ActionButton from "../../components/Button/ActionButton";
import withInitiatePayment from "../../components/HOC/withInitiatePayment";

import { payWithCard } from "../../services/card";

// images/icons
import { usePaymentContext } from "../../context/PaymentContext";
import useInterval from "../../hooks/useInterval";
import { validatePayment } from "../../services";
import FormError from "../../utils/form/FormError";
import { urls } from "../../utils/urls";

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

const timeBeforeOtpResend = 119;

const AuthorizeTransaction = () => {
	const history = useHistory();
	const { accessCode, reference } = useParams();
	const paymentContext = usePaymentContext();

	const [count, setCount] = useState(timeBeforeOtpResend);
	// Dynamic delay
	const [delay, setDelay] = useState(1000);
	// ON/OFF
	const [isCounting, setIsCounting] = useState(true);

	useInterval(
		() => {
			// Your custom logic here
			if (count > 0) {
				setCount(count - 1);
			}
			if (count === 0) {
				setIsCounting(false);
				setCount(timeBeforeOtpResend);
			}
		},
		// Delay in milliseconds or null to stop it
		isCounting ? delay : null
	);

	const submitPin = async (payload) => {
		const response = await payWithCard(payload);
		if (response.status) {
			paymentContext.setReference(response.data.reference);
			setIsCounting(true);
			toast.success("OTP Resent. Kindly Check your email or Phone Number.", {
				position: "top-center",
				style: { fontSize: "14px", textAlign: "center" },
			});
		} else {
			if (response.data.errors) {
				toast.error(response.message);
			} else {
				paymentContext.setErrorMessage(response.message);
				return history.push(urls.failure(accessCode));
			}
		}
	};

	const { seconds, minutes } = secondsToTime(count);

	const formik = useFormik({
		initialValues: {
			otp: "",
		},
		onSubmit: async (values) => {
			const urlSearchParams = new URLSearchParams(window.location.search);
			const type = urlSearchParams.get("type");

			const payload = {
				...values,
				reference,
				type,
			};

			const response = await validatePayment(payload);

			if (response.status) {
				let payment = response.data;
				if (Array.isArray(response.data)) {
					payment = response.data[0];
				}
				paymentContext.setPayment(payment);
				paymentContext.setReference(null);
				return history.push(urls.success(accessCode));
			} else {
				paymentContext.setReference("");

				paymentContext.setErrorMessage(response.message);
				return history.push(urls.failure(accessCode));
			}
		},
	});

	useEffect(() => {
		if (!paymentContext.reference) {
			history.push(urls.home(accessCode));
		}
	}, []);

	return (
		<>
			<div className="p-20">
				<p className="text-center f-13">{paymentContext.successMessage}</p>
			</div>
			<div className="px-20">
				<form>
					<div className="input-wrapper">
						<input
							type="text"
							name="otp"
							className="otp-input"
							placeholder="Enter OTP Code"
							value={formik.values.otp}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
						<FormError formik={formik} inputName="otp" />
					</div>
					<ActionButton
						type="button"
						className="submitbutton mt-20"
						onClick={formik.handleSubmit}
						loading={formik.isSubmitting}
						disabled={formik.values.otp.length < 4}
						spinColour="#FFFFFF"
						testId="authorize"
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
						<span>Authorize</span>
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
					<div className="resend-otp">
						<p className="resend-otp-title">Didn’t get the code?</p>
						<div className="resend-wrapper">
							<span className="resend-button">
								{!isCounting && (
									<span
										onClick={() => {
											submitPin(paymentContext.payment);
										}}
										className="resend-text-cursor"
									>
										Resend Code
									</span>
								)}
								{isCounting && (
									<>
										<span className="resend-text">Resend Code</span>
										<span className="resend-timer">
											: {`${minutes < 10 ? "0" : ""}${minutes}`}:
											{`${seconds < 10 ? "0" : ""}${seconds}`}
										</span>
									</>
								)}
							</span>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default withInitiatePayment(AuthorizeTransaction, false);
