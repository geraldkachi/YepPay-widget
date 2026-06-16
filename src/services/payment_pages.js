import { GET, POST } from "../utils/constants/requestTypes";
import { queryRequestHandler, requestHandler } from ".";
import { BASE_PAYMENT_URL } from "../utils";

export const fetchPaymentPageSettings = async (accessCode) => {
	const url = `${BASE_PAYMENT_URL}/page/${accessCode}`;
	const response = await queryRequestHandler(url, GET);
	return response;
};
// use this to fetch multipay verify for this
export const fetchMulitPayVerify = async (accessCode) => {
	const url = `/multipay/verify/${accessCode}`;
	const response = await queryRequestHandler(url, GET);
	return response;
};

export const createPaymentLink = 	async (payload) => {
	const url = `${BASE_PAYMENT_URL}/page`;
	const { data } = await requestHandler(url, POST, payload);
	return data;
};
