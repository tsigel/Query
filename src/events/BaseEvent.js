var pr = "prototype", p = $[pr], A = Array, ID = "__ID__", D = document;

var extend = function (child, parent) {
    var P = function () {};
    P.prototype = parent.prototype;
    child.prototype = new P();
    child.prototype.constructor = child;
};

///---

/**
 * @class BaseEvent
 * @constructor
 */
var BaseEvent = function () {
    this.type = null;
};

/**
 * @param event
 */
BaseEvent[pr].init = function (event) {
    this.originEvent = event.originEvent;
};

/**
 * @returns {string}
 */
BaseEvent[pr].getPrefix = function () {
    return "User:";
};

/**
 * @returns {string}
 */
BaseEvent[pr].getEventString = function () {
    return this.getPrefix() + this.type;
};

/**
 * @returns {Object}
 */
BaseEvent[pr].getClone = function () {
    return Object.create(this);
};