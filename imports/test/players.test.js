import { Meteor } from 'meteor/meteor';
import expect from 'expect';

import { Players } from './../api/players';

if ( Meteor.isServer) {
  describe('Players', function() {
    beforeEach(function() {
      Players.remove({});
      Players.insert({
        _id: 'testPlayerId',
        playerName: 'TestYar',
        playerScore: '',
        userId: this.userId,
        updatedAt: 0,
      });
    });

    it('should insert new players', function(){
      const userId = 'testId';
      const _id =  Meteor.server.method_handlers['players.insert'].apply({ userId: 'testId'})

      expect(Players.findOne({ _id, userId: 'testId' })).toExist();
    });

    it('should not insert if not authenticated', function() {
      expect(() => {
        Meteor.server.method_handlers['players.insert']();
      }).toThrow();
    });


    it('should remove players', function() {
      Meteor.server.method_handlers['players.remove'].apply({ userId: 'testUserId1'}, ['testNoteId1']);
      expect(Players.findOne({ _id: 'testNoteId'})).toNotExist();
    });


    it('should not remove players if unauthenticated', function () {
      expect(() => {
        Meteor.server.method_handlers['players.remove'].apply({}, ['testNoteId1']);
      }).toThrow();
    });

    it('should not remove players if invalid _id', function () {
      expect(() => {
        Meteor.server.method_handlers['players.remove'].apply({ userId: 'testUserId1'});
      }).toThrow();
    });
  })
}
