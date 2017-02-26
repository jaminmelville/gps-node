import React from 'react';

export default class Tag extends React.Component {

  render() {
    let state = '';
    if (typeof(this.props.state) !== 'undefined') {
      let icon;
      switch (this.props.state) {
        case 1:
          icon = '✔';
          break;
        case 0:
          icon = '-';
          break;
        case -1:
          icon = '✗';
          break;
        default:
      }
      state = (
        <div className="tag__state">
          {icon}
        </div>
      );
    }

    const isClickable = typeof(this.props.onClick) === 'function';
    return (
      <div
        className={'tag' + (isClickable ? ' tag--clickable' : '')}
        onClick={this.props.onClick}
        >
        <div className="tag__name">
          {this.props.name}
        </div>
        {state}
      </div>
    );
  }

}
