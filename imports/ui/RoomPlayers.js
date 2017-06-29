import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Rooms } from '../api/rooms';

export default class RoomPlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: []
    };
  }

  componentDidMount() {
    this.roomTracker = Tracker.autorun(() => {
      Meteor.subscribe('rooms');
      const rooms = Rooms.find().fetch();
      this.setState({ rooms });
    });
  }

  componentWillUnmount() {
    this.roomTracker.stop();
  }

  renderPlayerRoom() {
    if ( this.state.rooms.length <= 1) {
      return <img src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif' />
    }
    else {
      return this.state.rooms.map((room) => {
        return <p key={room._id}>{room.email}</p>
      });
    }
  }

  render() {
    return (
      <div>
        <p>Room Players</p>
        <div>
          {this.renderPlayerRoom()}
        </div>
      </div>
    );
  }
};

