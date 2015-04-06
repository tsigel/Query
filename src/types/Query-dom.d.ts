interface IFind {
    id: string;
    value: any;
}

interface QueryStatic {

    (param:string):QueryDom;
    (param:Array<string>):QueryDom;
    (param:HTMLElement):QueryDom;
    (param:Array<HTMLElement>):QueryDom;

    new (param:string):QueryDom;
    new (param:Array<string>):QueryDom;
    new (param:HTMLElement):QueryDom;
    new (param:Array<HTMLElement>):QueryDom;


    /**
     * Парсим строку в элементы (игнорирует текстовые ноды)
     * @param html
     */
    parse(html:string):Array<HTMLElement>;

    /**
     * Возвращает дробное число в промежутке
     * @param min
     * @param max
     */
    random(min:number, max:number):number;

    /**
     * Возвращает целое число в промежутке
     * @param min
     * @param max
     */
    randomInt(min:number, max:number):number;

    /**
     * Обрезает пробелы и табы
     * @param text
     */
    trim(text:string):string;

    /**
     * Приводит строку в camelCase вид
     * @param text
     */
    camelCase(text:string):string;

    /**
     * Возвращает уникальный uuid
     */
    guuid():string;

    /**
     * Проверяем элемент ли это
     * @param some
     */
    isElement(some:any):boolean;

    /**
     * Итерируем объект
     * @param some объект
     * @param callback обработчик каждой итерации (value - значение итерации объекта, id - ключ)
     * @param context
     * @param param
     */
    forEach(some:Object, callback:(value?:any, id?:string, argument?:any)=>void, context?:any, param?:any):void;

    /**
     * Итерируем массив
     * @param some
     * @param callback
     * @param context
     * @param param
     */
    forEach<T>(some:Array<T>, callback:(value?:T, index?:number, argument?:any)=>void, context?:any, param?:any):void;

    some(some:Object, callback:(value?:any, id?:string, argument?:any)=>boolean, context?:any, param?:any):void;
    some<T>(some:Array<T>, callback:(value?:T, id?:string, argument?:any)=>boolean, context?:any, param?:any):void;

    every(some:Object, callback:(value?:any, id?:string, argument?:any)=>boolean, context?:any, param?:any):void;
    every<T>(some:Array<T>, callback:(value?:T, id?:string, argument?:any)=>boolean, context?:any, param?:any):void;

    findFirst(some:Object, callback:(value?:any, id?:string, argument?:any)=>boolean, context?:any, param?:any):IFind;
    findFirst<T>(some:Array<T>, callback:(value?:T, id?:string, argument?:any)=>boolean, context?:any, param?:any):IFind;

    floor(num:number):number;
    roundTo(num:number, toFix:number):number;

    addPlugin(callback:($:QueryStatic, E)=>void):void;

    events: {
        start: string;
        move: string;
        end: string;
    }

}

interface QueryDom {

    add(param:string):QueryDom;
    add(param:Array<string>):QueryDom;
    add(param:HTMLElement):QueryDom;
    add(param:Array<HTMLElement>):QueryDom;

    attr(name:string):string;
    attr(name:string, value:string):QueryDom;

    addClass(calassName:string):QueryDom;
    removeClass(calassName:string):QueryDom;
    toggleClass(calassName:string):QueryDom;

    css(name:string, value:string):QueryDom;
    css(name:string):string;
    css(name:Object):QueryDom;

    val(value:string):QueryDom;
    val():string;

    html(html:string):QueryDom;
    html():string;

    hasClass(className:string):boolean;

    removeAttr(attrName:string):QueryDom;

    width(width:string):QueryDom;
    width(width:number):QueryDom;
    width():number;

    height(width:string):QueryDom;
    height(width:number):QueryDom;
    height():number;

    find(selector:string):QueryDom;
    children():QueryDom;

    clone():QueryDom;

    show():QueryDom;
    hide():QueryDom;
    toggleDisplay():QueryDom;

    each(callback:(element:QueryDom, origin:HTMLElement, index:number)=>void):QueryDom;

    eq(index?:number):QueryDom;
    get(index?:number):HTMLElement;

    parent():QueryDom;

    append(html:string):QueryDom;
    append(htmls:Array<string>):QueryDom;
    append(elem:QueryDom):QueryDom;
    append(elem:HTMLElement):QueryDom;
    append(elems:Array<QueryDom>):QueryDom;
    append(elems:Array<HTMLElement>):QueryDom;

    prepend(html:string):QueryDom;
    prepend(htmls:Array<string>):QueryDom;
    prepend(elem:QueryDom):QueryDom;
    prepend(elem:HTMLElement):QueryDom;
    prepend(elems:Array<QueryDom>):QueryDom;
    prepend(elems:Array<HTMLElement>):QueryDom;
}