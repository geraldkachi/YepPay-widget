import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Payment from 'payment';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from '../../utils';
// components
import RememberCard from './RememberCard';
// icons
import MasterCard from '../../assets/mastercardmd.svg';
import VisaCard from '../../assets/visacard.svg';
import MaestroCard from '../../assets/maestrocard.svg';
import UnknownCard from '../../assets/unknowncard.svg';
import { payWithCard } from '../../services/card';
import ActionButton from '../Button/ActionButton';
import FormError from '../../utils/form/FormError';
import { usePaymentContext } from '../../context/PaymentContext';
import { urls } from '../../utils/urls';

const CardPaymentWidget = ({ paymentDetail }) => {
  const history = useHistory();
  const { accessCode } = useParams();
  const paymentContext = usePaymentContext();

  const formik = useFormik({
    initialValues: {
      card_number: '',
      expiry: '',
      cvv: '',
      pin: '',
    },
    onSubmit: async (values) => {
      const expiryInfo = values.expiry.split('/');
      const payload = {
        access_code: paymentDetail.access_code,
        ...values,
        card_number: values.card_number.split(' ').join(''),
        expiry_month: expiryInfo[0],
        expiry_year: expiryInfo[1].substring(0, 2),
      };
      const response = await payWithCard(payload);
      if (response.status) {
        paymentContext.setReference(response.data.reference);
        paymentContext.setSuccessMessage(response.message);
        return history.push(urls.otp(accessCode, response.data.reference, '?type=card'));
      } else {
        if (response.data.errors) {
          toast.error(response.message);
          return formik.setErrors(response.data.errors);
        } else {
          paymentContext.setErrorMessage(response.message);
          return history.push(urls.failure(accessCode));
        }
      }
    },
  });

  const { card_number, expiry, cvv, pin } = formik.values;
  const issuer = Payment.fns.cardType(card_number);
  const issuerType = (issuer) => {
    if (issuer === 'mastercard') {
      return MasterCard;
    } else if (issuer === 'visa') {
      return VisaCard;
    } else if (issuer === 'maestro') {
      return MaestroCard;
    }
    return UnknownCard;
  };

  return (
    <>
      <div className="cardpaymentwidget">
        <h1 className="text-center">Enter your card details to make payment</h1>
        {/* <RememberCard /> */}
        <form>
          <div className="input-wrapper">
            <input
              type="tel"
              name="card_number"
              className="form-control input-cardnumber"
              placeholder="0000 0000 0000 0000 0000"
              pattern="[\d| ]{16,22}"
              value={formatCreditCardNumber(card_number)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autocompletetype="cc-number"
            />
            <label htmlFor="cardNumber" className="label label--floating">
              Card Number
            </label>
            <div className="cardtype">
              <img src={issuerType(issuer)} alt="Card Type" />
            </div>
          </div>
          <FormError formik={formik} inputName="card_number" />
          <div className="flex-input">
            <div>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="expiry"
                  className="form-control input-cardexpiry"
                  value={formatExpirationDate(expiry)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="MM/YY"
                  pattern="\d\d/\d\d"
                  autocompletetype="cc-exp"
                  required
                />
                <label htmlFor="cardNumber" className="label label--floating">
                  Card Expiry
                </label>
              </div>
              <FormError formik={formik} inputName="expiry" />
            </div>
            <div>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="cvv"
                  className="form-control input-cvv"
                  value={formatCVC(cvv)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="123"
                  pattern="\d{3,4}"
                  autocompletetype="cc-csc"
                  required
                />
                <label htmlFor="cardNumber" className="label label--floating">
                  CVV
                </label>
                <button className="infobtn" type="button">
                  Info?
                </button>
                <div className="hidden-cvv-info">
                  <span>The 3 digits number behind your atm card</span>
                </div>
              </div>
              <FormError formik={formik} inputName="cvv" />
            </div>
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              name="pin"
              className="form-control input-cardnumber"
              placeholder="X X X X"
              pattern="[\d| ]{16,22}"
              value={formatCreditCardNumber(pin)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autocompletetype="cc-number"
            />
            <label htmlFor="cardNumber" className="label label--floating">
              CARD PIN
            </label>
          </div>
          <FormError formik={formik} inputName="pin" />
          <p className="remembercard-check">
            <input type="checkbox" id="remembercard" />
            <label htmlFor="remembercard">Remember card</label>
          </p>
          <ActionButton
            type="button"
            className="submitbutton"
            onClick={formik.handleSubmit}
            loading={formik.isSubmitting}
            spinColour="#FFFFFF"
            testId="card-payment"
          >
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3.33331"
                  y="7.33333"
                  width="9.33333"
                  height="6.66667"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.66669 5.33333C4.66669 3.49239 6.15907 2 8.00002 2V2C9.84097 2 11.3334 3.49238 11.3334 5.33333V7.33333H4.66669V5.33333Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              Pay {paymentDetail.currency} {paymentDetail.amount}
            </span>
            <span>
              <svg
                width="8"
                height="13"
                viewBox="0 0 8 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.76438 6.5L0 1.05573L1.11781 0L8 6.5L1.11781 13L0 11.9443L5.76438 6.5Z"
                  fill="white"
                />
              </svg>
            </span>
          </ActionButton>
        </form>
      </div>
    </>
  );
};

export default CardPaymentWidget;
