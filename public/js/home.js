"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Activities = function (_React$Component) {
  _inherits(Activities, _React$Component);

  function Activities() {
    _classCallCheck(this, Activities);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Activities).apply(this, arguments));
  }

  _createClass(Activities, [{
    key: "render",
    value: function render() {
      var activityNodes = this.props.activities.map(function (activity, index) {
        var distance = parseInt(activity.distance) / 1000;
        var date = new Date(parseInt(activity.start_time) * 1000);
        var minutes = parseInt(activity.elapsed_time / 60);
        var seconds = activity.elapsed_time % 60;
        var speed = distance / (parseInt(activity.elapsed_time) / 3600);

        var tags = activity.tags.map(function (tag, index) {
          return React.createElement(
            "span",
            { className: "activities__tag label", key: index },
            tag.name
          );
        });

        var onClick = function onClick() {
          location.href = '/activity/' + activity.id;
        };

        return React.createElement(
          "li",
          { className: "small-12 medium-4 large-3 columns activities__wrap", onClick: onClick, key: index },
          React.createElement(
            "div",
            { className: "activities__item" },
            React.createElement(
              "div",
              { className: "row text-center" },
              React.createElement(
                "div",
                { className: "activities__value columns small-4" },
                React.createElement(
                  "div",
                  { className: "activities__number" },
                  distance.toFixed(2)
                ),
                React.createElement(
                  "div",
                  { className: "activities__unit" },
                  "km"
                )
              ),
              React.createElement(
                "div",
                { className: "activities__value columns small-4" },
                React.createElement(
                  "div",
                  { className: "activities__number" },
                  minutes,
                  ":",
                  zeroPad(seconds, 2)
                ),
                React.createElement(
                  "div",
                  { className: "activities__unit" },
                  "mm:ss"
                )
              ),
              React.createElement(
                "div",
                { className: "activities__value columns small-4" },
                React.createElement(
                  "div",
                  { className: "activities__number" },
                  speed.toFixed(2)
                ),
                React.createElement(
                  "div",
                  { className: "activities__unit" },
                  "km/h"
                )
              )
            ),
            React.createElement(
              "div",
              { className: "activities__date text-center" },
              date.getHours(),
              ":",
              zeroPad(date.getMinutes(), 2),
              " - ",
              weekday[date.getDay()],
              " - ",
              date.getDate(),
              "/",
              date.getMonth() + 1,
              "/",
              date.getFullYear()
            ),
            React.createElement(
              "div",
              { className: "activities__tags" },
              tags
            )
          )
        );
      });
      return React.createElement(
        "ul",
        { className: "activities row" },
        activityNodes
      );
    }
  }]);

  return Activities;
}(React.Component);
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

    _this.createChart = _this.createChart.bind(_this);
    _this.state = {
      type: 'speed'
    };
    _this.onOptionClick = _this.onOptionClick.bind(_this);
    _this.units = {
      'speed': 'km/h',
      'distance': 'km'
    };
    return _this;
  }

  _createClass(Chart, [{
    key: 'createChart',
    value: function createChart() {
      var _this2 = this;

      var min = 10000;
      var max = 0;
      var activities = this.props.activities.slice(0).reverse();
      var points = activities.map(function (activity) {
        var distance = parseInt(activity.distance) / 1000;
        var time = parseInt(activity.elapsed_time);
        var speed = distance / (time / 3600);
        if (speed < min) {
          min = speed;
        } else if (speed > max) {
          max = speed;
        }
        return { speed: speed, distance: distance };
      });
      var data = points.map(function (point) {
        return point[_this2.state.type];
      });
      var numberOfActivities = activities.length;
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
              click: function click(e) {
                var index = numberOfActivities - e.point.index - 1;
                var $active = $('#activities .activities__item').removeClass('activities__item--active').eq(index).addClass('activities__item--active');
                var scrollTop = $active.offset().top - ($(window).height() - $active.height()) / 2;
                $('html,body').animate({ scrollTop: scrollTop }, 400);
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
          data: data,
          showInLegend: false
        }]
      });
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
    key: 'onOptionClick',
    value: function onOptionClick(value) {
      this.setState({ type: value });
    }
  }, {
    key: 'render',
    value: function render() {
      var options = [{ name: 'Speed', value: 'speed', onClick: this.onOptionClick }, { name: 'Distance', value: 'distance', onClick: this.onOptionClick }];
      return React.createElement(
        'div',
        null,
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

var Filters = function (_React$Component) {
  _inherits(Filters, _React$Component);

  function Filters(props, context) {
    _classCallCheck(this, Filters);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Filters).call(this, props, context));

    var includeTags = JSON.parse(localStorage.getItem('includeTags'));
    var excludeTags = JSON.parse(localStorage.getItem('excludeTags'));
    _this.params = {
      start: new Date(_this.localStorage('startDate', '2016-01-01')).getTime() / 1000,
      end: new Date(_this.localStorage('endDate', '2016-12-31')).getTime() / 1000,
      includeTags: includeTags ? includeTags : [],
      excludeTags: excludeTags ? excludeTags : [],
      min: parseInt(_this.localStorage('minDistance', '0')),
      max: parseInt(_this.localStorage('maxDistance', '43000'))
    };
    _this.updateList = _this.updateList.bind(_this);
    _this.createTags = _this.createTags.bind(_this);
    _this.onStartDateChange = _this.onStartDateChange.bind(_this);
    _this.onEndDateChange = _this.onEndDateChange.bind(_this);
    return _this;
  }

  _createClass(Filters, [{
    key: 'localStorage',
    value: function (_localStorage) {
      function localStorage(_x, _x2) {
        return _localStorage.apply(this, arguments);
      }

      localStorage.toString = function () {
        return _localStorage.toString();
      };

      return localStorage;
    }(function (key, defaultValue) {
      var value = localStorage.getItem(key) ? localStorage.getItem(key) : defaultValue;
      localStorage.setItem(key, value);
      return value;
    })
  }, {
    key: 'onStartDateChange',
    value: function onStartDateChange(event) {
      localStorage.setItem('startDate', event.target.value);
      this.params.start = new Date(event.target.value).getTime() / 1000;
    }
  }, {
    key: 'onEndDateChange',
    value: function onEndDateChange(event) {
      localStorage.setItem('endDate', event.target.value);
      this.params.end = new Date(event.target.value).getTime() / 1000;
    }
  }, {
    key: 'updateList',
    value: function updateList() {
      this.params.min = $('#minSlider').val();
      localStorage.setItem('minDistance', this.params.min);
      this.params.max = $('#maxSlider').val();
      localStorage.setItem('maxDistance', this.params.max);
      this.props.onChange(this.params);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.updateList();
      $('#filters-reveal').on('open.zf.reveal', function () {
        setTimeout(function () {
          new Foundation.Slider($('.filters .slider'), {
            initialStart: _this2.params.min,
            initialEnd: _this2.params.max,
            end: 43000
          });
        }, 1000);
      });
      $('#filters-reveal').on('closed.zf.reveal', function () {
        _this2.updateList();
        $('.filters .slider').foundation('destroy');
      });
      $('#filters-reveal [data-close]').on('click', function () {
        $('#filters-reveal').foundation('close');
      });
    }
  }, {
    key: 'createTags',
    value: function createTags(tagType, title) {
      var _this3 = this;

      var createdTags = this.props.tags.map(function (tag, key) {
        var tags = _this3.params[tagType];
        var onTagChange = function onTagChange() {
          if (tags.indexOf(tag.id) > -1) {
            tags.splice(tags.indexOf(tag.id), 1);
          } else {
            tags.push(tag.id);
          }
          localStorage.setItem(tagType, JSON.stringify(tags));
          _this3.params[tagType] = tags;
        };

        var checked = tags.indexOf(parseInt(tag.id)) > -1;
        return React.createElement(
          'div',
          { className: 'columns large-4 medium-6 small-6', key: key },
          React.createElement(
            'span',
            { className: 'switch tiny' },
            React.createElement('input', { className: 'switch-input', id: tagType + tag.name, type: 'checkbox', name: tagType + tag.name, onChange: onTagChange, defaultChecked: checked }),
            React.createElement('label', { className: 'switch-paddle', htmlFor: tagType + tag.name })
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
        { className: 'columns large-6 medium-6 small-12' },
        React.createElement(
          'h5',
          null,
          title
        ),
        React.createElement(
          'div',
          { className: 'row' },
          createdTags
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var start = localStorage.getItem('startDate');
      var end = localStorage.getItem('endDate');
      return React.createElement(
        'div',
        { id: 'filters-reveal', className: 'filters reveal large', 'data-reveal': true, 'data-animation-in': 'fade-in', 'data-animation-out': 'fade-out' },
        React.createElement(
          'button',
          { className: 'close-button', type: 'button', 'data-close': true, 'aria-label': 'Close reveal' },
          React.createElement(
            'span',
            { 'aria-hidden': 'true' },
            '×'
          )
        ),
        React.createElement(
          'h4',
          null,
          'Date range'
        ),
        React.createElement(
          'div',
          { className: 'filters__date row' },
          React.createElement(
            'div',
            { className: 'columns large-6 medium-6 small-12' },
            'Start Date: ',
            React.createElement('input', { type: 'date', onChange: this.onStartDateChange, defaultValue: start })
          ),
          React.createElement(
            'div',
            { className: 'columns large-6 medium-6 small-12' },
            'End Date: ',
            React.createElement('input', { type: 'date', onChange: this.onEndDateChange, defaultValue: end })
          )
        ),
        React.createElement(
          'h4',
          null,
          'Distance range'
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6' },
            'min: ',
            React.createElement('input', { id: 'minSlider', defaultValue: this.params.min, type: 'number' })
          ),
          React.createElement(
            'div',
            { className: 'columns small-6' },
            'max: ',
            React.createElement('input', { id: 'maxSlider', defaultValue: this.params.max, type: 'number' })
          )
        ),
        React.createElement(
          'div',
          { className: 'slider' },
          React.createElement('span', { className: 'slider-handle', 'data-slider-handle': true, role: 'slider', tabIndex: '1', 'aria-controls': 'minSlider' }),
          React.createElement('span', { className: 'slider-fill', 'data-slider-fill': true }),
          React.createElement('span', { className: 'slider-handle', 'data-slider-handle': true, role: 'slider', tabIndex: '1', 'aria-controls': 'maxSlider' })
        ),
        React.createElement(
          'h4',
          null,
          'Tags'
        ),
        React.createElement(
          'div',
          null,
          this.createTags('includeTags', 'Include'),
          this.createTags('excludeTags', 'Exclude')
        )
      );
    }
  }]);

  return Filters;
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
      var total_distance = 0;
      var time = 0;
      var activityNodes = this.props.activities.forEach(function (activity) {
        total_distance += parseInt(activity.distance) / 1000;
        time += parseInt(activity.elapsed_time);
      });
      var average_distance = total_distance / this.props.activities.length;
      var speed = total_distance / (time / 3600);
      return React.createElement(
        'div',
        { className: 'stats' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Total distance'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            total_distance.toFixed(2),
            ' km'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Total activities'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            this.props.activities.length
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Total time'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            parseInt(time / 60 / 60),
            'H ',
            parseInt(time % 3600 / 60),
            'M '
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Average speed'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            speed.toFixed(2),
            ' km/h'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'columns small-6 medium-4 large-3 text-right' },
            'Average distance'
          ),
          React.createElement(
            'div',
            { className: 'columns small-6 medium-2 large-2' },
            average_distance.toFixed(2),
            ' km'
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

var Home = function (_React$Component) {
  _inherits(Home, _React$Component);

  function Home(props, context) {
    _classCallCheck(this, Home);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Home).call(this, props, context));

    _this.state = {
      activities: false
    };
    _this.onChange = _this.onChange.bind(_this);
    _this.fetchNewActivities = _this.fetchNewActivities.bind(_this);
    _this.socket = io.connect();
    _this.socket.on('attach', _this.fetchNewActivities);
    _this.fetchNewActivities();
    return _this;
  }

  _createClass(Home, [{
    key: 'fetchNewActivities',
    value: function fetchNewActivities() {
      var _this2 = this;

      $.get('/api/new-activities', function (activities) {
        if (activities.length) {
          _this2.setState({ newActivities: activities });
        }
      });
    }
  }, {
    key: 'onChange',
    value: function onChange(params) {
      var _this3 = this;

      $.post('/api/activities', params, function (activities) {
        _this3.setState({ activities: activities });
      });
    }
  }, {
    key: 'onThemeChange',
    value: function onThemeChange(theme) {
      setCookie('theme', theme, 365);
      window.location.reload();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      $(document).foundation();
      $('body').perfectScrollbar();
    }
  }, {
    key: 'render',
    value: function render() {
      var newActivities = '';
      if (this.state.newActivities) {
        newActivities = React.createElement(
          Section,
          { title: 'New' },
          React.createElement(Activities, { activities: this.state.newActivities })
        );
      }

      if (this.state.activities) {
        var sections = React.createElement(
          'div',
          null,
          React.createElement(
            Section,
            { title: 'Stats' },
            React.createElement(Stats, { activities: this.state.activities })
          ),
          React.createElement(
            Section,
            { title: 'Chart' },
            React.createElement(Chart, { activities: this.state.activities })
          ),
          newActivities,
          React.createElement(
            Section,
            { title: 'Activities' },
            React.createElement(Activities, { activities: this.state.activities })
          )
        );
      } else {
        var sections = 'loading...';
      }
      var options = [{ name: 'Pink', value: 'pink', onClick: this.onThemeChange }, { name: 'Green', value: 'green', onClick: this.onThemeChange }, { name: 'Blue', value: 'blue', onClick: this.onThemeChange }];
      return React.createElement(
        'div',
        { className: 'home' },
        React.createElement(Filters, { tags: tags, onChange: this.onChange }),
        sections,
        React.createElement(Options, { options: options })
      );
    }
  }]);

  return Home;
}(React.Component);

ReactDOM.render(React.createElement(Home, null), $('#home')[0]);