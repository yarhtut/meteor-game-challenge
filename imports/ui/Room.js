import React from 'react';
import { Accounts } from 'meteor/accounts-base';

import { Rooms } from '../api/rooms';
import RoomPlayers from './RoomPlayers';

export default class Room extends React.Component {
  // Logout Function
  //  Get Current User Session
  //  Remove user from Room
  onLogout() {
    let cpInSession = Session.get('gameRoom');
    Rooms.remove({"_id": cpInSession })

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
