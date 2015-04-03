var pr = "prototype", p = $[pr], A = Array, ID = "__ID__", D = document;

var extend = function (child, parent) {
    var P = function () {};
    P.prototype = parent.prototype;
    child.prototype = new P();
    child.prototype.constructor = child;
};

///---

var Tap = function (e, finger) {
    this.init(e);
    this.type = "tap";
    this.coordinates = {
        x: finger.pageX,
        y: finger.pageY
    };
    this.time = finger.time;
};

extend(Tap, BaseEvent);