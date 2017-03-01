import { Meteor } from 'meteor/meteor';
import { Records } from '../imports/api/records';
import '../imports/startup/server';

Meteor.publish('records', (id) => {
  const records = Records.find({ activity_id: id });
  return records;
});

Meteor.publish('sessions', () => Records.find({ type: 'session' }));
