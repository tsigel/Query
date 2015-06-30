interface QueryCss {
    transform(transform?:ITransformation):QueryCss;
    translate(translate:ICoordinates):QueryCss;
    scale(scale:ICoordinates):QueryCss;
    rotate(rotate:ICoordinates):QueryCss;
}

interface ITransformation {
    translate?: ICoordinates;
    scale?:ICoordinates;
    rotate?:ICoordinates;
}

interface ICoordinates {
    x?: number;
    y?: number;
    z?: number;
}

