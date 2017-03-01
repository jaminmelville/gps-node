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
    const paused = elapsed_time - timer_time;
    const secondsPerKm = timer_time / distance;

    return (
      <div className="stats">
        <div className="stats__row">
          <div className="stats__property">Start</div>
          <div className="stats__value">
            {date.getHours()}:{zeroPad(date.getMinutes(), 2)}
            &nbsp;{weekday[date.getDay()]}&nbsp;
            {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
          </div>
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
          <div className="stats__property">Duration</div>
          <div className="stats__value">
            {parseInt((timer_time) / 60)}M {parseInt(timer_time % 60)}S
            {paused > 0 ? ' ( +' + parseInt((paused) / 60) + 'M ' + parseInt(paused % 60) + 'S Paused )' : null}
          </div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Speed</div>
          <div className="stats__value">{speed.toFixed(2)} km/h ( {parseInt(secondsPerKm / 60)}M {(secondsPerKm % 60).toFixed(2)} min/km )</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Vertical distance</div>
          <div className="stats__value">{this.props.verticalMeters.toFixed(2)} m</div>
        </div>
      </div>
    );
  }

}
