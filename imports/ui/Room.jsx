// Meteor
import { Accounts } from 'meteor/accounts-base';

// React
import React from 'react';

// Template
import RoomPlayers from './RoomPlayers';

export default class Room extends React.Component {
  // Logout Function
  // Remove user from Room
  onLogout() {
    Accounts.logout();
  }
  render() {
    return (
      <div className='page-content'>
        <h1>Room</h1>
        <button onClick={this.onLogout.bind(this)}>Logout</button>
        <RoomPlayers />
      </div>
    );
  }
}
