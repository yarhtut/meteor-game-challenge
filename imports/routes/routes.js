// Meteor
import { Meteor } from 'meteor/meteor';

// React
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Template
import Signup from '../ui/Signup';
import Room from '../ui/Room';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';
import Game from '../ui/Game';

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/rooms', '/games/'];


const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace('/rooms');
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
    browserHistory.replace('/rooms');
  } else if (isAuthenticatedPage && !isAuthenticated) {
    browserHistory.replace('/');
  }
};

export const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Login} onEnter={onEnterPublicPage}/>
    <Route path="/signup" component={Signup} onEnter={onEnterPublicPage}/>
    <Route path="/rooms" component={Room} onEnter={onEnterPrivatePage}/>
    <Route path="/game/:id" component={Game} onEnter={onEnterPrivatePage}/>
    <Route path="*" component={NotFound}/>
  </Router>
);
