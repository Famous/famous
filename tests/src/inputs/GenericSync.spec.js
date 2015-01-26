var test        = require('tape');
var GenericSync = require('../../../src/inputs/GenericSync');
var MockSync    = require('../../helpers/MockSync');

test('GenericSync', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof GenericSync, 'function', 'GenericSync should be a function');
    });

    t.test('register method', function(t) {
        t.plan(1);
        t.equal(typeof GenericSync.register, 'function', 'GenericSync.register should be a function');

        var mockSyncClasses = {
            FirstMockSync: MockSync.createConstructor(),
            SecondMockSync: MockSync.createConstructor(),
            ThirdMockSync: MockSync.createConstructor()
        };

        GenericSync.register(mockSyncClasses);
    });

    t.test('addSync method', function(t) {
        t.plan(7);
        var genericSync = new GenericSync();
        t.equal(typeof genericSync.addSync, 'function', 'genericSync.addSync should be a function');

        var syncObject = {
            fa: MockSync.createConstructor(),
            mo: MockSync.createConstructor(),
            us: MockSync.createConstructor()
        };

        GenericSync.register(syncObject);
        genericSync.addSync(['fa', 'mo', 'us']);

        var mockSyncs = MockSync.getMockSyncs();
        t.equal(mockSyncs[mockSyncs.length - 3] instanceof syncObject.fa, true, 'genericSync.addSync should use previously registered sync constructors');
        t.equal(mockSyncs[mockSyncs.length - 2] instanceof syncObject.mo, true, 'genericSync.addSync should use previously registered sync constructors');
        t.equal(mockSyncs[mockSyncs.length - 1] instanceof syncObject.us, true, 'genericSync.addSync should use previously registered sync constructors');

        var usSync = mockSyncs[mockSyncs.length - 1];

        genericSync.on('start', function(event) {
            t.equal(event.source, usSync, 'GenericSync.pipeSync should pipe start event of sync');
        });

        genericSync.on('update', function(event) {
            t.equal(event.source, usSync, 'GenericSync.pipeSync should pipe update event of sync');
        });

        genericSync.on('end', function(event) {
            t.equal(event.source, usSync, 'GenericSync.pipeSync should pipe end event of sync');
        });

        usSync.emitStart({ source: usSync });
        usSync.emitUpdate({ source: usSync });
        usSync.emitEnd({ source: usSync });
    });

    t.test('setOptions method', function(t) {
        t.plan(1);
        var genericSync = new GenericSync();
        t.equal(typeof genericSync.setOptions, 'function', 'genericSync.setOptions should be a function');
    });
    
    // t.test('pipeSync method', function(t) {
    //     t.plan(2);
    //     var genericSync = new GenericSync();
    //     t.equal(typeof genericSync.pipeSync, 'function', 'genericSync.pipeSync should be a function');

    //     var MockSyncConstructor = MockSync.createConstructor();

    //     var syncObject = {
    //         // bla: MockSync.createConstructor(),
    //         blub: MockSyncConstructor,
    //     };

    //     GenericSync.register(syncObject);
    //     genericSync.addSync(['blub']);
    //     genericSync.addSync(['bla']);
    //     genericSync.pipeSync('bla');
    //     genericSync.pipeSync('blub');

    //     genericSync.on('boom', t.pass);



    //     // genericSync._eventInput.emit('update', {});

    //     // blaSync.emitUpdate();

    //     // blubSync.emitUpdate();

    //     // TODO
    // });

    // t.test('unpipeSync method', function(t) {
    //     t.plan(1);
    //     var genericSync = new GenericSync();
    //     t.equal(typeof genericSync.unpipeSync, 'function', 'genericSync.unpipeSync should be a function');


    //     // TODO
    // });
});

