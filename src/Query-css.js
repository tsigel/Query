(function (W, D) {
    $.addPlugin(function ($, E) {
        "use strict";

        ///IMPORT:src/Matrix.js

        var pr = "prototype", ep = E[pr], p = $[pr], A = Array, r = 180 / Math.PI,
            Matrix = window["MSCSSMatrix"] || window["WebKitCSSMatrix"] || CSSMatrix;


        ep.transform = function (t) {
            var str = this._getCss("transform");
            if (!this._t || this._t.cache != str) {
                this._t = E._parseMatrix(str);
            }
            if (!E._hasVal(t)) {
                return {
                    translate: {
                        x: this._t.translate.x,
                        y: this._t.translate.y,
                        z: this._t.translate.z
                    },
                    scale: {
                        x: this._t.scale.x,
                        y: this._t.scale.y,
                        z: this._t.scale.z
                    },
                    rotate: {
                        x: this._t.rotate.x,
                        y: this._t.rotate.y,
                        z: this._t.rotate.z
                    }
                }
            } else {
                $.forEach(t, function (value, name) {
                    $.forEach(value, function (value, sunName) {
                        this._t[name][sunName] = value;
                    }, this);
                }, this);
                this._t.cache = E._createMatrix(this._t);
                this._setCss("transform", this._t.cache);
            }
        };

        E._parseMatrix = function (s) {
            var m;
            if (s == "none") {
                m = new Matrix();
            } else {
                m = new Matrix(s);
            }
            var sX = Math.sqrt(m.m11 * m.m11 + m.m12 * m.m12 + m.m13 * m.m13),
                sY = Math.sqrt(m.m21 * m.m21 + m.m22 * m.m22 + m.m23 * m.m23),
                sZ = Math.sqrt(m.m31 * m.m31 + m.m32 * m.m32 + m.m33 * m.m33);

            var rX = Math.atan2(-m.m32 / sZ, m.m33 / sZ) / r,
                rY = Math.asin(m.m31 / sZ) / r,
                rZ = Math.atan2(-m.m21 / sY, m.m11 / sX) / r;

            if (m.m21 === 1 || m.m21 === -1) {
                rX = 0;
                rY = m.m21 * -Math.PI / 2;
                rZ = m.m21 * Math.atan2(m.m23 / sY, m.m22 / sY) / r
            }

            var tX = m.m41 / sX,
                tY = m.m42 / sX,
                tZ = m.m43 / sX;

            return {
                translate: {x: $.floor(tX), y: $.floor(tY), z: $.floor(tZ)},
                rotate: {x: $.floor(rX), y: $.floor(rY), z: $.floor(rZ)},
                scale: {x: $.roundTo(sX, 4), y: $.roundTo(sY, 4), z: $.roundTo(sZ, 4)},
                cache: s
            }
        };

        E._createMatrix = function (t) {
            return new Matrix()
                .translate(t.translate.x, t.translate.y, t.translate.z)
                .rotate(t.rotate.x, t.rotate.y, t.rotate.z)
                .scale(t.scale.x, t.scale.y, t.scale.z)
                .toString().replace(/\.0+?([\),])/g, "$1");
        };

        var defaultDo = {
            scale: function (s) {
                return {x: s, y: s};
            },
            rotate: function (r) {
                return {z: r};
            }
        };

        ["translate", "scale", "rotate"].forEach(function (method) {
            p[method] = function (data) {
                if (E._hasVal(data)) {
                    var t = {};
                    if (typeof data == "object") {
                        t[method] = data;
                        return this._toAll("transform", [t]);
                    } else {
                        t[method] = defaultDo[method](data);
                        return this._toAll("transform", [t]);
                    }
                } else {
                    return this[0].transform().rotate;
                }
            };
        });

        p.transform = function (t) {
            return this._setOrGet("transform", t);
        };

    });
})(window["$window"] || window, window["$document"] || document);