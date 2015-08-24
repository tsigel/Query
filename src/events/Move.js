var pr = "prototype", p = $[pr], A = Array, ID = "__ID__", D = window['$document'] || document;

var extend = function (child, parent) {
    var P = function () {};
    P.prototype = parent.prototype;
    child.prototype = new P();
    child.prototype.constructor = child;
};

///---

var Move = function (e, finger, history) {

    this.init(e);

    this.type = "move";

    this.startCoordinates = Move.getStartCoordinates(history);
    this.coordinates = Move.getCoordinates(finger);
    this.startTime = history.touch.time;
    this.lastTime = Date.now();

    this.currentDistance(history);
    this.currentSpeed(history);

    this.initSwipeSpeed(history);
};

extend(Move, BaseEvent);

Move[pr].currentDistance = function (history) {

    this.distanceX = this.coordinates.x - this.startCoordinates.x;
    this.distanceY = this.coordinates.y - this.startCoordinates.y;
    this.distance = Math.sqrt(Math.pow(this.distanceX, 2) + Math.pow(this.distanceY, 2));

    if (history.move) {
        this.lastDistanceX = this.distanceX - history.move.distanceX;
        this.lastDistanceY = this.distanceY - history.move.distanceY;
        this.lastDistance = this.distance - history.move.distance;
    } else {
        this.lastDistance = 0;
        this.lastDistanceX = 0;
        this.lastDistanceY = 0;
    }

};

Move[pr].currentSpeed = function(history) {

    var allTime = this.lastTime - this.startTime, localTime;

    this.speedX = this.distanceX / allTime;
    this.speedY = this.distanceY / allTime;
    this.speed = this.distance / allTime;

    if (history.move) {
        localTime = this.lastTime - history.move.lastTime;
        this.lastSpeedX = this.lastDistanceX / localTime;
        this.lastSpeedY = this.lastDistanceY / localTime;
        this.lastSpeed = this.lastDistance / localTime;
    } else {
        this.lastSpeed = 0;
        this.lastDistanceX = 0;
        this.lastDistanceY = 0;
    }

};

Move[pr].initSwipeSpeed = function (history) {
    if (history.move && history.move.hasSwipeSpeed) {
        this.hasSwipeSpeed = true;
    } else {
        this.hasSwipeSpeed = this.lastSpeed > Move.swipeSpeed;
    }
};

Move.getStartCoordinates = function (history) {
    return {
        x: history.touch.coordinates.x,
        y: history.touch.coordinates.y
    }
};

Move.getCoordinates = function (finger) {
    return {
        x: finger.pageX,
        y: finger.pageY
    }
};

Move.swipeSpeed = 0.5;