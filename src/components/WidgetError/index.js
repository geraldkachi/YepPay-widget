import React, { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import Pusher from "pusher-js";
import { useLocation, useHistory } from "react-router-dom";
import { triggerPaymentConfirmation } from "../../services/card";
import { usePaymentContext } from "../../context/PaymentContext";
import AnimatedFailureCheckmark from "../../components/AnimatedFailureCheckmark";
import { urls } from "../../utils/urls";
import Error from "../../assets/Widget-Error.svg";

const WidgetError = () => {
	const reloadPage = () => {
		return window.location.reload();
	};

	return (
		<div className="confirm-payment-vwh">
			<div className="cashenvoypaymentwidget">
				<div className="confirm-payment">
					<div className="confirm-payment-inner">
						<div className="confirm-payment-spinner-wrapper">
							<img src={Error} alt="" />
						</div>
						<h4>Oops! Operation Failed</h4>
						<h5>
							Please check your internet connection or make sure your access
							code is valid
						</h5>
						<div className="widget-error-btn-wrapper">
							<button
								type="button"
								className="mt-15 btn block-btn blue relative"
								onClick={reloadPage}
							>
								Try Again
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WidgetError;
