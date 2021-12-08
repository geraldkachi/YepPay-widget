import React, { useState } from 'react';

// Components

// images/icons
import WidgetHeader from '../../components/WidgetHeader';
import WidgetFooter from '../../components/WidgetFooter';
import BankWidget from '../../components/BankWidget';
import USSDWidget from '../../components/USSDWidget';


const TestWidget = () => {
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
          showMeta={false}
          element={<span className="test-mode">Test Mode</span>}
        />
        <div className="widget-body">
          <div className="tab-content">
            {setActive === 'CardPayment' && (
              <div className="testcard-content">
                <p>
                  Test your payment with the options <br /> listed below
                </p>
                <label className="testcard-check success">
                  <span>Test Successful Payment </span>
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <label className="testcard-check failure">
                  <span>Test Failed Payment</span>
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="pt-40">
                  <button type="button" to="/authorize_transaction" className="submitbutton">
                    <span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3.33331" y="7.33333" width="9.33333" height="6.66667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.66669 5.33333C4.66669 3.49239 6.15907 2 8.00002 2V2C9.84097 2 11.3334 3.49238 11.3334 5.33333V7.33333H4.66669V5.33333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>Pay NGN100</span>
                    <span>
                      <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.76438 6.5L0 1.05573L1.11781 0L8 6.5L1.11781 13L0 11.9443L5.76438 6.5Z" fill="white" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
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

export default TestWidget;
