import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Records } from '../../api/records.js';

class Tags extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    this.removeTag = this.removeTag.bind(this)
    this.addTag = this.addTag.bind(this)
  }

  removeTag(tag) {
    if (Records.find({ _id: this.props.session._id, tags: tag }).count()) {
      Records.update({ _id: this.props.session._id }, { $pull: { tags: tag } });
    }
  }

  addTag(tag) {
    Records.update({ _id: this.props.session._id }, { $push: { tags: tag } });
  }

  render() {
    if (this.props.loading) {
      return (<div>loading...</div>);
    }

    const allTags = this.props.sessions.map(a => a.tags).reduce((res, arr) => {
      arr.forEach((a) => {
        if (res.indexOf(a) < 0) {
          res.push(a);
        }
      });
      return res;
    }, []);
    const tagNodes = allTags.map((tag) => {
      const onClick = (e) => {
        if (e.target.checked) {
          this.addTag(tag);
        } else {
          this.removeTag(tag);
        }
      };
      const checked = this.props.session.tags.indexOf(tag) >= 0;
      return (
        <div className="tags__item" key={tag}>
          <input type="checkbox" onChange={onClick} checked={checked} />
          {tag}
        </div>
      );
    });
    const createTag = (event) => {
      if (event.key === 'Enter' && event.target.value) {
        this.addTag(event.target.value.toLowerCase());
        event.target.value = '';
      }
    }
    return (
      <div className="row tags">
        {tagNodes}
        Add new: <input type="text" onKeyUp={createTag} />
      </div>
    );
  }
}

Tags.propTypes = {
  session: React.PropTypes.object.isRequired,
};

export default createContainer((props) => {
  const handle = Meteor.subscribe('sessions');
  const loading = !handle.ready();
  return {
    loading,
    session: props.session,
    sessions: Records.find({ type: 'session' }).fetch(),
  };
}, Tags);
