// Meteor
import { Meteor } from 'meteor/meteor';

// React
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Template
import Signup from '../ui/Signup';
import Queue from '../ui/Queue';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';
import Game from '../ui/Game';

// Define routes
const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/queues', '/games/'];

// check user login
const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace('/queues');
  }
};

const onEnterPrivatePage = () => {
  if (!Meteor.userId()) {
    browserHistory.replace('/');
  }
};

export const onAuthChange = (isAuthenticated) => {
  const pathname = browserHistory.getCurrentLocation().pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);

  if (isUnauthenticatedPage && isAuthenticated) {
    browserHistory.replace('/queues');
  } else if (isAuthenticatedPage && !isAuthenticated) {
    browserHistory.replace('/');
  }
};

export const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Login} onEnter={onEnterPublicPage}/>
    <Route path="/signup" component={Signup} onEnter={onEnterPublicPage}/>
    <Route path="/queues" component={Queue} onEnter={onEnterPrivatePage}/>
    <Route path="/game/:id" component={Game} onEnter={onEnterPrivatePage}/>
    <Route path="*" component={NotFound}/>
  </Router>
);
