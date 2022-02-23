import React from "react";
import { useParams, Redirect } from "react-router-dom";

const urls = { card: "card", ussd: "ussd-payment", bank: "bank-transfer" };

const RedirectToFirstChannel = ({ paymentDetail }) => {
	console.log(paymentDetail);
	const { accessCode } = useParams();
	return <Redirect to={`/${accessCode}/${urls[paymentDetail.channels[0]]}`} />;
};

export default RedirectToFirstChannel;
