import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const paymentContext = createContext();

export const usePaymentContext = () => useContext(paymentContext);

export const PaymentProvider = ({ children, initialValue }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentDetail, setPaymentDetail] = useState({});
  const [reference, setReference] = useState('');
  const [payment, setPayment] = useState({});

  const value = {
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    paymentDetail,
    setPaymentDetail,
    reference,
    setReference,
    payment,
    setPayment
  };
  return (
    <paymentContext.Provider value={value}>
      {children}
    </paymentContext.Provider>
  );
};

PaymentProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialValue: PropTypes.instanceOf(Object),
};

PaymentProvider.defaultProps = {
  initialValue: {},
};
