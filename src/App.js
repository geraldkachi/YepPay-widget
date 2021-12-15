import React, { Suspense } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import './App.css';
import { PaymentProvider } from './context/PaymentContext';
import { urls } from './utils/urls';
const AuthorizeTransaction = React.lazy(() =>
  import('./pages/AuthorizeTransaction')
);
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = React.lazy(() => import('./pages/PaymentFailure'));
const USSDWidget = React.lazy(() => import('./pages/USSDWidget'));
const CardWidget = React.lazy(() => import('./pages/CardWidget'));
const BankTransferWidget = React.lazy(() =>
  import('./pages/BankTransferWidget')
);
const SelectExistingCard = React.lazy(() =>
  import('./pages/SelectExistingCard')
);

const queryClient = new QueryClient();

const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <PaymentProvider>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route
                  exact
                  path={urls.home(':accessCode')}
                  children={<CardWidget />}
                />
                <Route
                  exact
                  path={urls.card(':accessCode')}
                  children={<CardWidget />}
                />
                <Route
                  exact
                  path={urls.ussd(':accessCode')}
                  children={<USSDWidget />}
                />
                <Route
                  exact
                  path={urls.bankTransfer(':accessCode')}
                  children={<BankTransferWidget />}
                />
                <Route
                  exact
                  path={urls.otp(':accessCode', ':reference')}
                  children={<AuthorizeTransaction />}
                />
                <Route
                  exact
                  path={urls.success(':accessCode')}
                  children={<PaymentSuccess />}
                />
                <Route
                  exact
                  path={urls.failure(':accessCode')}
                  children={<PaymentFailure />}
                />
                <Route
                  exact
                  path="/existing-card"
                  children={<SelectExistingCard />}
                />
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
