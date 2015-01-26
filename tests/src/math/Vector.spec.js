var test   = require('tape');
var Vector = require('../../../src/math/Vector');

test('Vector', function(t) {
    t.test('constructor', function(t) {
        t.equal(typeof Vector, 'function', 'Vector should be a function');

        var desired = [1, 2, 3];
        var vec1 = new Vector([1, 2, 3]);
        var vec2 = new Vector({x: 1, y: 2, z: 3});
        t.deepEqual(vec1.get(), desired, 'Vector constructor should accept objects and arrays');
        t.deepEqual(vec2.get(), desired, 'Vector constructor should accept objects and arrays');
        t.end();
    });
    
    t.test('add method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.add, 'function', 'vector.add should be a function');

        t.deepEqual((new Vector(0, 1, 0)).add(new Vector(0, 0, 1)).get(), [0, 1, 1], 'vector.add should correctly add vectors');
        t.deepEqual((new Vector(1, 2, 3)).add(new Vector(4, 5, 6)).get(), [5, 7, 9], 'vector.add should correctly add vectors');
        t.deepEqual((new Vector(1, 1, 1)).add(new Vector(2, 1, 1)).get(), [3, 2, 2], 'vector.add should correctly add vectors');
        t.deepEqual((new Vector(3, 1, 2)).add(new Vector(5, 7, 1)).get(), [8, 8, 3], 'vector.add should correctly add vectors');

        var vec3State = [0.3, 1.1, 0];
        var vec3 = new Vector(vec3State);
        var vec4State = [1.3, 9.5, 1.7];
        var vec4 = new Vector(vec4State);
        var expectedResult = [1.6, 10.6, 1.7];
        t.deepEqual(vec3.add(vec4).get(), expectedResult, 'vector.add should correctly add vectors');

        t.deepEqual(vec3.get(), vec3State, 'vector.add should not have any side effects');
        t.deepEqual(vec4.get(), vec4State, 'vector.add should not have any side effects');

        t.end();
    });

    t.test('sub method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.sub, 'function', 'vector.sub should be a function');

        t.deepEqual((new Vector(0, 1, 0)).sub(new Vector(0, 0, 1)).get(), [0, 1, -1], 'vector.sub should correctly subtract vectors');
        t.deepEqual((new Vector(1, 2, 3)).sub(new Vector(4, 5, 6)).get(), [-3, -3, -3], 'vector.sub should correctly subtract vectors');
        t.deepEqual((new Vector(1, 1, 1)).sub(new Vector(2, 1, 1)).get(), [-1, 0, 0], 'vector.sub should correctly subtract vectors');
        t.deepEqual((new Vector(3, 1, 2)).sub(new Vector(5, 7, 1)).get(), [-2, -6, 1], 'vector.sub should correctly subtract vectors');

        var vec3State = [0.3, 1.1, 0];
        var vec3 = new Vector(vec3State);
        var vec4State = [1.3, 9.5, 1.7];
        var vec4 = new Vector(vec4State);
        var expectedResult = [-1, -8.4, -1.7];
        t.deepEqual(vec3.sub(vec4).get(), expectedResult, 'vector.sub should correctly sub vectors');

        t.deepEqual(vec3.get(), vec3State, 'vector.sub should not have any side effects');
        t.deepEqual(vec4.get(), vec4State, 'vector.sub should not have any side effects');

        t.end();
    });

    t.test('mult method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.mult, 'function', 'vector.mult should be a function');

        t.deepEqual((new Vector(0, 1, 0)).mult(4).get(), [0, 4, 0], 'vector.mult should correctly multiply vectors');
        t.deepEqual((new Vector(1, 2, 3)).mult(2).get(), [2, 4, 6], 'vector.mult should correctly multiply vectors');
        t.deepEqual((new Vector(1, 1, 1)).mult(9).get(), [9, 9, 9], 'vector.mult should correctly multiply vectors');
        t.deepEqual((new Vector(3, 1, 2)).mult(7).get(), [21, 7, 14], 'vector.mult should correctly multiply vectors');

        var vecState = [0.3, 1, 0];
        var vec = new Vector(vecState);
        t.deepEqual(vec.mult(5.2).get(), [1.56, 5.2, 0], 'vector.mult should correctly multiply vectors');

        t.deepEqual(vec.get(), vecState, 'vector.mult should not have any side effects');

        t.end();
    });
    
    t.test('div method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.div, 'function', 'vector.div should be a function');

        t.deepEqual((new Vector(0, 5, 0)).div(4).get(), [0, 1.25, 0], 'vector.div should correctly divide vectors');
        t.deepEqual((new Vector(3, 7, 3)).div(2).get(), [1.5, 3.5, 1.5], 'vector.div should correctly divide vectors');
        t.deepEqual((new Vector(2, 9, 1)).div(8).get(), [0.25, 1.125, 0.125], 'vector.div should correctly divide vectors');
        t.deepEqual((new Vector(1, 3, 0)).div(7).get(), [0.14285714285714285, 0.42857142857142855, 0], 'vector.div should correctly divide vectors');

        var vecState = [0.3, 1, 0];
        var vec = new Vector(vecState);
        t.deepEqual(vec.div(5).get(), [0.06, 0.2, 0], 'vector.div should correctly divide vectors');

        t.deepEqual(vec.get(), vecState, 'vector.div should not have any side effects');

        t.end();
    });

    t.test('cross method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.cross, 'function', 'vector.cross should be a function');

        t.deepEqual((new Vector(0, 1, 0)).cross(new Vector(0, 0, 1)).get(), [-1, 0, 0], 'vector.cross should correctly determine cross-product of vectors');
        t.deepEqual((new Vector(1, 2, 3)).cross(new Vector(4, 5, 6)).get(), [3, -6, 3], 'vector.cross should correctly determine cross-product of vectors');
        t.deepEqual((new Vector(1, 1, 1)).cross(new Vector(2, 1, 1)).get(), [0, -1, 1], 'vector.cross should correctly determine cross-product of vectors');
        t.deepEqual((new Vector(3, 1, 2)).cross(new Vector(5, 7, 1)).get(), [13, -7, -16], 'vector.cross should correctly determine cross-product of vectors');

        var vec3State = [0.3, 1.1, 0];
        var vec3 = new Vector(vec3State);
        var vec4State = [1.3, 9.5, 1.7];
        var vec4 = new Vector(vec4State);
        var expectedResult = [-1.87, 0.51, -1.42];
        t.deepEqual(vec3.cross(vec4).get(), expectedResult, 'vector.cross should correctly determine cross-product of vectors');

        t.deepEqual(vec3.get(), vec3State, 'vector.cross should not have any side effects');
        t.deepEqual(vec4.get(), vec4State, 'vector.cross should not have any side effects');

        t.end();
    });

    t.test('equals method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.equals, 'function', 'vector.equals should be a function');

        t.equals((new Vector(0, 1, 0)).equals(new Vector(1, 2, 3)), false, 'vector.equals should check if two vectors are equivalent');
        t.equals((new Vector(1, 2, 3)).equals(new Vector(1, 2, 3)), true, 'vector.equals should check if two vectors are equivalent');
        t.equals((new Vector(0, 1, 0)).equals(new Vector(0, 1, 0)), true, 'vector.equals should check if two vectors are equivalent');

        t.end();
    });

    t.test('rotateX method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.rotateX, 'function', 'vector.rotateX should be a function');

        var vec = new Vector([1, 2, 3]);
        t.deepEquals(vec.rotateX(0).get(), [1, 2, 3], 'vector.rotateX should rotate clockwise around x-axis by theta radians');
        t.deepEquals(vec.rotateX(1).get(), [1, -1.4438083426874098, 3.3038488872202123], 'vector.rotateX should rotate clockwise around x-axis by theta radians');
        t.deepEquals(vec.rotateX(4).get(), [1, 0.9631202441965605, -3.4745358532066923], 'vector.rotateX should rotate clockwise around x-axis by theta radians');
        t.deepEquals(vec.rotateX(5).get(), [1, 3.4440971949158676, -1.0668619929365981], 'vector.rotateX should rotate clockwise around x-axis by theta radians');

        t.end();
    });

    t.test('rotateY method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.rotateY, 'function', 'vector.rotateY should be a function');

        var vec = new Vector([1, 2, 3]);
        t.deepEquals(vec.rotateY(0).get(), [1, 2, 3], 'vector.rotateY should rotate clockwise around y-axis by theta radians');
        t.deepEquals(vec.rotateY(1).get(), [3.064715260291829, 2, 0.7794359327965228], 'vector.rotateY should rotate clockwise around y-axis by theta radians');
        t.deepEquals(vec.rotateY(4).get(), [-2.924051106787396, 2, -1.2041283672829077], 'vector.rotateY should rotate clockwise around y-axis by theta radians');

        t.end();
    });

    t.test('rotateZ method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.rotateZ, 'function', 'vector.rotateZ should be a function');

        var vec = new Vector([1, 2, 3]);
        t.deepEquals(vec.rotateZ(0).get(), [1, 2, 3], 'vector.rotateZ should rotate clockwise around z-axis by theta radians');
        t.deepEquals(vec.rotateZ(1).get(), [-1.1426396637476532, 1.922075596544176, 3], 'vector.rotateZ should rotate clockwise around z-axis by theta radians');
        t.deepEquals(vec.rotateZ(4).get(), [0.8599613697522445, -2.064089737035152, 3], 'vector.rotateZ should rotate clockwise around z-axis by theta radians');

        t.end();
    });

    t.test('dot method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.dot, 'function', 'vector.dot should be a function');

        var vec = new Vector([1, 2, 3]);
        t.deepEquals(vec.dot(new Vector([4, 5, 6])), 32, 'vector.dot should return the dot product of this with a second Vector');
        t.deepEquals(vec.dot(new Vector([4, 8, 6])), 38, 'vector.dot should return the dot product of this with a second Vector');
        t.deepEquals(vec.dot(new Vector([1, 1, 0])), 3, 'vector.dot should return the dot product of this with a second Vector');

        t.end();
    });

    // t.test('normSquared method', function(t) {
    //     var vector = new Vector();
    //     t.equal(typeof vector.normSquared, 'function', 'vector.normSquared should be a function');

    //     t.equal((new Vector([1, 2, 3])).normSquared(), 14);
    //     t.equal((new Vector([2.4, 9, 5])).normSquared(), 111.76);
    //     t.end();
    // });

    t.test('norm method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.normSquared, 'function', 'vector.normSquared should be a function');

        t.equal((new Vector([1, 2, 3])).norm(), Math.sqrt(14));
        t.equal((new Vector([2.4, 9, 5])).norm(), Math.sqrt(111.76));
        t.end();
    });

    t.test('normalize method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.normalize, 'function', 'vector.normalize should be a function');

        t.deepEquals((new Vector([2, 0, 0])).normalize(), new Vector(1, 0, 0));
        t.deepEquals((new Vector([2.4, 9, 5])).normalize().norm(), 1, 'vector.normalize should return vector with length 1 by default');
        t.deepEquals((new Vector([2.4, 9, 5])).normalize(2).norm(), 2, 'vector.normalize should return vector with length 2');

        t.end();
    });

    t.test('clone method', function(t) {
        var originalVector = new Vector();
        t.equal(typeof originalVector.clone, 'function', 'originalVector.clone should be a function');

        t.notEqual(originalVector.clone(), originalVector);
        t.deepEquals(originalVector.clone(), originalVector);

        t.end();
    });

    t.test('isZero method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.isZero, 'function', 'vector.isZero should be a function');

        t.equal((new Vector(0, 0, 0)).isZero(), true);
        t.equal((new Vector(1, 0, 0)).isZero(), false);
        t.equal((new Vector(0, 1, 0)).isZero(), false);
        t.equal((new Vector(2, 3, 1)).isZero(), false);
        t.end();
    });

    t.test('set method', function(t) {
        t.test('exists', function(t) {
            var vector = new Vector();
            t.equal(typeof vector.set, 'function', 'vector.set should be a function');
            t.end();
        });

        t.test('from array', function(t) {
            var vector = new Vector();
            t.deepEquals(vector.set([1, 2, 3]), new Vector(1, 2, 3));
            t.end();
        });

        t.test('from number', function(t) {
            var vector = new Vector();
            t.deepEquals(vector.set(Math.PI), new Vector([Math.PI, 0, 0]));
            t.end();
        });
    });

    t.test('setXYZ method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.setXYZ, 'function', 'vector.setXYZ should be a function');
        t.deepEqual(vector.setXYZ(1, 2, 3), new Vector(1, 2, 3));
        t.deepEqual(vector, new Vector(1, 2, 3));
        t.end();
    });

    t.test('set1D method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.set1D, 'function', 'vector.set1D should be a function');
        t.deepEqual(vector.set1D(4), new Vector([4, 0, 0]));
        t.end();
    });

    t.test('put method', function(t) {
        var vector = new Vector();
        t.equal(typeof vector.put, 'function', 'vector.put should be a function');
        var inputVector = new Vector(1, 2, 3);
        var outputVector = new Vector(4, 5, 6);
        inputVector.put(outputVector);
        t.deepEqual(outputVector, new Vector(1, 2, 3));
        t.end();
    });

    t.test('clear method', function(t) {
        var vector = new Vector(1, 2, 4);
        t.equal(typeof vector.clear, 'function', 'vector.clear should be a function');
        t.deepEqual(vector.clear(), new Vector(0, 0, 0));
        t.deepEqual(vector, new Vector(0, 0, 0));
        t.end();
    });

    t.test('cap method', function(t) {
        var vector = new Vector(4, 0, 0);
        t.equal(typeof vector.cap, 'function', 'vector.cap should be a function');
        t.deepEqual(vector.cap(3), new Vector(3, 0, 0));
        t.deepEqual(vector.cap(5), new Vector(4, 0, 0));
        t.deepEqual(vector, new Vector(4, 0, 0));
        t.end();
    });

    t.test('project method', function(t) {
        var vector = new Vector(4, 5, 96);
        t.equal(typeof vector.project, 'function', 'vector.project should be a function');
        t.deepEqual(vector.project(new Vector(0, 0, 0)), new Vector(0, 0, 0));
        t.deepEqual(vector.project(new Vector(1, 1, 1)), new Vector(105, 105, 105));
        t.deepEqual(vector, new Vector(4, 5, 96));
        t.end();
    });

    t.test('reflectAcross method', function(t) {
        var vector = new Vector(1, 2, 3);
        t.equal(typeof vector.reflectAcross, 'function', 'vector.reflectAcross should be a function');

        // TODO

        t.deepEqual(vector, new Vector(1, 2, 3));
        t.end();
    });

    t.test('get method', function(t) {
        var vector = new Vector(1, 2, 3);
        t.equal(typeof vector.get, 'function', 'vector.get should be a function');

        t.deepEqual(vector.get(), [1, 2, 3]);
        t.deepEqual(vector, new Vector(1, 2, 3), 'vector.get should be free of side-effects');
        t.end();
    });

    t.test('get1D method', function(t) {
        var vector = new Vector(1, 2, 3);
        t.equal(typeof vector.get1D, 'function', 'vector.get1D should be a function');
        t.deepEqual(vector.get1D(), 1);
        t.deepEqual(vector, new Vector(1, 2, 3), 'vector.get1D should be free of side-effects');
        t.end();
    });
});
