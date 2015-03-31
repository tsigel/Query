var $ = (function () {

    var pr = "prototype";
    var c = "constructor";
    var d = "document";
    var D = document;
    var w = "window";
    var W = window;
    var co = console;
    var A = Array;

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

    ep.css = function (name, value) {
        if (typeof name == "object") {
            $.forEach(name, function (value, name) {
                this._setCss(name, value);
            }, this);
            return this;
        }
        if (E._hasVal(value)) {
            this._setCss(name,value);
        } else {
            this._getCss(name);
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

    ep.width = function (width) {
        if (E._hasVal(width)) {
            this._setCss("width", typeof width == "number" ? width + "px" : width);
        } else {
            return this.node.clientWidth || parseInt(this._getCss("width")) || 0;
        }
    };

    ep.height = function (height) {
        if (E._hasVal(height)) {
            this._setCss("height", typeof height == "number" ? height + "px" : height);
        } else {
            return this.node.clientHeight || parseInt(this._getCss("height")) || 0;
        }
    };

    ep.html = function (html) {
        if (E._hasVal(html)) {
            this.node.innerHTML = html;
        } else {
            return this.node.innerHTML;
        }
    };

    ep._setCss = function (name,value) {

    };

    ep._getCss = function (name) {

    };

    /**
     * @class $
     * @extends Array
     * @param param
     * @returns {$}
     */
    var $ = function $(param) {
        if (this instanceof $) {
            A[pr].forEach.call(arguments, function (arg) {
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

    ["val", "html"].forEach(function (method) {
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
        if (A.isArray(param)) {
            param.forEach(this.add, this);
        } else {
            this._toElem(param).forEach(function (el) {
                this.push(el);
            }, this);
        }
    };

    p.hasClass = function (className) {
        if (!this._has()) return false;
        return this[0].hasClass(className);
    };

    p.find = function (selector) {
        if (!this._has()) return this;
        return new $(A[pr].slice.call(this[0].node.querySelectorAll(selector)));
    };

    p.clone = function () {
        if (!this._has()) return this;
        return new $(this[0].node.cloneNode(true));
    };

    p.show = function () {
        if (!this._has()) return this;
        this._toAll("css", ["display", "block"]);
    };

    p.hide = function () {
        if (!this._has()) return this;
        this._toAll("css", ["display", "none"]);
    };

    p.css = function (name, value) {
        if (typeof name == "object") {
            return this._toAll("css", [name]);
        } else {
            if (E._hasVal(value)) {
                return this._toAll("css", [name, value]);
            } else {
                return this[0].css(name);
            }
        }
    };

    p.toggleDisplay = function () {
        if (!this._has()) return this;
        this.each(function () {
            if (this.css("display") == "none") {
                this.show();
            } else {
                this.hide();
            }
        });
    };

    p.each = function (callback) {
        this.forEach(function (el, index) {
            callback.call(this.eq(index), el.node, index);
        }, this);
        return this;
    };

    p.children = function () {
        if (!this._has()) return this;
        return new $(A[pr].slice.call(this[0].node.childNodes));
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
        this._toElem(param, true).forEach(function (elem) {
            this[0].node.appendChild(elem.node);
        }, this);
    };

    p.prepend = function (param) {
        if (!this._has()) return this;
        this._toElem(param, true).forEach(function (elem) {
            var childs = A[pr].filter.call(this[0].node.childNodes, function (el) {
                return $.isElement(el)
            });
            if (childs.length) {
                this[0].node.insertBefore(elem.node, childs[0]);
            } else {
                this[0].node.appendChild(elem.node);
            }
        }, this);
    };

    p._toElem = function (param, notSelector) {
        if ($.isElement(param)) {
            return [new E(param)];
        } else if (param instanceof E) {
            return [param];
        } else if (param instanceof $) {
            return [param[0]];
        } else if (typeof param == "string") {
            if (/<.+?>/.test(param)) {
                return $.parse(param).map(function (el) {
                    return new E(el)
                });
            } else {
                if (notSelector) {
                    return [param];
                } else {
                    return A[pr].slice.call(D.querySelectorAll(param)).map(function (el) {
                        return new E(el)
                    });
                }
            }
        } else {
            co.log("wrong param!", param);
            return [];
        }
    };

    p._toAll = function (method, args) {
        this.forEach(function (elem) {
            elem[method].apply(elem, args);
        });
        return this;
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
            return this[0][method](arg);
        }
    };

    $.parse = function (html) {
        var div = D.createElement("div");
        div.innerHTML = html;
        return A[pr].filter.call(div.childNodes, function (elem) {
            return $.isElement(elem);
        });
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
    $.trim = (function () {
        if ("trim" in String[pr]) {
            return function (text) {
                return text.trim();
            }
        }
        return function (text) {
            return (text || "").replace(/^\s+|\s+$/g, "");
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
        if (A.isArray(some)) {
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
        if (A.isArray(some)) {
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

    $.addPlugin = function (callback) {
        callback($, E);
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