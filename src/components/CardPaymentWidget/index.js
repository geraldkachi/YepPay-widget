import React from 'react';
import { Link } from 'react-router-dom';
import Payment from 'payment';
import { formatCreditCardNumber, formatCVC, formatExpirationDate } from "../../utils";
// components
import RememberCard from './RememberCard';
// hooks
import useForm from '../../hooks/useForm';
import MasterCard from '../../assets/mastercardmd.svg';
import VisaCard from '../../assets/visacard.svg';
import MaestroCard from '../../assets/maestrocard.svg';
import UnknownCard from '../../assets/unknowncard.svg';


const CardPaymentWidget = () => {
  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      number: "",
      expiry: "",
      cvc: ""
    },
    (formData) => console.dir(formData)
  );
  const { number, expiry, cvc } = formData;
  const issuer = Payment.fns.cardType(number);
  const issuerType = (issuer) => {
    if (issuer === 'mastercard') {
      return MasterCard
    } else if (issuer === "visa") {
      return VisaCard
    } else if (issuer === "maestro") {
      return MaestroCard
    }
    return UnknownCard;
  }

  return (
    <div className="cardpaymentwidget">
      <h1 className="text-center">Enter your card details to make payment</h1>
      <RememberCard />
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="tel"
            name="number"
            className="form-control input-cardnumber"
            placeholder="0000 0000 0000 0000 0000"
            pattern="[\d| ]{16,22}"
            value={formatCreditCardNumber(number)}
            onChange={handleInputChange}
            autocompletetype="cc-number"
          />
          <label htmlFor="cardNumber" className="label label--floating">Card Number</label>
          <div className="cardtype">
            <img src={issuerType(issuer)} alt="Card Type" />
          </div>
        </div>
        <div className="flex-input">
          <div className="input-wrapper">
            <input
              type="tel"
              name="expiry"
              className="form-control input-cardexpiry"
              value={formatExpirationDate(expiry)}
              onChange={handleInputChange}
              placeholder="MM/YY"
              pattern="\d\d/\d\d"
              autocompletetype="cc-exp"
              required
            />
            <label htmlFor="cardNumber" className="label label--floating">Card Expiry</label>
          </div>
          <div className="input-wrapper">
            <input
              type="tel"
              name="cvc"
              className="form-control input-cvv"
              value={formatCVC(cvc)}
              onChange={handleInputChange}
              placeholder="123"
              pattern="\d{3,4}"
              autocompletetype="cc-csc"
              required
            />
            <label htmlFor="cardNumber" className="label label--floating">CVV</label>
            <button className="infobtn" type="button">Info?</button>
          </div>
        </div>
        <div className="input-wrapper">
          <input
            type="tel"
            name="number"
            className="form-control input-cardnumber"
            placeholder="X X X X"
            pattern="[\d| ]{16,22}"
            value={formatCreditCardNumber(number)}
            onChange={handleInputChange}
            autocompletetype="cc-number"
          />
          <label htmlFor="cardNumber" className="label label--floating">CARD PIN</label>
        </div>
        <p className="remembercard-check">
          <input type="checkbox" id="remembercard" />
          <label htmlFor="remembercard">Remember card</label>
        </p>
        {/* <button className="submitbutton" type="submit">
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
        </button> */}
        <Link type="button" to="/authorize_transaction" className="submitbutton">
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
        </Link>
      </form>
    </div>
  )
}

export default CardPaymentWidget;
