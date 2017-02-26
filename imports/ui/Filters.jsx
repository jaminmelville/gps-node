import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Records } from '../api/records';
import Layout from './Layout';
import Tag from './Tag';

class Filters extends React.Component {

  componentDidMount() {
    document.title = 'GPS - FILTERS';
  }

  render() {
    // @TODO: Don't alter props. Create clone.
    const filters = this.props.filters;

    const setDate = (event) => {
      const start = this.refs.start.value;
      const end = this.refs.end.value;
      // @TODO: Don't alter props.
      filters.date = {
        start,
        end,
      };
      Session.setPersistent('filters', filters);
    };

    const setDistances = (event) => {
      filters.distance = {
        min: event[0],
        max: event[1],
      };
      Session.setPersistent('filters', filters);
    };

    const stepSize = 0.1;
    const tags = this.props.tags.sort().map((tag) => {
      const state = (tag in filters.tags) ? filters.tags[tag] : 'ignore';
      const onClick = () => {
        if (state === 'ignore') {
          filters.tags[tag] = 'include';
        } else if (state === 'include') {
          filters.tags[tag] = 'exclude';
        } else {
          delete filters.tags[tag];
        }
        Session.setPersistent('filters', filters);
      }
      const states = {
        'include': 1,
        'exclude': -1,
        'ignore': 0,
      }
      return (
        <Tag name={tag} key={tag} onClick={onClick} state={states[state]} />
      );
    })
    return (
      <Layout>
        <div className="filters">
          <h2>Distance</h2>
          <div className="filters__row">
            <div className="filters__distance">
              {this.props.filters.distance.min} km
            </div>
            <Range
              value={[this.props.filters.distance.min,this.props.filters.distance.max]}
              min={this.props.min - stepSize > 0 ? this.props.min - stepSize : 0}
              max={this.props.max + stepSize}
              step={ stepSize }
              onChange={setDistances}
              className="filters__range"
            />
            <div className="filters__distance">
              {this.props.filters.distance.max} km
            </div>
          </div>
          <h2>Date</h2>
          <div className="filters__row">
            <div>
              Start Date: <input
                ref="start"
                type="date"
                onChange={setDate}
                defaultValue={this.props.filters.date.start}
              />
            </div>
            <div>
              End Date: <input
                ref="end"
                type="date"
                onChange={setDate}
                defaultValue={this.props.filters.date.end}
              />
            </div>
          </div>
          <div>
            <h2>Tags</h2>
            <ul className="filters__tags">
              {tags}
            </ul>
          </div>
        </div>
      </Layout>
    );
  }

}

export default createContainer(() => {
  const sessionsHandle = Meteor.subscribe('sessions');
  Meteor.subscribe('filters', { filters: Session.get('filters') });
  let max = 0;
  if (Records.find({}, { sort: [['total_distance', 'desc']], limit: 1 }).count()) {
    max = Records.find({}, { sort: [['total_distance', 'desc']], limit: 1 }).fetch()[0].getKms();
  }
  let min = 0;
  if (Records.find({}, { sort: [['total_distance', 'desc']], limit: 1 }).count()) {
    min = Records.find({}, { sort: [['total_distance', 'asc']], limit: 1 }).fetch()[0].getKms();
  }
  let tags = [];
  if (sessionsHandle.ready()) {
    tags = Records.find({ type: 'session' }).map(a => a.tags).reduce((res, arr) => {
      arr.forEach((a) => {
        if (res.indexOf(a) < 0) {
          res.push(a);
        }
      });
      return res;
    }, []);
  }

  return {
    activities: Records.find({}, { sort: [['timestamp', 'desc']] }).fetch(),
    max,
    min,
    filters: Session.get('filters'),
    tags,
  };
}, Filters);
