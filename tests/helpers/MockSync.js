var EventHandler = require('../../src/core/EventHandler');

var mockSyncs = [];

function MockSync() {
    EventHandler.call(this);
    mockSyncs.push(this);

    this._eventInput  = new EventHandler();
    this._eventOutput = new EventHandler();

    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);
}

MockSync.prototype = Object.create(EventHandler.prototype);
MockSync.prototype.constructor = MockSync;

MockSync.prototype.emitStart = function(event) {
    this._eventOutput.emit('start', event);
};

MockSync.prototype.emitUpdate = function(event) {
    this._eventOutput.emit('update', event);
};

MockSync.prototype.emitEnd = function(event) {
    this._eventOutput.emit('end', event);
};

MockSync.getMockSyncs = function() {
    return mockSyncs.slice();
};

// now for the tricky part
MockSync.createConstructor = function() {
    function MockSyncClass() {
        MockSync.call(this);
    }

    MockSyncClass.prototype = Object.create(MockSync.prototype);
    MockSyncClass.prototype.constructor = MockSyncClass;

    return MockSyncClass;
};

module.exports = MockSync;
