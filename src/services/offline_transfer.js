import { GET, POST } from "../utils/constants/requestTypes";
import { queryRequestHandler, requestHandler } from ".";
import { BASE_PAYMENT_URL } from "../utils";

export const generateDynamicAccountNumber = async (payload) => {
	const url = `${BASE_PAYMENT_URL}/nuban/generate`;
	const { data } = await requestHandler(url, POST, payload);
	return data;
};
