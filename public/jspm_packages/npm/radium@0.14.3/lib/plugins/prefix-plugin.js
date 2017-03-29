/* */ 
'use strict';
var Prefixer = require('../prefixer');
var prefixPlugin = function prefixPlugin(_ref) {
  var componentName = _ref.componentName;
  var style = _ref.style;
  var newStyle = Prefixer.getPrefixedStyle(style, componentName);
  return {style: newStyle};
};
module.exports = prefixPlugin;
