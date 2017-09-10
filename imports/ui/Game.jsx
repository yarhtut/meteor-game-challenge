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
  }

  componentWillMount() {
    // listen the data changes
    this.gameTracker = Tracker.autorun(() => {
      Meteor.subscribe('games');
      const games = Games.find({ _id: this.props.params.id }).fetch();
      // update current game state
      this.setState({ games });
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

        const player1 = game.player1Numbers.map((playerNumber) =>  {
          return (
            <button
              disabled={this.state.games[0].playerTurn != 'player1'}
              className='btn btn-card'
              onClick={this.onPlay.bind(this)}
              data-number={playerNumber}
              data-player='player1'
              key={playerNumber}>
              {playerNumber}
            </button>
          )
        })
        const player2 = game.player2Numbers.map((playerNumber) =>  {
          return (
            <button
              disabled={this.state.games[0].playerTurn != 'player2'}
              className='btn btn-card'
              onClick={this.onPlay.bind(this)}
              data-number={playerNumber}
              data-player='player2'
              key={playerNumber}>
              {playerNumber}
            </button>
            )})
        const winner = game.winner ? (<h2 className='winner'>{ game.winner }</h2>) : '';
        return (
          <div>
            <p key={game._id}>GameId: {game._id}- FirstPlayer: {game.firstPlayerEmail} - SecondPlayer: {game.secondPlayerEmail}</p>
            <br />
            { winner }
            <h1>This is { game.playerTurn } Turn.</h1>
            <h2>Total Player1 Win is { game.player1Win }.</h2>
            <h2>Total Player2 Win is { game.player2Win }.</h2>
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

  setValue(selectedNumber, playerNumberArray, player){
    let popArrayIndex = playerNumberArray.indexOf(parseInt(selectedNumber));
    playerNumberArray.splice(popArrayIndex, 1);

    if (player == 'player1') {
      Games.update(
        { _id: this.state.games[0]._id},
        { $set: { player1Number : parseInt(selectedNumber), player1Numbers: playerNumberArray, playerTurn: 'player2' }}
      )
    } else {
      Games.update(
        { _id: this.state.games[0]._id},
        { $set: { player2Number : parseInt(selectedNumber), player2Numbers: playerNumberArray, playerTurn: 'player1' }}
      )
    }

    this.gameTracker = Tracker.autorun(() => {
      Meteor.subscribe('games');
      const games = Games.find({ _id: this.props.params.id }).fetch();
      this.setState({ games });
    });
  }

  onPlay(e){
    e.preventDefault();
    const cGame = this.state.games[0];
    const el = e.target.dataset;
    let player1Number = 0;
    let player2Number = 0;

    if ( el.player == 'player1' ) {
      player1Number = el.number;
      this.setValue(player1Number,cGame.player1Numbers, el.player);
    } else {
      player2Number = el.number;
      this.setValue(player2Number,cGame.player2Numbers, el.player);
    }

    if ( cGame.player2Number > 0  < cGame.player1Number) {
      if (cGame.player1Number > parseInt(player2Number)) {
        Games.update(
          { _id: cGame._id},
          { $set: { player1Win: cGame.player1Win + 1 }}
        )
      }
      if (parseInt(player2Number) > cGame.player1Number) {
        Games.update(
          { _id: cGame._id},
          { $set: { player2Win: cGame.player2Win + 1 }}
        )
      }
      Games.update(
        { _id: cGame._id},
        { $set: { round: cGame.round + 1 , player1Number: 0, player2Number: 0}}
      )

      if ( cGame.player1Win >= 2 ) {
        Games.update(
          { _id: cGame._id},
          { $set: { winner: 'Winner is Player1.', player1Numbers: [], player2Numbers: []}}
        )
      }
      if ( cGame.player2Win >= 2 ) {
        Games.update(
          { _id: cGame._id},
          { $set: { winner: 'Winner is Player2.', player1Numbers: [], player2Numbers: []}}
        )
      }

      this.gameTracker = Tracker.autorun(() => {
        Meteor.subscribe('games');
        const games = Games.find({ _id: this.props.params.id }).fetch();
        this.setState({ games });
      });
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
          secondPlayerEmail: game.secondPlayerEmail,
          winner:            game.winner,
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
