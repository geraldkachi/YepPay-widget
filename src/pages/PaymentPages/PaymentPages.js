import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import YEPLOGO from "../../assets/Yep-Logo2.svg";

import WidgetError from "../../components/WidgetError";
import { fetchPaymentPageSettings } from "../../services/payment_pages";

import LoadingPage from "../LoadingPage";
import { useQuery } from "react-query";
import PaymentForm from "./PaymentForm";

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

	console.log(pageSettings[0]);

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
						<img
							className="paymentPages-customer-logo"
							src={
								pageSettings[0]?.business_details?.logo
									? pageSettings[0].business_details.logo
									: YEPLOGO
							}
							alt=""
						/>
						<h2 className="paymentPages-businessName">
							Business Name -{" "}
							{pageSettings[0]?.business_details?.name ?? ""}
						</h2>
						{pageSettings[0]?.description && (
							<h2 className="paymentPages-description">
								{pageSettings[0].description}
							</h2>
						)}
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
