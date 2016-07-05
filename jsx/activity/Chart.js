class Chart extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      type: 'speed'
    }
    this.onOptionClick = this.onOptionClick.bind(this)
    this.createChart = this.createChart.bind(this)
    this.units = {
      speed: 'km/h',
      'average speed': 'km/h',
      distance: 'km'
    }
  }

  onOptionClick(value) {
    this.setState({type: value})
  }

  componentDidUpdate(prevProps, prevState) {
    $('.chart').highcharts().destroy()
    this.createChart()
  }

  componentDidMount() {
    this.createChart()
  }

  createChart() {
    var data = []
    var totalDistance = 0
    var totalTime = 0
    for (var i = 0; i < records.length - 1; i++) {
      var distance = getDistance(records[i], records[i+1]) // meters
      var time = records[i+1].time - records[i].time //seconds
      var speed = distance / time * 3.6 // km/h
      totalDistance += distance
      totalTime += time
      data.push({
        time: (records[i+1].time - records[0].time)/ 60,
        speed: speed,
        'average speed': totalDistance / totalTime * 3.6,
        distance: totalDistance / 1000
      })
    }

    var averageValue = data.reduce((average, point) => {
      return average + point[this.state.type] / data.length
    }, 0)

    $('.chart').highcharts({
        chart: {
            type: 'spline',
            height: 250
        },
        title: {
            text: ''
        },
        xAxis: {
            title: {
                text: 'Minutes',
                style: {
                  color: '#ffffff',
                  'font-size': '1rem'
                }
            },
            gridLineDashStyle: 'Dot',
            gridLineColor: '#FFFFFF',
            gridLineWidth: 1,
            tickInterval: null, //change interval
            labels: {
              style: {
                color: '#ffffff'
              }
            }
        },
        yAxis: {
            title: {
                text: this.units[this.state.type],
                style: {
                  color: '#ffffff',
                  'font-size': '1rem'
                }
            },
            gridLineDashStyle: 'Dot',
            gridLineColor: '#FFFFFF',
            min: data.reduce((min, point) => {
              var value = point[this.state.type]
              return value < min ? value : min
            }, averageValue),
            max: data.reduce((max, point) => {
              var value = point[this.state.type]
              return (value > max && value < 1.2 * max) ? value : max
            }, averageValue),
            labels: {
              style: {
                color: '#ffffff'
              }
            }
        },
        plotOptions: {
          spline:{
            lineWidth: 4,
            color: PRIMARY_COLOR,
            events: {
              click: (e) => {
                MyEvent.emit('gps point', records[e.point.index])
              }
            }
          }
        },
        tooltip: {
            headerFormat: '<span class="label">',
            pointFormat:  '{point.y:.1f} ' + this.units[this.state.type],
            footerFormat: '</span>',
            shared: true,
            useHTML: true
        },
        series: [{
            data: data.map((point) => {
              return [point.time, point[this.state.type]]
            }),
            showInLegend: false
        }]
    })
  }

  render() {
    var options = [
      {name: 'Speed', value: 'speed', onClick: this.onOptionClick},
      {name: 'Average speed', value: 'average speed', onClick: this.onOptionClick},
      {name: 'Distance', value: 'distance', onClick: this.onOptionClick}
    ]
    return (
      <div className='graph'>
        <div className='chart' />
        <Options options={options} />
      </div>
    )
  }

}
