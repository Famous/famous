'use strict';

var nextIdentifier = 0;
function Touch(pageX, pageY, identifier) {
    return {
        pageX: pageX || 1,
        pageY: pageY || 1,
        identifier: (identifier || nextIdentifier++)
    };
}

module.exports = Touch;
