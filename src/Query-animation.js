(function (W, D) {
    "use strict";

    $.addPlugin(function ($, E) {

        ///IMPORT:src/Animations/TimeFuncs.js

        var pr = "prototype", p = $[pr], ep = E[pr];

        var AC = function () {
            this.active = 0;
            this.step = 1;
            this.animations = [];
        };

        AC[pr].delay = function (time) {
            this.animations.push({
                start: function () {
                    setTimeout(function () {
                        that._endAnimation();
                    }, time);
                }
            });
            var that = this;
            return this;
        };

        AC[pr].revers = function () {
            var that = this;
            this.animations.push({
                start: function () {
                    that.step = that.step * -1;
                    that._endAnimation();
                }
            });
            return this;
        };

        AC[pr]._endAnimation = function () {
            var that = this;
            requestAnimationFrame(function () {
                var an = that.animations[that.active];
                if (an.success) an.success();
                that.active += that.step;
                if (that.active in that.animations) {
                    that.animations[that.active].start(that.step > 0);
                } else {
                    that.success(that);
                }
            });
        };

        AC[pr].onEnd = function (callback) {
            this.success = callback;
        };

        AC[pr].play = function () {
            this.active = 0;
            this.step = 1;
            this.animations[0].start(true);
        };

        AC[pr].animate = function (options) {

            var startTime, that = this,
                timeFunction = getTimeFunc(options.timeFunction) || Ease.linear,
                duration = options.duration || 300,
                animations = getStep(options, timeFunction),
                state = 0,
                loop = options.loop || 1,
                cacheDirection,
                step;

            var control = {
                stop: function () {
                    $._removeAnimation(frame);
                },
                end: function () {
                    this.stop();
                    step(timeFunction(1));
                },
                onEnd: function () {
                    if (options.loop != -1) state++;
                    if (state == loop) {
                        that._endAnimation();
                    } else {
                        cacheDirection = options.yoyo ? !cacheDirection : cacheDirection;
                        this._start(cacheDirection);
                    }
                },
                success: options.success,
                start: function (direction) {
                    cacheDirection = direction;
                    state = 0;
                    this._start(direction);
                },
                _start: function (direction) {
                    startTime = Date.now();
                    step = direction ? animations.play : animations.reverse;
                    $._addAnimation(frame);
                }
            };

            var frame = function () {

                var progress = (Date.now() - startTime) / duration;
                if (progress > 1) progress = 1;

                step(progress);

                if (progress == 1) {
                    $._removeAnimation(frame);
                    control.onEnd();
                }
            };

            this.animations.push(control);

            if (this.animations.length == 1) {
                requestAnimationFrame(function () {
                    that.animations[0].start(true);
                });
            }

            return this;

        };


        var getTimeFunc = function (t) {
                if (!t) {
                    return null;
                } else if (typeof t == "string") {
                    if (t in Ease) {
                        return Ease[t];
                    } else {
                        console.warn("Не удалось найти ф-цию времени!");
                        return null;
                    }
                } else {
                    return t;
                }
            },
            getStep = function (options, timeFunc) {

                if (options.step) {
                    return function (progress) {
                        return options.step(timeFunc(progress), progress);
                    }
                }

                var start = {},
                    end = {},
                    exists = {},
                    timeFunctions = {},
                    delta = {}, reg = /[^a-z]/g;

                if (!options.exists) options.exists = {};
                if (!options.timeFunctions) options.timeFunctions = {};

                $.forEach(options.start, function (value, name) {
                    exists[name] = options.exists[name] || value.replace(reg, "") || options.end[name].replace(reg, "");
                    start[name] = parseFloat(value);
                    end[name] = parseFloat(options.end[name]);
                    delta[name] = end[name] - start[name];
                    if (delta[name] == 0) {
                        delete start[name];
                        delete end[name];
                        delete exists[name];
                    } else {
                        timeFunctions[name] = getTimeFunc(options.timeFunctions[name]) || timeFunc;
                    }
                });

                return {
                    play: function (progress) {
                        var result = {};
                        Object.keys(exists).forEach(function (name) {
                            result[name] = start[name] + (delta[name] * timeFunctions[name](progress)) + exists[name];
                        });
                        options.apply(result, progress);
                    },
                    reverse: function (progress) {
                        var result = {};
                        Object.keys(exists).forEach(function (name) {
                            result[name] = end[name] - (delta[name] * timeFunctions[name](progress)) + exists[name];
                        });
                        options.apply(result, progress);
                    }

                };

            };

        $._animations = [];

        $.timeFunctions = Ease;

        $._addAnimation = function (callback) {
            this._animations.push(callback);
            if (this._animations.length == 1) {
                this._tick();
            }
        };

        $._removeAnimation = function (callback) {
            this._animations.splice(this._animations.indexOf(callback), 1);
        };

        $._tick = function () {
            requestAnimationFrame(function tick() {
                if ($._animations.length) {
                    $._animations.forEach(function (callback) {
                        callback();
                    });
                    requestAnimationFrame(tick);
                }
            });
        };

        $.animate = function (options) {
            var ac = new AC();
            ac.animate(options);
            return ac;
        };

        $.delay = function (time) {
            var ac = new AC();
            ac.delay(time);
            return ac;
        };

    });

})(window["$window"] || window, window["$document"] || document);