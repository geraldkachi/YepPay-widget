export const urls = {
	home: (accessCode) => `/${accessCode}`,
	card: (accessCode) => `/${accessCode}/card`,
	ussd: (accessCode) => `/${accessCode}/ussd-payment`,
	bankTransfer: (accessCode) => `/${accessCode}/bank-transfer`,
	offlineTransfer: (accessCode) => `/${accessCode}/offline-transfer`,
	otp: (accessCode, transactionReference, queryParams = "") =>
		`/${accessCode}/authorize/${transactionReference}/${queryParams}`,
	failure: (accessCode) => `/${accessCode}/failure`,
	success: (accessCode) => `/${accessCode}/success`,
	"confirm-payment": () => "/payment/confirm-payment",
	"no-payment-option": (accessCode) => `/error/${accessCode}`,
};
