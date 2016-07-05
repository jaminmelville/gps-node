function rad(x) {
  return x * Math.PI / 180;
}

function getDistance(p1, p2) {
  var R = 6399057.501483163; // Earth’s mean radius in meter
  var dLat = rad(p2.latitude - p1.latitude);
  var dLong = rad(p2.longitude - p1.longitude);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1
  return Array(+(zero > 0 && zero)).join("0") + num
}

var weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

class MyEvent {

  static getEvent(name) {
    if (typeof(this.events) === 'undefined') {
      this.events = {}
    }
    if (typeof(this.events[name]) === 'undefined') {
      this.events[name] = []
    }
    return this.events[name]
  }

  static emit(name, data) {
    var event = this.getEvent(name)
    event.forEach((fn) => {
      fn(data)
    })
  }

  static listen(name, fn) {
    var event = this.getEvent(name)
    event.push(fn)
  }
}
