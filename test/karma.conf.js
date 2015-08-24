// Karma configuration
// Generated on Sun Oct 20 2013 07:28:56 GMT+0200 (CEST)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../',


        // frameworks to use
        frameworks: ['mocha', 'expect'],


        // list of files / patterns to load in the browser
        files: [

            "test/Browser.js",

            //"src/Query-dom.js",
            //"src/events/BaseEvent.js",
            //"src/events/Touch.js",
            //"src/events/Tap.js",
            //"src/events/Move.js",
            //"src/events/MultiTouch.js",
            //"src/events/Swipe.js",
            //"src/Query-events.js",

            "build/query.js",
            //"build/Query.js",

            "test/query-dom.test.js",
            "test/query-events.test.js"
        ],


        // web server port
        port: 9876,

        browsers: ['Chrome'],

        client: {
            mocha: {
                reporter: 'html', // change Karma's debug.html to the mocha web reporter
                ui: 'bdd'
            }
        }
    });
};
