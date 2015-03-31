describe("query test", function () {

    var createElem = function (tagName, className, parent) {
        var elem = document.createElement(tagName);
        elem.className = className;
        if (parent) {
            parent.appendChild(elem);
        }
        return elem;
    };

    describe("constructor", function () {

        it("selector single", function () {

            var div = createElem("div", "test", document.body);
            expect($("body > .test").get()).to.be(div);
            div.remove();

        });

        it("selector array", function () {

            var div = createElem("div", "test2", document.body);
            var div1 = createElem("div", "test", document.body);
            expect($(["body > .test", ".test2"]).length).to.be(2);
            expect($(["body > .test", ".test2"]).get(1)).to.be(div);
            div.remove();
            div1.remove();


        });

        it("selector html", function () {

            var tagName = "SPAN";
            expect($("<span></span>").get(0)["nodeName"]).to.be(tagName);

        });

        it("selector query", function () {

            expect($($("<span></span>")).get(0)["nodeName"]).to.be("SPAN");

        });

    });

    it("find", function () {

        var div = createElem("div", "find", document.body);
        var child = createElem("div", "test", div);
        expect($(".find").find(".test").get()).to.be(child);
        div.remove();

    });

    it("children", function () {

        var div = createElem("div", "find", document.body);
        var child = createElem("div", "test", div);
        expect($(".find").children().get()).to.be(child);
        div.remove();

    });

    it("eq", function () {

        var div = createElem("div", "test", document.body);
        expect($(["<span></span>", ".test"]).eq(1).get()).to.be(div);
        div.remove();

    });

    it("parent", function () {

        var div = createElem("div", "test", document.body);
        expect($([".test"]).parent().get()).to.be(document.body);
        div.remove();

    });

    it("append", function () {

        var div = createElem("div", "test", document.body);
        var childsCount = 10;

        var toAppend = createElem("div", "item");

        for (var i = 0; i < childsCount; i++) createElem("div", "child", div);

        $([".test"]).append(toAppend);

        expect(toAppend.parentNode).to.be(div);
        expect(div.childNodes[childsCount]).to.be(toAppend);
        div.remove();

    });

    it("prepend", function () {

        var div = createElem("div", "test", document.body);
        var childsCount = 10;

        var toAppend = createElem("div", "item");

        for (var i = 0; i < childsCount; i++) createElem("div", "child", div);

        $([".test"]).prepend(toAppend);

        expect(toAppend.parentNode).to.be(div);
        expect(div.childNodes[0]).to.be(toAppend);
        div.remove();

    });

    it("attr", function () {

        var div = createElem("div", "test", document.body);
        $(div).attr("data-test", "1");
        expect(div.getAttribute("data-test")).to.be("1");
        expect($(div).attr("data-test")).to.be("1");
        div.remove();

    });

    it("html", function () {

        var div = createElem("div", "test", document.body);
        $(div).html("test");
        expect(div.innerHTML).to.be("test");
        expect($(div).html()).to.be("test");
        div.remove();

    });

    it("html", function () {

        var div = createElem("div", "test", document.body);
        $(div).html("test");
        expect($(div).hasClass("test")).to.be(true);
        div.remove();

    });

    it("val", function () {

        var input = createElem("input", "test", document.body);
        input.value = "15";
        expect($(input).val()).to.be(input.value);
        $(input).val(10);
        expect($(input).val()).to.be("10");
        input.remove();

    });

    describe("classes", function () {

        var div = createElem("div", "test", document.body);
        var el = $(div);

        it("add", function () {

            el.addClass("test2");
            expect(div.className.indexOf("test2") != -1).to.be(true);
            div.className = "test";

        });

        it("remove", function () {

            el.removeClass("test");
            expect(div.className).to.be("");
            div.className = "test";

        });

        it("toggle", function () {

            el.toggleClass("test");
            expect(div.className).to.be("");
            el.toggleClass("test");
            expect(div.className).to.be("test");
            div.className = "test";

        });

        div.remove();

    });

});