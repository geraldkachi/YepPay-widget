import React, { Suspense } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

import "./App.css";
import { PaymentProvider } from "./context/PaymentContext";
import { urls } from "./utils/urls";
import LoadingPage from "./pages/LoadingPage";
import NoConfiguredPaymentOption from "./components/NoConfiguredPaymentOption";
import PageNotFound from "./components/PageNotFound";
import PaymentPages from "./pages/PaymentPages/PaymentPages";

const AuthorizeTransaction = React.lazy(() =>
	import("./pages/AuthorizeTransaction")
);
const ConfirmPayment = React.lazy(() => import("./pages/ConfirmPayment"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = React.lazy(() => import("./pages/PaymentFailure"));
const USSDWidget = React.lazy(() => import("./pages/USSDWidget"));
const CardWidget = React.lazy(() => import("./pages/CardWidget"));
const OfflineWidget = React.lazy(() => import("./pages/OfflineWidget"));
const RedirectWidget = React.lazy(() => import("./pages/RedirectWidget"));
const BankTransferWidget = React.lazy(() =>
	import("./pages/BankTransferWidget")
);

const queryClient = new QueryClient();

const App = () => {
	return (
		<div>
			<QueryClientProvider client={queryClient}>
				<PaymentProvider>
					<BrowserRouter>
						<Suspense fallback={<LoadingPage />}>
							<Switch>
								<Route
									exact
									path={urls.home(":accessCode")}
									children={<RedirectWidget />}
								/>

								<Route
									exact
									path={urls.card(":accessCode")}
									children={<CardWidget />}
								/>
								<Route
									exact
									path={urls["payment-pages"](":accessCode")}
									children={<PaymentPages />}
								/>
								{/* <Route
									exact
									path={urls.ussd(":accessCode")}
									children={<USSDWidget />}
								/> */}
								{/* <Route
									exact
									path={urls.bankTransfer(":accessCode")}
									children={<BankTransferWidget />}
								/> */}
								{/* <Route
									exact
									path={urls.offlineTransfer(":accessCode")}
									children={<OfflineWidget />}
								/> */}
								<Route
									exact
									path={urls.otp(":accessCode", ":reference")}
									children={<AuthorizeTransaction />}
								/>
								<Route
									exact
									path={urls.success(":accessCode")}
									children={<PaymentSuccess />}
								/>
								<Route
									exact
									path={urls.failure(":accessCode")}
									children={<PaymentFailure />}
								/>
								<Route
									exact
									path={urls["no-payment-option"](
										":accessCode"
									)}
									children={<NoConfiguredPaymentOption />}
								/>
								<Route
									exact
									path={urls["confirm-payment"]()}
									children={<ConfirmPayment />}
								/>
								<Route component={PageNotFound} />
							</Switch>
						</Suspense>
						<Toaster position="top-center" />
					</BrowserRouter>
				</PaymentProvider>
			</QueryClientProvider>
		</div>
	);
};

export default App;
