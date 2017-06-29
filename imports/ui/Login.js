import React from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Rooms } from '../api/rooms';

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
      Rooms.insert({
        email 
      })
      let cpInRoom = Rooms.find({ "email": email }).fetch();
      Session.set('gameRoom', cpInRoom[0]._id);
    });

    // Meteor login error
    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        this.setState({error: 'Unable to login. Check email and password.'});
      } else {
        this.setState({error: ''});
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

