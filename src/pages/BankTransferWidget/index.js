import React from 'react';
import BankWidget from '../../components/BankWidget';
import withInitiatePayment from '../../components/HOC/withInitiatePayment';

const BankTransferWidget = ({ paymentDetail }) => (
  <BankWidget paymentDetail={paymentDetail} />
);

export default withInitiatePayment(BankTransferWidget);
