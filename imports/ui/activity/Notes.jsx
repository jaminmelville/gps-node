import React from 'react';
import { Meteor } from 'meteor/meteor';
import { jQuery as $ } from 'meteor/jquery';
import { Records } from '../../api/records';

export default class Notes extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.timeout = 0;
    this.notes = props.session.notes;
    this.onChange = this.onChange.bind(this);
  }

  componentWillUpdate(props) {
    this.notes = props.session.notes;
  }

  onChange(event) {
    this.notes = event.target.value;
    $('.notes').addClass('notes--busy');
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      Records.update({ _id: this.props.session._id }, { $set: { notes: this.notes } });
      $('.notes').removeClass('notes--busy');
    }, 1000);
  }

  render() {
    return (
      <textarea className="notes" onChange={this.onChange} defaultValue={this.notes} />
    );
  }

}

Notes.propTypes = {
  session: React.PropTypes.object.isRequired,
};
