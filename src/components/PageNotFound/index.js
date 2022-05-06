import React, { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import Pusher from "pusher-js";
import { useLocation, useHistory } from "react-router-dom";
import { triggerPaymentConfirmation } from "../../services/card";
import { usePaymentContext } from "../../context/PaymentContext";
import AnimatedFailureCheckmark from "../../components/AnimatedFailureCheckmark";
import { urls } from "../../utils/urls";
import ErrorIcon from "../../assets/Widget-Error.svg";

const PageNotFound = () => {
	return (
		<div className="confirm-payment-vwh">
			<div className="cashenvoypaymentwidget">
				<div className="confirm-payment">
					<div className="confirm-payment-inner">
						<div className="confirm-payment-spinner-wrapper">
							<img src={ErrorIcon} alt="" />
						</div>
						<h4>Oops! Page Not Found</h4>
						<h5>Please check the url and make sure it's valid.</h5>
						{/* <div className="widget-error-btn-wrapper">
							<button
								type="button"
								className="mt-15 btn block-btn blue relative"
								onClick={reloadPage}
							>
								Try Again
							</button>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PageNotFound;
