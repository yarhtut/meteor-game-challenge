// Meteor
import { Meteor } from 'meteor/meteor';

// Model
import '../imports/api/users';
import '../imports/api/queues';
import '../imports/api/games';
import '../imports/api/players';
import '../imports/api/gameHistory';

// Just for Development
import {Queues} from '../imports/api/queues';
import {Games} from '../imports/api/games';
import {Players} from '../imports/api/players';

Meteor.startup(() => {
  Queues.remove({});
  Games.remove({});
});
