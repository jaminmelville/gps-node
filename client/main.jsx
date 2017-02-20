import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { renderRoutes } from '../imports/startup/client/routes';

Meteor.startup(() => {
  Session.setDefault('theme', 'green');
  Session.setDefault('filters', {
    distance: {
      min: 0,
      max: 0,
    },
    date: {
      start: 0,
      end: 0,
    },
    tags: {},
  });
  render(renderRoutes(), document.getElementById('app'));
});
