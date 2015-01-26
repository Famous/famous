'use strict';

function MockTransitionable(state) {
    if (state) this.set(state);
    this.callbacks = [];
}

MockTransitionable.prototype.set = function(state, transition, callback) {
    this.state = state;
    if (callback) callback.call(this);
};

MockTransitionable.prototype.reset = function(state) {
    this.state = state;
};

MockTransitionable.prototype.get = function() {
    return this.state;
};

MockTransitionable.prototype.callCallbacks = function() {
    this.callbacks.forEach(function(callback) {
        callback.call(this);
    });
    this.callbacks = [];
};

module.exports = MockTransitionable;
