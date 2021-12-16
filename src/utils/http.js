import axios from 'axios';
import { BASE_PAYMENT_URL } from '.';

import { GET } from './constants/requestTypes';

/**
 *
 * @param {string} url
 * @param {string} method
 * @param {object} data
 *
 * @returns { object } config
 */
export const httpConfig = async (
  url,
  method = GET,
  data = null,
  contentType = 'application/json'
) => {
  const { REACT_APP_PAYMENT_URL, REACT_APP_OVERRIDE_KEY } = process.env;
  const apiBaseUrl = REACT_APP_PAYMENT_URL
    ? REACT_APP_PAYMENT_URL
    : BASE_PAYMENT_URL;

  const overrideKey = REACT_APP_OVERRIDE_KEY
    ? REACT_APP_OVERRIDE_KEY
    : 'V3R1TmxHb05KWnV4RnZ1VkNCY09DZHRlQ2dEOTkyZkM';

  const headers = {
    accept: contentType,
    'Content-Type': contentType,
    'Override-Key': overrideKey,
  };

  const axiosConfig = {
    method,
    url,
    baseURL: apiBaseUrl,
    data,
    headers,
  };

  return axiosConfig;
};

const httpClient = async ({ method, url, data, contentType }) => {
  const config = await httpConfig(url, method, data, contentType);
  return axios(config);
};

// Add a response interceptor
// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response.status === 401) {
//       await inMemoryTokenManager.getRefreshedToken();
//     }
//     return Promise.reject(error);
//   }
// );

export default httpClient;
