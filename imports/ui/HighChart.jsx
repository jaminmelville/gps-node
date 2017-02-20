import React from 'react';

const Highcharts = require('highcharts');

export default class HighChart extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.renderGraph = this.renderGraph.bind(this);
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.chart.destroy();
    this.renderGraph();
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  renderGraph() {
    this.chart = Highcharts.chart(this.refs.chart, this.props.options);
  }

  render() {
    return (
      <div ref="chart" />
    );
  }

}
