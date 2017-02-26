import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Records } from '../api/records';
import Stats from './home/Stats';
import Chart from './home/Chart';
import Activities from './home/Activities';
import Options from './Options';
import Section from './Section';
import Layout from './Layout';
import { SECONDS_SINCE_1990 } from '../../lib/util';

class Home extends React.Component {

  componentDidMount() {
    document.title = 'GPS - HOME';
  }

  render() {
    if (this.props.loading) {
      return (<div>Loading..</div>);
    }
    function changeTheme(theme) {
      Session.setPersistent("theme", theme);
    }

    let newActivities = '';
    if (this.props.newSessions.length) {
      newActivities = (
        <Section title="New">
          <Activities activities={this.props.newSessions} />
        </Section>
      );
    }

    const sections = (
      <div>
        <Section title="Stats">
          <Stats activities={this.props.sessions} />
        </Section>
        <Section title="Chart">
          <Chart activities={this.props.sessions} />
        </Section>
        {newActivities}
        <Section title="Activities">
          <Activities activities={this.props.sessions} />
        </Section>
      </div>
    );

    const options = [
      { name: 'Pink', value: 'pink', onClick: changeTheme },
      { name: 'Green', value: 'green', onClick: changeTheme },
      { name: 'Blue', value: 'blue', onClick: changeTheme },
      { name: 'Purple', value: 'purple', onClick: changeTheme },
      { name: 'Orange', value: 'orange', onClick: changeTheme },
      { name: 'Red', value: 'red', onClick: changeTheme },
    ];
    return (
      <Layout>
        <div className="home">
          {sections}
          <Options options={options} />
        </div>
      </Layout>
    );
  }

}

Home.propTypes = {
  sessions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default createContainer(() => {
  const sessionsHandle = Meteor.subscribe('sessions');
  Meteor.subscribe('theme', { theme: Session.get('theme') });
  const filters = Session.get('filters');
  const tgt = ((new Date(filters.date.start)).getTime() / 1000) - SECONDS_SINCE_1990;
  const tlt = ((new Date(filters.date.end)).getTime() / 1000) - SECONDS_SINCE_1990;
  const loading = !sessionsHandle.ready();
  const excludeTags = [];
  const includeTags = [];
  Object.keys(filters.tags).forEach((tag) => {
    if (filters.tags[tag] === 'include') {
      includeTags.push(tag);
    } else {
      excludeTags.push(tag);
    }
  });
  const query = {
    total_distance: {
      $gt: filters.distance.min * 100000,
      $lt: filters.distance.max * 100000,
    },
    timestamp: {
      $gt: tgt,
      $lt: tlt,
    },
    tags: { $ne: [] },
  };
  if (includeTags.length) {
    query.tags.$all = includeTags;
  }
  if (excludeTags.length) {
    query.tags.$not = { $in: excludeTags };
  }
  return {
    sessions: Records.find(query, { sort: [['timestamp', 'desc']] }).fetch(),
    loading,
    newSessions: Records.find({ tags: [], type: 'session' }, { sort: [['timestamp', 'desc']] }).fetch()
  };
}, Home);
