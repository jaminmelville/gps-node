class Stats extends React.Component {

  render() {
    var distance = parseInt(this.props.activity.distance) / 1000
    var duration = this.props.activity.elapsed_time
    var speed = distance / (duration / 3600)
    var date = new Date(parseInt(this.props.activity.start_time)*1000)

    return (
      <div className='stats'>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Date</div>
          <div className='columns small-6 medium-2 large-2'>{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Day</div>
          <div className='columns small-6 medium-2 large-2'>{weekday[date.getDay()]}</div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Time</div>
          <div className='columns small-6 medium-2 large-2'>{date.getHours()}:{zeroPad(date.getMinutes(), 2)}</div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Distance</div>
          <div className='columns small-6 medium-2 large-2'>{distance.toFixed(2)} km</div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Duration</div>
          <div className='columns small-6 medium-2 large-2'>{parseInt((duration) / 60)}M {parseInt(duration % 60)}S</div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Speed</div>
          <div className='columns small-6 medium-2 large-2'>{speed.toFixed(2)} km/h</div>
        </div>
      </div>
    )
  }

}
