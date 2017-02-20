import React from 'react';
import Options from '../Options.jsx';
import Maps from '../../../lib/client/maps.js';
import { Session } from 'meteor/session';
import { getDistance, colors } from '../../../lib/util.js';

export default class Map extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.createMap = this.createMap.bind(this);
    this.onOptionClick = this.onOptionClick.bind(this);
    this.createTrackingDot = this.createTrackingDot.bind(this);
    this.setTrackingDot = this.setTrackingDot.bind(this);
    this.state = {
      google: false,
    };
  }

  componentDidMount() {
    Maps((google) => {
      this.setState({ google }, this.createMap);
      // MyEvent.listen('gps point', this.setTrackingDot)
    });
  }

  onOptionClick(value) {
    this.map.setMapTypeId(value);
  }

  setTrackingDot(point) {
    this.trackingDot.setPosition(new this.state.google.maps.LatLng(
      point.getLat(),
      point.getLong(),
    ));
  }

  createMap() {
    const mapProperties = {
      styles: [
        {
          stylers: [
            { saturation: -100 },
          ],
        },
      ],
      mapTypeId: this.state.google.maps.MapTypeId.ROADMAP,
      panControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false,
    };
    this.map = new this.state.google.maps.Map(this.googleMap, mapProperties);

    // Add start marker to map.
    new this.state.google.maps.Marker({
      position: new this.state.google.maps.LatLng(
        this.props.records[0].getLat(),
        this.props.records[0].getLong(),
      ),
      map: this.map,
      icon: '/images/LapDot.png',
      title: 'Start',
    });

    // Add lap markers to map.
    this.props.laps.forEach((lap, index) => {
      let title = 'Finish';
      if (index !== this.props.laps.length - 1) {
        title = index + 1 + ' km';
      }
      new this.state.google.maps.Marker({
        position: new this.state.google.maps.LatLng(
          lap.getEndLat(),
          lap.getEndLong(),
        ),
        map: this.map,
        icon: '/images/LapDot.png',
        title,
      });
    });

    const coordinates = this.props.records.map((record) => {
      return new this.state.google.maps.LatLng(
        record.getLat(),
        record.getLong(),
      );
    });

    const bounds = new this.state.google.maps.LatLngBounds();
    coordinates.forEach((coordinate) => {
      bounds.extend(coordinate);
    });
    this.map.fitBounds(bounds);

    const runPath = new this.state.google.maps.Polyline({
      path: coordinates,
      strokeColor: colors[Session.get('theme')],
      strokeOpacity: 1,
      strokeWeight: 4,
    });
    runPath.setMap(this.map);
    this.createTrackingDot(this.props.records[0]);
  }

  createTrackingDot(point) {
    this.trackingDot = new this.state.google.maps.Marker({
      position: new this.state.google.maps.LatLng(
        point.getLat(),
        point.getLong(),
      ),
      map: this.map,
      icon: '/images/TrackingDot.png',
    });
  }

  render() {
    if (!this.state.google) {
      return (
        <div className="map">
          <div ref={(c) => { this.googleMap = c; }} id="googleMap" />
        </div>
      );
    }
    const options = [
      { name: 'Standard', onClick: this.onOptionClick, value: this.state.google.maps.MapTypeId.ROADMAP },
      { name: 'Satellite', onClick: this.onOptionClick, value: this.state.google.maps.MapTypeId.SATELLITE },
    ];
    return (
      <div className="map">
        <div ref={(c) => { this.googleMap = c; }} id="googleMap" />
        <Options options={options} />
      </div>
    );
  }

}
