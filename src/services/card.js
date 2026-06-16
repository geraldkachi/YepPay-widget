import { GET, POST } from '../utils/constants/requestTypes';
import { queryRequestHandler, requestHandler } from '.';
import { BASE_PAYMENT_URL } from '../utils';

// export const getPaymentDetails = async (accessCode) => {
//   const url = `${BASE_PAYMENT_URL}/${accessCode}`;
//   const response = await queryRequestHandler(url, GET);
//   return response;
// };

export const  getPaymentDetails = async (accessCode) => {
  try {
    const url = `${BASE_PAYMENT_URL}/${accessCode}`;
    const response = await queryRequestHandler(url, GET);
    
    // If the response contains a status field that's false, it's an error
    if (response?.status === false) {
      return Promise.reject(response); // Reject with the error response
    }
    
    return response;
  } catch (error) {
    // If there's any other error, reject with it
    return Promise.reject(error.response?.data || error);
  }
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

export const resolveFeesCard = async (bin, accessCode, payment_channel) => {
	let url;
	if (bin) {
		url = `${BASE_PAYMENT_URL}/resolve-fees?bin=${bin}&access_code=${accessCode}&payment_channel=${payment_channel}`;
	} else {
		url = `${BASE_PAYMENT_URL}/resolve-fees?access_code=${accessCode}&payment_channel=${payment_channel}`;
	}
	const { data } = await requestHandler(url, GET);
	return data;
};

export const cyberSourceAuth = async (payload) => {
  const url = `${BASE_PAYMENT_URL}/card/cyber/authentication-setups`;
  const { data } = await requestHandler(url, POST, payload);
  return data;
}

export const cyberSourceAuthPay = async (payload) => {
  const url = `${BASE_PAYMENT_URL}/card/cyber/auth-pay`;
  const { data } = await requestHandler(url, POST, payload);
  return data;
}
export const cyberSourceValidate = async (payload) => {
  const url = `${BASE_PAYMENT_URL}/card/cyber/validate-pay`;
  const { data } = await requestHandler(url, POST, payload);
  return data;
}