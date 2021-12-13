import React from 'react';
import USSD from '../../components/USSDWidget';
import withInitiatePayment from '../../components/HOC/withInitiatePayment';

const USSDWidget = ({ paymentDetail }) => (
  <USSD paymentDetail={paymentDetail} />
);

export default withInitiatePayment(USSDWidget);
