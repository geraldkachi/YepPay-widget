import React from 'react';
import { Link } from 'react-router-dom';

const CardTestWidget = () => {
  return (
    <div className="testwidget-wrapper">
      <div className="testwidget">
        <div className="testwidget-header">
          <img src="https://res.cloudinary.com/cashenvoy/image/upload/v1638092035/Cashenvoy-nextgen/cashenvoylogo_pkci6s.svg" alt="Cashenvoy" />
          <span>Test Mode</span>
        </div>
        <div className="pay-with-card-test">
          <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.5 9.5V22C25.5 22.3315 25.3683 22.6495 25.1339 22.8839C24.8995 23.1183 24.5815 23.25 24.25 23.25H1.75C1.41848 23.25 1.10054 23.1183 0.866116 22.8839C0.631696 22.6495 0.5 22.3315 0.5 22V9.5H25.5ZM25.5 7H0.5V2C0.5 1.66848 0.631696 1.35054 0.866116 1.11612C1.10054 0.881696 1.41848 0.75 1.75 0.75H24.25C24.5815 0.75 24.8995 0.881696 25.1339 1.11612C25.3683 1.35054 25.5 1.66848 25.5 2V7ZM16.75 17V19.5H21.75V17H16.75Z" fill="#F12F58" />
          </svg>
          <span>Pay with <span>Card</span></span>
        </div>
        <div className="testcard-content">
          <span>Total Amount</span>
          <span>NGN4,000.00</span>
          <div className="testcard-line"></div>
          <p>
            Test your payment with the options <br /> listed below
          </p>
          <label class="testcard-check success">
            <span>Test Successful Payment </span>
            <input type="checkbox" />
            <span class="checkmark"></span>
          </label>
          <label class="testcard-check failure">
            <span>Test Failed Payment</span>
            <input type="checkbox" />
            <span class="checkmark"></span>
          </label>
          <button className="testcard-btn">
            Pay NGN100
          </button>
        </div>
        <div className="testcard-footer">
          <Link to="/" className="testwidget-link bt-grey">
            <span>
              <svg width="18" height="26" viewBox="0 0 18 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 0.5H16.5C16.8315 0.5 17.1495 0.631696 17.3839 0.866116C17.6183 1.10054 17.75 1.41848 17.75 1.75V24.25C17.75 24.5815 17.6183 24.8995 17.3839 25.1339C17.1495 25.3683 16.8315 25.5 16.5 25.5H1.5C1.16848 25.5 0.850537 25.3683 0.616117 25.1339C0.381696 24.8995 0.25 24.5815 0.25 24.25V1.75C0.25 1.41848 0.381696 1.10054 0.616117 0.866116C0.850537 0.631696 1.16848 0.5 1.5 0.5ZM9 19.25C8.66848 19.25 8.35054 19.3817 8.11612 19.6161C7.8817 19.8505 7.75 20.1685 7.75 20.5C7.75 20.8315 7.8817 21.1495 8.11612 21.3839C8.35054 21.6183 8.66848 21.75 9 21.75C9.33152 21.75 9.64946 21.6183 9.88388 21.3839C10.1183 21.1495 10.25 20.8315 10.25 20.5C10.25 20.1685 10.1183 19.8505 9.88388 19.6161C9.64946 19.3817 9.33152 19.25 9 19.25Z" fill="#F12F58" />
              </svg>
              <span>USSD</span>
            </span>
            <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.58586 9L0.292969 1.70711L1.70718 0.292892L10.4143 9L1.70718 17.7071L0.292969 16.2929L7.58586 9Z" fill="#91979F" />
            </svg>
          </Link>
          <Link to="/" className="testwidget-link">
            <span>
              <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 20.75V7H0.25V4.5H4V2C4 1.66848 4.1317 1.35054 4.36612 1.11612C4.60054 0.881696 4.91848 0.75 5.25 0.75H22.75C23.0815 0.75 23.3995 0.881696 23.6339 1.11612C23.8683 1.35054 24 1.66848 24 2V4.5H27.75V7H26.5V20.75H27.75V23.25H0.25V20.75H1.5ZM15.25 20.75V12H12.75V20.75H15.25ZM9 20.75V12H6.5V20.75H9ZM21.5 20.75V12H19V20.75H21.5ZM6.5 3.25V4.5H21.5V3.25H6.5Z" fill="#F12F58" />
              </svg>
              <span>Bank Transfer</span>
            </span>
            <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.58586 9L0.292969 1.70711L1.70718 0.292892L10.4143 9L1.70718 17.7071L0.292969 16.2929L7.58586 9Z" fill="#91979F" />
            </svg>
          </Link>
          <button type="button" className="testwidget-cancel-btn">
            <span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.99994 6.23744L1.24366 9.99372L0.00622559 8.75629L3.76251 5L0.00622559 1.24372L1.24366 0.00628662L4.99994 3.76257L8.75623 0.00628662L9.99366 1.24372L6.23738 5L9.99366 8.75629L8.75623 9.99372L4.99994 6.23744Z" fill="black" />
              </svg>
              <span>Cancel</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardTestWidget;
