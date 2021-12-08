import React, { useState } from 'react';

// Components
import CardPaymentWidget from '../../components/CardPaymentWidget';
import USSDWidget from '../../components/USSDWidget';
import BankWidget from '../../components/BankWidget';
import WidgetHeader from '../../components/WidgetHeader';
import WidgetFooter from '../../components/WidgetFooter';

// images/icons
import CancelIcon from '../../assets/cancel.svg';


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
              <BankWidget />
            )}
          </div>
        </div>
        <WidgetFooter verb="Cancel Payment" />
      </div>

    </div>
  );

}

export default Home;
