function rad(x) {
  return (x * Math.PI) / 180;
}
export function semicirclesToDegrees(semicircle) {
  return semicircle / (Math.pow(2, 31) / 180);
}

export function getDistance(p1, p2) {
  const R = 6399057.501483163; // Earth’s mean radius in meter
  const dLat = rad(semicirclesToDegrees(p2.position_lat) - semicirclesToDegrees(p1.position_lat));
  const dLong = rad(semicirclesToDegrees(p2.position_long) - semicirclesToDegrees(p1.position_long));
  const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
    (Math.cos(rad(semicirclesToDegrees(p1.position_lat))) * Math.cos(rad(semicirclesToDegrees(p2.position_lat))) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // returns the distance in meter
}

export function zeroPad(num, places) {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

export const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export class MyEvent {

  static getEvent(name) {
    if (typeof (this.events) === 'undefined') {
      this.events = {};
    }
    if (typeof (this.events[name]) === 'undefined') {
      this.events[name] = [];
    }
    return this.events[name];
  }

  static emit(name, data) {
    const event = this.getEvent(name);
    event.forEach((fn) => {
      fn(data);
    });
  }

  static listen(name, fn) {
    const event = this.getEvent(name);
    event.push(fn);
  }
}

export const SECONDS_SINCE_1990 = new Date('1989-12-31').getTime() / 1000;

export const colors = {
  blue: '#22c6bb',
  green: '#98c25c',
  pink: '#e16d92',
  purple: '#8b5cd6',
  orange: '#f2813a',
  red: '#ce2e33',
};
