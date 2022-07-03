import Payment from "payment";
import * as Yup from "yup";

function clearNumber(value = "") {
	return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value) {
	if (!value) {
		return value;
	}

	const issuer = Payment.fns.cardType(value);
	const clearValue = clearNumber(value);
	let nextValue;

	switch (issuer) {
		case "amex":
			nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
				4,
				10
			)} ${clearValue.slice(10, 15)}`;
			break;
		case "dinersclub":
			nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
				4,
				10
			)} ${clearValue.slice(10, 14)}`;
			break;
		default:
			nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
				4,
				8
			)} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
			break;
	}

	return nextValue.trim();
}

export const formatCVC = (value, prevValue, allValues = {}) => {
	const clearValue = clearNumber(value);
	let maxLength = 4;

	if (allValues.number) {
		const issuer = Payment.fns.cardType(allValues.number);
		maxLength = issuer === "amex" ? 4 : 3;
	}

	return clearValue.slice(0, maxLength);
};

export function formatExpirationDate(value) {
	const clearValue = clearNumber(value);

	if (clearValue.length >= 3) {
		return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
	}

	return clearValue;
}

export function formatFormData(data) {
	return Object.keys(data).map((d) => `${d}: ${data[d]}`);
}

// export const BASE_PAYMENT_URL = 'https://staging-ws.ce-nextgen.com/api/v1/widget';
// export const BASE_PAYMENT_URL = 'https://staging-services.ce-nextgen.com/api/v1/widget';
export const BASE_PAYMENT_URL = process.env.REACT_APP_BACKEND_URL;

// REACT_APP_BACKEND_URL_PROD = https://services.cashenvoy.com

/**
 * async delay function
 *
 * @param { Number } duration in milliseconds
 * @returns { Promise }
 */
export const delay = async (duration = 1000) =>
	new Promise((resolve) => setTimeout(resolve, duration));

export const capitalizeFirstCharacters = (name: string) => {
	if (typeof name === "string") {
		const nameArray = name.split("_");
		let abbr = "";
		if (nameArray.length > 1) {
			for (let i = 0; i < nameArray.length; i++) {
				if (i === nameArray.length - 1) {
					abbr += `${nameArray[i][0].toUpperCase()}${nameArray[i].slice(1)}`;
				} else {
					abbr += `${nameArray[i][0].toUpperCase()}${nameArray[i].slice(1)} `;
				}
			}

			return abbr;
		}

		return `${name[0].toUpperCase()}${name.slice(1)}`;
	}
	return "";
};

export const generateInitialState = (config) => {
	const initialState = { email: "" };
	if (config.amount === null) [(initialState["amount"] = "")];
	if (config.can_collect_name) {
		initialState["first_name"] = "";
		initialState["last_name"] = "";
	}
	if (config.can_collect_phone_number) {
		initialState["phone_number"] = "";
	}

	if (
		config.metadata &&
		Array.isArray(config.metadata) &&
		config.metadata.length > 0
	) {
		const metadata = config.metadata;
		for (let i = 0; i < config.metadata.length; i++) {
			const key = metadata[i];
			initialState[key] = "";
		}
	}

	return initialState;
};

export const generateSchema = (config) => {
	const _yupObject = {
		email: Yup.string()
			.trim()
			.email("Enter Valid Email")
			.required("Email is required"),
	};

	if (config.amount === null)
		[
			(_yupObject["amount"] = Yup.string()
				.trim()
				.required("Amount is required")),
		];

	if (config.can_collect_name) {
		_yupObject["first_name"] = Yup.string()
			.trim()
			.required("First Name is required");
		_yupObject["last_name"] = Yup.string()
			.trim()

			.required("Last Name is required");
	}

	if (config.can_collect_phone_number) {
		_yupObject["phone_number"] = Yup.string()
			.trim()
			.min(11, "Phone number must be 11 digits")
			.max(11, "Phone number must be 11 digits")
			.required("Phone Number is required");
	}
	if (
		config.metadata &&
		Array.isArray(config.metadata) &&
		config.metadata.length > 0
	) {
		const metadata = config.metadata;
		for (let i = 0; i < config.metadata.length; i++) {
			const key = metadata[i];
			_yupObject[key] = Yup.string()
				.trim()
				.required(`${capitalizeFirstCharacters(key)} is required`);
		}
	}

	return Yup.object().shape(_yupObject);
};

export const shouldSubmit = (values) => {
	let response = false;
	for (let k in values) {
		if (values[k].trim()) {
			response = true;
		} else {
			response = false;
		}
	}
	return response;
};

export const evaluateFormikError = (formik: any, name: string) => {
	if (formik.touched?.[name] && formik.errors?.[name]) {
		return formik.errors[name];
	} else {
		return "";
	}
};