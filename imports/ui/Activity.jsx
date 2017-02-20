import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Section from './Section';
import Map from './activity/Map';
import Stats from './activity/Stats';
import Laps from './activity/Laps';
import Chart from './activity/Chart';
import Notes from './activity/Notes';
import Tags from './activity/Tags';
import { Records } from '../api/records';
import Layout from './Layout';

class Activity extends React.Component {

  componentDidMount() {
    document.title = 'GPS - ACTIVITY';
  }

  render() {
    if (this.props.loading || !this.props.session) {
      return (<div>loading...</div>);
    }
    const sections = [
      <Section title="Stats" key="1">
        <Stats session={this.props.session} />
      </Section>,
      <Section title="Tags" tags={this.props.tags} key="2">
        <Tags session={this.props.session} />
      </Section>
    ];
    // The following sections are only available if it's a gps activity.
    sections.push(
      <Section title="Chart" key="3">
        <Chart records={this.props.combo} events={this.props.events} />
      </Section>,
      <Section title="Map" key="4">
        <Map records={this.props.records} laps={this.props.laps} />
      </Section>,
      <Section title="Laps" key="5">
        <Laps laps={this.props.laps} />
      </Section>,
    );
    sections.push(
      <Section title="Notes" key="6">
        <Notes session={this.props.session} />
      </Section>,
    );
    return (
      <Layout>
        <div className="activity">
          {sections}
        </div>
      </Layout>
    );
  }

}

export default createContainer((props) => {
  const handle = Meteor.subscribe('records', props.params.id);
  const loading = !handle.ready();
  return {
    loading,
    events: Records.find({ activity_id: props.params.id, type: 'event' }).fetch(),
    laps: Records.find({ activity_id: props.params.id, type: 'lap' }).fetch(),
    records: Records.find({ activity_id: props.params.id, type: 'record' }).fetch(),
    combo: Records.find({ activity_id: props.params.id, type: { $in: ['record', 'lap', 'event'] } }).fetch(),
    session: Records.findOne({ activity_id: props.params.id, type: 'session' }),
  };
}, Activity);
