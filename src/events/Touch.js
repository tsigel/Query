var pr = "prototype", p = $[pr], A = Array, ID = "__ID__", D = document;

var extend = function (child, parent) {
    var P = function () {};
    P.prototype = parent.prototype;
    child.prototype = new P();
    child.prototype.constructor = child;
};

///---

var Touch = function (e, finger, status) {
    this.init(e);
    this.status = status;
    this.type = "touch";
    this.coordinates = {x: finger.pageX, y: finger.pageY};
    this.time = finger.time;
};
extend(Touch, BaseEvent);

Touch[pr].getEventString = function () {
    return BaseEvent[pr].getEventString.call(this) + ":" + this.status;
};