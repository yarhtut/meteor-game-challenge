// Meteor
import { Accounts } from 'meteor/accounts-base';

// React
import React from 'react';

// Template
import QueuePlayers from './QueuePlayers';

export default class Queue extends React.Component {
  // Logout Function
  // TODO: remove from queue model if player leave room
  onLogout() {
    Accounts.logout();
  }
  render() {
    return (
      <div className='page-content'>
        <h1>Game Queue</h1>
        <button onClick={this.onLogout.bind(this)}>Logout</button>
        <QueuePlayers />
      </div>
    );
  }
}
