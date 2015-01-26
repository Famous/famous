var test    = require('tape');
var Utility = require('../../../src/utilities/Utility');

test('Utility', function(t) {
    t.test('Direction object', function(t) {
        t.equal(typeof Utility.Direction, 'object', 'Utility.Direction should be object');
        t.equal(Object.keys(Utility.Direction).length, 3, 'Utility.Direction should have 3 keys');
        t.end();
    });

    t.test('after method', function(t) {
        t.plan(20);
        t.equal(typeof Utility.after, 'function', 'Utility.after should be a function');

        var generateCallMe = function (n) {
            var callMe = function () {
                t.pass('Utility.after should call callMe after ' + n + ' calls of wrappedCallback');
            };
            return callMe;
        };

        for (var i = 1; i < 20; i++) {
            var wrappedCallback = Utility.after(i, generateCallMe(i));
            for (var j = 0; j < i; j++) {
                wrappedCallback();
            }
            wrappedCallback();
        }
    });

    t.test('loadURL method', function(t) {
        t.equal(typeof Utility.loadURL, 'function', 'Utility.loadURL should be a function');
        Utility.loadURL(window.location.href, function (contents) {
            t.equal(typeof contents, 'string', 'Utility.loadURL returned contents should be string');
            t.end();
        });
    });

    t.test('createDocumentFragmentFromHTML method', function(t) {
        t.equal(typeof Utility.createDocumentFragmentFromHTML, 'function', 'Utility.createDocumentFragmentFromHTML should be a function');
        var result = Utility.createDocumentFragmentFromHTML('<span>I\'m should be a DocumentFragment</span>');
        t.equal(typeof result, 'object', 'Utility.createDocumentFragmentFromHTML should create object');
        t.end();
    });

    t.test('clone method', function(t) {
        t.equal(typeof Utility.clone, 'function', 'Utility.clone should be a function');

        var flatObject = {a: {}, b: {}, c: {}};
        t.deepEqual(Utility.clone(flatObject), flatObject, 'Utility.clone should clone flat object');

        var nestedObject = {
            test1: {
                test1test1: {
                    test1test1test1: 3
                },
                test1test2: 3
            },
            test2: {},
            test3: {}
        };
        t.deepEqual(Utility.clone(nestedObject), nestedObject, 'Utility.clone should deep clone nested object');
        t.end();
    });
});
