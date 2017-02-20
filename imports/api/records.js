import { Mongo } from 'meteor/mongo';
import { semicirclesToDegrees, SECONDS_SINCE_1990 } from '../../lib/util';

export const Records = new Mongo.Collection('records');

Records.helpers({
  getKms() {
    return this.total_distance / 100000;
  },
  getSpeed() {
    return this.avg_speed * 0.0036;
  },
  getElapsedTime() {
    return this.total_elapsed_time / 1000;
  },
  getTimerTime() {
    return this.total_timer_time / 1000;
  },
  getDate() {
    const epoch = this.start_time + SECONDS_SINCE_1990;
    return new Date(parseInt(epoch, 10) * 1000);
  },
  getEndLat() {
    return semicirclesToDegrees(this.end_position_lat);
  },
  getEndLong() {
    return semicirclesToDegrees(this.end_position_long);
  },
  getLat() {
    return semicirclesToDegrees(this.position_lat);
  },
  getLong() {
    return semicirclesToDegrees(this.position_long);
  },
});

export default Records;
