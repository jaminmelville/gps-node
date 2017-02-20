import React from 'react';

export default class Stats extends React.PureComponent {

  render() {
    let totalDistance = 0;
    let time = 0;
    this.props.activities.forEach((activity) => {
      totalDistance += activity.getKms();
      time += activity.getTimerTime();
    });
    let yearEstimate = 0;
    const count = this.props.activities.length;
    if (count > 1) {
      const duration = this.props.activities[0].timestamp - this.props.activities[count - 1].timestamp;
      yearEstimate = (totalDistance * ((count - 1) / count) * (365.25 * 24 * 60 * 60)) / duration;
    }
    const averageDistance = totalDistance / this.props.activities.length;
    const speed = totalDistance / (time / 3600);

    return (
      <div className="stats">
        <div className="stats__row">
          <div className="stats__property">Total distance</div>
          <div className="stats__value">{totalDistance.toFixed(2)} km</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Total activities</div>
          <div className="stats__value">{this.props.activities.length}</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Total time</div>
          <div className="stats__value">
            {parseInt(time / 3600, 10)}H {parseInt((time % 3600) / 60, 10)}M
          </div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Average speed</div>
          <div className="stats__value">{speed.toFixed(2)} km/h</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Average distance</div>
          <div className="stats__value">{averageDistance.toFixed(2)} km</div>
        </div>
        <div className="stats__row">
          <div className="stats__property">Yearly estimate</div>
          <div className="stats__value">{yearEstimate.toFixed(2)} km</div>
        </div>
      </div>
    );
  }

}
