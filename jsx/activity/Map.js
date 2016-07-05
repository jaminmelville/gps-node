class Map extends React.Component {

  constructor (props, context) {
    super(props, context)
    this.createMap = this.createMap.bind(this)
    this.onOptionClick = this.onOptionClick.bind(this)
    this.createTrackingDot = this.createTrackingDot.bind(this)
    this.setTrackingDot = this.setTrackingDot.bind(this)
    this.state = {
      googleLoaded: false
    }
  }

  createMap() {
    this.setState({googleLoaded: true})

    var mapProperties = {
      styles: [
        {
          "stylers": [
            { "saturation": -100 }
          ]
        }
      ],
      mapTypeId:google.maps.MapTypeId.ROADMAP,
      panControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel:  false
    }
    this.map = new google.maps.Map(document.getElementById("googleMap"), mapProperties)

    // Add start and finish markers to map.
    new google.maps.Marker({
      position: new google.maps.LatLng(
        records[0].latitude,
        records[0].longitude
      ),
      map: this.map,
      icon: '/images/LapDot.png',
      title: 'Start'
    })
    new google.maps.Marker({
      position: new google.maps.LatLng(
        records[records.length-1].latitude,
        records[records.length-1].longitude
      ),
      map: this.map,
      icon: '/images/LapDot.png',
      title: 'Finish'
    })
    // Add lap markers to map.
    var laps = 0
    var distance = 0
    for (var i = 0; i < records.length - 1; i++) {
      distance += getDistance(records[i], records[i+1])
      if (distance >= 1000) {
        laps++
        new google.maps.Marker({
          position: new google.maps.LatLng(
            records[i].latitude,
            records[i].longitude
          ),
          map: this.map,
          icon: '/images/LapDot.png',
          title: laps + ' km'
        })
        distance -= 1000
      }
    }

    var coordinates = records.map((record) => {
      return new google.maps.LatLng(
        record.latitude,
        record.longitude
      )
    })

    var bounds = new google.maps.LatLngBounds()
    coordinates.forEach((coordinate) => {
      bounds.extend(coordinate)
    })
    this.map.fitBounds(bounds)

    var runPath = new google.maps.Polyline({
      path:coordinates,
      strokeColor: PRIMARY_COLOR,
      strokeOpacity: 1,
      strokeWeight: 4
    })
    runPath.setMap(this.map)
    this.createTrackingDot(records[0])
  }

  createTrackingDot(point) {
    this.trackingDot = new google.maps.Marker({
      position: new google.maps.LatLng(
        point.latitude,
        point.longitude
      ),
      map: this.map,
      icon: '/images/TrackingDot.png'
    })
  }

  setTrackingDot(point) {
    this.trackingDot.setPosition(new google.maps.LatLng(
      point.latitude,
      point.longitude
    ))
  }

  componentDidMount() {
    if (typeof(google) !== 'undefined') {
      google.maps.event.addDomListener(window, 'load', this.createMap)
      MyEvent.listen('gps point', this.setTrackingDot)
    }
  }

  onOptionClick(value) {
    this.map.setMapTypeId(value)
  }

  render() {
    if (!this.state.googleLoaded) {
      return (
        <div className='callout'>
          <h5>Maps are down!</h5>
          <p>This is most likely because you are not connected to the internet.</p>
        </div>
      )
    }
    var options = [
      {name: 'Standard', onClick: this.onOptionClick, value: google.maps.MapTypeId.ROADMAP},
      {name: 'Satellite', onClick: this.onOptionClick, value: google.maps.MapTypeId.SATELLITE}
    ]
    return (
      <div className='map'>
        <div id='googleMap'/>
        <Options options={options}/>
      </div>
    )
  }

}
