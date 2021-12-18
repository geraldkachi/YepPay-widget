import React, { useEffect } from 'react';
// Components
import AnimatedSuccessCheckmark from '../../components/AnimatedSuccessCheckmark';
import WidgetFooter from '../../components/WidgetFooter';
import { usePaymentContext } from '../../context/PaymentContext';
import { delay } from '../../utils';

const PaymentSuccess = () => {
  const paymentContext = usePaymentContext();
  const { payment } = paymentContext;

  const openCallbackUrl = () => {
    return window.location.replace(payment.callback_url);
  };

  useEffect(() => {
    (async () => {
      if (payment?.amount) {
        await delay(3500); // wait for user to see the success message
        openCallbackUrl();
      }
    })();
  }, [payment]);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="paymentstatus mt-50">
        <div className="w-full flex justify-center">
          <div className="icon-wrapper">
            <AnimatedSuccessCheckmark />
          </div>
        </div>
        <div className="paymentstatus-content">
          <p>Payment Successful</p>
          <span>You have successfully completed the payment of</span>
          <h1>
            {payment.currency || 'NGN'} {payment.amount}
          </h1>
          {/* <div className="centralize">
            <button type="button" to="/authorize_transaction" className="btn success w-200">
              <span>View Receipt</span>
            </button>
          </div> */}
        </div>
        <div className="pt-120">
          <WidgetFooter onClick={openCallbackUrl} verb="Dismiss" />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
