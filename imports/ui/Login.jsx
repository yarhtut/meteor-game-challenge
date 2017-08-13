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

        Games.insert({
          game:              usersInRoom,
          firstPlayer:       usersInRoom[0],
          firstPlayerEmail:  userEmailInRoom[0],
          secondPlayer:      usersInRoom[1],
          secondPlayerEmail: userEmailInRoom[1],
          createGame:        true
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

