import React from 'react';
import { Link } from 'react-router-dom';

// images/icons
import WidgetFooter from '../../components/WidgetFooter';
import WidgetHeader from '../../components/WidgetHeader';

const AuthorizeTransaction = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="mt-50 cashenvoypaymentwidget">
        <WidgetHeader email="zahrawiz@gmail.com" amount="NGN 10,000.00" />
        <div className="p-20">
          <p className="text-center f-13">Kindly enter thr OTP code sent to <br /> *******2345 or *********@email.com or enter the</p>
          <p className="text-center f-13"> OTP generated from your Hardware Token device.</p>
        </div>
        <div className="px-20">
          <form>
            <div className="input-wrapper">
              <input
                type="tel"
                name="number"
                className="form-control input-cardnumber"
                placeholder="0000"
                pattern="[\d| ]{16,22}"
                autocompletetype="cc-number"
                required
              />
              <label for="cardNumber" class="label label--floating">OTP CODE</label>
            </div>
            <Link type="button" to="/success" className="submitbutton mt-20">
              <span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3.33331" y="7.33333" width="9.33333" height="6.66667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M4.66669 5.33333C4.66669 3.49239 6.15907 2 8.00002 2V2C9.84097 2 11.3334 3.49238 11.3334 5.33333V7.33333H4.66669V5.33333Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>Authorize</span>
              <span>
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.76438 6.5L0 1.05573L1.11781 0L8 6.5L1.11781 13L0 11.9443L5.76438 6.5Z" fill="white" />
                </svg>
              </span>
            </Link>
          </form>
        </div>
        <div className="pt-100">
          <WidgetFooter verb="Cancel Payment" />
        </div>
      </div>
    </div>
  );

}

export default AuthorizeTransaction;
