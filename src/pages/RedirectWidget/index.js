import React from "react";
import withInitiatePayment from "../../components/HOC/withInitiatePayment";
import RedirectToCard from "../../components/Redirect";

const RedirectWidget = ({ paymentDetail }) => {
	return <RedirectToCard paymentDetail={paymentDetail} />;
};

export default withInitiatePayment(RedirectWidget);
