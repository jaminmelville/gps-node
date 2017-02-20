import { Meteor } from 'meteor/meteor';
import fit from '../../../lib/server/fit';
import watch from '../../../lib/server/watch';
import { basePath } from '../../../lib/server/paths';
import { Records } from '../../api/records';

const fs = require('fs');

watch(Meteor.bindEnvironment(() => {
  const fitFilesPath = `${basePath}/private/fit_files/`;
  const activities = Records.find({ type: 'session' }).map(record => record.activity_id);
  const directories = fs.readdirSync(fitFilesPath);
  directories.forEach((directory) => {
    const fitFiles = fs.readdirSync(`${fitFilesPath}/${directory}`);
    fitFiles.forEach((fitFile) => {
      const fitFilePath = `${directory}/${fitFile}`;
      if (activities.indexOf(fitFilePath) < 0) {
        const records = fit(`${basePath}/private/fit_files/${fitFilePath}`);
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
      }
    });
  });
}));
