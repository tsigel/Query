describe("query events", function () {

    var DIV = Browser.createElement("DIV", "TEST");

    it("on click", function () {

        var div = Browser.createElement("div");

        var ok = false;
        var $div = $(div);

        $div.on("click", function () {
            ok = true;
        });

        div.trigger("click", new Browser.$Event({target: div}));

        $div.off();

        expect(ok).to.be(true);
        expect(Object.keys($._elems).length).to.be(0);

    });

    it("off click", function () {

        var count = 0;
        var div = Browser.createElement("div");

        $(div).on("click", function () {
            count++;
        });

        div.trigger("click", new Browser.$Event({target: div}));

        $(div).off();

        div.trigger("click", new Browser.$Event({target: div}));

        expect(count).to.be(1);
        expect(Object.keys($._elems).length).to.be(0);

    });

    it("trigger", function () {

        var div = Browser.createElement("div");
        var $div = $(div);
        var ok = false, context = {};

        $div.on("myEvent", function () {
            if (this == context) ok = true;
        }, context);

        $div.trigger("myEvent", []);
        $div.off();
        expect(ok).to.be(true);
        expect(Object.keys($._elems).length).to.be(0);

    });

    it("tap", function (done) {

        var div = Browser.createElement("div");
        var ok = false;

        $(div).on("User:tap", function () {
            ok = true;
        });

        div.trigger(Browser.getType("start"), new Browser.$Event({
            target: div, type: "start", id: 1
        }));

        setTimeout(function () {
            $document.trigger(Browser.getType("end"), new Browser.$Event({
                target: div, type: "end", id: 1
            }));

            setTimeout(function () {
                $(div).off();
                expect(ok).to.be(true);
                expect(Object.keys($._elems).length).to.be(0);
                done();
            }, 50);

        }, 50);

    }, 300);

    it("touch", function (done) {

        var start = false;
        var end = false;
        var context = {};

        var div = Browser.createElement("div");

        $(div)
            .on("User:touch:start", function () {
                if (this == context) start = true;
            }, context)
            .on("User:touch:end", function () {
                if (this == context) end = true;
            }, context);


        div.trigger(Browser.getType("start"), new Browser.$Event({
            target: div, type: "start", id: 1
        }));

        setTimeout(function () {

            $document.trigger(Browser.getType("end"), new Browser.$Event({
                target: div, type: "end", id: 1
            }));

            setTimeout(function () {
                expect(start).to.be(true);
                expect(end).to.be(true);
                $(div).off();
                expect(Object.keys($._elems).length).to.be(0);
                done();
            }, 50);

        }, 50);

    }, 300);

    it("swipe horizontal", function (done) {

        var horizontal = false;

        var div = Browser.createElement("div");

        $(div)
            .on("User:swipe:horizontal:right", function () {
                horizontal = true;
            });


        div.trigger(Browser.getType("start"), new Browser.$Event({
            target: div, type: "start",
            pageX: 1, pageY: 1,
            id: 1
        }));

        var move = function (data, callback) {

            setTimeout(function () {
                $document.trigger(Browser.getType("move"), new Browser.$Event({
                    target: div, type: "move",
                    pageX: data.shift(), pageY: 1,
                    id: 1
                }));
                if (data.length) {
                    move(data, callback);
                } else {
                    callback();
                }
            }, 15);

        };

        move([10, 100, 200], function () {

            setTimeout(function () {
                $document.trigger(Browser.getType("end"), new Browser.$Event({
                    target: div, type: "end",
                    pageX: 200, pageY: 1,
                    id: 1
                }));

                expect(horizontal).to.be(true);
                $(div).off();
                expect(Object.keys($._elems).length).to.be(0);
                done();
            }, 15);

        });
    }, 300);

});