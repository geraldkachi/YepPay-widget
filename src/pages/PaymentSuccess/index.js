import React from 'react';
// Components
import AnimatedSuccessCheckmark from '../../components/AnimatedSuccessCheckmark';

const PaymentSuccess = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="paymentstatus mt-50">
        <div className="w-full flex justify-center">
          <div className="icon-wrapper">
<<<<<<< HEAD
=======
            {/* <img src={SuccessIcon} alt="Payment Success Icon" /> */}
>>>>>>> 2e651d95abdb4d52ecd8745aa8027a0fd3b9879c
            <AnimatedSuccessCheckmark />
          </div>
        </div>
        <div className="paymentstatus-content">
          <p>Payment Successful</p>
          <span>You have successfully completed the payment of</span>
          <h1>NGN 1,000.00</h1>
<<<<<<< HEAD
          <div className="centralize">
            <button type="button" to="/authorize_transaction" className="btn success w-200">
              <span>View Receipt</span>
            </button>
          </div>
          <div className="centralize">
            <button type="button" to="/authorize_transaction" className="btn w-200 default mt-5 mb-15">
              <span>Dismiss</span>
            </button>
          </div>
=======
          <button type="button" to="/authorize_transaction" className="btn block-btn success">
            <span>View Receipt</span>
          </button>
          <button type="button" to="/authorize_transaction" className="btn block-btn default mt-5 mb-15">
            <span>Dismiss</span>
          </button>
>>>>>>> 2e651d95abdb4d52ecd8745aa8027a0fd3b9879c
        </div>
        <div className="paymentstatus-footer">
          <p>Powered by Cashenvoy</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess;
