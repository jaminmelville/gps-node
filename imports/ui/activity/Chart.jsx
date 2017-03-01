import React from 'react';
import { Session } from 'meteor/session';
import Options from '../Options';
import HighChart from '../HighChart';
import { getDistance, colors } from '../../../lib/util';

export default class Chart extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      type: 'speed',
    };
    this.onOptionClick = this.onOptionClick.bind(this);
    this.units = {
      speed: 'km/h',
      'average speed': 'km/h',
      distance: 'km',
      elevation: 'm',
    };
    this.getChartOptions = this.getChartOptions.bind(this);
  }

  onOptionClick(value) {
    this.setState({ type: value });
  }

  getChartOptions() {
    const data = [];
    let totalDistance = 0;
    let totalTime = 0;
    let previousLocation = false;
    const startTime = this.props.records[0].timestamp;

    this.props.records.forEach((record, index) => {
      switch (record.type) {
        case 'record':
          if (previousLocation) {
            const distance = getDistance(previousLocation, record);
            const time = record.timestamp - previousLocation.timestamp;
            const speed = (distance / time) * 3.6;
            totalDistance += distance;
            totalTime += time;
            data.push({
              time: (record.timestamp - startTime) / 60,
              speed,
              'average speed': (totalDistance / totalTime) * 3.6,
              distance: totalDistance / 1000,
              elevation: record.elevation ? record.elevation : 0,
            });
          }
          previousLocation = record;
          break;
        case 'event':
          if (record.event_type === 0 && index !== 0) {
            // start..
            data.push({
              time: (record.timestamp - startTime) / 60,
              speed: 0,
              'average speed': 0,
              distance: 0,
              elevation: 0,
            });
          } else if (record.event_type === 4 && index !== this.props.records.length - 1) {
            // stop..
            data.push({
              time: (record.timestamp - startTime) / 60,
              speed: 0,
              'average speed': 0,
              distance: 0,
              elevation: 0,
            });
          }
          break;
        case 'lap':

          break;

        default:
          break;
      }
    });

    const averageValue = data.reduce((average, point) =>
      average + (point[this.state.type] / data.length)
    , 0);

    const chartOptions = {
      chart: {
        type: 'spline',
        height: 250,
      },
      title: {
        text: '',
      },
      xAxis: {
        title: {
          text: 'Minutes',
          style: {
            color: '#ffffff',
            'font-size': '1rem',
          },
        },
        gridLineDashStyle: 'Dot',
        gridLineColor: '#FFFFFF',
        gridLineWidth: 1,
        tickInterval: null, // change interval
        labels: {
          style: {
            color: '#ffffff',
          },
        },
      },
      yAxis: {
        title: {
          text: this.units[this.state.type],
          style: {
            color: '#ffffff',
            'font-size': '1rem',
          },
        },
        gridLineDashStyle: 'Dot',
        gridLineColor: '#FFFFFF',
        min: data.reduce((min, point) => {
          const value = point[this.state.type];
          return value < min ? value : min;
        }, averageValue),
        max: data.reduce((max, point) => {
          const value = point[this.state.type];
          return (value > max && value < 1.2 * max) ? value : max;
        }, averageValue),
        labels: {
          style: {
            color: '#ffffff',
          },
        },
      },
      plotOptions: {
        spline: {
          lineWidth: 4,
          color: colors[Session.get('theme')],
          events: {
            click: (e) => {
              // MyEvent.emit('gps point', records[e.point.index]);
            },
          },
        },
      },
      tooltip: {
        headerFormat: '<span class="label">',
        pointFormat: '{point.y:.1f} ' + this.units[this.state.type],
        footerFormat: '</span>',
        shared: true,
        useHTML: true,
      },
      series: [{
        data: data.map(point =>
          [point.time, point[this.state.type]],
        ),
        showInLegend: false,
      }],
    };
    return chartOptions;
  }

  render() {
    const options = [
      { name: 'Speed', value: 'speed', onClick: this.onOptionClick },
      { name: 'Average speed', value: 'average speed', onClick: this.onOptionClick },
      { name: 'Elevation', value: 'elevation', onClick: this.onOptionClick },
      { name: 'Distance', value: 'distance', onClick: this.onOptionClick },
    ];
    return (
      <div className="graph">
        <HighChart options={this.getChartOptions()} />
        <Options options={options} />
      </div>
    );
  }

}
