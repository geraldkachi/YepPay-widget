import { useQuery } from "react-query";

const useFetchWithParams = (key, apiFunction, config) => {
	const fetchFunction = async ({ queryKey }) => {
		const [, params] = queryKey;

		const response = await apiFunction(...Object.values(params));
		return response.data;
	};

	const data = useQuery(key, fetchFunction, config);

	return data;
};

export default useFetchWithParams;
