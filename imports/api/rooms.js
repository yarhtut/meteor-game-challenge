import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

export const Rooms = new Mongo.Collection('rooms');

Meteor.methods({
  'rooms.insert'(){
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Rooms.insert({
      titles: 'test',
      body: '',
      userId: this.userId,
      updatedAt: moment().valueOf() 
    })
  },

  'rooms.remove'(_id) {
    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({ _id});

    Rooms.remove({ _id, userId: this.userId });
  }
});
