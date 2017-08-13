import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

export const Games = new Mongo.Collection('games');

Meteor.methods({
  'games.insert'(){
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Games.insert({
      titles: 'test',
      body: '',
      userId: this.userId,
      updatedAt: moment().valueOf() 
    })
  },

  'games.remove'(_id) {
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({ _id});

    Games.remove({ _id, userId: this.userId });
  }
});
