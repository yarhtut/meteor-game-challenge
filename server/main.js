import { Meteor } from 'meteor/meteor';

import '../imports/api/users';
import '../imports/api/rooms';
import '../imports/api/games';
import {Rooms} from '../imports/api/rooms';
import {Games} from '../imports/api/games';

Meteor.startup(() => {
  Rooms.remove({});
  Games.remove({});
});
