import { Meteor } from 'meteor/meteor';
import expect from 'expect';

import { Rooms } from './../api/rooms';

if ( Meteor.isServer) {
  describe('Rooms', function() {
    beforeEach(function() {
      Rooms.remove({});
      Rooms.insert({
        _id: 'testPlayerId',
        playerName: 'TestYar',
        playerScore: '',
        userId: this.userId,
        updatedAt: 0,
      });
    });

    it('should insert new rooms', function(){
      const userId = 'testId';
      const _id =  Meteor.server.method_handlers['rooms.insert'].apply({ userId: 'testId'})

      expect(Rooms.findOne({ _id, userId: 'testId' })).toExist();
    });

    it('should not insert if not authenticated', function() {
      expect(() => {
        Meteor.server.method_handlers['rooms.insert']();
      }).toThrow();
    });


    it('should remove player form room', function() {
      Meteor.server.method_handlers['rooms.remove'].apply({ userId: 'testUserId1'}, ['testNoteId1']);
      expect(Rooms.findOne({ _id: 'testNoteId'})).toNotExist();
    });


    it('should not remove note if unauthenticated', function () {
      expect(() => {
        Meteor.server.method_handlers['rooms.remove'].apply({}, ['testNoteId1']);
      }).toThrow();
    });

    it('should not remove note if invalid _id', function () {
      expect(() => {
        Meteor.server.method_handlers['rooms.remove'].apply({ userId: 'testUserId1'});
      }).toThrow();
    });
  })
}
