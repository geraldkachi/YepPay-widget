import React from 'react';
import { Link } from 'react-router-dom';
import WidgetFooter from '../../components/WidgetFooter';
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.5 0.5H14C14.8642 0.5 15.5 1.13579 15.5 2V9.5C15.5 10.3642 14.8642 11 14 11H11V14C11 14.8642 10.3642 15.5 9.5 15.5H2C1.13579 15.5 0.5 14.8642 0.5 14V6.5C0.5 5.63579 1.13579 5 2 5H5V2C5 1.13579 5.63579 0.5 6.5 0.5ZM5 6.5H2V14H9.5V11H6.5C5.63579 11 5 10.3642 5 9.5V6.5ZM6.5 2V9.5H14V2H6.5Z" fill="#8797B1" />
              </svg>
              Click here to copy USSD code
            </button>
          </div>
          <div className="centralize pt-20">
            <Link to="/" className="cashenvoyred font-500">Choose Another Bank</Link>
          </div>
        </div>
        <div className="pt-100">
          <WidgetFooter verb="Cancel Payment" />
        </div>
      </div>
    </div>
  );

}

export default Ussd;
