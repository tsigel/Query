interface IqueryEvent extends MouseEvent {
    touches?:ToucesList;
    changedTouches?: ToucesList;
    targetTouches?: ToucesList;
    pointerType?:string;
    pointerId?:number;
    type: string;
    pageX: number;
    pageY: number;
    clientX: number
    clientY: number
    force: number;
    radiusX: number;
    radiusY: number;
    screenX: number;
    screenY: number;
    target: HTMLElement;
    timeStamp: number;
    stopPropagation();
    preventDefault();
}
interface ToucesList {
    [key:number]: Itouch;
    length: number;
}
interface Itouch {
    clientX: number
    clientY: number
    force: number;
    identifier: number;
    pageX: number;
    pageY: number;
    radiusX: number;
    radiusY: number;
    screenX: number;
    screenY: number;
    target: HTMLElement;
}