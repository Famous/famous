'use strict';

var Time = {};

var _t;
var _nowFn = function() {
    return _t;
};
var _originalNowFn = Date.now;

Time.set = function(t) {
    _t = t;
    Date.now = _nowFn;
};

Time.reset = function() {
    Date.now = _originalNowFn;
};

module.exports = Time;
