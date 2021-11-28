import React from 'react';
import CashenvoyLogo from '../../assets/cashenvoylogo.svg';
import CancelIcon from '../../assets/cancel.svg';
import CardIcon from '../../assets/card.svg';
import USSDIcon from '../../assets/ussd.svg';
import BankIcon from '../../assets/bank.svg';

const WidgetHeader = ({ email, amount, setActive, toggleTab, showTabs }) => {
  return (
    <div className="widget-header">
      <div className="w-full flex items-center justify-between">
        <img src={CashenvoyLogo} alt="Cashenvoy Logo" />
        <button>
          <img src={CancelIcon} alt="Cancel Icon" />
        </button>
      </div>
      <div className="widget-header-pill">
        <span>{email}</span>
        <span>{amount}</span>
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
