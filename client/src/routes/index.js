import React from 'react';
import { Route } from 'react-router-dom';
import SignUp from '../containers/Auth/SignUp';
import SignIn from '../containers/Auth/SignIn';


export default {
  authenticated: [
    <Route key="userProfilePage" path="/profile" exact render={() => <h2>Secret</h2>} />,
  ],
  notAuthenticated: [
    <Route key="SignIn" path="/sign-in" exact component={SignIn} />,
    <Route key="SignUp" path="/sign-up" exact component={SignUp} />,
  ],
};