var $ = (function () {

    var pr = "prototype";
    var c = "constructor";
    var d = "document";
    var w = "window";
    var co = console;

    /**
     * @class E
     * @param {HTMLElement|HTMLInputElement} node
     * @constructor
     */
    var E = function (node) {
        this.node = node;
    };

    E._hasVal = function (val) {
        return val != undefined;
    };

    var ep = E.prototype;

    ep.attr = function (name, value) {
        if (E._hasVal(value)) {
            this.node.setAttribute(name, value);
        } else {
            return this.node.getAttribute(name) || "";
        }
    };

    ep.addClass = function (className) {
        if (!this.hasClass(className)) {
            var classList = this.node.className.split(" ");
            classList.push(className);
            this.node.className = $.trim(classList.join(" "));
        }
    };

    ep.removeClass = function (className) {
        if (this.hasClass(className)) {
            var classList = this.node.className.split(" ");
            classList.splice(classList.indexOf(className), 1);
            this.node.className = $.trim(classList.join(" "));
        }
    };

    ep.toggleClass = function (className) {
        if (this.hasClass(className)) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
    };

    ep.val = function (value) {
        if (E._hasVal(value)) {
            this.node.value = value;
        } else {
            return this.node.value || "";
        }
    };

    ep.hasClass = function (className) {
        return (this.node.className.split(" ").indexOf(className) != -1);
    };

    ep.removeAttr = function (name) {
        this.node.removeAttribute(name);
    };

    ep.html = function (html) {
        if (E._hasVal(html)) {
            this.node.innerHTML = html;
        } else {
            return this.innerHTML;
        }
    };

    /**
     * @class $
     * @extends Array
     * @param param
     * @returns {$}
     */
    var $ = function $(param) {
        if (this instanceof $) {
            Array[pr].forEach.call(arguments, function (arg) {
                this.add(arg);
            }, this);
        } else {
            return new $(param);
        }
    };

    $[pr] = [];
    $[pr][c] = $;
    var p = $.prototype;

    ["addClass", "removeClass", "toggleClass", "removeAttr"].forEach(function (method) {
        p[method] = function (className) {
            this._toAll(method, [className]);
            return this;
        };
    });

    ["val", "hasClass", "html"].forEach(function (method) {
        p[method] = function (val) {
            return this._setOrGet(method, val);
        }
    });

    ["attr"].forEach(function (method) {
        p[method] = function (name, value) {
            return this._setOrGet(method, value, name);
        }
    });

    p.add = function (param) {
        if (Array.isArray(param)) {
            param.forEach(this.add, this);
        } else {
            var elem = this._toElem(param);
            if (elem)
                this.push(elem);
        }
    };

    p.find = function (selector) {
        if (!this._has()) return this;
        return new $(Array[pr].slice.call(this[0].node.querySelectorAll(selector)));
    };

    p.children = function () {
        if (!this._has()) return this;
        return new $(Array[pr].slice.call(this[0].node.childNodes));
    };

    p.eq = function (index) {
        if (!this._has()) return this;
        return new $(this[index || 0]);
    };

    p.get = function (index) {
        if (!this._has()) return null;
        return this[index || 0].node;
    };

    p.parent = function () {
        if (!this._has()) return this;
        return new $(this[0].node.parentNode);
    };

    p.append = function (param) {
        if (!this._has()) return this;
        var elem = this._toElem(param);
        if (elem)
            this[0].node.appendChild(elem.node);
    };

    p._toElem = function (param) {
        if ($.isElement(param)) {
            return new E(param);
        } else if (param instanceof E) {
            return param;
        } else if (typeof param == "string") {
            console.log("string");
        } else {
            co.log("wrong param!", param);
        }
    };

    p._toAll = function (method, args) {
        this.forEach(function (elem) {
            elem[method].apply(elem, args);
        });
    };

    p._has = function () {
        if (!this.length) {
            co.warn("not length!");
            return false;
        } else {
            return true;
        }
    };

    p._setOrGet = function (method, argToCheck, arg) {
        if (!this._has()) return this;
        if (E._hasVal(argToCheck)) {
            var args = arg ? [arg, argToCheck] : [argToCheck];
            this._toAll(method, args);
            return this;
        } else {
            return this[0][method]();
        }
    };

    /**
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    $.random = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    /**
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    $.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * @param {string} text
     * @returns {string}
     */
    $.trim = (function (text) {
        if ("trim" in String.prototype) {
            return function (text) {
                return text.trim();
            }
        } else {
            return function (text) {
                return (text || "").replace(/^\s+|\s+$/g, "");
            }
        }
    })();

    /**
     * @param {string} text
     * @returns {string}
     */
    $.camelCase = function (text) {
        return text.toLowerCase().replace(/-(.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    };

    /**
     * @returns {string}
     */
    $.guuid = function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    /**
     * @param some
     * @returns {boolean}
     */
    $.isElement = function (some) {
        return ((some instanceof Node) && (some["nodeType"] == 1));
    };

    /**
     * @param {Object|Array} some
     * @param {function} callback
     * @param {*} [context]
     */
    $.forEach = function (some, callback, context) {
        if (Array.isArray(some)) {
            some.forEach(callback, context);
        } else {
            Object.keys(some).forEach(function (name) {
                callback.call(context || window, some[name], name);
            });
        }
    };

    /**
     * @param {Object|Array} some
     * @param {function} callback
     * @param {*} [context]
     * @param {*} [argument]
     * @returns {boolean}
     */
    $.some = function (some, callback, context, argument) {
        if (Array.isArray(some)) {
            return some.some(function (value, index) {
                return callback.call(context || window, value, index, argument);
            });
        } else {
            return Object.keys(some).some(function (name) {
                return callback.call(context || window, some[name], name, argument);
            });
        }
    };

    /**
     * @param {Object|Array} some
     * @param {function} callback
     * @param {*} [context]
     * @param {*} [argument]
     * @returns {boolean}
     */
    $.every = function (some, callback, context, argument) {
        return !$.some(some, callback, context, argument);
    };

    /**
     * @param {Object|Array} some
     * @param {function} callback
     * @param {*} [context]
     * @param {*} [argument]
     * @returns {{id: null, value: null}}
     */
    $.findFirst = function (some, callback, context, argument) {
        var result = {
            id: null,
            value: null
        };

        $.some(some, function (value, id) {

            if (callback.call(context || window, value, id, argument)) {
                result = {
                    id: id,
                    value: value
                };
                return true;
            }
        });

        return result;
    };

    $.events = {};

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    var getEventSupport = function (event) {
        event = "on" + event;
        var target = document.createElement("div");
        target.setAttribute(event, "");
        var isSupported = typeof target[event] === "function";
        if (typeof target[event] !== "undefined") target[event] = null;
        target.removeAttribute(event);
        return isSupported;
    };

    var events = {
        mouse: {
            start: "mousedown",
            move: "mousemove",
            end: "mouseup"
        },
        mobile: {
            start: "touchstart",
            move: "touchmove",
            end: "touchend"
        },
        win: {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp"
        },
        winTouch: {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup"
        }
    };

    (function () {
        if ("PointerEvent" in window) {
            $.events = events.winTouch;
        } else if (window.navigator.msPointerEnabled) {
            $.events = events.win;
        } else if (getEventSupport("touchmove")) {
            $.events = events.mobile;
        } else {
            $.events = events.mouse;
        }
    })();

    return $;
})();