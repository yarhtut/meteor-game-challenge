// Meteor
import { Meteor } from 'meteor/meteor';

// React
import React from 'react';
import { Link } from 'react-router';

// Model
import { Queues } from '../api/queues';
import { Games } from '../api/games';
import { Players } from '../api/players';
import { GamesHistory } from '../api/gameHistory';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    }
  }

  // Meteor default Authentication
  // @params in Events { email , password }
  // TODO: refactor [ extract to login class or something ]
  onSubmit(e) {
    e.preventDefault();
    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    // Meteor default login with password functionality
    Meteor.loginWithPassword({email}, password, () => {
      currentUser = Meteor.user();

      Queues.insert({
        users: currentUser._id,
        userEmail: email,
        inGame: false
      })

      let roomCount = Queues.find().count();

      if(roomCount == 2 ) {
        let userInRoom = Queues.find().fetch();
        let usersInRoom  = userInRoom.map((room) => room.users);
        let userEmailInRoom  = userInRoom.map((room) => room.userEmail);

        gameNumber = [1,2,3,4,5,6,7,8,9,10];
        const gameNumbers = gameNumber.sort(function() { return 0.5 - Math.random() });
        const player1 = [];
        const player2 = [];

        for (var i = 0; i < gameNumbers.length; i += 2) {
          player1.push(gameNumbers[i]);
          gameNumbers[i+1] && player2.push(gameNumbers[i+1]);
        }

        Games.insert({
          game:              usersInRoom,
          firstPlayer:       usersInRoom[0],
          firstPlayerEmail:  userEmailInRoom[0],
          secondPlayer:      usersInRoom[1],
          secondPlayerEmail: userEmailInRoom[1],
          player1Numbers: player1,
          player2Numbers: player2,
          player1Number: 0,
          player2Number: 0,
          player1Win: 0,
          player2Win: 0,
          round: 0,
          playerTurn: 'player1',
          winner: ''
        });

        userInRoom.map((room) => {
          Players.insert({
            userId: room.users,
            userEmail: room.userEmail,
            againstPlayer: usersInRoom
          });
        });

        let usersIdInRoom  = userInRoom.map((room) => {
          Queues.remove({ _id: room._id})
        });
      }
    });
  }

  render() {
    return (
      <div className='boxed-view'>
        <div className='boxed-view__container'>
          <h1>Game Challenge</h1>

          {this.state.error ? <p>{this.state.error}</p> : undefined}

          <form onSubmit={this.onSubmit.bind(this)} noValidate className='boxed-view__form'>
            <input type="email" ref="email" name="email" placeholder="Email"/>
            <input type="password" ref="password" name="password" placeholder="Password"/>
            <button className='button'>Login</button>
          </form>

          <Link to="/signup">Signup for an account?</Link>
        </div>
      </div>
      );
}
}

