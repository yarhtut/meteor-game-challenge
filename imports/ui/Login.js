import React from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Rooms } from '../api/rooms';
import { Games } from '../api/games';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  // Form submit function for Login
  // @params in Events { email , password }
  onSubmit(e) {
    e.preventDefault();
    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    // Meteor default login with password functionality
    Meteor.loginWithPassword({email}, password, () => {
      currentUser = Meteor.user();

      Rooms.insert({
        users: currentUser._id,
        inGame: false
      })

      let roomCount = Rooms.find().count();

      if(roomCount == 2 ) {
        let userInRoom = Rooms.find().fetch();
        let usersInRoom  = userInRoom.map((room) => room.users);

        let usersIdInRoom  = userInRoom.map((room) => {
          Rooms.update({ _id: room._id}, {$set: { inGame: true } })
        });

        Games.insert({
          game: usersInRoom,
          firstUser: usersInRoom[0],
          secondUser: usersInRoom[1],
          createGame: true
        })
        //Session.set('currentUser', currentUser._id)
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

