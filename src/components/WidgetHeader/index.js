import React from 'react';
import CardIcon from '../../assets/card.svg';
import USSDIcon from '../../assets/ussd.svg';
import BankIcon from '../../assets/bank.svg';

const WidgetHeader = ({ email, amount, setActive, toggleTab, showTabs, showMeta, element }) => {
  return (
    <div className="widget-header">
      <div className="w-full flex items-center justify-between">
        <img src="https://res.cloudinary.com/cashenvoy/image/upload/v1638092035/Cashenvoy-nextgen/cashenvoylogo_pkci6s.svg" alt="Cashenvoy Logo" />
        {element}
      </div>
      <div className="widget-header-pill">
        <div className="widget-header-user">
          <span>{email}</span>
          <span>{amount}</span>
        </div>
        {showMeta && (
          <div className="widget-header-meta">
          <div className="meta-child">
            <span>+ Additional charges</span>
            <button className="">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.583374 7.00004C0.583374 10.5439 3.45621 13.4167 7.00004 13.4167C10.5439 13.4167 13.4167 10.5439 13.4167 7.00004C13.4167 3.45621 10.5439 0.583374 7.00004 0.583374C3.45621 0.583374 0.583374 3.45621 0.583374 7.00004ZM12.25 7.00004C12.25 9.89954 9.89954 12.25 7.00004 12.25C4.10055 12.25 1.75004 9.89954 1.75004 7.00004C1.75004 4.10055 4.10055 1.75004 7.00004 1.75004C9.89954 1.75004 12.25 4.10055 12.25 7.00004ZM7.00023 9.91574C7.3225 9.91574 7.58376 9.65457 7.58376 9.33241C7.58376 9.01024 7.3225 8.74907 7.00023 8.74907C6.67796 8.74907 6.41671 9.01024 6.41671 9.33241C6.41671 9.65457 6.67796 9.91574 7.00023 9.91574ZM6.41671 8.16671H7.58337C7.58337 7.701 7.65654 7.61565 8.13592 7.37596C8.96904 6.9594 9.33337 6.53433 9.33337 5.54171C9.33337 4.27041 8.33258 3.50004 7.00004 3.50004C5.71138 3.50004 4.66671 4.54471 4.66671 5.83337H5.83337C5.83337 5.18904 6.35571 4.66671 7.00004 4.66671C7.74505 4.66671 8.16671 4.99128 8.16671 5.54171C8.16671 6.00741 8.09355 6.09277 7.61417 6.33246C6.78105 6.74902 6.41671 7.17408 6.41671 8.16671Z" fill="#FFB1C2" />
              </svg>
            </button>
          </div>
        </div>
        )}
      </div>
      {showTabs && (
        <div className="tab-headers">
          <div className="buttonGroup">
            <button
              className={`button flex items-center ${setActive === 'CardPayment' && 'active'
                }`}
              onClick={toggleTab}
              id="CardPayment"
              data-value="CardPayment"
            >
              <img className="mr-4" src={CardIcon} alt="Card Icon" />
              Card
            </button>
            <button
              className={`button flex items-center ${setActive === 'USSDPayment' && 'active'
                }`}
              onClick={toggleTab}
              id="USSDPayment"
              data-value="USSDPayment"
            >
              <img className="mr-4" src={USSDIcon} alt="USSD Icon" />
              USSD
            </button>
            <button
              className={`button flex items-center ${setActive === 'BankPayment' && 'active'
                }`}
              onClick={toggleTab}
              id="BankPayment"
              data-value="BankPayment"
            >
              <img className="mr-4" src={BankIcon} alt="Bank Payment Icon" />
              Bank
            </button>
          </div>
        </div>
      )}
    </div>

  )
}

export default WidgetHeader;

WidgetHeader.defaultProps = {
  showMeta: true
}
