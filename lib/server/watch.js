import fit from './fit';

const usb = require('usb');
const exec = require('child_process').exec;
const fs = require('fs');

export function syncFiles(cb) {
  setTimeout(() => {
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
      exec('rsync -avhzP ' + watchPath + 'ACTIVITY/ assets/app/fit_files/' + watchId + '/', (e,r,s) => {
        console.log(r)
        cb();
      });
    }
  }, 2000);
}

const VID = 2334;
const PID = 9674;
export default function watch(cb) {
  if (usb.findByIds(VID, PID)) {
    syncFiles(cb);
  }

  usb.on('attach', (device) => {
    if (device.deviceDescriptor.idVendor === VID && device.deviceDescriptor.idProduct === PID) {
      syncFiles(cb);
    }
  });
}
