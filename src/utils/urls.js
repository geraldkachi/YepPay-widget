export const urls = {
	home: (accessCode) => `/${accessCode}`,
	card: (accessCode) => `/${accessCode}/card`,
	ussd: (accessCode) => `/${accessCode}/ussd-payment`,
	bankTransfer: (accessCode) => `/${accessCode}/bank-transfer`,
	offlineTransfer: (accessCode) => `/${accessCode}/offline-transfer`,
	multipay: (accessCode) => `/${accessCode}/multipay`,
	otp: (accessCode, transactionReference, queryParams = "") =>
		`/${accessCode}/authorize/${transactionReference}/${queryParams}`,
	failure: (accessCode) => `/${accessCode}/failure`,
	success: (accessCode) => `/${accessCode}/success`,
	"payment-pages": (accessCode) => `/payment-pages/${accessCode}`,

	"confirm-payment": () => "/payment/confirm-payment",
	confirmOtp: (accessCode) => `${accessCode}/confirm-otp`,
	"no-payment-option": (accessCode) => `/error/${accessCode}`,
};
