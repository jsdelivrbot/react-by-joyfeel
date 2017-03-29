/* */ 
'use strict';
var getStateKey = require('./get-state-key');
var getState = function getState(state, elementKey, value) {
  var key = getStateKey(elementKey);
  return !!state && !!state._radiumStyleState && !!state._radiumStyleState[key] && state._radiumStyleState[key][value];
};
module.exports = getState;
