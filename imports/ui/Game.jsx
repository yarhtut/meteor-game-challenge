import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';

import { Games } from '../api/games';
import { GamesHistory } from '../api/gameHistory';

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

  componentWillMount() {
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
  currentUser = Meteor.user();
  currentgame = this.state.games.map((game) => {
    return game.game.includes(currentUser._id)
  });

  if ( currentgame[0] == true ) {
    return this.state.games.map((game) => {
      return <p key={game._id}>GameId: {game._id}- FirstPlayer: {game.firstPlayerEmail} - SecondPlayer: {game.secondPlayerEmail}</p>
      });
  }else {
    return <p> Your game oponenet leave the game you should logout. </p>;
  }
}

onLogout() {

  currentUser = Meteor.user();
  currentgame = this.state.games.map((game) => {

    if (game.game.includes(currentUser._id)) {

      var cGame = game._id;
       
      GamesHistory.insert({
        game:              game.game,
        firstPlayer:       game.firstPlayer,
        firstPlayerEmail:  game.firstPlayerEmail,
        secondPlayer:      game.secondPlayer,
        secondPlayerEmail: game.secondPlayerEmail 
      });

      Games.remove({ _id: cGame})
      Accounts.logout();

      browserHistory.replace('/');
    }
  })
}

render() {
  return(
    <div>
      <button onClick={this.onLogout.bind(this)}>Logout</button>
      { this.renderGameRoom() }
    </div>
    )
  }
}
