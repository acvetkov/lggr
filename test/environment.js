/**
 * Sets testing environment
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

var oldValuesMap = {};

function setGlobal(name, value) {
    oldValuesMap[name] = global[name];
    global[name] = value;
}

chai.use(chaiAsPromised);
sinon.assert.expose(chai.assert, {prefix: ''});
setGlobal('sinon', sinon);
setGlobal('assert', chai.assert);
