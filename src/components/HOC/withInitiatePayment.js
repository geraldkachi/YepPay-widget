import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import { GET_PAYMENT_DETAILS } from '../../utils/constants/queryTypes';
import LoadingPage from '../../pages/LoadingPage';
import { urls } from '../../utils/urls';

// Components
import WidgetHeader from '../WidgetHeader';
import WidgetFooter from '../WidgetFooter';

import { usePaymentContext } from '../../context/PaymentContext';
import { getPaymentDetails } from '../../services/card';

const withInitiatePayment =
  (Component, showTabs = true) =>
  (passThroughProps) => {
    const paymentContext = usePaymentContext();
    const { accessCode } = useParams();
    const history = useHistory();

    const { data, isError, isLoading } = useQuery(
      [GET_PAYMENT_DETAILS, accessCode],
      () => getPaymentDetails(accessCode)
    );

    let paymentDetail = {};
    if (data?.data) {
      paymentDetail = data.data?.data;
    }

    useEffect(() => {
      if (paymentDetail.amount) {
        paymentContext.setPaymentDetail(paymentDetail);
      }
    }, [paymentDetail]);

    if (isError) {
      history.push(urls.failure(accessCode));
    }

    if (isLoading) {
      return <LoadingPage />;
    }

    const props = {
      paymentDetail,
    };

    return (
      <div className="h-full flex justify-center items-center">
        <div className="mt-50 cashenvoypaymentwidget">
          <WidgetHeader showTabs={showTabs} paymentDetail={paymentDetail} />
          <div className="widget-body">
            <div className="tab-content">
              <Component {...props} {...passThroughProps} />
            </div>
          </div>
          <WidgetFooter
            onClick={() => history.push(urls.home(accessCode))}
            verb="Cancel Payment"
          />
        </div>
      </div>
    );
  };

export default withInitiatePayment;
