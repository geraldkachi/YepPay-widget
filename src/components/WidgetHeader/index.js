import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import CardIcon from '../../assets/card.svg';
import USSDIcon from '../../assets/ussd.svg';
import BankIcon from '../../assets/bank.svg';
import OfflineIcon from "../../assets/offline_transfer_icon.svg";
import { urls } from "../../utils/urls";
import { usePaymentContext } from "../../context/PaymentContext";

import YEPLOGO from "../../assets/Yep-Logo.svg";

// navigation and availablePaymentChannels must always be in sync
export const availablePaymentChannels = ["card", "ussd"];
// export const availablePaymentChannels = ["card", "offline transfer", "ussd"];

const WidgetHeader = ({ showTabs, paymentDetail }) => {
	const { accessCode } = useParams();
	const { additionalFee, setAdditionalFee } = usePaymentContext();

	const { customer, amount, currency, amount_formatted, channels, bearer } =
		paymentDetail;

	const showAdditionContent = bearer !== "account";
	// console.log(additionalFee);
	const showFee = additionalFee !== null;

	const navigation = {
		card: (
			<NavLink
				to={urls.card(accessCode)}
				onClick={() => {
					setAdditionalFee(null);
				}}
				className="button flex justify-center items-center"
				activeClassName="active"
			>
				<img className="mr-4" src={CardIcon} alt="Card Icon" />
				Card
			</NavLink>
		),
		ussd: (
			<NavLink
				to={urls.ussd(accessCode)}
				onClick={() => {
					setAdditionalFee(null);
				}}
				className="button flex justify-center items-center"
				activeClassName="active"
			>
				<img className="mr-4" src={USSDIcon} alt="USSD Icon" />
				USSD
			</NavLink>
		),
		// bank: (
		// 	<NavLink
		// 		to={urls.bankTransfer(accessCode)}
		// 		onClick={() => {
		// 			setAdditionalFee(null);
		// 		}}
		// 		className="button flex justify-center items-center"
		// 		activeClassName="active"
		// 	>
		// 		<img className="mr-4" src={BankIcon} alt="Bank Payment Icon" />
		// 		Bank
		// 	</NavLink>
		// ),
		// "offline transfer": (
		// 	<NavLink
		// 		to={urls.offlineTransfer(accessCode)}
		// 		onClick={() => {
		// 			setAdditionalFee(null);
		// 		}}
		// 		className="button flex justify-center items-center"
		// 		activeClassName="active"
		// 	>
		// 		<img
		// 			className="mr-4"
		// 			src={OfflineIcon}
		// 			alt="Bank Payment Icon"
		// 		/>
		// 		Transfer
		// 	</NavLink>
		// ),
	};

	return (
		<div className="widget-header">
			<div className="w-full flex items-center justify-between">
				<img
					// src="https://res.cloudinary.com/cashenvoy/image/upload/v1638092035/Cashenvoy-nextgen/cashenvoylogo_pkci6s.svg"
					src={YEPLOGO}
					alt="Cashenvoy Logo"
				/>
				{!Boolean(paymentDetail?.is_live) && (
					<span className="test-mode">Test Mode</span>
				)}
			</div>
			<div className="widget-header-pill">
				<div className="widget-header-user">
					<span>{customer.email}</span>
					<span>
						{currency} {amount_formatted}
					</span>
				</div>
				{showAdditionContent && (
					<>
						{!showFee && (
							<div className="widget-header-meta">
								<div className="meta-child">
									<span>+ Additional charges</span>
									<button className="display-hidden-charges">
										<svg
											width="14"
											height="14"
											viewBox="0 0 14 14"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M0.583374 7.00004C0.583374 10.5439 3.45621 13.4167 7.00004 13.4167C10.5439 13.4167 13.4167 10.5439 13.4167 7.00004C13.4167 3.45621 10.5439 0.583374 7.00004 0.583374C3.45621 0.583374 0.583374 3.45621 0.583374 7.00004ZM12.25 7.00004C12.25 9.89954 9.89954 12.25 7.00004 12.25C4.10055 12.25 1.75004 9.89954 1.75004 7.00004C1.75004 4.10055 4.10055 1.75004 7.00004 1.75004C9.89954 1.75004 12.25 4.10055 12.25 7.00004ZM7.00023 9.91574C7.3225 9.91574 7.58376 9.65457 7.58376 9.33241C7.58376 9.01024 7.3225 8.74907 7.00023 8.74907C6.67796 8.74907 6.41671 9.01024 6.41671 9.33241C6.41671 9.65457 6.67796 9.91574 7.00023 9.91574ZM6.41671 8.16671H7.58337C7.58337 7.701 7.65654 7.61565 8.13592 7.37596C8.96904 6.9594 9.33337 6.53433 9.33337 5.54171C9.33337 4.27041 8.33258 3.50004 7.00004 3.50004C5.71138 3.50004 4.66671 4.54471 4.66671 5.83337H5.83337C5.83337 5.18904 6.35571 4.66671 7.00004 4.66671C7.74505 4.66671 8.16671 4.99128 8.16671 5.54171C8.16671 6.00741 8.09355 6.09277 7.61417 6.33246C6.78105 6.74902 6.41671 7.17408 6.41671 8.16671Z"
												fill="#FFB1C2"
											/>
										</svg>
									</button>
									<div className="hidden-charges">
										<div className="hidden-charges-child">
											<span>Payment Processing Fee</span>
											{/* <span>
												{currency} {amount_formatted}
											</span> */}
										</div>
									</div>
								</div>
							</div>
						)}

						{showFee && (
							<div className="widget-header-meta">
								<div className="meta-child">
									<span>
										+ {currency} {additionalFee}
									</span>
								</div>
							</div>
						)}
					</>
				)}
			</div>
			{showTabs && (
				<div className="tab-headers">
					<div className="buttonGroup">
						{channels
							.filter((chan) =>
								availablePaymentChannels.includes(chan)
							)
							.map((channel) => (
								<span key={channel}>
									{navigation[channel]}{" "}
								</span>
							))}
					</div>
				</div>
			)}
		</div>
	);
};;;

export default WidgetHeader;

// WidgetHeader.defaultProps = {
//   showMeta: true,
// };
WidgetHeader.propTypes = {
	setActive: PropTypes.bool,
	toggleTab: PropTypes.func,
	showTabs: PropTypes.bool,
	// showMeta: PropTypes.bool,
	element: PropTypes.element,
};
