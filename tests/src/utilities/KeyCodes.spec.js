var test     = require('tape');
var KeyCodes = require('../../../src/utilities/KeyCodes');

test('KeyCodes', function(t) {
    var numbers = [];
    for (var i = 0; i < 10; i++) numbers[i] = i.toString();
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var allCapsAlphabet = alphabet.join('').toUpperCase().split('');

    var additionalKeys = ['ENTER', 'LEFT_ARROW', 'RIGHT_ARROW', 'UP_ARROW', 'DOWN_ARROW', 'SPACE', 'SHIFT', 'TAB'];
    var expectedKeys = [].concat(numbers, alphabet, allCapsAlphabet, additionalKeys).sort();
    var actualKeys = Object.keys(KeyCodes).sort();
    t.deepEqual(expectedKeys, actualKeys, 'KeyCodes should contain the entire alphabet, additional keys and numbers');
    t.end();
});
