class Chart extends React.Component {

  constructor (props, context) {
    super(props, context)
    this.createChart = this.createChart.bind(this)
    this.state = {
      type: 'speed'
    }
    this.onOptionClick = this.onOptionClick.bind(this)
    this.units = {
      'speed': 'km/h',
      'distance': 'km'
    }
  }

  createChart() {
    var min = 10000
    var max = 0
    var activities = this.props.activities.slice(0).reverse()
    var points = activities.map((activity) => {
      var distance = parseInt(activity.distance)/1000
      var time = parseInt(activity.elapsed_time)
      var speed = distance / (time / 3600)
      if (speed < min) {
        min = speed
      }
      else if (speed > max) {
        max = speed
      }
      return {speed:speed, distance: distance}
    })
    var data = points.map((point) => {
      return point[this.state.type]
    })
    var numberOfActivities = activities.length
    $('.chart').highcharts({
        chart: {
            type: 'column',
            height: 250,
            bakgroundColor: 'transparent'
        },
        title: {
            text: ''
        },
        xAxis: {
          visible: false
        },
        yAxis: {
          visible: false,
          min: this.state.type === 'speed' ? min : null,
          max: this.state.type === 'speed' ? max : null
        },
        plotOptions: {
            column: {
                color: PRIMARY_COLOR,
                pointPadding: 0,
                borderWidth: 0,
                groupPadding: 0.1,

                events: {
                  click: (e) => {
                     var index = numberOfActivities - e.point.index -1
                     var $active = $('#activities .activities__item')
                       .removeClass('activities__item--active')
                       .eq(index)
                       .addClass('activities__item--active')
                     var scrollTop = $active.offset().top - ($(window).height() - $active.height()) / 2
                     $('html,body').animate({ scrollTop: scrollTop }, 400)
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
            data: data,
            showInLegend: false
        }]
    })
  }

  componentDidUpdate(prevProps, prevState) {
    $('.chart').highcharts().destroy()
    this.createChart()
  }

  componentDidMount() {
    this.createChart()
  }

  onOptionClick(value) {
    this.setState({type: value})
  }

  render() {
    var options = [
      {name: 'Speed', value: 'speed', onClick: this.onOptionClick},
      {name: 'Distance', value: 'distance', onClick: this.onOptionClick}
    ]
    return (
      <div>
        <div className="chart"></div>
        <Options options={options}/>
      </div>
    )
  }
}
