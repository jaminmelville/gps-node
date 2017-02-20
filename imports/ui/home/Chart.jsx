import React from 'react';
import Options from '../Options.jsx';
import HighChart from '../HighChart.jsx';
import { Session } from 'meteor/session';
import { colors } from '../../../lib/util.js';

export default class Chart extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      type: 'speed',
    };
    this.onOptionClick = this.onOptionClick.bind(this);
    this.getChartOptions = this.getChartOptions.bind(this);
    this.units = {
      speed: 'km/h',
      distance: 'km',
    };
  }

  onOptionClick(value) {
    this.setState({ type: value });
  }

  getChartOptions() {
    let min = 10000;
    let max = 0;
    const activities = this.props.activities.slice(0).reverse();
    const points = activities.map((activity) => {
      const distance = activity.getKms();
      const speed = activity.getSpeed();
      if (speed < min) {
        min = speed;
      }
      else if (speed > max) {
        max = speed;
      }
      return { speed, distance };
    });
    const data = points.map(point =>
      point[this.state.type],
    );
    const numberOfActivities = activities.length;
    const chartOptions = {
      chart: {
        type: 'column',
        height: 250,
        bakgroundColor: 'transparent',
      },
      title: {
        text: '',
      },
      xAxis: {
        visible: false,
      },
      yAxis: {
        visible: false,
        min: this.state.type === 'speed' ? min : null,
        max: this.state.type === 'speed' ? max : null,
      },
      plotOptions: {
        column: {
          color: colors[Session.get('theme')],
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0.1,
          events: {
            click: (e) => {
              const index = numberOfActivities - e.point.index -1;
              const $active = $('#activities .activities__item')
              .removeClass('activities__item--active')
              .eq(index)
              .addClass('activities__item--active');
              const scrollTop = $active.offset().top - ($(window).height() - $active.height()) / 2;
              $('html,body').animate({ scrollTop }, 400);
            },
          },
        },
      },
      tooltip: {
        headerFormat: '<span class="label">',
        pointFormat:  '{point.y:.1f} ' + this.units[this.state.type],
        footerFormat: '</span>',
        shared: true,
        useHTML: true,
      },
      series: [{
        data,
        showInLegend: false,
      }],
    };
    return chartOptions;
  }

  render() {
    const options = [
      { name: 'Speed', value: 'speed', onClick: this.onOptionClick },
      { name: 'Distance', value: 'distance', onClick: this.onOptionClick },
    ];
    return (
      <div>
        <HighChart options={this.getChartOptions()} />
        <Options options={options} />
      </div>
    );
  }
}
