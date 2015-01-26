var allTypes = [0, -1, 1, 0|0, -1|0, 1|0, 0.3482, -0.23479, 23479.47935, -34795.2349725, 23948723|0, 31593452|0, NaN, null, void 0, {}, [], '', 'hello', function(){}, true, false];

function Types(types) {
    this._types = types || allTypes.slice();
}

Types.prototype.filter = function () {
    return new Types(this._types.filter.apply(this._types, arguments));
};

Types.prototype.removeNumbers = function removeNumbers() {
    return this.filter(function(item) {
        return typeof item !== 'number';
    });
};

Types.prototype.removeFloats =  function removeFloats() {
    return this.filter(function(item) {
        return isNaN(item) || item === item|0;
    });
};

Types.prototype.removeFunctions = function removeFunctions() {
    return this.filter(function(item) {
        return typeof item !== 'function';
    });
};

Types.prototype.removeInts = function removeInts() {
    return this.filter(function(item) {
        return isNaN(item) || item !== item|0;
    });
};

Types.prototype.removeNegatives = function removeNegatives() {
    return this.filter(function(item) {
        return isNaN(item) || item >= 0;
    });
};

Types.prototype.removePositives = function removePositives() {
    return this.filter(function(item) {
        return isNaN(item) || item >= 0;
    });
};

Types.prototype.removeArrays = function removeArrays() {
    return this.filter(function(item) {
        return !(item instanceof Array);
    });
};

Types.prototype.removeObjects = function removeObjects() {
    return this.filter(function(item) {
        return !(item instanceof Object);
    });
};

Types.prototype.removeTruthy = function removeTruthy() {
    return this.filter(function(item) {
        return !!item;
    });
};

Types.prototype.removeFalsy = function removeFalsy() {
    return this.filter(function(item) {
        return !item;
    });
};

Types.prototype.removeStrings = function removeStrings() {
    return this.filter(function(item) {
        return typeof item !== 'string';
    });
};

Types.prototype.removeBools = function removeBools() {
    return this.filter(function(item) {
        return item !== true && item !== false;
    });
};

Types.prototype.removeUndefined = function removeUndefined() {
    return this.filter(function(item) {
        return item !== undefined;
    });
};

Types.prototype.removeNull = function removeNull() {
    return this.filter(function(item) {
        return item !== null;
    });
};

Types.prototype.strings = function strings() {
    return this.filter(function(item) {
        return typeof item === 'string';
    });
};

Types.prototype.numbers = function numbers() {
    return this.filter(function(item) {
        return typeof item === 'number';
    });
};

Types.prototype.objects = function objects() {
    return this.filter(function(item) {
        return item instanceof Object;
    });
};

Types.prototype.functions = function functions() {
    return this.filter(function(item) {
        return typeof item === 'function';
    });
};

Types.prototype.truthy = function truthy() {
    return this.filter(function (item) {
        return !!item;
    });
};

Types.prototype.falsy = function falsy() {
    return this.filter(function (item) {
        return !item;
    });
};

Types.prototype.forEach = function forEach(fn) {
    for (var i = 0 ; i < this._types.length ; i++) {
        fn(this._types[i], i, this._types);
    }
};

Types.prototype.value = function value() {
    return this._types;
};

module.exports = Types;