import React from "react";
import TextInputAmount from "../../components/TextInputAmount/TextInputAmount";
import { useFormik } from "formik";
import * as Yup from "yup";
import ActionButton from "../../components/Button/ActionButton";
import TextInputWithLabel from "../../components/TextInputWithLabel";
import {
	generateSchema,
	shouldSubmit,
	evaluateFormikError,
	generateInitialState,
	capitalizeFirstCharacters,
} from "../../utils/index";
import { createPaymentLink } from "../../services/payment_pages";
import { useHistory } from "react-router-dom";

const PaymentForm = ({ config }) => {
	const history = useHistory();


	const showName = config.can_collect_name;
	const showAmount = !config.amount;

	// console.log("showAmount", showAmount);
	const showPhoneNumber = config.can_collect_phone_number;
	const showMetas =
		config.metadata &&
		Array.isArray(config.metadata) &&
		config.metadata.length > 0;

	const form = useFormik({
		initialValues: generateInitialState(config),

		validationSchema: generateSchema(config),
		onSubmit: async (values) => {
			const apiData = {
				email: values.email,
				channels: config?.channels ?? [],
				page_id: config.id,
				business_id: config.business_id,
				is_live: config.is_live,
				callback_url: config?.callback_url ?? "",
				has_customer_as_bearer: config?.has_customer_as_bearer ? 1 : 0,
			};
			if (config.can_collect_name) {
				apiData["first_name"] = values.first_name;
				apiData["last_name"] = values.last_name;
			}

			if (config.amount === null) {
				apiData["amount"] = values.amount;
			} else {
				apiData["amount"] = config.amount;
			}

			if (config.can_collect_phone_number) {
				apiData["phone_number"] = values.phone_number;
			}

			if (
				config.metadata &&
				Array.isArray(config.metadata) &&
				config.metadata.length > 0
			) {
				const _metaData = config.metadata;
				let metaArray = [];
				for (let i = 0; i < _metaData.length; i++) {
					const key = _metaData[i];
					metaArray.push({ [key]: values[key] });
				}
				apiData["metadata"] = metaArray;
			}

			try {
				const response = await createPaymentLink(apiData);
				if (response.status && response?.data) {
					history.push(`/${response.data.access_code}`);
				} else {
					if (
						response?.data?.errors &&
						Object.keys(response.data.errors).length > 0
					) {
						const errObj = response.data.errors;
						for (let key in errObj) {
							form.setFieldError(key, errObj[key]);
						}
					}
				}
			} catch (error) {
				console.log(error);
			}
		},
	});

	const cancelPayment = (e) => {
		e.preventDefault();
		e.stopPropagation();
		window.location.replace("https://app.yeppay.io/");
	};

	const {
		handleSubmit,
		handleChange,
		setFieldValue,
		values,
		handleBlur,
		setFieldTouched,
		errors,
		isSubmitting,
	} = form;

	const canSubmit = shouldSubmit(values) && Object.keys(errors).length === 0;

	return (
		<form>
			<div className="paymentPages-grid">
				{showName && (
					<>
						<TextInputWithLabel
							name="first_name"
							onChange={handleChange}
							onBlur={handleBlur}
							error={evaluateFormikError(form, "first_name")}
							value={values.first_name}
							placeholder="Enter your first name"
							label="First Name"
						/>
						<TextInputWithLabel
							name="last_name"
							onChange={handleChange}
							error={evaluateFormikError(form, "last_name")}
							onBlur={handleBlur}
							value={values.last_name}
							placeholder="Enter your last name"
							label="Last Name"
						/>
					</>
				)}

				<TextInputWithLabel
					name="email"
					type="email"
					onChange={handleChange}
					error={evaluateFormikError(form, "email")}
					onBlur={handleBlur}
					value={values.email}
					placeholder="Enter your email address"
					label="Email Address"
				/>

				{showAmount && (
					<TextInputAmount
						error={evaluateFormikError(form, "amount")}
						onChange={(val) => {
							setFieldValue("amount", val);
						}}
						onBlur={() => {
							setFieldTouched("amount", true);
						}}
						label="Amount"
					/>
				)}
				{!showAmount && (
					<TextInputWithLabel
						error={""}
						disabled={true}
						readOnly={true}
						name="amount"
						placeholder=""
						value={config?.amount ?? ""}
						onChange={() => {}}
						onBlur={() => {}}
						label="Amount"
					/>
				)}

				{showPhoneNumber && (
					<TextInputWithLabel
						name="phone_number"
						error={evaluateFormikError(form, "phone_number")}
						onChange={(e) => {
							const onlyNumbers = e.target.value.replace(
								/[^\d]/g,
								""
							);
							if (onlyNumbers.length > 11) {
								return;
							}

							setFieldValue("phone_number", onlyNumbers);
						}}
						onBlur={handleBlur}
						value={values.phone_number}
						placeholder="e.g 0800 000 0000"
						label="Phone Number"
					/>
				)}

				{showMetas &&
					config.metadata.map((key, index) => {
						const label = capitalizeFirstCharacters(key);
						return (
							<TextInputWithLabel
								error={evaluateFormikError(form, key)}
								key={`additionalField${key}`}
								name={key}
								onBlur={handleBlur}
								title={label}
								onChange={handleChange}
								value={values[key]}
								placeholder={`Enter ${label}`}
								label={`${label}`}
							/>
						);
					})}
			</div>
			<div className="actionButton">
				<ActionButton
					testId="payment-Page"
					type="button"
					className="submitbutton"
					onClick={handleSubmit}
					disabled={!canSubmit || isSubmitting}
					loading={false}
					spinColour="#FFFFFF"
					// testId="card-payment"
				>
					<span className="actionButton-lock">
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="3.33331"
								y="7.33333"
								width="9.33333"
								height="6.66667"
								stroke="white"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M4.66669 5.33333C4.66669 3.49239 6.15907 2 8.00002 2V2C9.84097 2 11.3334 3.49238 11.3334 5.33333V7.33333H4.66669V5.33333Z"
								stroke="white"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</span>
					<span>
						Pay{" "}
						{/* {shouldResolveFees && paymentContext.additionalFee !== null && (
						<span>
							{paymentDetail.currency}{" "}
							{paymentDetail.amount + +paymentContext.additionalFee}
						</span>
					)}
					{!shouldResolveFees && paymentContext.additionalFee === null && (
						<span>
							{paymentDetail.currency} {paymentDetail.amount}
						</span>
					)} */}
					</span>
					{/* <span>
								<svg
									width="8"
									height="13"
									viewBox="0 0 8 13"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M5.76438 6.5L0 1.05573L1.11781 0L8 6.5L1.11781 13L0 11.9443L5.76438 6.5Z"
										fill="white"
									/>
								</svg>
							</span> */}
				</ActionButton>

				<button onClick={cancelPayment} className="cancelButton">
					Cancel Payment
				</button>
			</div>
		</form>
	);
};

export default PaymentForm;
