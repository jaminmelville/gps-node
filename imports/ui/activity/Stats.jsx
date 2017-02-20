import React from 'react';
import { zeroPad, weekday } from '../../../lib/util.js';

export default class Stats extends React.Component {

  render() {
    const distance = this.props.session.getKms();
    const timer_time = this.props.session.getTimerTime();
    const elapsed_time = this.props.session.getElapsedTime();
    const speed = this.props.session.getSpeed();
    const calories = this.props.session.total_calories;
    const date = this.props.session.getDate();

    return (
      <div className="stats">
        <div className="stats__row">
          <div className="stats__property">Date</div>
          <div className="stats__value">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Day</div>
          <div className="stats__value">{weekday[date.getDay()]}</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Time</div>
          <div className="stats__value">{date.getHours()}:{zeroPad(date.getMinutes(), 2)}</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Distance</div>
          <div className="stats__value">{distance.toFixed(2)} km</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Calories</div>
          <div className="stats__value">{calories}</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Elapsed</div>
          <div className="stats__value">{parseInt((elapsed_time) / 60)}M {parseInt(elapsed_time % 60)}S</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Timer</div>
          <div className="stats__value">{parseInt((timer_time) / 60)}M {parseInt(timer_time % 60)}S</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Pause</div>
          <div className="stats__value">{parseInt((elapsed_time - timer_time) / 60)}M {parseInt((elapsed_time - timer_time) % 60)}S</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Speed</div>
          <div className="stats__value">{speed.toFixed(2)} km/h</div>
        </div>
      </div>
    );
  }

}
