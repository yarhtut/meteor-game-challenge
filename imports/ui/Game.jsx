// Meteor 
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';

// React
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Model
import { Games } from '../api/games';
import { GamesHistory } from '../api/gameHistory';

export default class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      games: []
    }
  }

  componentWillMount() {
    // listen the data changes   
    this.gameTracker = Tracker.autorun(() => {
      Meteor.subscribe('games');
      var games = Games.find({ _id: this.props.params.id }).fetch();

      // add games into current state
      this.setState({
        games
      });
    });
  }

  // after we render stop the data changes
  componentWillUnmount() {
    this.gameTracker.stop();
  }
 
  renderGameRoom() {
    currentUser = Meteor.user();

    currentGame = this.state.games.map((game) => {
      return game.game.includes(currentUser._id)
    });

    // current user in game ?
    if ( currentGame[0] == true ) {
      return this.state.games.map((game) => {
        return <p key={game._id}>GameId: {game._id}- FirstPlayer: {game.firstPlayerEmail} - SecondPlayer: {game.secondPlayerEmail}</p>
        });
    } else {
    // TODO: support to put back inot Queue instead of force logout
      Accounts.logout();
      browserHistory.replace('/');
    }
  }


  // TODO: change game model field to meaningful
  onLogout() {
    currentUser = Meteor.user();

    this.state.games.map((game) => {
      // current user in the game ?
      // TODO: change game model field to meaningful
      if (game.game.includes(currentUser._id)) {

        // store current game into GameHistory model
        GamesHistory.insert({
          game:              game.game,
          firstPlayer:       game.firstPlayer,
          firstPlayerEmail:  game.firstPlayerEmail,
          secondPlayer:      game.secondPlayer,
          secondPlayerEmail: game.secondPlayerEmail 
        });
        
        // remove current game
        let currentGame = game._id;
        Games.remove({ _id: currentGame})

        Accounts.logout();

        browserHistory.replace('/');
      }
    })
  }

  render() {
    return (
      <div className='page-content'>
        <button onClick={this.onLogout.bind(this)}>Logout</button>
        { this.renderGameRoom() }
      </div>
    )
  }
}
