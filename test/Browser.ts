module Browser {

    interface IElement extends HTMLElement {
        events: {[key: string]: Array<(event) => any>};
        trigger(eventName:string, event);
    }

    interface ITouches {
        [key: number]:ITouchE;
        length:number;
    }

    interface ITouchE {
        timeStamp?:number;
        pageX?:number;
        pageY:number;
        target?:HTMLElement;
    }

    interface IEvent {

        preventDefault():void;
        stopPropagation():void;

        type:string;
        pointerId?:number;
        timeStamp?:number;
        pageX?:number;
        pageY?:number;
        target?:IElement;

        touches?:ITouches;
        changedTouches?:ITouches;

    }

    interface IEventOptions {
        type?:string;
        id: number;
        pageX?:number;
        pageY: number;
        target?:IElement;
        touches?:ITouches;
        changedTouches?:ITouches;
    }

    export function throwError(message:string) {
        console.error(message);
        throw new Error(message);
    }

    export function isPointer() {
        return !!window.navigator.msPointerEnabled;
    }

    export function isTouch() {
        var event = "ontouchmove";
        var target = document.createElement("div");
        target.setAttribute(event, "");
        var isSupported = typeof target[event] === "function";
        if (typeof target[event] !== "undefined") target[event] = null;
        target.removeAttribute(event);
        return isSupported;
    }

    export function isMouse() {
        return !Browser.isPointer() && !Browser.isTouch();
    }

    export function getType(type:string):string {
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
        if (Browser.isPointer()) return events.win[type];
        if (Browser.isTouch()) return events.mobile[type];
        if (Browser.isMouse()) return events.mouse[type];
    }

    export function createElement(tagName?:string, className?:string, parent?:HTMLElement) {

        var $element:IElement = <any>document.createElement(tagName || "div");
        if (className) $element.className = className;
        if (parent) parent.appendChild($element);

        $element.events = {};

        $element.addEventListener = function (eventName:string, handler, delegate?:boolean) {

            if (!eventName) Browser.throwError("Не передано имя события!");
            if (!handler) Browser.throwError("Не передан обработчик события!");

            if (!this.events[eventName]) this.events[eventName] = [];

            this.events[eventName].push(handler);

        };

        $element.removeEventListener = function (eventName:string, handler, delegate?:boolean) {

            if (!eventName) Browser.throwError("Не передано имя события!");
            if (!handler) Browser.throwError("Не передан обработчик события!");

            if (this.events[eventName]) {
                this.events[eventName] = this.events[eventName].filter(function ($handler) {
                    return handler != $handler;
                });
            }

        };

        $element.trigger = function (eventName, Event?) {

            if (!eventName) Browser.throwError("Не передано имя события!");

            if (eventName in this.events) {
                this.events[eventName].forEach((handler) => {
                    handler.call(this, Event);
                });
            }

        };

        return $element;

    }

    export function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    export class $Event implements IEvent {

        public type:string;
        public pointerId:number = null;
        public timeStamp:number = null;
        public pageX:number = null;
        public pageY:number = null;
        public target:HTMLElement = null;
        public touches:ITouches = null;
        public changedTouches:ITouches = null;

        constructor(options:IEventOptions) {
            this.init(options);
        }

        public preventDefault():void {
        }

        public stopPropagation():void {
        }

        private init(options:IEventOptions):void {

            this.type = Browser.getType(options.type || "start");

            if (Browser.isPointer()) {
                this.initPointer(options);
            } else if (Browser.isTouch()) {
                this.initTouch(options);
            } else if (Browser.isMouse()) {
                this.initMouse(options)
            }

        }

        private initPointer(options:IEventOptions):void {
            this.pointerId = options.id || Browser.randomInt(0, 1000);
            $Event.setData(this, options);
        }

        private initTouch(options:IEventOptions):void {

            var touch = $Event.setData({}, options);
            touch.identifier = options.id || Browser.randomInt(0, 1000);

            if (this.type == "touchstart" || this.type == "touchmove") {

                this.touches = options.touches || {
                    length: 1,
                    0: touch
                };

                this.changedTouches = {
                    length: 1,
                    0: touch
                };

            } else if (this.type == "touchend") {

                this.touches = options.touches || <any>{length: 0};
                this.changedTouches = options.changedTouches || {
                    length: 1,
                    0: touch
                };

            } else {
                Browser.throwError("Неизвестный тип события!");
            }

        }

        private initMouse(options:IEventOptions):void {
            $Event.setData(this, options)
        }

        private static setData(object, data:IEventOptions) {
            object.pageX = data.pageX || Browser.randomInt(0, innerWidth);
            object.pageY = data.pageY || Browser.randomInt(0, innerHeight);
            object.target = data.target || document.body;
            return object;
        }
    }

}

var $document = <any>Browser.createElement("document", "document", document.body);

$document.createElement = function (tagName) {
    return document.createElement(tagName);
};

$document.querySelectorAll = function (selector) {
    return document.querySelectorAll(selector);
};
