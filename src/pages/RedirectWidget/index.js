import React from "react";
import withInitiatePayment from "../../components/HOC/withInitiatePayment";
import RedirectToFirstChannel from "../../components/Redirect";

const RedirectWidget = ({ paymentDetail }) => {
	return <RedirectToFirstChannel paymentDetail={paymentDetail} />;
};

export default withInitiatePayment(RedirectWidget);
