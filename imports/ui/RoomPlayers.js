import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Rooms } from '../api/rooms';
import { Games } from '../api/games';
import { Router, Route, browserHistory, Redirect } from 'react-router';

export default class RoomPlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: []
    };
  }

  componentDidMount() {
    this.gameTracker = Tracker.autorun(() => {
      Meteor.subscribe('games');
      let currentUser = Meteor.user();
     
      var games = Games.find({ game: { $in: [currentUser._id] }}).fetch();
      this.setState({
        games
      });
      console.log(this.state.games)
    });
  }

  componentWillUnmount() {
    this.gameTracker.stop();
  }

  renderPlayerRoom() {
    let usersInGame = this.state.games.map((user) => {
      return user.game.includes(currentUser._id)
    });

    if ( usersInGame == false ) {
      return <img src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif' />
    }
    else {
      let gameId = this.state.games.map((game) => {
        return game._id
      });
      const path = `/game/${gameId}`;
      browserHistory.replace(path);
    }
  }

  render() {
    return (
      <div>
        <p>Room Players</p>
        {this.renderPlayerRoom()}
      </div>
    );
  }
};

