import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

class Layout extends React.Component {

  render() {
    return (
      <div className={'app' + ' ' + Session.get('theme')}>
        <ul className="menu menu--white">
          <li className="menu__item menu--active">
            <Link to="/">Home</Link>
          </li>
          <li className="menu__item">
            <Link to="/filters">Filters</Link>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }

}

export default createContainer(() => {
  Meteor.subscribe('theme', { theme: Session.get('theme') });
  return {
    theme: Session.get("theme"),
  };
}, Layout);
