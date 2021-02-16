import React, { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const AuthorizeTransaction = lazy(() => import('../pages/AuthorizeTransaction'));
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('../pages/PaymentFailure'));



const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/authorize_transaction',
    component: AuthorizeTransaction,
    exact: true,
  },
  {
    path: '/success',
    component: PaymentSuccess,
    exact: true,
  },
  {
    path: '/error',
    component: PaymentFailure,
    exact: true
  }
];

export default routes;
