describe("query dom", function () {

    var createElem = function (tagName, className, parent) {
        var elem = document.createElement(tagName);
        elem.className = className || "";
        if (parent) {
            parent.appendChild(elem);
        }
        return elem;
    };

    if (!("remove" in Element.prototype)) {
        Element.prototype.remove = function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            } else {
                console.warn("Нет родителя!");
            }
        }
    }

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

    it("removeAttr", function () {

        var div = createElem("div");
        div.setAttribute("test", " ");
        $(div).removeAttr("test");
        expect(div.getAttribute("test")).to.be(null);

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

    it("hide show toggle", function () {

        var div = createElem("div");
        $(div).hide();
        expect(div.style.display).to.be("none");
        $(div).show();
        expect(div.style.display).to.be("block");
        $(div).toggleDisplay();
        expect(div.style.display).to.be("none");
        $(div).toggleDisplay();
        expect(div.style.display).to.be("block");

    });

    it("requestAnimationFrame", function () {

        requestAnimationFrame(function () {
            expect(true).to.be(true);
        });

    }, 100);

    it("css transform", function () {

        var names = ["transform-origin", "TransformOrigin", "transformOrigin"];
        var prefexes = [
            "",
            "-moz-",
            "-ms-",
            "-webkit-",
            "-o-",
            "Moz",
            "Ms",
            "Webkit",
            "O",
            "moz",
            "ms",
            "webkit"
        ];

        var value = "50% 50%";

        var div = createElem("div");
        $(div).css("transform-origin", value);
        var ok = false;

        if (names.some(function (name) {
                if (name in div.style && div.style[name].indexOf(value) == 0) {
                    return true;
                } else {
                    return prefexes.some(function (prefix) {
                        return (((prefix + name) in div.style) && div.style[prefix + name].indexOf(value) == 0);
                    });
                }
            })) {
            ok = true;
        }
        expect(ok).to.be(true);
        expect($(div).css("transform-origin").indexOf(value)).to.be(0);

    });

    it("width", function () {

        var div = createElem("div", "width");
        var $div = $(div);
        div.style.width = "10px";
        expect($div.width()).to.be(10);
        $div.width(15);
        expect(div.style.width).to.be("15px");

    }, 100);

    it("style width Async", function (done) {

        var div = createElem("div", "width", document.body);
        var $div = $(div);
        div.removeAttribute("style");
        var style = createElem("style");
        style.innerHTML = ".width {width: 100px}";
        document.head.appendChild(style);
        setTimeout(function () {
            expect($div.width()).to.be(100);
            done();
            div.remove();
        }, 200);

    }, 300);

    it("style height Async", function (done) {

        var div = createElem("div", "height", document.body);
        var $div = $(div);
        div.removeAttribute("style");
        var style = createElem("style");
        style.innerHTML = ".height {height: 100px}";
        document.head.appendChild(style);
        setTimeout(function () {
            expect($div.height()).to.be(100);
            done();
            div.remove();
        }, 200);

    }, 300);

    it("height", function () {

        var div = createElem("div", "height");
        var $div = $(div);
        div.style.height = "10px";
        expect($div.height()).to.be(10);
        $div.height(15);
        expect(div.style.height).to.be("15px");

    }, 100);

    describe("classes", function () {

        var div = createElem("div", "test", document.body);
        var el = $(div);

        it("add", function () {

            el.addClass("test2");
            el.addClass("test2");
            expect(div.className.indexOf("test2") != -1).to.be(true);
            expect(div.className.indexOf("test2") === div.className.lastIndexOf("test2")).to.be(true);
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

    describe("$ static", function () {

        it("parse", function () {

            var template = "<div class='test'></div>";
            var className = "test";
            var tagName = "DIV";
            var parsed = $.parse(template);
            expect(parsed.length).to.be(1);
            expect(parsed[0].className).to.be(className);
            expect(parsed[0].tagName).to.be(tagName);

        });

        it("random", function () {

            var someNum = $.random(0, 100);
            expect(typeof someNum).to.be("number");
            expect(isNaN(someNum)).to.be(false);
            expect(someNum > 0 && someNum < 100).to.be(true);
            console.log(someNum);

        });

        it("randomInt", function () {

            var someNum = $.randomInt(0, 100);
            console.log(someNum);
            expect(typeof someNum).to.be("number");
            expect(isNaN(someNum)).to.be(false);
            expect(someNum >= 0 && someNum <= 100).to.be(true);
            expect(Math.round(someNum)).to.be(someNum);

        });

        it("trim", function () {

            var toTest = [" some", "    some", "some ", "some    ", "   some   ", " some "];

            expect(toTest.map($.trim).every(function (text) {
                return text == "some";
            })).to.be(true);

        });

        it("camelCase", function () {

            var toTest = ["some", "some name", "some-name", "-prefix-some-style-name"];
            var result = ["some", "someName", "someName", "PrefixSomeStyleName"];

            expect(toTest.map($.camelCase).every(function (text, index) {
                return text == result[index];
            })).to.be(true);

        });

        it("guid", function () {

            var ok = $.guuid() != $.guuid();
            expect(ok).to.be(true);

        });

        it("isElement", function () {

            var toTest = [
                "DIV", "SPAN", "IMG", "I", "B", "table", "TR", "TD", "THEAD", "TBODY", "INPUT",
                "TEXTAREA", "CANVAS", "SVG", "A", "BUTTON", "SCRIPT", "LINK", "BODY", "HTML"
            ];

            expect(toTest.map(function (tagName) {
                return document.createElement(tagName);
            }).every($.isElement)).to.be(true);

        });

        it("forEach", function () {

            var toTestObj = {
                "some1": "value1",
                "some2": "value2"
            };

            var toTestArr = ["value1", "value2"];

            var check = {
                "some1": false,
                "some2": false,
                "value1": false,
                "value2": false
            };

            $.forEach(toTestObj, function (value, name, argument) {
                if (this == toTestObj && argument == 1 && value == toTestObj[name]) check[name] = true;
            }, toTestObj, 1);

            $.forEach(toTestArr, function (value, name, argument) {
                if (this == toTestArr && argument == 1 && toTestArr[name] == value) check[value] = true;
            }, toTestArr, 1);

            for (var key in check) {
                if (check.hasOwnProperty(key)) {
                    expect(check[key]).to.be(true);
                }
            }

        });

        it("some", function () {

            var toTestArr = [1, 2, "fsa", "ok", "dfs", {}];
            var toTestObj = {
                0: 1,
                "fdsa": 2,
                "fdsaf": "ok",
                "fads": {}
            };

            var handler = function (value, name, arg) {
                return (value == "ok" && this == toTestArr && arg == 1);
            };

            expect($.some(toTestArr, handler, toTestArr, 1)).to.be(true);
            expect($.some(toTestObj, handler, toTestArr, 1)).to.be(true);

        });

        it("every", function () {

            var toTestArr = [1,2,3,4,5,6,7,8,9,0];
            var toTestObj = {0:1, 1:2, 2:3, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9, 9:0};
            var check = toTestArr.slice();

            var handler = function (value, index, arg) {
                return value == check[index] && this == toTestObj && arg == 1;
            };

            expect($.every(toTestArr, handler, toTestObj, 1)).to.be(true);
            expect($.every(toTestObj, handler, toTestObj, 1)).to.be(true);

        });

        it("findFirst", function () {

            var toTestArr = [0, "ok", {}];
            var toTestObj = {"": 0, "1": "ok", 3: {}};

            var checkArr = {id: 1, value: "ok"};
            var checkObj = {id: "1", value: "ok"};

            var handler = function (value, name, arg) {
                return value == "ok" && +name == 1 && arg == 1 && this == toTestArr;
            };

            var resObj = $.findFirst(toTestObj, handler, toTestArr, 1);
            var resArr = $.findFirst(toTestArr, handler, toTestArr, 1);

            expect(resObj.id).to.be(checkObj.id);
            expect(resObj.value).to.be(checkObj.value);
            expect(resArr.id).to.be(checkArr.id);
            expect(resArr.value).to.be(checkArr.value);

        });

        it("isPointer", function () {

            var ok = !!window.navigator.msPointerEnabled;
            expect($.isPointer).to.be(ok);

        });

    });

});