class Stats extends React.Component {

  render() {
    var total_distance = 0
    var time = 0
    var activityNodes = this.props.activities.forEach((activity) => {
      total_distance += parseInt(activity.distance) / 1000
      time += parseInt(activity.elapsed_time)
    })
    var average_distance = total_distance / this.props.activities.length
    var speed = total_distance / (time / 3600)
    return (
      <div className='stats'>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Total distance</div>
          <div className='columns small-6 medium-2 large-2'>{total_distance.toFixed(2)} km</div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Total activities</div>
          <div className='columns small-6 medium-2 large-2'>{this.props.activities.length}</div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Total time</div>
          <div className='columns small-6 medium-2 large-2'>{parseInt(time/60/60)}H {parseInt((time%3600)/60)}M </div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Average speed</div>
          <div className='columns small-6 medium-2 large-2'>{speed.toFixed(2)} km/h</div>
        </div>
        <div className='row'>
          <div className="columns small-6 medium-4 large-3 text-right">Average distance</div>
          <div className='columns small-6 medium-2 large-2'>{average_distance.toFixed(2)} km</div>
        </div>
      </div>
    )
  }

}
