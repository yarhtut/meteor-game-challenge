import { Meteor } from 'meteor/meteor';

import '../imports/api/users';
import '../imports/api/rooms';
import {Rooms} from '../imports/api/rooms';

Meteor.startup(() => {
  Rooms.remove({});
});
