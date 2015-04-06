/// <reference path="./Query-dom.d.ts" />

interface QueryEvents extends QueryDom {

    on(eventName:string, handler, context?:any):QueryEvents;
    off(eventName?:string, handler?):QueryEvents;

    trigger(eventName:string, args?:any);
    trigger(eventName:string, args?:Array<any>);

}