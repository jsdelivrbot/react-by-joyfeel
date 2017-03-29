/* */ 
'use strict';
var Enhancer = require('./enhancer');
module.exports = function(ComposedComponent) {
  return Enhancer(ComposedComponent);
};
module.exports.Plugins = require('./plugins/index');
module.exports.PrintStyleSheet = require('./components/print-style-sheet');
module.exports.Style = require('./components/style');
module.exports.getState = require('./get-state');
module.exports.keyframes = require('./keyframes');
module.exports.__clearStateForTests = require('./resolve-styles').__clearStateForTests;
