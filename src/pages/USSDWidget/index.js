import React from 'react';
import withInitiatePayment from "../../components/HOC/withInitiatePayment";
import UssdPaymentWidget from "../UssdPaymentWidget/index";

const USSDWidget = ({ paymentDetail }) => (
	<UssdPaymentWidget paymentDetail={paymentDetail} />
);

export default withInitiatePayment(UssdPaymentWidget);
