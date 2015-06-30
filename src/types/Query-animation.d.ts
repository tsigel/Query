/// <reference path="Query-dom.d.ts" />

interface QueryStaticAnimation {
    animate(options:IAnimationOptions):IAnimation;
    delay(time:number):IAnimation;
}

interface IAnimationOptions {

    timeFunction?: string|timeFunc;
    duration?:number;
    loop?:number;
    yoyo?:boolean;
    success?:()=>void;
    step?:(progress:number, originProgress:number)=>void;
    apply?:(data:any, progress:number)=>void;
    start?:Object;
    end?:Object;
    exists?:Object;
    timeFunctions?: string|timeFunc;

}

interface timeFunc {
    (progress:number):number;
}

interface IAnimation {
    delay(time:number):IAnimation;
    animate(options:IAnimationOptions):IAnimation;
    revers():IAnimation;
    onEnd(callback):void;
    play():void;
}