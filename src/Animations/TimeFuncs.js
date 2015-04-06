var Ease = {

    linear: function (t) {
        return t;
    },

    get: function (amount) {
        if (amount < -1) {
            amount = -1;
        }
        if (amount > 1) {
            amount = 1;
        }
        return function (t) {
            if (amount == 0) {
                return t;
            }
            if (amount < 0) {
                return t * (t * -amount + 1 + amount);
            }
            return t * ((2 - t) * amount + (1 - amount));
        }
    },

    getPowIn: function (pow) {
        return function (t) {
            return Math.pow(t, pow);
        }
    },


    /**
     * Configurable exponential ease.
     * @method getPowOut
     * @param pow The exponent to use (ex. 3 would return a cubic ease).
     * @static
     **/
    getPowOut: function (pow) {
        return function (t) {
            return 1 - Math.pow(1 - t, pow);
        }
    },


    /**
     * Configurable exponential ease.
     * @method getPowInOut
     * @param pow The exponent to use (ex. 3 would return a cubic ease).
     * @static
     **/
    getPowInOut: function (pow) {
        return function (t) {
            if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
            return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
        }
    },


    /**
     * @method sineIn
     * @static
     **/
    sineIn: function (t) {
        return 1 - Math.cos(t * Math.PI / 2);
    },

    /**
     * @method sineOut
     * @static
     **/
    sineOut: function (t) {
        return Math.sin(t * Math.PI / 2);
    },

    /**
     * @method sineInOut
     * @static
     **/
    sineInOut: function (t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1)
    },

    /**
     * Configurable "back in" ease.
     * @method getBackIn
     * @param amount The strength of the ease.
     * @static
     **/
    getBackIn: function (amount) {
        return function (t) {
            return t * t * ((amount + 1) * t - amount);
        }
    },

    /**
     * Configurable "back out" ease.
     * @method getBackOut
     * @param amount The strength of the ease.
     * @static
     **/
    getBackOut: function (amount) {
        return function (t) {
            return (--t * t * ((amount + 1) * t + amount) + 1);
        }
    },

    /**
     * Configurable "back in out" ease.
     * @method getBackInOut
     * @param amount The strength of the ease.
     * @static
     **/
    getBackInOut: function (amount) {
        amount *= 1.525;
        return function (t) {
            if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
            return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
        }
    },


    /**
     * @method circIn
     * @static
     **/
    circIn: function (t) {
        return -(Math.sqrt(1 - t * t) - 1);
    },

    /**
     * @method circOut
     * @static
     **/
    circOut: function (t) {
        return Math.sqrt(1 - (--t) * t);
    },

    /**
     * @method circInOut
     * @static
     **/
    circInOut: function (t) {
        if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },

    /**
     * @method bounceIn
     * @static
     **/
    bounceIn: function (t) {
        return 1 - Ease.bounceOut(1 - t);
    },

    /**
     * @method bounceOut
     * @static
     **/
    bounceOut: function (t) {
        if (t < 1 / 2.75) {
            return (7.5625 * t * t);
        } else if (t < 2 / 2.75) {
            return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
        } else if (t < 2.5 / 2.75) {
            return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
        } else {
            return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
        }
    },

    /**
     * @method bounceInOut
     * @static
     **/
    bounceInOut: function (t) {
        if (t < 0.5) return Ease.bounceIn(t * 2) * .5;
        return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
    },


    /**
     * Configurable elastic ease.
     * @method getElasticIn
     * @param amplitude
     * @param period
     * @static
     **/
    getElasticIn: function (amplitude, period) {
        var pi2 = Math.PI * 2;
        return function (t) {
            if (t == 0 || t == 1) return t;
            var s = period / pi2 * Math.asin(1 / amplitude);
            return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
        }
    },

    /**
     * Configurable elastic ease.
     * @method getElasticOut
     * @param amplitude
     * @param period
     * @static
     **/
    getElasticOut: function (amplitude, period) {
        var pi2 = Math.PI * 2;
        return function (t) {
            if (t == 0 || t == 1) return t;
            var s = period / pi2 * Math.asin(1 / amplitude);
            return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
        }
    },
    /**
     * Configurable elastic ease.
     * @method getElasticInOut
     * @param amplitude
     * @param period
     * @static
     **/
    getElasticInOut: function (amplitude, period) {
        var pi2 = Math.PI * 2;
        return function (t) {
            var s = period / pi2 * Math.asin(1 / amplitude);
            if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
        }
    }
};


/**
 * @method backOut
 * @static
 **/
Ease.backOut = Ease.getBackOut(1.7);

/**
 * @method backIn
 * @static
 **/
Ease.backIn = Ease.getBackIn(1.7);

/**
 * @method backInOut
 * @static
 **/
Ease.backInOut = Ease.getBackInOut(1.7);

/**
 * @method elasticIn
 * @static
 **/
Ease.elasticIn = Ease.getElasticIn(1, 0.3);

/**
 * @method elasticInOut
 * @static
 **/
Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);

/**
 * @method elasticOut
 * @static
 **/
Ease.elasticOut = Ease.getElasticOut(1, 0.3);

/**
 * @method quadIn
 * @static
 **/
Ease.quadIn = Ease.getPowIn(2);

/**
 * @method quadOut
 * @static
 **/
Ease.quadOut = Ease.getPowOut(2);
/**
 * @method quadInOut
 * @static
 **/
Ease.quadInOut = Ease.getPowInOut(2);


/**
 * @method cubicIn
 * @static
 **/
Ease.cubicIn = Ease.getPowIn(3);
/**
 * @method cubicOut
 * @static
 **/
Ease.cubicOut = Ease.getPowOut(3);
/**
 * @method cubicInOut
 * @static
 **/
Ease.cubicInOut = Ease.getPowInOut(3);

/**
 * @method quartIn
 * @static
 **/
Ease.quartIn = Ease.getPowIn(4);
/**
 * @method quartOut
 * @static
 **/
Ease.quartOut = Ease.getPowOut(4);
/**
 * @method quartInOut
 * @static
 **/
Ease.quartInOut = Ease.getPowInOut(4);


/**
 * @method quintIn
 * @static
 **/
Ease.quintIn = Ease.getPowIn(5);
/**
 * @method quintOut
 * @static
 **/
Ease.quintOut = Ease.getPowOut(5);
/**
 * @method quintInOut
 * @static
 **/
Ease.quintInOut = Ease.getPowInOut(5);
