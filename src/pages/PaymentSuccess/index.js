import React from 'react';
// Components
import AnimatedSuccessCheckmark from '../../components/AnimatedSuccessCheckmark';
import WidgetFooter from '../../components/WidgetFooter';

const PaymentSuccess = () => {
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
          <h1>NGN 1,000.00</h1>
          <div className="centralize">
            <button type="button" to="/authorize_transaction" className="btn success w-200">
              <span>View Receipt</span>
            </button>
          </div>
        </div>
        <div className="pt-120">
          <WidgetFooter verb="Dismiss" />
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess;
