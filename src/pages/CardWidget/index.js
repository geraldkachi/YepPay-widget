import React from 'react';

import CardPaymentWidget from '../../components/CardPaymentWidget';
import withInitiatePayment from '../../components/HOC/withInitiatePayment';

const CardWidget = ({ paymentDetail }) => (
  <CardPaymentWidget paymentDetail={paymentDetail} />
);

export default withInitiatePayment(CardWidget);
