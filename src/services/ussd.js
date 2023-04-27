import { GET, POST } from "../utils/constants/requestTypes";
import { queryRequestHandler, requestHandler } from ".";
import { BASE_PAYMENT_URL } from "../utils";

export const getAllBankUsdCode = async () => {
	const url = `${BASE_PAYMENT_URL}/ussd/bank`;
	const response = await queryRequestHandler(url, GET);
	return response;
};

export const generateUssdCode = async (payload) => {
	const url = `${BASE_PAYMENT_URL}/ussd/generate`;
	const { data } = await requestHandler(url, POST, payload);
	return data;
};
