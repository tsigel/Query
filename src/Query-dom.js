var $ = (function (W, D) {
    "use strict";

    var pr = "prototype",
        c = "constructor",
        d = "document",
        w = "window",
        co = console,
        A = Array;

    /**
     * @class E
     * @param {HTMLElement|HTMLInputElement} node
     * @constructor
     */
    var E = function (node) {
        this._node = node;
    };

    /**
     * Ссылка на прототип для быстрой и компактной записи (профит при обфусцировании)
     * @type {Object}
     */
    var ep = E.prototype;

    /**
     * Получаем или ставим атрибут
     * @param {string} name
     * @param {string} [value]
     * @returns {string|null}
     */
    ep.attr = function (name, value) {
        if (E._hasVal(value)) {
            this._node.setAttribute(name, value);
        } else {
            return this._node.getAttribute(name) || "";
        }
    };

    /**
     * Добавляем класс
     * @param {string} className
     */
    ep.addClass = function (className) {
        if (!this.hasClass(className)) {
            var classList = this._node.className.split(" ");
            classList.push(className);
            this._node.className = $.trim(classList.join(" "));
        }
    };

    /**
     * Убираем класс
     * @param {string} className
     */
    ep.removeClass = function (className) {
        if (this.hasClass(className)) {
            var classList = this._node.className.split(" ");
            classList.splice(classList.indexOf(className), 1);
            this._node.className = $.trim(classList.join(" "));
        }
    };

    /**
     * Добавляем/получаем стили элемента
     * @param {string|Object} name
     * @param [value]
     * @returns {string|null}
     */
    ep.css = function (name, value) {
        if (typeof name == "object") {
            $.forEach(name, function (value, name) {
                this._setCss(name, value);
            }, this);
            return this;
        }
        if (E._hasVal(value)) {
            this._setCss(name, value);
        } else {
            return this._getCss(name);
        }
    };

    /**
     * Добавляем/убираем класс
     * @param {string} className
     */
    ep.toggleClass = function (className) {
        if (this.hasClass(className)) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
    };

    /**
     * Добавляем/получаем value элемента
     * @param {string} [value]
     * @returns {string|string}
     */
    ep.val = function (value) {
        if (E._hasVal(value)) {
            this._node.value = value;
        } else {
            return this._node.value || "";
        }
    };

    /**
     * Проверяем наличие класса
     * @param {string} className
     * @returns {boolean}
     */
    ep.hasClass = function (className) {
        return (this._node.className.split(" ").indexOf(className) != -1);
    };

    /**
     * Удаляем атрибут
     * @param {string} name
     */
    ep.removeAttr = function (name) {
        this._node.removeAttribute(name);
    };

    /**
     * Добавляем/получаем ширину
     * @param {string|number} [width]
     * @returns {number}
     */
    ep.width = function (width) {
        if (E._hasVal(width)) {
            this._setCss("width", typeof width == "number" ? width + "px" : width);
        } else {
            return this._node.clientWidth || parseInt(this._getCss("width")) || 0;
        }
    };

    /**
     * Добавляем/получаем высоту
     * @param {string|number} [height]
     * @returns {number}
     */
    ep.height = function (height) {
        if (E._hasVal(height)) {
            this._setCss("height", typeof height == "number" ? height + "px" : height);
        } else {
            return this._node.clientHeight || parseInt(this._getCss("height")) || 0;
        }
    };

    /**
     * Добавляем/получаем содержимое элемента
     * @param {string} [html]
     * @returns {string}
     */
    ep.html = function (html) {
        if (E._hasVal(html)) {
            this._node.innerHTML = html;
        } else {
            return this._node.innerHTML;
        }
    };

    /**
     * Устанавливаем стиль элемента
     * @param {string} name
     * @param {string} value
     * @private
     */
    ep._setCss = function (name, value) {
        var $name;
        name = $.camelCase(name);
        if (!name in E.test.style) {
            if (!E._activePrefix) {
                if (!E._prefexes.some(function (prefix) {
                        var $name = $.camelCase(prefix + name);
                        if ($name in E.test.style) {
                            E._activePrefix = prefix;
                            name = $name;
                            return true;
                        }
                    })) {
                    co.warn("Не удалось найти префикс!", name, value);
                }
            } else {
                $name = $.camelCase(E._activePrefix + name);
                if ($name in E.test.style) {
                    name = $name;
                } else {
                    co.warn("Не корректный стиль!", name, value);
                }
            }
        }

        this._node.style[name] = value;
    };

    /**
     * Получаем стиль
     * @param {string} name
     * @returns {string}
     * @private
     */
    ep._getCss = function (name) {

        name = $.camelCase(name);
        var styles = [this._node.style, getComputedStyle(this._node)];
        var result = styles[0][name] || styles[1][name] || "";

        var check = function (name, callback) {
            return styles.some(function (style) {
                var $name = $.camelCase(name);
                if ($name in style) {
                    result = style[$name];
                    callback ? callback() : false;
                    return true;
                }
            });
        };

        if (!result) {
            if (E._activePrefix) {
                if (!check(E._activePrefix + name)) {
                    co.warn("Не удалось получить стиль!", name);
                }
            } else {
                if (!E._prefexes.some(function (prefix) {
                        return check(prefix + name, function () {
                            E._activePrefix = prefix;
                        });
                    })) {
                    co.warn("Не удалось получить стиль и префикс!", name);
                }
            }
        }
        return result;
    };

    /**
     * Проверяет наличие значения
     * @param val
     * @returns {boolean}
     * @private
     */
    E._hasVal = function (val) {
        return val != undefined;
    };

    E._createE = function (node) {
        return new E(node);
    };

    /**
     * Активный префикс
     * @type {string}
     * @private
     */
    E._activePrefix = "";

    /**
     * Массив префиксов браузеров
     * @type {string[]}
     * @private
     */
    E._prefexes = [
        "-moz-",
        "-ms-",
        "-webkit-",
        "-o-"
    ];

    /**
     * @type {HTMLElement}
     */
    E.test = D.createElement("DIV");

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

    ["val", "html", "width", "height"].forEach(function (method) {
        p[method] = function (val) {
            return this._setOrGet(method, val);
        }
    });

    ["attr"].forEach(function (method) {
        p[method] = function (name, value) {
            return this._setOrGet(method, value, name);
        }
    });

    /**
     * Добавляем элементы
     * @param param
     * @return $
     */
    p.add = function (param) {
        if (A.isArray(param)) {
            param.forEach(this.add, this);
        } else {
            this._toElem(param).forEach(function (el) {
                this.push(el);
            }, this);
        }
        return this;
    };

    /**
     * Проверяет наличие класса у первого элемента коллекции
     * @param {string} className
     * @returns {boolean}
     */
    p.hasClass = function (className) {
        if (!this._has()) return false;
        return this[0].hasClass(className);
    };

    /**
     * Ищем элементы в первом элементе коллекции
     * @param selector
     * @returns {$}
     */
    p.find = function (selector) {
        if (!this._has()) return this;
        return new $(A[pr].slice.call(this[0]._node.querySelectorAll(selector)));
    };

    /**
     * Получаем копию ноды первого элемента коллекции
     * @returns {$}
     */
    p.clone = function () {
        if (!this._has()) return this;
        return new $(this[0]._node.cloneNode(true));
    };

    /**
     * Показываем все элементы коллекции
     * @returns {$}
     */
    p.show = function () {
        if (!this._has()) return this;
        this._toAll("css", ["display", "block"]);
    };

    /**
     * Скрываем все элементы коллекции
     * @returns {$}
     */
    p.hide = function () {
        if (!this._has()) return this;
        this._toAll("css", ["display", "none"]);
    };

    /**
     * Применяем стили всем элементам коллекции или получаем стиль первого
     * @param {string|Object} name
     * @param {string} [value]
     * @returns {string|$}
     */
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

    /**
     * Скрывает или показывает все элементы коллекции
     * @returns {$}
     */
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

    /**
     * Перебираем все элементы коллекции
     * @param callback
     * @returns {$}
     */
    p.each = function (callback) {
        this.forEach(function (el, index) {
            callback.call(this.eq(index), el._node, index);
        }, this);
        return this;
    };

    /**
     * Получаем коллекцию элементов дочерних первому элементу коллекции
     * @returns {$}
     */
    p.children = function () {
        if (!this._has()) return this;
        return new $(A[pr].slice.call(this[0]._node.childNodes));
    };

    /**
     * Получаем новую коллекцию с элементом по номеру
     * @param index
     * @returns {$}
     */
    p.eq = function (index) {
        if (!this._has()) return this;
        return new $(this[index || 0]);
    };

    /**
     * Получаем ДОМ элемент из коллекции по номеру
     * @param index
     * @returns {HTMLElement|null}
     */
    p.get = function (index) {
        if (!this._has()) return null;
        return this[index || 0]._node;
    };

    /**
     * Получаем коллекцию из родительского элемента
     */
    p.parent = function () {
        if (!this._has()) return this;
        return new $(this[0]._node.parentNode);
    };

    /**
     * Добавляем в конец набора элементов
     * @param param
     * @returns {$}
     */
    p.append = function (param) {
        if (!this._has()) return this;
        this._toElem(param, true).forEach(function (elem) {
            this[0]._node.appendChild(elem._node);
        }, this);
    };

    /**
     * Добавляем в начало набора элементов
     * @param param
     * @returns {$}
     */
    p.prepend = function (param) {
        if (!this._has()) return this;
        this._toElem(param, true).forEach(function (elem) {
            var childs = A[pr].filter.call(this[0]._node.childNodes, function (el) {
                return $.isElement(el)
            });
            if (childs.length) {
                this[0]._node.insertBefore(elem._node, childs[0]);
            } else {
                this[0]._node.appendChild(elem._node);
            }
        }, this);
    };

    /**
     * Приводим элементы к 1 типу
     * @param param
     * @param notSelector
     * @returns {*}
     * @private
     */
    p._toElem = function (param, notSelector) {
        if ($.isElement(param)) {
            return [E._createE(param)];
        } else if (param instanceof E) {
            return [param];
        } else if (param instanceof $) {
            return [param[0]];
        } else if (typeof param == "string") {
            if (/<.+?>/.test(param)) {
                return $.parse(param).map(function (el) {
                    return E._createE(el)
                });
            } else {
                if (notSelector) {
                    return [{_node: document.createTextNode(param)}];
                } else {
                    return A[pr].slice.call(D.querySelectorAll(param)).map(function (el) {
                        return E._createE(el)
                    });
                }
            }
        } else {
            co.log("wrong param!", param);
            return [];
        }
    };

    /**
     * Выполняем для всех элементов коллекции
     * @param method
     * @param args
     * @returns {$}
     * @private
     */
    p._toAll = function (method, args) {
        this.forEach(function (elem) {
            elem[method].apply(elem, args);
        });
        return this;
    };

    /**
     * Проверяем есть ли элементы в коллекции
     * @returns {boolean}
     * @private
     */
    p._has = function () {
        if (!this.length) {
            co.warn("not length!");
            return false;
        } else {
            return true;
        }
    };

    /**
     * Задаем или получаем данные для элементов коллекции
     * @param method
     * @param argToCheck
     * @param [arg]
     * @returns {*}
     * @private
     */
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

    /**
     * Парсим строку превращая её в ДОМ
     * @param html
     * @returns {Array}
     */
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
        return text.split(/[^\d\w]/).map(function (str, index) {
            return index ? str.charAt(0).toUpperCase() + str.substr(1) : str;
        }).join("");
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
     * @param {*} [argument]
     */
    $.forEach = function (some, callback, context, argument) {
        if (A.isArray(some)) {
            some.forEach(function (value, id) {
                callback.call(context || this, value, id, argument);
            });
        } else {
            Object.keys(some).forEach(function (name) {
                callback.call(context || this, some[name], name, argument);
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
                return callback.call(context || this, value, index, argument);
            });
        } else {
            return Object.keys(some).some(function (name) {
                return callback.call(context || this, some[name], name, argument);
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
        return !$.some(some, function (value, name) {
            return !callback.call(context || this, value, name, argument);
        });
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

    $.isPointer = false;

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
        }
    };

    (function () {
        if (window.navigator.msPointerEnabled) {
            $.events = events.win;
            $.isPointer = true;
        } else if (getEventSupport("touchmove")) {
            $.events = events.mobile;
        } else {
            $.events = events.mouse;
        }
    })();

    window["requestAnimationFrame"] = (function () {
        return window.requestAnimationFrame ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            window["oRequestAnimationFrame"] ||
            window["msRequestAnimationFrame"] ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    return $;
})(window["$window"] || window, window["$document"] || document);