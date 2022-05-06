import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { availablePaymentChannels } from "../WidgetHeader/index";

const urls = {
	card: "card",
	ussd: "ussd-payment",
	bank: "bank-transfer",
	offline_transfer: "offline-transfer",
};

const RedirectToFirstChannel = ({ paymentDetail }) => {
	const merchantsConfiguredChannels = paymentDetail.channels;

	const { accessCode } = useParams();

	const channelsAvailable = merchantsConfiguredChannels.filter((channel) =>
		availablePaymentChannels.includes(channel)
	);



	if (channelsAvailable.length === 0) {
		return <Redirect to={`/error/${accessCode}`} />;
	}

	return <Redirect to={`/${accessCode}/${urls[channelsAvailable[0]]}`} />;
};;

export default RedirectToFirstChannel;
