import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Games } from '../api/games';

import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Signup from '../ui/Signup';
import Room from '../ui/Room';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';

// Page not found for routing error
export default class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      games: []
    }
  }

  componentDidMount() {
    this.gameTracker = Tracker.autorun(() => {
      Meteor.subscribe('games');
      var games = Games.find({ _id: this.props.params.id }).fetch();
      this.setState({
        games
      });
    });
  }

  componentWillUnmount() {
    this.gameTracker.stop();
  }
  renderGameRoom() {
    return this.state.games.map((game) => {
      return <p key={game._id}>GameId: {game._id}- FirstPlayer: {game.firstUser} - SecondPlayer: {game.secondUser}</p>
    });
  }

  render() {
    return(
      <div> 
      <p>Game component here</p>;
      { this.renderGameRoom() }
      </div>
    )
  }
}
