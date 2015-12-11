# Query

its simple library for dom control.

# API

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
