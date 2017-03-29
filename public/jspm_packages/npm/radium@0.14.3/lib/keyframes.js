/* */ 
'use strict';
var camelCasePropsToDashCase = require('./camel-case-props-to-dash-case');
var createMarkupForStyles = require('./create-markup-for-styles');
var Prefixer = require('./prefixer');
var ExecutionEnvironment = require('exenv');
var isAnimationSupported = false;
var keyframesPrefixed = 'keyframes';
if (ExecutionEnvironment.canUseDOM) {
  var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
  var element = (document.createElement('div'));
  if (element.style.animationName !== undefined) {
    isAnimationSupported = true;
  } else {
    domPrefixes.some(function(prefix) {
      if (element.style[prefix + 'AnimationName'] !== undefined) {
        keyframesPrefixed = '-' + prefix.toLowerCase() + '-keyframes';
        isAnimationSupported = true;
        return true;
      }
      return false;
    });
  }
}
var animationIndex = 1;
var animationStyleSheet = null;
if (isAnimationSupported) {
  animationStyleSheet = (document.createElement('style'));
  document.head.appendChild(animationStyleSheet);
}
var keyframes = function keyframes(keyframeRules, componentName) {
  var prefix = arguments.length <= 2 || arguments[2] === undefined ? Prefixer.getPrefixedStyle : arguments[2];
  var name = 'Animation' + animationIndex;
  animationIndex += 1;
  if (!isAnimationSupported) {
    return name;
  }
  var rule = '@' + keyframesPrefixed + ' ' + name + ' {\n' + Object.keys(keyframeRules).map(function(percentage) {
    var props = keyframeRules[percentage];
    var prefixedProps = prefix(props, componentName);
    var cssPrefixedProps = camelCasePropsToDashCase(prefixedProps);
    var serializedProps = createMarkupForStyles(cssPrefixedProps, '  ');
    return '  ' + percentage + ' {\n  ' + serializedProps + '\n  }';
  }).join('\n') + '\n}\n';
  if (!animationStyleSheet) {
    throw new Error('keyframes not initialized properly');
  }
  animationStyleSheet.sheet.insertRule(rule, animationStyleSheet.sheet.cssRules.length);
  return name;
};
module.exports = keyframes;
