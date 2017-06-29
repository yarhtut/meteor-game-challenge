import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

export const Players = new Mongo.Collection('players');

Meteor.methods({
  'players.insert'(){
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Players.insert({
      playerName: 'TestYar',
      playerScore: '',
      userId: this.userId,
      updatedAt: moment().valueOf() 
    })
  },

  'players.remove'(_id) {
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({ _id});

    Players.remove({ _id, userId: this.userId });
  }
});
