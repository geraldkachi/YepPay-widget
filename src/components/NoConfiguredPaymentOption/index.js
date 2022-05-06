import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Pusher from "pusher-js";

import { triggerPaymentConfirmation } from "../../services/card";
import { usePaymentContext } from "../../context/PaymentContext";
import { useParams, useHistory } from "react-router-dom";
import AnimatedFailureCheckmark from "../../components/AnimatedFailureCheckmark";
import { urls } from "../../utils/urls";
import ErrorIcon from "../../assets/Widget-Error.svg";

const NoConfiguredPaymentOption = () => {
	const { accessCode } = useParams();
	const history = useHistory();
	const reloadPage = () => {
		return history.push(`/${accessCode}`);
	};

	return (
		<div className="confirm-payment-vwh">
			<div className="cashenvoypaymentwidget">
				<div className="confirm-payment">
					<div className="confirm-payment-inner">
						<div className="confirm-payment-spinner-wrapper">
							<img src={ErrorIcon} alt="" />
						</div>
						<h4>Oops!!! Payment Channel Unavailable</h4>
						<h5>
							Kindly reachout to your merchant to ensure that they have the
							right payment channel enabled.
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

export default NoConfiguredPaymentOption;
