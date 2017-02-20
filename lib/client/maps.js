const GoogleMapsLoader = require('google-maps');

GoogleMapsLoader.KEY = 'AIzaSyDId3kWjcDVdlFOzosFkm78XaFAH8PWiYQ';
const cbs = [];
let g = false;
GoogleMapsLoader.load((google) => {
  g = google;
  cbs.forEach((cb) => {
    cb(g);
  });
});

export default function Maps(cb) {
  if (g) {
    cb(g);
  } else {
    cbs.push(cb);
  }
}
