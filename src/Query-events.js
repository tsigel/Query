(function (W, D) {
    $.addPlugin(function ($, E) {
        "use strict";

        var pr = "prototype", p = $[pr], ep = E[pr], A = Array, ID = "_ID_";

        /**
         * Функция наследования
         * @param child
         * @param parent
         */
        var extend = function (child, parent) {
            var P = function () {
            };
            P.prototype = parent.prototype;
            child.prototype = new P();
            child.prototype.constructor = child;
        };

        ///IMPORT:src/events/BaseEvent.js
        ///IMPORT:src/events/Touch.js
        ///IMPORT:src/events/Move.js
        ///IMPORT:src/events/Swipe.js
        ///IMPORT:src/events/Tap.js
        ///IMPORT:src/events/MultiTouch.js

        E[pr] = ep;

        /**
         * Подписываемся на событие
         * @param {string} eventName
         * @param {function} handler
         * @param {*} [context]
         */
        ep.on = function (eventName, handler, context) {

            if (!this._events) this._events = {};

            if (!this._ID) {
                this._ID = $._add(this);
                this._node[ID] = this._ID;
            }

            if (!this._events[eventName]) this._events[eventName] = [];

            var event_obj = {
                event: eventName,
                handler: handler,
                context: context || new $(this)
            };

            this._events[eventName].push(event_obj);

            if (eventName.indexOf("User") != 0) {
                var $handler = function (event) {
                    return handler.call(context || this, event);
                };
                event_obj.originHandler = $handler;
                this._node.addEventListener(eventName, $handler, false);
            } else {
                if (!this._hasCustom) {
                    this._addCustom();
                }
            }

        };

        /**
         * Отписываемся от события
         * @param {string} [eventName]
         * @param {function} [handler]
         * @returns {ep}
         */
        ep.off = function (eventName, handler) {

            if (!this._events) return this;

            $.forEach(this._events, function (events, $eventName) {

                if (!eventName || eventName == $eventName) {
                    events = events.filter(function (eventObject) {
                        if (!handler || handler == eventObject.handler) {
                            this._node.removeEventListener($eventName, eventObject.originHandler || eventObject.handler);
                            return false;
                        } else {
                            return true;
                        }
                    }, this);
                }

                if (events.length == 0) {
                    delete this._events[$eventName];
                }

            }, this);

            if (this._hasCustom && !$.some(this._events, function (events, eventName) {
                    return eventName.indexOf("User") == 0;
                })) {
                this._removeCustom();
            }

            if (!Object.keys(this._events).length) {
                $._remove(this._ID);
                this._node[ID] = null;
                this._ID = null;
            }

        };

        /**
         * Запускаем событие
         * @param {string} eventName
         * @param {Array} [args]
         * @returns {ep}
         */
        ep.trigger = function (eventName, args) {

            if (!this._events) return this;

            if (!eventName) {
                console.log("Неверные параметры!");
                return this;
            }

            if (!args) args = [];
            if (!A.isArray(args)) args = [args];

            E._splitEvents(eventName).forEach(function (event, index) {

                if (this._events[event]) {
                    this._startUserEvent(event, E._currentArgs(eventName, index, args.slice()));
                }

            }, this);

            return this;
        };

        /**
         * Запускаем событие (для trigger)
         * @param {string} event
         * @param {Array} localArgs
         * @private
         */
        ep._startUserEvent = function (event, localArgs) {
            this._events[event].forEach(function (eventObject) {
                eventObject.handler.apply(eventObject.context, localArgs);
            });
        };

        /**
         * Добавляем приватные обработчики для создания тач событий
         * @private
         */
        ep._addCustom = function () {
            this._hasCustom = true;
            var $this = this;
            /**
             * @param {IqueryEvent} e
             * @private
             */
            this._start = function (e) {

                e.preventDefault();
                $this._onStart(e);

            };

            this._node.addEventListener($.events.start, this._start, false);
        };

        /**
         * Обрабатываем прикосновение
         * @param {IqueryEvent} e
         * @private
         */
        ep._onStart = function (e) {

            var $this = this;

            E._fingers = E._fingers.concat(E._getTouches(e, true));
            this._createTouchEvent(e, E._fingers.slice(), "start");

            /**
             * Функция для подписки на движение пальца
             * @param {IqueryEvent} e
             */
            var move = function (e) {
                e.preventDefault();
                $this._onMove(e);
            };

            /**
             * Функция для подписки на отрыв пальца
             * @param {IqueryEvent} e
             */
            var end = function (e) {
                e.preventDefault();
                $this._onEnd(e);
                if (!E._fingers.length) {
                    D.removeEventListener($.events.move, move);
                    D.removeEventListener($.events.end, end);
                }
            };

            if (E._fingers.length == 1) {
                D.addEventListener($.events.move, move, false);
                D.addEventListener($.events.end, end, false);
            }

        };

        /**
         * Обрабатываем движение пальца
         * @param {IqueryEvent} e
         * @private
         */
        ep._onMove = function (e) {
            var fingers = E._getFingers(e);
            if (fingers.length == 1) {
                this._createMoveEvent(e, fingers);
            } else {
                this._createMultitouch(e, fingers);
            }
        };

        /**
         * Обрабатываем отрыв пальца
         * @param {IqueryEvent} e
         * @private
         */
        ep._onEnd = function (e) {
            var touches = E._getTouches(e, true);
            var fingers = E._getFingers(e, touches, true);
            this._createSwipe(e, fingers);
            this._createTapEvent(e, fingers);
            this._createTouchEvent(e, fingers, "end");
            E._clearEvents(fingers);
            E._fingers = E._fingers.filter(function (finger) {
                return !$.some(touches, E._getFingerById, E, finger.identifier);
            });
        };

        /**
         * Создаем событие прикосновения
         * @param {IqueryEvent} e
         * @param {Array} fingers массив пальцев
         * @param {string} state
         * @private
         */
        ep._createTouchEvent = function (e, fingers, state) {
            fingers.forEach(function (finger) {
                this._startEvent(new Touch(e, finger, state), finger);
            }, this);
        };

        /**
         * Создаем событие движения
         * @param {IqueryEvent} e
         * @param {Array} fingers
         * @private
         */
        ep._createMoveEvent = function (e, fingers) {
            var finger = fingers[0];
            this._startEvent(new Move(e, finger, E._Event.fingers[finger.identifier]), finger);
        };

        /**
         * Создаем мультитач событие
         * @param {IqueryEvent} e
         * @param {Array} fingers
         * @private
         */
        ep._createMultitouch = function (e, fingers) {
            fingers = fingers.sort(function (a, b) {
                return a.time - b.time
            });
            this._startEvent(new MultiTouch(e, fingers[0], fingers[1], E._Event.multitouch));
        };

        /**
         * Создаем тап событие
         * @param {IqueryEvent} e
         * @param {Array} fingers
         * @private
         */
        ep._createTapEvent = function (e, fingers) {
            fingers.forEach(function (finger) {
                if (E._isTap(finger)) {
                    this._startEvent(new Tap(e, finger), finger);
                }
            }, this);
        };

        /**
         * Создаем свайп событие
         * @param {IqueryEvent} e
         * @param {Array} fingers
         * @private
         */
        ep._createSwipe = function (e, fingers) {
            fingers.forEach(function (finger) {
                if (E._isSwipe(finger)) {
                    this._startEvent(new Swipe(e, finger, E._Event.fingers[finger.identifier]), finger);
                }
            }, this);
        };

        /**
         * Отписываемся от приватных событий
         * @private
         */
        ep._removeCustom = function () {
            this._hasCustom = false;
            this._node.removeEventListener($.events.start, this._start);
        };

        /**
         * Запускаем событие
         * @param EVENT
         * @param [finger]
         * @private
         */
        ep._startEvent = function (EVENT, finger) {
            if (!finger) {
                E._Event.multitouch = EVENT;
            } else {
                if (!E._Event.fingers[finger.identifier]) E._Event.fingers[finger.identifier] = {};
                E._Event.fingers[finger.identifier][EVENT.type] = EVENT;
            }
            this.trigger(EVENT.getEventString(), [EVENT.getClone()]);
        };

        /**
         * Проверяем надо ли запускать тап для этого пальца
         * @param finger
         * @returns {boolean}
         * @private
         */
        E._isTap = function (finger) {
            if (!E._Event.fingers[finger.identifier]) return false;
            if (!E._Event.fingers[finger.identifier].touch) return E._message("Нет тача!", "warn");
            if (E._Event.fingers[finger.identifier].move && E._Event.fingers[finger.identifier].move.distance > 15) return false;
            return (Date.now() - E._Event.fingers[finger.identifier].touch.time < E._tapTime);
        };

        /**
         * Проверяем надо ли запускать свайп для этого пальца
         * @param finger
         * @returns {boolean}
         * @private
         */
        E._isSwipe = function (finger) {
            return ((E._Event.fingers[finger.identifier]) &&
            (E._Event.fingers[finger.identifier].move) &&
            (E._Event.fingers[finger.identifier].move.distance > 30) &&
            (E._Event.fingers[finger.identifier].move.hasSwipeSpeed) &&
            (Date.now() - E._Event.fingers[finger.identifier].touch.time < E._tapTime));
        };

        /**
         * Получаем список пальцев из события
         * @param {IqueryEvent} e
         * @param {boolean} [startOrEnd]
         * @returns {Array}
         * @private
         */
        E._getTouches = function (e, startOrEnd) {
            var result = [];
            if ($.isPointer) {
                if (!e.pointerId) return E._message("Нет идентификатора пальца!");
                result.push(E._getFingerData(e));
            } else if (e.touches) {
                var touches = startOrEnd ? e.changedTouches : e.touches;
                result = A[pr].map.call(touches, function (touch) {
                    return E._getFingerData(touch);
                });
            } else {
                result.push(E._getFingerData(e));
            }
            return result;
        };

        /**
         * Получаем список пальцев
         * @param {IqueryEvent} e
         * @param {Array} [fingers]
         * @param {boolean} [isEnd]
         * @returns {Array}
         * @private
         */
        E._getFingers = function (e, fingers, isEnd) {
            var result;
            fingers = fingers || E._getTouches(e);
            if (isEnd) {
                result = E._fingers.filter(function (finger) {
                    return $.some(fingers, E._getFingerById, E, finger.identifier);
                });
            }

            E._fingers = E._fingers.map(function (finger) {
                var fingerData = $.findFirst(result || fingers, E._getFingerById, E, finger.identifier);
                if (fingerData.id != null) {
                    return E._getFingerData(fingerData.value, finger.time);
                } else {
                    return finger;
                }
            });
            return result || E._fingers.slice();
        };

        /**
         * Функция для итератора из статики $ (проверяем наличие пальца в E._fingers)
         * @param finger
         * @param index
         * @param id
         * @returns {boolean}
         * @private
         */
        E._getFingerById = function (finger, index, id) {
            return finger.identifier == id;
        };

        /**
         * Активные пальцы на экране
         * @type {Array}
         * @private
         */
        E._fingers = [];

        /**
         * Вывадит сообщение в лог
         * @param {string} message
         * @param {string} [type]
         * @param {*} [returns]
         * @returns {*}
         * @private
         */
        E._message = function (message, type, returns) {
            console[type || "error"](message);
            return returns || false;
        };

        /**
         * Время на тап
         * @type {number}
         * @private
         */
        E._tapTime = 300;

        E._Event = {
            multitouch: null,
            fingers: {}
        };

        /**
         * Очищаем события
         * @private
         */
        E._clearEvents = function (fingers) {
            if (fingers.length == 1) {
                E._Event.multitouch = null;
            }
            fingers.forEach(function (finger) {
                delete E._Event.fingers[finger.identifier];
            });
        };

        /**
         * Получаем данные по событию
         * @param data
         * @param [time]
         * @returns {{time: (*|number|Date), identifier: (*|number), pageX: (*|number|Number), pageY: (*|number|Number), target: (*|HTMLElement|string|Node|EventTarget)}}
         * @private
         */
        E._getFingerData = function (data, time) {
            return {
                time: time || data.timeStamp || Date.now(),
                identifier: data.identifier || data.pointerId || 0,
                pageX: data.pageX,
                pageY: data.pageY,
                target: data.target
            }
        };

        /**
         * Рассчитываем аргументы для trigger
         * @param {string} eventName
         * @param {number} index
         * @param {Array} args
         * @returns {Array}
         * @private
         */
        E._currentArgs = function (eventName, index, args) {
            var arr = eventName.split(":");
            arr.splice(0, index + 1);
            return arr.concat(args);
        };

        /**
         * Получаем список событий для запуска для trigger
         * @param {string} eventName
         * @returns {Array}
         * @private
         */
        E._splitEvents = function (eventName) {
            var events = eventName.split(":"), result = [];
            for (var i = 0; i < events.length; i++) {
                result.push(events.slice(0, i + 1).join(":"));
            }
            return result;
        };

        /**
         * Получаем обёртку над элементом
         * @param node
         * @returns {*}
         * @private
         */
        E._createE = function (node) {
            return $._getById(node[ID]) || new E(node);
        };

        $._elems = {};

        $._add = function (element) {
            var uuid;
            while (!(uuid && !(uuid in this._elems))) {
                uuid = $.guuid();
            }
            this._elems[uuid] = element;
            return uuid;
        };

        $._remove = function (uuid) {
            delete this._elems[uuid];
        };

        $._getById = function (uuid) {
            return this._elems[uuid] || null;
        };

        ["on", "off", "trigger"].forEach(function (method) {
            p[method] = function () {
                return this._toAll(method, A[pr].slice.call(arguments));
            }
        });

    });
})(window["$window"] || window, window["$document"] || document);