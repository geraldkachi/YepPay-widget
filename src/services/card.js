import { GET, POST } from '../utils/constants/requestTypes';
import { queryRequestHandler, requestHandler } from '.';
import { BASE_PAYMENT_URL } from '../utils';

export const getPaymentDetails = async (accessCode) => {
  const url = `${BASE_PAYMENT_URL}/${accessCode}`;
  const response = await queryRequestHandler(url, GET);
  return response;
};

export const payWithCard = async (payload) => {
  const url = `${BASE_PAYMENT_URL}/card`;
  const { data } = await requestHandler(url, POST, payload);
  return data;
};

export const payWithTokenizedCard = async (payload) => {
  const url = `${BASE_PAYMENT_URL}/card/tokenized`;
  const { data } = await requestHandler(url, POST, payload);
  return data;
};

export const getRememberedCards = async (email, businessId) => {
  const url = `${BASE_PAYMENT_URL}/card?email=${email}&business_id=${businessId}`;
  const response = await queryRequestHandler(url, GET);
  return response;
};

export const removeRememberedCard = async (payload) => {
  const url = `${BASE_PAYMENT_URL}/card/forget`;
  const { data } = await requestHandler(url, POST, payload);
  return data;
};

export const triggerPaymentConfirmation = async (payload) => {
	const url = `${BASE_PAYMENT_URL}/flutterwave/callback${payload}`;
	const { data } = await requestHandler(url, GET);
	return data;
};

export const resolveFeesCard = async (bin, accessCode) => {
	const url = `${BASE_PAYMENT_URL}/card/resolve-fees?bin=${bin}&access_code=${accessCode}`;
	const { data } = await requestHandler(url, GET);
	return data;
};
