import fit from './fit';
import { Meteor } from 'meteor/meteor';

const usb = require('usb');
const execSync = require('child_process').execSync;
const fs = require('fs');

export function syncFiles(cb) {
  Meteor.setTimeout(() => {
    let watchPath = false;
    if (fs.existsSync('/media/ben/GARMIN/GARMIN/ACTIVITY/')) {
      watchPath = '/media/ben/GARMIN/GARMIN/';
    }
    if (fs.existsSync('/media/heidi/GARMIN/GARMIN/ACTIVITY/')) {
      watchPath = '/media/heidi/GARMIN/GARMIN/';
    }
    if (watchPath) {
      const deviceData = fit(watchPath + 'DEVICE.FIT');
      const watchId = deviceData[0].data.serial_number;
      execSync('cp -n ' + watchPath + 'ACTIVITY/* assets/app/fit_files/' + watchId + '/');
      cb();
    }
  }, 2000);
}

const VID = 2334;
const PID = 9674;
export default function watch(cb) {
  if (usb.findByIds(VID, PID)) {
    syncFiles(cb);
  }
  usb.on('attach', Meteor.bindEnvironment((device) => {
    if (device.deviceDescriptor.idVendor === VID && device.deviceDescriptor.idProduct === PID) {
      syncFiles(cb);
    }
  }));
}
