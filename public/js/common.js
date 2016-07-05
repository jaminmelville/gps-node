'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Options = function (_React$Component) {
  _inherits(Options, _React$Component);

  function Options() {
    _classCallCheck(this, Options);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Options).apply(this, arguments));
  }

  _createClass(Options, [{
    key: 'render',
    value: function render() {
      var options = this.props.options.map(function (option, key) {
        var onClick = function onClick() {
          option.onClick(option.value);
        };
        return React.createElement(
          'a',
          { key: key, className: 'button hollow tiny', onClick: onClick },
          option.name
        );
      });
      return React.createElement(
        'div',
        { className: 'options small' },
        options
      );
    }
  }]);

  return Options;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Section = function (_React$Component) {
  _inherits(Section, _React$Component);

  function Section() {
    _classCallCheck(this, Section);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Section).apply(this, arguments));
  }

  _createClass(Section, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'section',
        { className: 'section', id: this.props.title.toLowerCase(), 'data-magellan-target': this.props.title.toLowerCase() },
        React.createElement(
          'h3',
          { className: 'section__title' },
          this.props.title
        ),
        React.createElement(
          'div',
          { className: 'section__content' },
          this.props.children
        )
      );
    }
  }]);

  return Section;
}(React.Component);
'use strict';

$(document).ready(function () {
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.rotation.z = -0.2;
  camera.position.set(-300, 0, 600);

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('#background').append(renderer.domElement);

  var geometry = new THREE.SphereGeometry(300, 32, 32);
  var material = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('/images/map.jpg') });

  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = -200;
  mesh.position.y = -10;
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0x111111, 0.1));

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.x = 0.5;
  directionalLight.position.y = 0.5;
  directionalLight.position.z = 0.5;
  directionalLight.position.normalize();
  scene.add(directionalLight);

  var render = function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  render();

  $(window).on('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  $(window).on('scroll', function () {
    mesh.rotation.y = -Math.PI * 2 / ($('.row.column').height() - $(window).innerHeight()) * $(window).scrollTop();
  });
});
'use strict';

var theme = getCookie('theme');
var colors = {
  'green': '#709C00',
  'pink': '#ff50d3',
  'blue': '#0000ff'
};
var PRIMARY_COLOR = colors[theme] ? colors[theme] : colors['green'];
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function rad(x) {
  return x * Math.PI / 180;
}

function getDistance(p1, p2) {
  var R = 6399057.501483163; // Earth’s mean radius in meter
  var dLat = rad(p2.latitude - p1.latitude);
  var dLong = rad(p2.longitude - p1.longitude);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
}

Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

var weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

var MyEvent = function () {
  function MyEvent() {
    _classCallCheck(this, MyEvent);
  }

  _createClass(MyEvent, null, [{
    key: "getEvent",
    value: function getEvent(name) {
      if (typeof this.events === 'undefined') {
        this.events = {};
      }
      if (typeof this.events[name] === 'undefined') {
        this.events[name] = [];
      }
      return this.events[name];
    }
  }, {
    key: "emit",
    value: function emit(name, data) {
      var event = this.getEvent(name);
      event.forEach(function (fn) {
        fn(data);
      });
    }
  }, {
    key: "listen",
    value: function listen(name, fn) {
      var event = this.getEvent(name);
      event.push(fn);
    }
  }]);

  return MyEvent;
}();