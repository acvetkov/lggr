/**
 * Sets testing environment
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

export function set() {
    chai.use(chaiAsPromised);
    sinon.assert.expose(chai.assert, {prefix: ''});
    setGlobal('sinon', sinon);
    setGlobal('assert', chai.assert);
}

export function reset() {
    resetGlobals();
}

var oldValuesMap = {};

function setGlobal(name, value) {
    oldValuesMap[name] = global[name];
    global[name] = value;
}

function resetGlobals() {
    Object.keys(oldValuesMap).forEach(function (name) {
        var oldValue = oldValuesMap[name];
        if (oldValue !== undefined) {
            global[name] = oldValue;
        } else {
            delete global[name];
        }
    });
}

// Automatically set test environment
set();
