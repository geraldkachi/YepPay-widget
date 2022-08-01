import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import YEPLOGO from "../../assets/Yep-Logo.svg";

import WidgetError from "../../components/WidgetError";
import { fetchPaymentPageSettings } from "../../services/payment_pages";

import LoadingPage from "../LoadingPage";
import { useQuery } from "react-query";
import PaymentForm from "./PaymentForm";

// const _config = {
// 	amount: "50,000,000,000",
// 	business_id: 2,
// 	callback_url: "https://google.com",
// 	can_collect_name: false,
// 	can_collect_phone_number: true,
// 	channels: ["card", "offline transfer"],
// 	currency: "ngn",
// 	has_customer_as_bearer: false,
// 	id: 30,
// 	is_live: 0,
// 	metadata: ["home_address", "city"],
// 	recipients: [""],
// };

const PaymentPages = () => {
	const { accessCode } = useParams();
	const pageSettings = useState(null);

	const { isError, isLoading } = useQuery(
		["payment-page-config", accessCode],
		() => fetchPaymentPageSettings(accessCode),
		{
			onSuccess: (response) => {
				pageSettings[1](response.data.data);
			},
		}
	);

	// if (isLoading && !pageSettings[0]) {
	// 	return <LoadingPage />;
	// }

	// if (isError && !pageSettings[0]) {
	// 	return <WidgetError />;
	// }

	return (
		<>
			{isLoading && !pageSettings[0] && <LoadingPage />}
			{isError && !pageSettings[0] && <WidgetError />}
			{!isError && pageSettings[0] && (
				<>
					<Helmet>
						<meta charset="utf-8" />

						<meta
							name="viewport"
							content="width=device-width, initial-scale=1"
						/>
						<meta name="theme-color" content="#000000" />
						<meta name="description" content="Payment Pages, Yep" />

						<title>Yep Payment Pages</title>
					</Helmet>
					<main className="paymentPages-bg">
						<img className="paymentPages-customer-logo" src={YEPLOGO} alt="" />
						<section className="paymentPages-card">
							<PaymentForm config={pageSettings[0]} />

							<div className="poweredByYep">
								<p>Powered by</p>
								<img src={YEPLOGO} alt="" />
							</div>
						</section>
					</main>
				</>
			)}
		</>
	);
};

export default PaymentPages;
