class Laps extends React.Component {

  constructor (props, context) {
    super(props, context)

    var records = props.records
    this.laps = []
    var distance = 0
    var start_time = records[0].time

    for (var i = 0; i < records.length - 1; i++) {
      distance += getDistance(records[i], records[i + 1])
      if (distance >= 1000) {
        var time = records[i + 1].time - start_time
        this.laps.push({
          distance: 1,
          time: parseInt(time/60) + 'm ' + this.zeroPad(time%60, 2) + 's',
          speed: (1 / time * 60 * 60).toFixed(2) + ' km/h'
        })
        start_time = records[i + 1].time
        distance -= 1000
      }
    }
    var time = records[records.length - 1].time - start_time
    this.laps.push({
      distance: distance/1000,
      time: parseInt(time/60) + 'm ' + this.zeroPad(time%60, 2) + 's',
      speed: (distance/1000 / time * 60 * 60).toFixed(2) + ' km/h'
    })
    this.state = {
      option: 'time'
    }
    this.onOptionClick = this.onOptionClick.bind(this)
  }

  zeroPad(num, places) {
    var zero = places - num.toString().length + 1
    return Array(+(zero > 0 && zero)).join("0") + num
  }

  onOptionClick(value) {
    this.setState({'option': value})
  }

  render() {
    var lapNodes = this.laps.map((lap, index) => {
      return (
        <li className='row' key={index}>
          <div className='columns small-6 medium-3 large-2 text-right'>
            {(index + lap.distance).toFixed(2)}
          </div>
          <div className='columns small-6 medium-3 large-2'>
            {lap[this.state.option]}
          </div>
        </li>
      )
    })
    var options = [
      {name: 'Time', value: 'time', onClick: this.onOptionClick},
      {name: 'Speed', value: 'speed', onClick: this.onOptionClick}
    ]
    return (
      <div>
        <ul className="laps">
          {lapNodes}
        </ul>
        <Options options={options}/>
      </div>
    )
  }

}
