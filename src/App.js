import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
const Home = React.lazy(() => import('./pages/Home'));
const AuthorizeTransaction = React.lazy(() => import('./pages/AuthorizeTransaction'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = React.lazy(() => import('./pages/PaymentFailure'));
const Ussd = React.lazy(() => import('./pages/Ussd'));



const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/authorize_transaction" element={<AuthorizeTransaction/>} />
          <Route exact path="/payment_success" element={<PaymentSuccess/>} />
          <Route exact path="/payment_failure" element={<PaymentFailure/>} />
          <Route exact path="/ussd" element={<Ussd/>} />
        </Routes>
      </Suspense>
    </div>
  );

}

export default App;
