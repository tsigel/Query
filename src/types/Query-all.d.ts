/// <reference path="./Query-dom.d.ts" />
/// <reference path="./Query-events.d.ts" />
/// <reference path="./Query-animation.d.ts" />
/// <reference path="./Query-css.d.ts" />

interface Query extends QueryDom, QueryEvents, QueryCss {}
interface QueryStatic extends QueryStaticDom, QueryStaticAnimation {}