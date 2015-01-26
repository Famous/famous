var test       = require('tape');
var Quaternion = require('../../../src/math/Quaternion');
var Matrix     = require('../../../src/math/Matrix');
var Vector     = require('../../../src/math/Vector');
var deepRound  = require('../../helpers/deepRound');

test('Quaternion', function(t) {
    t.test('constructor', function(t) {
        t.equal(typeof Quaternion, 'function', 'Quaternion should be a function');

        t.doesNotThrow(function() {
	        new Quaternion(1, 2, 3, 4);
        }, 'Quaternion constructor should not throw an error');

        t.end();
    });

    t.test('add method', function(t) {
        t.plan(5);
        var quaternion = new Quaternion(Math.PI*0.5, 1, 2, 3);
        t.equal(typeof quaternion.add, 'function', 'quaternion.add should be a function');

        var summand = new Quaternion(Math.PI, 1, 2, 3);

        var sum = quaternion.add(summand);
        t.equal(sum.w, Math.PI*1.5);
        t.equal(sum.x, 2);
        t.equal(sum.y, 4);
        t.equal(sum.z, 6);
    });

    t.test('sub method', function(t) {
        t.plan(5);
        var quaternion = new Quaternion(Math.PI*0.2, 4, 5, 6);
        t.equal(typeof quaternion.sub, 'function', 'quaternion.sub should be a function');

        var subtrahend = new Quaternion(Math.PI, 1, 2, 3);

        var result = quaternion.sub(subtrahend);
        t.equal(result.w, -Math.PI*0.8);
        t.equal(result.x, 3);
        t.equal(result.y, 3);
        t.equal(result.z, 3);
   });

    t.test('scalarDivide method', function(t) {
        t.plan(5);
        var quaternion = new Quaternion(Math.PI*0.2, 4, 5, 6);
        t.equal(typeof quaternion.scalarDivide, 'function', 'quaternion.scalarDivide should be a function');

        var result = quaternion.scalarDivide(2);
        t.equal(result.w, Math.PI*0.1);
        t.equal(result.x, 2);
        t.equal(result.y, 2.5);
        t.equal(result.z, 3);
    });

    t.test('scalarMultiply method', function(t) {
        t.plan(5);
        var quaternion = new Quaternion(Math.PI*0.2, 4, 5, 6);
        t.equal(typeof quaternion.scalarMultiply, 'function', 'quaternion.scalarMultiply should be a function');

        var result = quaternion.scalarMultiply(2);
        t.equal(result.w, Math.PI*0.4);
        t.equal(result.x, 8);
        t.equal(result.y, 10);
        t.equal(result.z, 12);
    });

    t.test('multiply method', function(t) {
        t.plan(9);
        var quaternion = new Quaternion(Math.PI*0.2, 4, 5, 6);
        t.equal(typeof quaternion.multiply, 'function', 'quaternion.multiply should be a function');

        var result = quaternion.multiply(new Quaternion(0, 0, 0, 0));
        t.equal(result.w, 0);
        t.equal(result.x, 0);
        t.equal(result.y, 0);
        t.equal(result.z, 0);

        quaternion = new Quaternion(1, 2, 3, 4);
        result = quaternion.multiply(new Quaternion(1, 1, 1, 1));
        t.equal(result.w, -8);
        t.equal(result.x, 4);
        t.equal(result.y, 2);
        t.equal(result.z, 6);
    });
    
    t.test('rotateVector method', function(t) {
        t.plan(3);
        var vector;
        var quaternion = new Quaternion(Math.PI*0.5, Math.sqrt(2), Math.sqrt(2), Math.sqrt(2));
        t.equal(typeof quaternion.rotateVector, 'function', 'quaternion.rotateVector should be a function');

        vector = new Vector(0, 0, 0);
        t.deepEqual(quaternion.rotateVector(vector), {w: 0, x: 0, y: 0, z: 0}, 'quaternion.multiply with null vector should return null quaternion');

        vector = new Vector(2, 3, 4);
        var expected = {w: 4.440892098500626e-15, x: 24.491919262386318, y: 34.28796917713375, z: 17.42672146293099};
        t.deepEqual(deepRound(quaternion.rotateVector(vector)), deepRound(expected));
    });
    
    t.test('inverse method', function(t) {
        t.plan(2);
        var quaternion = new Quaternion(1.5, 9.2, 2.3, -2.5);
        t.equal(typeof quaternion.inverse, 'function', 'quaternion.inverse should be a function');
        var q1 = quaternion.clone();
        var q2 = quaternion.clone();
        t.deepEqual(deepRound(q1.multiply(q2).inverse(), 1), {
            x: 0, y: 0, z: 0, w: 0
        }, 'Multiplication of quaternion with its inverse should return its identity');
    });
    
    t.test('negate method', function(t) {
        t.plan(2);
        var quaternion = new Quaternion(Math.PI*3, 4, 5, 6);
        t.equal(typeof quaternion.negate, 'function', 'quaternion.negate should be a function');

        t.deepEqual(quaternion.negate(), {w: -Math.PI*3, x: -4, y: -5, z: -6});
    });
    
    t.test('conj method', function(t) {
        t.plan(2);
        var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
        t.equal(typeof quaternion.conj, 'function', 'quaternion.conj should be a function');

        t.deepEqual(quaternion.conj(), {w: Math.PI*0.5, x: -8, y: -1, z: -3});
    });
    
    t.test('normalize method', function(t) {
        t.plan(8);
        var clonedQuaternion;
        var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
        t.equal(typeof quaternion.normalize, 'function', 'quaternion.normalize should be a function');

        t.equal(quaternion.x, 8);
        t.equal(quaternion.y, 1);
        t.equal(quaternion.z, 3);
        clonedQuaternion = quaternion.normalize().scalarMultiply(quaternion.norm());
        t.notDeepEqual(clonedQuaternion, {w: 0, x: 0, y: 0, z: 0})
        t.deepEqual(deepRound(clonedQuaternion), deepRound(quaternion));

        clonedQuaternion = quaternion.normalize().scalarMultiply(quaternion.norm()*4);
        t.deepEqual(deepRound(clonedQuaternion), deepRound(quaternion.scalarMultiply(4)));
        t.notDeepEqual(deepRound(clonedQuaternion), deepRound(quaternion.scalarMultiply(1)));
    });

    t.test('makeFromAngleAndAxis method', function(t) {
        t.plan(3);
        var vector, angle;
        var quaternion = new Quaternion();
        t.equal(typeof quaternion.makeFromAngleAndAxis, 'function', 'quaternion.makeFromAngleAndAxis should be a function');

        vector = new Vector(1, 2, 3);
        angle = 0;
        t.deepEqual(quaternion.makeFromAngleAndAxis(angle, vector), {w: 1, x: 0, y: 0, z: 0});

        vector = new Vector(2, 0, 0);
        angle = Math.PI*2;
        t.deepEqual(quaternion.makeFromAngleAndAxis(angle, vector), {w: -1, x: -Math.sin(Math.PI), y: 0, z: 0});
    });

    t.test('setWXYZ method', function(t) {
        t.plan(3);
        var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
        t.equal(typeof quaternion.setWXYZ, 'function', 'quaternion.setWXYZ should be a function');

        quaternion.setWXYZ(0, 1, 2, 3);
        t.deepEqual(quaternion, {w: 0, x: 1, y: 2, z: 3});

        quaternion.setWXYZ(0, 1, 2, 4);
        t.deepEqual(quaternion, {w: 0, x: 1, y: 2, z: 4});
    });

    t.test('set method', function(t) {
        t.plan(3);
        var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
        t.equal(typeof quaternion.set, 'function', 'quaternion.set should be a function');

        quaternion.set([1, 2, 3]);
        t.deepEqual(quaternion, {w: 0, x: 1, y: 2, z: 3}, 'quaternion.set should accept array and set w to 0 in that case');
        
        quaternion.set({w: 0, x: 1, y: 2, z: 4});
        t.deepEqual(quaternion, {w: 0, x: 1, y: 2, z: 4}, 'quaternion.set should accept object literal');
    });

    t.test('put method', function(t) {
       t.plan(3);
       var original = {w: Math.PI*0.5, x: 8, y: 1, z: 3};
       var quaternion = new Quaternion(original.w, original.x, original.y, original.z);
       t.equal(typeof quaternion.put, 'function', 'quaternion.put should be a function');

       var resultQuaternion = new Quaternion(1, 2, 3, 4);
       t.equal(quaternion.put(resultQuaternion), undefined);
       t.deepEqual(resultQuaternion, new Quaternion(1, 0, 0, 0));
    });

    t.test('clone method', function(t) {
       t.plan(3);
       var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
       t.equal(typeof quaternion.clone, 'function', 'quaternion.clone should be a function');

       t.deepEqual(quaternion.clone(), quaternion);
       t.notEqual(quaternion.clone(), quaternion);
    });

    t.test('clear method', function(t) {
       t.plan(2);
       var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
       t.equal(typeof quaternion.clear, 'function', 'quaternion.clear should be a function');

       quaternion.clear();
       t.deepEqual(quaternion, {w: 1, x: 0, y: 0, z: 0});
    });

    t.test('isEqual method', function(t) {
       t.plan(3);
       var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
       t.equal(typeof quaternion.isEqual, 'function', 'quaternion.isEqual should be a function');

       t.equal(quaternion.isEqual(new Quaternion(Math.PI*0.5, 8, 1, 3)), true);
       t.equal(quaternion.isEqual(new Quaternion(Math.PI*0.5, 8, 1, 4)), false);
    });

    t.test('dot method', function(t) {
       t.plan(2);
       var quaternion = new Quaternion();
       t.equal(typeof quaternion.dot, 'function', 'quaternion.dot should be a function');

       var q1 = new Quaternion(Math.PI*0.5, 8, 1, 3);
       var q2 = new Quaternion(3,           4, 2, 6);

       t.deepEqual(q1.dot(q2), Math.PI*1.5 + 32 + 2 + 18);
    });

    t.test('normSquared method', function(t) {
       t.plan(2);
       var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
       t.equal(typeof quaternion.normSquared, 'function', 'quaternion.normSquared should be a function');

       t.equal(quaternion.normSquared(), quaternion.dot(quaternion));
    });

    t.test('norm method', function(t) {
       t.plan(3);
       var quaternion = new Quaternion(Math.PI, 0, 0, 0);
       t.equal(typeof quaternion.norm, 'function', 'quaternion.norm should be a function');

       t.equal(quaternion.norm(), Math.PI);
       
       quaternion = new Quaternion(0, 0, 0, 0);
       t.equal(quaternion.norm(), 0);
    });

    t.test('isZero method', function(t) {
       t.plan(7);
       var quaternion = new Quaternion();
       t.equal(typeof quaternion.isZero, 'function', 'quaternion.isZero should be a function');

       t.equal(quaternion.isZero(), true, 'Quaternion should be zero by default');
       t.equal((new Quaternion(0, 0, 0, 0)).isZero(), true);
       t.equal((new Quaternion(1, 0, 0, 0)).isZero(), true);
       t.equal((new Quaternion(0, 1, 0, 0)).isZero(), false);
       t.equal((new Quaternion(0, 0, 1, 0)).isZero(), false);
       t.equal((new Quaternion(0, 0, 0, 1)).isZero(), false);
    });

    t.test('getTransform method', function(t) {
       t.plan(3);
       var quaternion = new Quaternion(Math.PI*0.5, 0, 0, 0);
       t.equal(typeof quaternion.getTransform, 'function', 'quaternion.getTransform should be a function');

       t.deepEqual(quaternion.getTransform(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

       quaternion = new Quaternion(Math.PI*2, 1, 2, 3);

       t.deepEqual(quaternion.getTransform(), [0.5138225631066257, -0.6301441469788684, 0.5821552436170371, 0, 0.7797372044845221, 0.626017356235866, -0.010590638985417983, 0, -0.3577656573585566, 0.4593698115023789, 0.8130086781179331, 0, 0, 0, 0, 1]);
    });

    t.test('getMatrix method', function(t) {
       t.plan(3);
       var quaternion = new Quaternion(Math.PI*0.5, 8, 1, 3);
       t.equal(typeof quaternion.getMatrix, 'function', 'quaternion.getMatrix should be a function');

       t.ok(quaternion.getMatrix() instanceof Matrix, 'quaternion.getMatrix() should return matrix');

       quaternion = new Quaternion(Math.PI*0.3, 1, 2, 3);
       t.deepEqual(quaternion.getMatrix().get(), [ [ -0.7463419044878157, 0.6484884013070052, 0.14978836729126843 ], [ -0.11115243069536962, -0.34333992652908896, 0.9326107612511826 ], [ 0.656215588626185, 0.6793971505837243, 0.32833003673545547 ] ]);
    });

    // TODO Uncomment when #590 is merged in
    // t.test('slerp method', function(t) {
    //   t.plan(3);
    //   var originalState = {w: Math.PI*0.5, x: 5, y: 2, z: 8};
    //   var finalState = {w: Math.PI*0.9, x: 4, y: 0, z: 1};
    //   var quaternion = new Quaternion(originalState);
    //   t.equal(typeof quaternion.slerp, 'function', 'quaternion.setWXYZ should be a function');

    //   quaternion = new Quaternion(originalState);
    //   t.deepEqual(deepRound(quaternion.slerp(finalState, 0.00000001)), deepRound(originalState));

    //   quaternion = new Quaternion(originalState);
    //   t.deepEqual(deepRound(quaternion.slerp(finalState, 0.99999999)), deepRound(finalState));
    // });
});
