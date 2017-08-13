import { Meteor } from 'meteor/meteor';

import '../imports/api/users';
import '../imports/api/rooms';
import '../imports/api/games';
import '../imports/api/players';
import '../imports/api/gameHistory';

import {Rooms} from '../imports/api/rooms';
import {Games} from '../imports/api/games';
import {Players} from '../imports/api/players';

Meteor.startup(() => {
  Rooms.remove({});
  Games.remove({});
  Players.remove({});
});
