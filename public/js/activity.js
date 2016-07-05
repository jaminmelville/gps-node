'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  function Chart(props, context) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chart).call(this, props, context));

    _this.state = {
      type: 'speed'
    };
    _this.onOptionClick = _this.onOptionClick.bind(_this);
    _this.createChart = _this.createChart.bind(_this);
    _this.units = {
      speed: 'km/h',
      'average speed': 'km/h',
      distance: 'km'
    };
    return _this;
  }

  _createClass(Chart, [{
    key: 'onOptionClick',
    value: function onOptionClick(value) {
      this.setState({ type: value });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      $('.chart').highcharts().destroy();
      this.createChart();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createChart();
    }
  }, {
    key: 'createChart',
    value: function createChart() {
      var _this2 = this;

      var data = [];
      var totalDistance = 0;
      var totalTime = 0;
      for (var i = 0; i < records.length - 1; i++) {
        var distance = getDistance(records[i], records[i + 1]); // meters
        var time = records[i + 1].time - records[i].time; //seconds
        var speed = distance / time * 3.6; // km/h
        totalDistance += distance;
        totalTime += time;
        data.push({
          time: (records[i + 1].time - records[0].time) / 60,
          speed: speed,
          'average speed': totalDistance / totalTime * 3.6,
          distance: totalDistance / 1000
        });
      }

      var averageValue = data.reduce(function (average, point) {
        return average + point[_this2.state.type] / data.length;
      }, 0);

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
          min: data.reduce(function (min, point) {
            var value = point[_this2.state.type];
            return value < min ? value : min;
          }, averageValue),
          max: data.reduce(function (max, point) {
            var value = point[_this2.state.type];
            return value > max && value < 1.2 * max ? value : max;
          }, averageValue),
          labels: {
            style: {
              color: '#ffffff'
            }
          }
        },
        plotOptions: {
          spline: {
            lineWidth: 4,
            color: PRIMARY_COLOR,
            events: {
              click: function click(e) {
                MyEvent.emit('gps point', records[e.point.index]);
              }
            }
          }
        },
        tooltip: {
          headerFormat: '<span class="label">',
          pointFormat: '{point.y:.1f} ' + this.units[this.state.type],
          footerFormat: '</span>',
          shared: true,
          useHTML: true
        },
        series: [{
          data: data.map(function (point) {
            return [point.time, point[_this2.state.type]];
          }),
          showInLegend: false
        }]
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var options = [{ name: 'Speed', value: 'speed', onClick: this.onOptionClick }, { name: 'Average speed', value: 'average speed', onClick: this.onOptionClick }, { name: 'Distance', value: 'distance', onClick: this.onOptionClick }];
      return React.createElement(
        'div',
        { className: 'graph' },
        React.createElement('div', { className: 'chart' }),
        React.createElement(Options, { options: options })
      );
    }
  }]);

  return Chart;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Laps = function (_React$Component) {
  _inherits(Laps, _React$Component);

  function Laps(props, context) {
    _classCallCheck(this, Laps);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Laps).call(this, props, context));

    var records = props.records;
    _this.laps = [];
    var distance = 0;
    var start_time = records[0].time;

    for (var i = 0; i < records.length - 1; i++) {
      distance += getDistance(records[i], records[i + 1]);
      if (distance >= 1000) {
        var time = records[i + 1].time - start_time;
        _this.laps.push({
          distance: 1,
          time: parseInt(time / 60) + 'm ' + _this.zeroPad(time % 60, 2) + 's',
          speed: (1 / time * 60 * 60).toFixed(2) + ' km/h'
        });
        start_time = records[i + 1].time;
        distance -= 1000;
      }
    }
    var time = records[records.length - 1].time - start_time;
    _this.laps.push({
      distance: distance / 1000,
      time: parseInt(time / 60) + 'm ' + _this.zeroPad(time % 60, 2) + 's',
      speed: (distance / 1000 / time * 60 * 60).toFixed(2) + ' km/h'
    });
    _this.state = {
      option: 'time'
    };
    _this.onOptionClick = _this.onOptionClick.bind(_this);
    return _this;
  }

  _createClass(Laps, [{
    key: 'zeroPad',
    value: function zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }
  }, {
    key: 'onOptionClick',
    value: function onOptionClick(value) {
      this.setState({ 'option': value });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var lapNodes = this.laps.map(function (lap, index) {
        return React.createElement(
          'li',
          { className: 'row', key: index },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-3 large-2 text-right' },
            (index + lap.distance).toFixed(2)
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-3 large-2' },
            lap[_this2.state.option]
          )
        );
      });
      var options = [{ name: 'Time', value: 'time', onClick: this.onOptionClick }, { name: 'Speed', value: 'speed', onClick: this.onOptionClick }];
      return React.createElement(
        'div',
        null,
        React.createElement(
          'ul',
          { className: 'laps' },
          lapNodes
        ),
        React.createElement(Options, { options: options })
      );
    }
  }]);

  return Laps;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Map = function (_React$Component) {
  _inherits(Map, _React$Component);

  function Map(props, context) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Map).call(this, props, context));

    _this.createMap = _this.createMap.bind(_this);
    _this.onOptionClick = _this.onOptionClick.bind(_this);
    _this.createTrackingDot = _this.createTrackingDot.bind(_this);
    _this.setTrackingDot = _this.setTrackingDot.bind(_this);
    _this.state = {
      googleLoaded: false
    };
    return _this;
  }

  _createClass(Map, [{
    key: "createMap",
    value: function createMap() {
      this.setState({ googleLoaded: true });

      var mapProperties = {
        styles: [{
          "stylers": [{ "saturation": -100 }]
        }],
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        scrollwheel: false
      };
      this.map = new google.maps.Map(document.getElementById("googleMap"), mapProperties);

      // Add start and finish markers to map.
      new google.maps.Marker({
        position: new google.maps.LatLng(records[0].latitude, records[0].longitude),
        map: this.map,
        icon: '/images/LapDot.png',
        title: 'Start'
      });
      new google.maps.Marker({
        position: new google.maps.LatLng(records[records.length - 1].latitude, records[records.length - 1].longitude),
        map: this.map,
        icon: '/images/LapDot.png',
        title: 'Finish'
      });
      // Add lap markers to map.
      var laps = 0;
      var distance = 0;
      for (var i = 0; i < records.length - 1; i++) {
        distance += getDistance(records[i], records[i + 1]);
        if (distance >= 1000) {
          laps++;
          new google.maps.Marker({
            position: new google.maps.LatLng(records[i].latitude, records[i].longitude),
            map: this.map,
            icon: '/images/LapDot.png',
            title: laps + ' km'
          });
          distance -= 1000;
        }
      }

      var coordinates = records.map(function (record) {
        return new google.maps.LatLng(record.latitude, record.longitude);
      });

      var bounds = new google.maps.LatLngBounds();
      coordinates.forEach(function (coordinate) {
        bounds.extend(coordinate);
      });
      this.map.fitBounds(bounds);

      var runPath = new google.maps.Polyline({
        path: coordinates,
        strokeColor: PRIMARY_COLOR,
        strokeOpacity: 1,
        strokeWeight: 4
      });
      runPath.setMap(this.map);
      this.createTrackingDot(records[0]);
    }
  }, {
    key: "createTrackingDot",
    value: function createTrackingDot(point) {
      this.trackingDot = new google.maps.Marker({
        position: new google.maps.LatLng(point.latitude, point.longitude),
        map: this.map,
        icon: '/images/TrackingDot.png'
      });
    }
  }, {
    key: "setTrackingDot",
    value: function setTrackingDot(point) {
      this.trackingDot.setPosition(new google.maps.LatLng(point.latitude, point.longitude));
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (typeof google !== 'undefined') {
        google.maps.event.addDomListener(window, 'load', this.createMap);
        MyEvent.listen('gps point', this.setTrackingDot);
      }
    }
  }, {
    key: "onOptionClick",
    value: function onOptionClick(value) {
      this.map.setMapTypeId(value);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.googleLoaded) {
        return React.createElement(
          "div",
          { className: "callout" },
          React.createElement(
            "h5",
            null,
            "Maps are down!"
          ),
          React.createElement(
            "p",
            null,
            "This is most likely because you are not connected to the internet."
          )
        );
      }
      var options = [{ name: 'Standard', onClick: this.onOptionClick, value: google.maps.MapTypeId.ROADMAP }, { name: 'Satellite', onClick: this.onOptionClick, value: google.maps.MapTypeId.SATELLITE }];
      return React.createElement(
        "div",
        { className: "map" },
        React.createElement("div", { id: "googleMap" }),
        React.createElement(Options, { options: options })
      );
    }
  }]);

  return Map;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Notes = function (_React$Component) {
  _inherits(Notes, _React$Component);

  function Notes(props, context) {
    _classCallCheck(this, Notes);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Notes).call(this, props, context));

    _this.timeout = 0, _this.state = { text: props.note.note };
    _this.onChange = _this.onChange.bind(_this);
    return _this;
  }

  _createClass(Notes, [{
    key: 'onChange',
    value: function onChange(event) {
      var _this2 = this;

      var text = event.target.value;
      $('.notes').addClass('notes--busy');
      this.setState({ text: text }, function () {
        clearTimeout(_this2.timeout);
        _this2.timeout = setTimeout(function () {
          $.post('/api/note/update', { id: _this2.props.note.id, text: text });
          $('.notes').removeClass('notes--busy');
        }, 1000);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('textarea', { className: 'notes', onChange: this.onChange, value: this.state.text });
    }
  }]);

  return Notes;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stats = function (_React$Component) {
  _inherits(Stats, _React$Component);

  function Stats() {
    _classCallCheck(this, Stats);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Stats).apply(this, arguments));
  }

  _createClass(Stats, [{
    key: 'render',
    value: function render() {
      var distance = parseInt(this.props.activity.distance) / 1000;
      var duration = this.props.activity.elapsed_time;
      var speed = distance / (duration / 3600);
      var date = new Date(parseInt(this.props.activity.start_time) * 1000);

      return React.createElement(
        'div',
        { className: 'stats' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Date'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            date.getDate(),
            '/',
            date.getMonth() + 1,
            '/',
            date.getFullYear()
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Day'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            weekday[date.getDay()]
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Time'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            date.getHours(),
            ':',
            zeroPad(date.getMinutes(), 2)
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Distance'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            distance.toFixed(2),
            ' km'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Duration'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            parseInt(duration / 60),
            'M ',
            parseInt(duration % 60),
            'S'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Speed'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            speed.toFixed(2),
            ' km/h'
          )
        )
      );
    }
  }]);

  return Stats;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tags = function (_React$Component) {
  _inherits(Tags, _React$Component);

  function Tags(props, context) {
    _classCallCheck(this, Tags);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tags).call(this, props, context));

    var tags = props.tags;
    tags.forEach(function (tag) {
      tag.checked = false;
      props.activity.tags.forEach(function (activity_tag) {
        if (tag.id == activity_tag.tag_id) {
          tag.checked = true;
        }
      });
    });
    _this.state = { tags: tags };
    return _this;
  }

  _createClass(Tags, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var tagNodes = this.state.tags.map(function (tag, index) {
        var onClick = function onClick() {
          var tags = _this2.state.tags;
          tag.checked = !tag.checked;
          _this2.setState({ tags: tags }, function () {
            if (tag.checked) {
              $.post('/api/tag/add', { activity_id: _this2.props.activity.id, tag_id: tag.id });
            } else {
              $.post('/api/tag/remove', { activity_id: _this2.props.activity.id, tag_id: tag.id });
            }
          });
        };

        return React.createElement(
          'div',
          { className: 'columns large-2 medium-3 small-6 tags__item', key: index },
          React.createElement(
            'span',
            { className: 'switch tiny' },
            React.createElement('input', { className: 'switch-input', id: 'tag-' + tag.name, type: 'checkbox', name: 'tag-' + tag.name, onChange: onClick, defaultChecked: tag.checked }),
            React.createElement('label', { className: 'switch-paddle', htmlFor: 'tag-' + tag.name })
          ),
          React.createElement(
            'span',
            { className: 'filters__tag-name' },
            tag.name
          )
        );
      });
      return React.createElement(
        'div',
        { className: 'row tags' },
        tagNodes
      );
    }
  }]);

  return Tags;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Activity = function (_React$Component) {
  _inherits(Activity, _React$Component);

  function Activity() {
    _classCallCheck(this, Activity);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Activity).apply(this, arguments));
  }

  _createClass(Activity, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      $('body').perfectScrollbar();
    }
  }, {
    key: 'render',
    value: function render() {
      var sections = [React.createElement(
        Section,
        { title: 'Stats', key: '1' },
        React.createElement(Stats, { activity: activity })
      ), React.createElement(
        Section,
        { title: 'Tags', key: '2' },
        React.createElement(Tags, { tags: tags, activity: activity })
      )];
      // The following sections are only available if it's a gps activity.
      if (records.length) {
        sections.push(React.createElement(
          Section,
          { title: 'Chart', key: '3' },
          React.createElement(Chart, null)
        ), React.createElement(
          Section,
          { title: 'Map', key: '4' },
          React.createElement(Map, null)
        ), React.createElement(
          Section,
          { title: 'Laps', key: '5' },
          React.createElement(Laps, { records: records })
        ), React.createElement(
          Section,
          { title: 'Notes', key: '6' },
          React.createElement(Notes, { note: note })
        ));
      }
      return React.createElement(
        'div',
        { className: 'activity' },
        sections
      );
    }
  }]);

  return Activity;
}(React.Component);

ReactDOM.render(React.createElement(Activity, null), $('#activity')[0]);