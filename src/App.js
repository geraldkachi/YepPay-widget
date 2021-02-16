import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import routes from './routes';

import './App.css';



const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {routes.map(({ path, component: Component, exact }) => {
            return (
              <Route path={path} key={path} exact={exact}>
                <Component />
              </Route>
            );
          })}
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </div>
  );

}

export default App;
