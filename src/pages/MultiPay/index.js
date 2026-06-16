import React from 'react';
import MultiPayWidget from '../../components/MultiPayWidget';
import withInitiatePayment from '../../components/HOC/withInitiatePayment';

const MultipayPage = ({ paymentDetail }) => (
  <MultiPayWidget paymentDetail={paymentDetail} />
);

export default withInitiatePayment(MultipayPage);
