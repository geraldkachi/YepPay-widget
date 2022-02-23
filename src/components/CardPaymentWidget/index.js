import React, { useState } from 'react';
import LiveCardWidget from "../../pages/LiveCardWidget";

import CardTestWidget from "../../pages/CardTestWidget";

const CardPaymentWidget = ({ paymentDetail }) => {
	return (
		<>
			{!Boolean(paymentDetail?.is_live) && (
				<CardTestWidget paymentDetail={paymentDetail} />
			)}
			{Boolean(paymentDetail?.is_live) && (
				<LiveCardWidget paymentDetail={paymentDetail} />
			)}
		</>
	);
};

export default CardPaymentWidget;
