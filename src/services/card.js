import { GET, POST } from '../utils/constants/requestTypes';
import { queryRequestHandler, requestHandler } from '.';
import { BASE_PAYMENT_URL } from '../utils';

export const getPaymentDetails = async (accessCode) => {
  const url = `${BASE_PAYMENT_URL}/payment/${accessCode}`;
  const response = await queryRequestHandler(url, GET);
  return response;
};

export const payWithCard = async (payload) => {
  const url = `${BASE_PAYMENT_URL}/payment/card`;
  const { data } = await requestHandler(url, POST, payload);
  return data;
};
