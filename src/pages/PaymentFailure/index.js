import React from 'react';
import AnimatedFailureCheckmark from '../../components/AnimatedFailureCheckmark';

const PaymentFailure = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="paymentstatus mt-50">
        <div className="w-full flex justify-center">
          <div className="icon-wrapper error">
            <AnimatedFailureCheckmark />
          </div>
        </div>
        <div className="paymentstatus-content error">
          <p>Payment Failed</p>
          <span>Operation failed due to poor network or insufficient funds. Please try again or use another card</span>
<<<<<<< HEAD
          <button type="button" to="/authorize_transaction" className="mt-15 btn block-btn success relative">
            <svg className="retry-svg-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.51584 3H4.8V4.2H0.6V0H1.8V1.96221C2.83506 0.709507 4.31746 0 6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6H1.2C1.2 8.65097 3.34903 10.8 6 10.8C8.65097 10.8 10.8 8.65097 10.8 6C10.8 3.34903 8.65097 1.2 6 1.2C4.56383 1.2 3.33212 1.84722 2.51584 3Z" fill="white" />
            </svg>
            Try Again
=======
          <button type="button" to="/authorize_transaction" className="mt-15 btn block-btn success">
            <span className="flex justify-end">
              <span className="w-full flex justify-between items-center">
                <span>Try Again</span>
                <span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M2.51584 3H4.8V4.2H0.6V0H1.8V1.96221C2.83506 0.709507 4.31746 0 6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6H1.2C1.2 8.65097 3.34903 10.8 6 10.8C8.65097 10.8 10.8 8.65097 10.8 6C10.8 3.34903 8.65097 1.2 6 1.2C4.56383 1.2 3.33212 1.84722 2.51584 3Z" fill="white" />
                </svg>
                </span>
              </span>
            </span>
>>>>>>> 2e651d95abdb4d52ecd8745aa8027a0fd3b9879c
          </button>
          <button type="button" to="/authorize_transaction" className="btn block-btn default mt-5 mb-15">
            <span>Dismiss</span>
          </button>
        </div>
        <div className="paymentstatus-footer">
          <p>Powered by Cashenvoy</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailure;
