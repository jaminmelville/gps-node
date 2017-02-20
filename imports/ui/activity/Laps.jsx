import React from 'react';
import Options from '../Options';
import { zeroPad } from '../../../lib/util';

export default class Laps extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      option: 'time',
    };
    this.onOptionClick = this.onOptionClick.bind(this);
  }

  onOptionClick(value) {
    this.setState({ option: value });
  }

  render() {
    const lapNodes = this.props.laps.map((lap, index) => {
      const time = parseInt((lap.getTimerTime()) / 60) + 'M ' + zeroPad(parseInt(lap.getTimerTime() % 60), 2) + 'S';
      const speed = lap.getSpeed();
      return (
        <li className="laps__row" key={lap._id}>
          <div className="laps__distance">
            {(index + lap.getKms()).toFixed(2)}
          </div>
          <div className="laps__value">
            {this.state.option === 'time' ? time : speed.toFixed(2) + ' km/h'}
          </div>
        </li>
      );
    })
    const options = [
      { name: 'Time', value: 'time', onClick: this.onOptionClick },
      { name: 'Speed', value: 'speed', onClick: this.onOptionClick },
    ];
    return (
      <div>
        <ul className="laps">
          {lapNodes}
        </ul>
        <Options options={options} />
      </div>
    );
  }

}
