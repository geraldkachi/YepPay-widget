import React, { useState } from 'react';
<<<<<<< HEAD
=======
import { Link } from 'react-router-dom';
>>>>>>> 2e651d95abdb4d52ecd8745aa8027a0fd3b9879c

// Components
import CardPaymentWidget from '../../components/CardPaymentWidget';

// images/icons
<<<<<<< HEAD
import CardGroup from '../../assets/cardgroup.svg';
import USSDWidget from '../../components/USSDWidget';
import WidgetHeader from '../../components/WidgetHeader';
=======
import CashenvoyLogo from '../../assets/cashenvoylogo.svg';
import CancelIcon from '../../assets/cancel.svg';
import CardIcon from '../../assets/card.svg';
import USSDIcon from '../../assets/ussd.svg';
import BankIcon from '../../assets/bank.svg';
import CardGroup from '../../assets/cardgroup.svg';
import USSDWidget from '../../components/USSDWidget';
>>>>>>> 2e651d95abdb4d52ecd8745aa8027a0fd3b9879c


const Home = () => {
  const [setActive, setActiveState] = useState('CardPayment');
  const toggleTab = (event) => {
    const { value } = event.currentTarget.dataset;

    setActiveState(() => value);
  };

  return (
    <div className="h-full flex justify-center items-center">
      <div className="mt-50 cashenvoypaymentwidget">
<<<<<<< HEAD
        <WidgetHeader
          email="wiztemple7@cashenvoy.com"
          amount="NGN 1,000.00"
          setActive={setActive}
          toggleTab={toggleTab}
          showTabs
        />
=======
        <div className="widget-header">
          <div className="w-full flex items-center justify-between">
            <img src={CashenvoyLogo} alt="Cashenvoy Logo" />
            <button className="">
              <img src={CancelIcon} alt="Cancel Icon" />
            </button>
          </div>
          <div className="widget-header-pill">
            <span>wiztemple7@cashenvoy.com</span>
            <span>NGN 1,000.00</span>
          </div>
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
        </div>
>>>>>>> 2e651d95abdb4d52ecd8745aa8027a0fd3b9879c
        <div className="widget-body">
          <div className="tab-content">
            {setActive === 'CardPayment' && (
              <CardPaymentWidget />
            )}
            {setActive === 'USSDPayment' && (
              <USSDWidget />
            )}
            {setActive === 'BankPayment' && (
              <div>
                <h1>Bank Payment</h1>
              </div>
            )}
          </div>
        </div>
        <div className="cardwidget-footer flex justify-between items-center">
          <button className="flex items-center ">
            <span>
              <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7713 13.8792L4.22879 4.98603" stroke="#162858" strokeLinecap="round" />
                <path d="M11.7712 4.98603L4.22874 13.8792" stroke="#162858" strokeLinecap="round" />
              </svg>
            </span>
            <span>Cancel Payment</span>
          </button>
          <img src={CardGroup} alt="Card Group" />
        </div>
      </div>

    </div>
  );

}

export default Home;
