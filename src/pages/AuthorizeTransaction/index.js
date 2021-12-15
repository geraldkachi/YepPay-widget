import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';
import ActionButton from '../../components/Button/ActionButton';
import withInitiatePayment from '../../components/HOC/withInitiatePayment';

// images/icons
import { usePaymentContext } from '../../context/PaymentContext';
import { validatePayment } from '../../services';
import FormError from '../../utils/form/FormError';
import { urls } from '../../utils/urls';

const AuthorizeTransaction = () => {
  const history = useHistory();
  const { accessCode,  reference } = useParams();
  const paymentContext = usePaymentContext();

  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    onSubmit: async (values) => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const type = urlSearchParams.get('type');

      const payload = {
        ...values,
        reference,
        type,
      }

      const response = await validatePayment(payload);

      if (response.status) {
        let payment = response.data
        if (Array.isArray(response.data)) {
          payment = response.data[0];
        }
        paymentContext.setPayment(payment);
        return history.push(urls.success(accessCode));
      } else {
        if (response.data.errors) {
          formik.setErrors(response.data.errors);
        }
        return toast.error(response.message);
      }
    }
  })

  return (
    <>
        <div className="p-20">
          <p className="text-center f-13">
            {paymentContext.successMessage}
          </p>
        </div>
        <div className="px-20">
          <form>
            <div className="input-wrapper">
              <input
                type="text"
                name="otp"
                className="otp-input"
                placeholder="Enter OTP Code"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              <FormError formik={formik} inputName="otp" />
            </div>
            <ActionButton
              type="button"
              className="submitbutton mt-20"
              onClick={formik.handleSubmit}
              loading={formik.isSubmitting}
              spinColour="#FFFFFF"
              testId="authorize"
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
              <span>Authorize</span>
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

export default withInitiatePayment(AuthorizeTransaction, false);
