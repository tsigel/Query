# Query

its simple library for dom control.

# API

#### addClass(className: string)
#### removeClass(className: string)
#### toggleClass(className: string)
#### removeAttr(name)
#### show()
#### hide()
#### toggleDisplay() // switch display none/block
#### val(): string
#### val(value: string)
#### html(): string
#### html(html: string)
#### width(): number // width of first element collection
#### width(width: number) // set width for all elements collection
#### height(): number // height of first element collection
#### height(height: number) // set height for all elements collection
#### attr(name: string): string //value of first element collection
#### attr(name: string, value: string)
#### add(element: Array<string|Element|$>|string|Element|$)
#### hasClass(className: string): boolean // of first element collection
#### find(selector: string): $
#### clone(): $
#### css(name: string): string
#### css(name: string, value: string)
#### css(style: {[key: string]: string});
#### each(callback: ($elem: $, elem: HTMLElement, index: number))
#### children(): $
#### eq(index: number): $
#### get(index: number): HTMLElement
#### parent(): $
#### append(element: Array<string|Element|$>|string|Element|$): $
#### prepend(element: Array<string|Element|$>|string|Element|$): $


## Static

#### isPointer: boolean (is windows with pointer events)
#### $.events: {start: string; move: string; end: string} 
example


if mobile  

```
console.log($.events) // {start: 'touchstart', move: 'touchmove', end: 'touchend'}
```

if desktop

```
console.log($.events) // {start: 'mousedown', move: 'mousemove', end: 'mouseup'}
```

#### $.roundTo(someNumber: number, roundLength: number): number
example 

```
$.roundTo(25.2222222, 2) // 25.22
```

#### $.floor(someNumber: number) // number
example 

```
$.floor(25.2222222) // 25
```

```
$.floor(25.8222222) // 26
```

#### $.findFirst(some: Array|Object, callback, context, argument): Object;
example

```
$.findFirst([{id: 1}, {id: 2}, {id: 3}], function (item) {
    return item.id === 2;
}) /// {id: 1, value: {id: 2}};
```

#### $.isElement(some: Node): boolean
#### $.guuid() // uuid like java ("a515ed3f-587c-2e8d-a6ee-db123ba8ce75")
#### $.camelCase('some string-with.some') // 'someStringWithSome'
#### $.trim(some: string) 
#### $.randomInt(min: number, max: number): number
#### $.random(min: number, max: number): number
#### $.parse(html: string): Array<HTMLElement>

example

```
$.parse('<div><span></span></div></div>') // [element: HTMLDivElement, element: HTMLSpanElement];
```

