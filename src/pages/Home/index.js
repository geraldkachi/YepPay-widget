import React, { useState } from 'react';

// Components
import CardPaymentWidget from '../../components/CardPaymentWidget';

// images/icons
import CardGroup from '../../assets/cardgroup.svg';
import USSDWidget from '../../components/USSDWidget';
import WidgetHeader from '../../components/WidgetHeader';


const Home = () => {
  const [setActive, setActiveState] = useState('CardPayment');
  const toggleTab = (event) => {
    const { value } = event.currentTarget.dataset;

    setActiveState(() => value);
  };

  return (
    <div className="h-full flex justify-center items-center">
      <div className="mt-50 cashenvoypaymentwidget">
        <WidgetHeader
          email="wiztemple7@cashenvoy.com"
          amount="NGN 1,000.00"
          setActive={setActive}
          toggleTab={toggleTab}
          showTabs
        />
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
