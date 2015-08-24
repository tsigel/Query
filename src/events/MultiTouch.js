var pr = "prototype", p = $[pr], A = Array, ID = "__ID__", D = window['$document'] || document;

var extend = function (child, parent) {
    var P = function () {};
    P.prototype = parent.prototype;
    child.prototype = new P();
    child.prototype.constructor = child;
};

///---

var MultiTouch = function (e, firstFinger, secondFinger, history) {

    this.startDistance = 0;
    this.distance = 0;
    this.deltaDistance = 0;
    this.angle = 0;
    this.deltaAngle = 0;
    this.zoom = 1;
    this.deltaZoom = 0;

    this.init(e);

    this.type = "multiTouch";

    this.vector = {
        x: secondFinger.pageX - firstFinger.pageX,
        y: secondFinger.pageY - firstFinger.pageY
    };

    this.distance = Math.sqrt(Math.pow(this.vector.x, 2) + Math.pow(this.vector.y, 2));
    this.angle = Math.atan(this.vector.y / this.vector.x) * 180 / Math.PI;

    if (history) {
        this.startDistance = history.startDistance;
        this.deltaAngle = this.angle - history.angle;
        this.deltaDistance = this.distance - history.distance;
        this.zoom = this.distance / this.startDistance;
        this.deltaZoom = this.zoom - history.zoom;
    } else {
        this.startDistance = this.distance;
    }

};

extend(MultiTouch, BaseEvent);