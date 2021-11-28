import React from 'react';
import { Link } from 'react-router-dom';
import WidgetHeader from '../../components/WidgetHeader';

const Ussd = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="mt-50 cashenvoypaymentwidget">
        <WidgetHeader
          email="zahrawiz@gmail.com"
          amount="NGN 10,000.00"
        />
        <div className="p-20">
          <p className="text-center primary-color font-500 f-13">
            Dial the code below on your mobile to <br /> complete this transaction
          </p>
          <p className="text-center f-20 font-500 cashenvoy-blue pt-20">*966*123456789#</p>
          <div className="centralize pt-20">
          <button className="copy-usd-code">
            Click here to copy USSD code
          </button>
          </div>
          <div className="centralize pt-20">
            <Link to="/" className="cashenvoyred font-500">Choose Another Bank</Link>
          </div>
        </div>
        <div className="cardwidget-footer flex justify-between items-center">
          <button className="flex items-center">
            <span>
              <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7713 13.8792L4.22879 4.98603" stroke="#162858" stroke-linecap="round" />
                <path d="M11.7712 4.98603L4.22874 13.8792" stroke="#162858" stroke-linecap="round" />
              </svg>
            </span>
            <span>Cancel Payment</span>
          </button>
        </div>
      </div>
    </div>
  );

}

export default Ussd;
