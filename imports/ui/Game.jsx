// Meteor
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';

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
    };
    //this.onPlay = this.onPlay.bind(this);
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

        var player1 = game.firstPlayerNumbers.map((playerNumber) =>  {
          return (
          <button
            className='btn btn-card'
            onClick={this.onPlay.bind(this)}
            data-number={playerNumber}
            data-name='player1'
            key={playerNumber}>
            {playerNumber}
          </button>
          )})
          var player2 = game.secondPlayerNumbers.map((playerNumber) =>  {
            return (
            <button 
              className='btn btn-card'
              onClick={this.onPlay.bind(this)}
              data-number={playerNumber}
              data-name='player2'
              key={playerNumber}>
              {playerNumber}
            </button>
            )})

        return (
          <div>
            <p key={game._id}>GameId: {game._id}- FirstPlayer: {game.firstPlayerEmail} - SecondPlayer: {game.secondPlayerEmail}</p>
            <br />
            <h1>This is { game.playerTurn } Turn.</h1>
            { (game.firstPlayer == currentUser._id) ? player1 : player2 }
          </div>
          )
      });
    } else {
      // TODO: support to put back inot Queue instead of force logout
      Accounts.logout();
      browserHistory.replace('/');
    }
  }
  onPlay(e){
    e.preventDefault();
    var el = e.target;
    var player1Number = 0;
    var player2Number = 0;
    if ( el.dataset.name == 'player1' ) {
      player1Number = el.dataset.number;
      var remove1 = this.state.games[0].firstPlayerNumbers;

      var removeIndex1 = remove1.indexOf(parseInt(player1Number));
      
      remove1.splice(removeIndex1, 1);
      Games.update({ _id: this.state.games[0]._id},
      {$set: { player1Number: parseInt(player1Number), firstPlayerNumbers: remove1  }})

    this.gameTracker = Tracker.autorun(() => {
      Meteor.subscribe('games');
      var games = Games.find({ _id: this.props.params.id }).fetch();
      // add games into current state
      this.setState({
        games
      });
    });
    } else {
      player2Number = el.dataset.number;
      var remove2 = this.state.games[0].secondPlayerNumbers;
      var removeIndex2 = remove2.indexOf(parseInt(player2Number));
      
      remove2.splice(removeIndex2, 1);
      Games.update({ _id: this.state.games[0]._id},
                   {$set: { player2Number: parseInt(player2Number), secondPlayerNumbers: remove2  }})
    this.gameTracker = Tracker.autorun(() => {
      Meteor.subscribe('games');
      var games = Games.find({ _id: this.props.params.id }).fetch();
      // add games into current state
      this.setState({
        games
      });
    });
    }
    if ( this.state.games[0].player2Number > 0  < this.state.games[0].player1Number) {
        if (this.state.games[0].player1Number > parseInt(this.state.games[0].player2Number)) {
          Games.update({ _id: this.state.games[0]._id},
                   {$set: { player1Win: this.state.games[0].player1Win + 1 }})
        }
        if (this.state.games[0].player2Number > this.state.games[0].player1Number) {
          Games.update({ _id: this.state.games[0]._id},
                   {$set: { player2Win: this.state.games[0].player2Win + 1 }})
        }
        Games.update({ _id: this.state.games[0]._id},
                 {$set: { round: this.state.games[0].round + 1 , player1Number: 0, player2Number: 0}})
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
