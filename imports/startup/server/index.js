import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import fit from '../../../lib/server/fit';
import watch from '../../../lib/server/watch';
import { Records } from '../../api/records';

const fs = require('fs');

function setElevations() {
  const interval = Meteor.setInterval(() => {
    const records = Records.find(
      { type: 'record', elevation: { $exists: false } },
      { limit: 100 },
    ).fetch();

    if (records.length) {
      const locations = records.map((r) => {
        return r.getLat() + ',' + r.getLong();
      }).join('|');

      const url = 'http://maps.googleapis.com/maps/api/elevation/json?locations=' + locations;
      const results = HTTP.call('GET', url);
      results.data.results.forEach((result, index) => {
        Records.update({ _id: records[index]._id }, { $set: { elevation: result.elevation } });
      });
    } else {
      Meteor.clearInterval(interval);
    }
  }, 1000);
}

setElevations();

function addNewRecords() {
  const fitFilesPath = 'assets/app/fit_files/';
  const activities = Records.find({ type: 'session' }).map(record => record.activity_id);
  const directories = fs.readdirSync(fitFilesPath);
  directories.forEach((directory) => {
    const fitFiles = fs.readdirSync(`${fitFilesPath}/${directory}`);
    fitFiles.forEach((fitFile) => {
      const fitFilePath = `${directory}/${fitFile}`;
      if (activities.indexOf(fitFilePath) < 0) {
        const records = fit(`assets/app/fit_files/${fitFilePath}`);
        // @TODO: make atomic with inserts below..
        records.forEach((record) => {
          const fields = {
            activity_id: fitFilePath,
            type: record.type,
          };
          if (record.type === 'session') {
            fields.tags = [];
            fields.notes = '';
          }
          const data = Object.assign(fields, record.data);
          Records.insert(data);
        });
        setElevations();
      }
    });
  });
}

watch(addNewRecords);
