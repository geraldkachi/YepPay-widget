import React, { useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import Payment from 'payment';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useQuery } from 'react-query';

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from '../../utils';
// components
import RememberCard from './RememberCard';

import {
  getRememberedCards,
  payWithCard,
  payWithTokenizedCard,
} from '../../services/card';
import ActionButton from '../Button/ActionButton';
import FormError from '../../utils/form/FormError';
import { usePaymentContext } from '../../context/PaymentContext';
import { urls } from '../../utils/urls';
import SelectCheckmark from '../SelectCheckmark';
import { GET_REMEMBERED_CARDS } from '../../utils/constants/queryTypes';
import { getIssuerType } from '../../utils/getIssuerType';

const CardPaymentWidget = ({ paymentDetail }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const history = useHistory();
  const { accessCode } = useParams();
  const paymentContext = usePaymentContext();

  const { data, isLoading } = useQuery(
    [
      GET_REMEMBERED_CARDS,
      paymentDetail.customer?.email,
      paymentDetail.business?.id,
    ],
    () =>
      getRememberedCards(
        paymentDetail.customer?.email,
        paymentDetail.business?.id
      )
  );

  let rememberedCards = [];
  if (data?.data) {
    rememberedCards = data.data?.data;
  }

  const formik = useFormik({
    initialValues: {
      card_number: '',
      expiry: '',
      cvv: '',
      pin: '',
      remember_card: [],
    },
    onSubmit: async (values) => {
      const expiryInfo = values.expiry.split('/');
      const payload = {
        access_code: paymentDetail.access_code,
        ...values,
        remember_card: Boolean(values.remember_card.length), // true or false
        card_number: values.card_number.split(' ').join(''),
        expiry_month: expiryInfo[0],
        expiry_year: expiryInfo[1].substring(0, 2),
      };
      const response = await payWithCard(payload);
      if (response.status) {
        paymentContext.setReference(response.data.reference);
        paymentContext.setSuccessMessage(response.message);
        return history.push(
          urls.otp(accessCode, response.data.reference, '?type=card')
        );
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

  const handleSelectCard = (card) => {
    setSelectedCard(card);
  };

  const handlePayWithTokenizedCard = async (payload) => {
    formik.setSubmitting(true);
    const response = await payWithTokenizedCard(payload);
    formik.setSubmitting(false);
    if (response.status) {
      paymentContext.setPayment(response.data);
      return history.push(urls.success(accessCode));
    } else {
      paymentContext.setErrorMessage(response.message);
      return history.push(urls.failure(accessCode));
    }
  };

  const handleSubmit = () => {
    if (selectedCard) {
      const payload = {
        access_code: paymentDetail.access_code,
        token: selectedCard.token,
      };
      return handlePayWithTokenizedCard(payload);
    } else {
      return formik.handleSubmit();
    }
  };

  const { card_number, expiry, cvv, pin } = formik.values;
  const issuer = Payment.fns.cardType(card_number);

  return (
    <>
      {selectedCard ? (
        <div className="cardpaymentwidget">
          <h1 className="text-center">
            Make payment with the selected card details
          </h1>
          <SelectCheckmark
            textContent={`${selectedCard.first_6} xxxx xxxx ${selectedCard.last_4}`}
            cardType={getIssuerType(selectedCard.type)}
          />
          <div className="existing-card-btn-wrapper">
            <button
              onClick={() => setSelectedCard(null)}
              type="button"
              className="user-another-card-link"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.8391 4.83334C12.7053 3.23225 10.9946 2.33334 8.99996 2.33334C5.31806 2.33334 2.33329 5.31811 2.33329 9.00001C2.33329 12.6819 5.31806 15.6667 8.99996 15.6667C12.6819 15.6667 15.6666 12.6819 15.6666 9.00001H17.3333C17.3333 13.6024 13.6023 17.3333 8.99996 17.3333C4.39759 17.3333 0.666626 13.6024 0.666626 9.00001C0.666626 4.39763 4.39759 0.666672 8.99996 0.666672C11.3368 0.666672 13.3957 1.6521 14.8333 3.39196V0.666672H16.5V6.50001H10.6666V4.83334H13.8391Z"
                  fill="black"
                />
              </svg>
              Use another card
            </button>
          </div>
        </div>
      ) : (
        <div className="cardpaymentwidget">
          <h1 className="text-center">
            Enter your card details to make payment
          </h1>
          {Boolean(paymentDetail.remember_card) && (
            <RememberCard
              cards={rememberedCards}
              handleSelectCard={handleSelectCard}
              loading={isLoading}
            />
          )}
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
                <img src={getIssuerType(issuer)} alt="Card Type" />
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
            {Boolean(paymentDetail.remember_card) && (
              <p className="remembercard-check">
                <input
                  type="checkbox"
                  id="remembercard"
                  name="remember_card"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="remembercard">Remember card</label>
              </p>
            )}
          </form>
        </div>
      )}
      <ActionButton
        type="button"
        className="submitbutton"
        onClick={handleSubmit}
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
    </>
  );
};

export default CardPaymentWidget;
