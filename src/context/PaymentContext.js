import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const paymentContext = createContext();

export const usePaymentContext = () => useContext(paymentContext);

export const PaymentProvider = ({ children, initialValue }) => {
  const [errorCallback, setErrorCallback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentDetail, setPaymentDetail] = useState({});
  const [cyberDetail, setCyberDetail] = useState({});
  const [reference, setReference] = useState("");
  const [payment, setPayment] = useState({});
  const [customerCode, setCustomerCode] = useState("");

  const [cardInfo, setCardPayDetails] = useState({});
  const [additionalFee, setAdditionalFee] = useState(null);

  const [threeDSecureData, setThreeDSecureData] = useState(null);
  const [grabPin, setGrabPin] = useState({}); // Store the PIN


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
		setPayment,
		additionalFee,
		setAdditionalFee,
		errorCallback,
		setErrorCallback,

    customerCode,
    setCustomerCode,

    cardInfo,
    setCardPayDetails,

    grabPin,
    setGrabPin,

    threeDSecureData,
    setThreeDSecureData,

    cyberDetail,
    setCyberDetail
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
