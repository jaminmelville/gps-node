class Activities extends React.Component {



  render() {
    var activityNodes = this.props.activities.map((activity, index) => {
      var distance = parseInt(activity.distance)/1000
      var date = new Date(parseInt(activity.start_time)*1000)
      var minutes = parseInt(activity.elapsed_time / 60)
      var seconds = activity.elapsed_time % 60
      var speed = distance / ( parseInt(activity.elapsed_time) / 3600)

      var tags = activity.tags.map((tag, index) => {
        return (
          <span className="activities__tag label" key={index}>{tag.name}</span>
        )
      })

      var onClick = () => {
        location.href = '/activity/' + activity.id
      }

      return (
        <li className="small-12 medium-4 large-3 columns activities__wrap" onClick={onClick} key={index} >
          <div className="activities__item">
            <div className='row text-center'>
              <div className='activities__value columns small-4'>
                <div className='activities__number'>{distance.toFixed(2)}</div>
                <div className='activities__unit'>km</div>
              </div>
              <div className='activities__value columns small-4'>
                <div className='activities__number'>{minutes}:{zeroPad(seconds, 2)}</div>
                <div className='activities__unit'>mm:ss</div>
              </div>
              <div className='activities__value columns small-4'>
                <div className='activities__number'>{speed.toFixed(2)}</div>
                <div className='activities__unit'>km/h</div>
              </div>
            </div>
            <div className="activities__date text-center">
              {date.getHours()}:{zeroPad(date.getMinutes(), 2)} -&nbsp;
              {weekday[date.getDay()]} -&nbsp;
              {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}
            </div>
            <div className="activities__tags">
              {tags}
            </div>
          </div>
        </li>
      )
    })
    return (
      <ul className="activities row">
        {activityNodes}
      </ul>
    )
  }

}
