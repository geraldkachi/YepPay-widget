import { GET, POST } from '../utils/constants/requestTypes';
import httpClient from '../utils/http';
import { BASE_PAYMENT_URL } from '../utils';

/**
 *
 * @param {string} url
 * @param {string} method
 * @param {object} data
 * @returns {Promise}
 */
export const requestHandler = async (
  url,
  method = GET,
  data = undefined,
  contentType = undefined
) => {
  try {
    const response = await httpClient({ method, url, data, contentType });
    return response;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
    if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      return console.log(error.request);
    }
    // Something happened in setting up the request that triggered an Error
    return console.log('Error', error.message);
  }
};

/**
 *
 * @param {string} url
 * @param {string} method
 * @param {object} data
 * @returns {Promise}
 */
export const queryRequestHandler = async (url, method = GET, data = null) => {
  const response = await httpClient({ method, url, data });
  return response;
};

export const validatePayment = async (payload) => {
  const url = `${BASE_PAYMENT_URL}/payment/validate`;
  const { data } = await requestHandler(url, POST, payload);
  return data;
};
