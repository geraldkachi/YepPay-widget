import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "react-query";

import { GET_PAYMENT_DETAILS } from "../../utils/constants/queryTypes";
import LoadingPage from "../../pages/LoadingPage";
import { urls } from "../../utils/urls";

import WidgetHeader from "../WidgetHeader";
import WidgetFooter from "../WidgetFooter";

import { usePaymentContext } from "../../context/PaymentContext";
import { getPaymentDetails } from "../../services/card";
import WidgetError from "../WidgetError";
import TextInputWithLabel from '../TextInputWithLabel';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { debounce } from 'lodash';
import YEPLOGO from "../../assets/Yep-Logo.svg";

const withInitiatePayment =
	(Component, showTabs = true) =>
		(passThroughProps) => {
			const paymentContext = usePaymentContext();
			const { accessCode } = useParams();
			const history = useHistory();
			const [used, setUsed] = useState('')
			// Get customerCode from context
			const { customerCode, setCustomerCode } = paymentContext;
			console.log(customerCode, 'customerCode')

			 const debouncedSetCustomerCode = useCallback(
				debounce((value) => {
				setCustomerCode(value);
				}, 300),
				[]
			);
			// Formik for referral code input
			const referralForm = useFormik({
				initialValues: {
					referral_code: customerCode || '',
				},
				enableReinitialize: true,
				validationSchema: Yup.object({
					referral_code: Yup.string()
						.min(3, 'Referral code must be at least 3 characters')
						.max(20, 'Referral code is too long'),
				}),
				onSubmit: (values) => {
					if (values.referral_code.trim()) {
						setCustomerCode(values.referral_code.trim());
						debouncedSetCustomerCode(values.referral_code.trim());
						// You could also save to localStorage for persistence
						// localStorage.setItem('customerCode', values.referral_code.trim());
						debouncedSetCustomerCode.cancel();
					} else {
						setCustomerCode(""); // Clear if empty
						localStorage.removeItem("customerCode");
					}
				},
			});

			// Custom handler for input changes - THIS HANDLES AUTO-UPDATE
				const handleReferralCodeChange = (e) => {
				const value = e.target.value;
				
				// Update formik field
				referralForm.setFieldValue("referral_code", value);
				
				// Auto-update context with debounce
				if (value.trim()) {
					debouncedSetCustomerCode(value.trim());
				} else {
					setCustomerCode("");
					localStorage.removeItem("customerCode");
					debouncedSetCustomerCode.cancel();
				}
				};

			const { data, isError, isLoading, error } = useQuery(
				[GET_PAYMENT_DETAILS, accessCode],
				() => getPaymentDetails(accessCode),
				{
					retry: false,
					refetchOnWindowFocus: false,
					staleTime: Infinity,
					cacheTime: Infinity,
					onError: (error) => {
						console.error('Payment details error:', error);
						setUsed(error?.message)
					}
				}
			);

			let paymentDetail = {};

			if (data?.data) {
				paymentDetail = data.data?.data;
				// Sort and filter channels based on currency
				if (paymentDetail.channels && Array.isArray(paymentDetail.channels)) {
					// Check if currency is USD
					const isUSD = paymentDetail.currency === 'USD';

					if (isUSD) {
						// For USD: Only show card and remove all other channels
						paymentDetail.channels = paymentDetail.channels.filter(channel => channel === "card");
					} else {
						// For non-USD: Sort to ensure "offline transfer" comes first
						paymentDetail.channels = [...paymentDetail.channels].sort((a, b) => {
							if (a === "offline transfer") return -1;
							if (b === "offline transfer") return 1;
							return 0;
						});
					}
				}
			}

			useEffect(() => {
				if (paymentDetail.amount) {
					paymentContext.setPaymentDetail(paymentDetail);
				}
			}, [paymentDetail]);

			// Load saved customerCode from localStorage on mount
			useEffect(() => {
				const savedCustomerCode = localStorage.getItem('customerCode');
				if (savedCustomerCode && !customerCode) {
					setCustomerCode(savedCustomerCode);
					referralForm.setFieldValue('referral_code', savedCustomerCode);
				}
				 // Cleanup debounce on unmount
				return () => {
					debouncedSetCustomerCode.cancel();
				};
			}, []);

			if (accessCode === "icons") {
				return window.location.replace("https://app.cashenvoy.com");
			}

			if (isLoading) {
				return <LoadingPage />;
			}

			if (used === "This payment link has been completed. You can no longer access it.") {
				return <>
					<div className="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100hv' }}>
						<div className="error-container">
							<div className="error-content">
								<div className="error-icon">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="error-title">We could not start this transaction</h3>
								{/* <p className="error-message">We could not start this transaction</p> */}
								<p className="error-description">It's either because the link is incorrect or the transaction is already completed</p>
								<button className="reload-button" onClick={() => window.location.reload()}>
									Reload
								</button>
							</div>
							<div className="security-footer">
								<img className='w-[36px] h-[36px]' style={{ width: '68px' }}
									src={YEPLOGO} alt="YEP Logo" />
								<span>
									Secured by YEP
								</span>
							</div>
						</div>
					</div>
				</>
			}

			if (isError && used !== "This payment link has been completed. You can no longer access it.") {
				return <WidgetError />;
			}

			const props = {
				paymentDetail,
			};

			return (
				<div className="h-full flex justify-center items-center">
					<div className="mt-50 cashenvoypaymentwidget">
						<WidgetHeader showTabs={showTabs} paymentDetail={paymentDetail} />
						<div className="widget-body">
							<div className="paymentPages-grid mb-4" style={{ display: 'none'}}>
								<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
									<form onSubmit={referralForm.handleSubmit} className='flex items-start gap-3 w-full'>
										<div className='flex-1 relative'>
											<TextInputWithLabel
												name="referral_code"
												// onChange={referralForm.handleChange}
												onChange={handleReferralCodeChange} 
												onBlur={(e) => {
													referralForm.handleBlur(e);
													// Force immediate save on blur
													if (referralForm.values.referral_code.trim()) {
													setCustomerCode(referralForm.values.referral_code.trim());
													localStorage.setItem("customerCode", referralForm.values.referral_code.trim());
													debouncedSetCustomerCode.cancel();
													}
												}}
												value={referralForm.values.referral_code}
												placeholder="Enter Referral Code (Optional)"
												label="Referral Code"
												error={referralForm.touched.referral_code && referralForm.errors.referral_code}
											/>
										</div>

										<div className='flex items-center gap-2' style={{marginTop: '32px', marginRight:'3px'}}>
											{/* <button
												type="submit"
												className='saveAgent'
												disabled={referralForm.values.referral_code === customerCode}
											>
												{referralForm.values.referral_code === customerCode ? 'Saved' : 'Save'}
											</button> */}
													
											{customerCode && (
												<button
													type="button"
													style={{marginLeft: '20px'}}
													onClick={() => {
														setCustomerCode("");
														referralForm.setFieldValue('referral_code', '');
														localStorage.removeItem("customerCode");
                         								debouncedSetCustomerCode.cancel();
													}}
													className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
												>
													Clear
												</button>
											)}
										</div>
									</form>
								</div>
							</div>
							<div className="tab-content">
								<Component {...props} {...passThroughProps} />
							</div>
						</div>
						<WidgetFooter
							onClick={() => history.push(urls.home(accessCode))}
							verb="Cancel Payment"
						/>
					</div>
				</div>
			);
		};

export default withInitiatePayment;
