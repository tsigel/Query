var pr = "prototype", p = $[pr], A = Array, ID = "__ID__", D = window['$document'] || document;

var extend = function (child, parent) {
    var P = function () {};
    P.prototype = parent.prototype;
    child.prototype = new P();
    child.prototype.constructor = child;
};

///---

var Swipe = function (e, finger, history) {

    this.init(e);
    this.type = "swipe";
    this.direction = "left";
    this.startCoordinates = Swipe.getStartCoordinates(history);
    this.vector = Swipe.getVector(finger, history);
    this.isHorizontal = Swipe.isHorizontal(this.vector);

    if (this.isHorizontal) {
        this.direction = Swipe.getDirection(this.vector.x, "left", "right");
    } else {
        this.direction = Swipe.getDirection(this.vector.y, "up", "down");
    }
};

extend(Swipe, BaseEvent);

Swipe[pr].getEventString = function () {
    return BaseEvent.prototype.getEventString.call(this) + ":"
        + (this.isHorizontal ? "horizontal:" : "vertical:") + this.direction;
};

Swipe.getStartCoordinates = function (history) {
    return {
        x: history.touch.coordinates.x,
        y: history.touch.coordinates.y
    };
};

Swipe.getVector = function (finger, history) {
    return {
        x: finger.pageX - history.touch.coordinates.x,
        y: finger.pageY - history.touch.coordinates.y
    };
};

Swipe.isHorizontal = function (vector) {
    return (Math.abs(vector.x) / Math.abs(vector.y || 0.00001) > Swipe.horizontalFactor);
};

Swipe.getDirection = function (vector, direction1, direction2) {
    if (vector < 0) {
        return direction1;
    } else {
        return direction2;
    }
};

Swipe.horizontalFactor = 2/3;