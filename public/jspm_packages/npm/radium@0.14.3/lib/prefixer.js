/* */ 
(function(process) {
  'use strict';
  var ExecutionEnvironment = require('exenv');
  var arrayFind = require('array-find');
  var VENDOR_PREFIX_REGEX = /-(moz|webkit|ms|o)-/;
  var vendorPrefixes = ['Webkit', 'ms', 'Moz', 'O'];
  var infoByCssPrefix = {
    '-moz-': {
      cssPrefix: '-moz-',
      jsPrefix: 'Moz',
      alternativeProperties: {
        alignItems: ['MozBoxAlign'],
        flex: ['MozBoxFlex'],
        flexDirection: ['MozBoxOrient'],
        justifyContent: ['MozBoxPack'],
        order: ['MozBoxOrdinalGroup']
      },
      alternativeValues: {
        alignItems: {
          'flex-start': ['start'],
          'flex-end': ['end']
        },
        display: {flex: ['-moz-box']},
        flexDirection: {
          column: ['vertical'],
          row: ['horizontal']
        },
        justifyContent: {
          'flex-start': ['start'],
          'flex-end': ['end'],
          'space-between': ['justify']
        }
      }
    },
    '-ms-': {
      cssPrefix: '-ms-',
      jsPrefix: 'ms',
      alternativeProperties: {
        alignContent: ['msFlexLinePack'],
        alignItems: ['msFlexAlign'],
        alignSelf: ['msFlexAlignItem'],
        justifyContent: ['msFlexPack'],
        order: ['msFlexOrder']
      },
      alternativeValues: {
        alignContent: {
          'flex-start': ['start'],
          'flex-end': ['end'],
          'space-between': ['justify'],
          'space-around': ['distribute']
        },
        alignItems: {
          'flex-start': ['start'],
          'flex-end': ['end']
        },
        alignSelf: {
          'flex-start': ['start'],
          'flex-end': ['end']
        },
        display: {
          flex: ['-ms-flexbox'],
          'inline-flex': ['-ms-inline-flexbox']
        },
        justifyContent: {
          'flex-start': ['start'],
          'flex-end': ['end'],
          'space-between': ['justify'],
          'space-around': ['distribute']
        }
      }
    },
    '-o-': {
      cssPrefix: '-o-',
      jsPrefix: 'O'
    },
    '-webkit-': {
      cssPrefix: '-webkit-',
      jsPrefix: 'Webkit',
      alternativeProperties: {
        alignItems: ['WebkitBoxAlign'],
        flex: ['MozBoxFlex'],
        flexDirection: ['WebkitBoxOrient'],
        justifyContent: ['WebkitBoxPack'],
        order: ['WebkitBoxOrdinalGroup']
      },
      alternativeValues: {
        alignItems: {
          'flex-start': ['start'],
          'flex-end': ['end']
        },
        display: {flex: ['-webkit-box']},
        flexDirection: {
          row: ['horizontal'],
          column: ['vertical']
        },
        justifyContent: {
          'flex-start': ['start'],
          'flex-end': ['end'],
          'space-between': ['justify']
        }
      }
    }
  };
  var isUnitlessNumber = {
    boxFlex: true,
    boxFlexGroup: true,
    columnCount: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    strokeDashoffset: true,
    strokeOpacity: true,
    strokeWidth: true
  };
  var domStyle = {};
  var prefixedPropertyCache = {};
  var prefixedValueCache = {};
  var prefixInfo = {
    cssPrefix: '',
    jsPrefix: ''
  };
  if (ExecutionEnvironment.canUseDOM) {
    domStyle = (document).createElement('p').style;
    if (domStyle.float === undefined) {
      domStyle.float = '';
    }
    var prefixMatch;
    var windowStyles = window.getComputedStyle(document.documentElement, '');
    for (var i = 0; i < windowStyles.length; i++) {
      prefixMatch = windowStyles[i].match(VENDOR_PREFIX_REGEX);
      if (prefixMatch) {
        break;
      }
    }
    var cssVendorPrefix = prefixMatch && prefixMatch[0];
    prefixInfo = cssVendorPrefix && infoByCssPrefix[cssVendorPrefix] ? infoByCssPrefix[cssVendorPrefix] : prefixInfo;
  }
  var getPrefixedPropertyName = function getPrefixedPropertyName(property) {
    if (prefixedPropertyCache.hasOwnProperty(property)) {
      return prefixedPropertyCache[property];
    }
    var unprefixed = property;
    var possiblePropertyNames = [prefixInfo.jsPrefix + property[0].toUpperCase() + property.slice(1), unprefixed];
    if (prefixInfo.alternativeProperties && prefixInfo.alternativeProperties[property]) {
      possiblePropertyNames = possiblePropertyNames.concat(prefixInfo.alternativeProperties[property]);
    }
    var workingProperty = arrayFind(possiblePropertyNames, function(possiblePropertyName) {
      if (possiblePropertyName in domStyle) {
        return possiblePropertyName;
      }
    }) || false;
    prefixedPropertyCache[property] = workingProperty;
    return prefixedPropertyCache[property];
  };
  var _getUnprefixedProperty = function _getUnprefixedProperty(property) {
    var noPrefixProperty = property;
    vendorPrefixes.some(function(prefix) {
      if (property.indexOf(prefix) === 0) {
        noPrefixProperty = noPrefixProperty.replace(prefix, '');
        noPrefixProperty = noPrefixProperty.charAt(0).toLowerCase() + noPrefixProperty.slice(1);
        return true;
      }
    });
    return noPrefixProperty;
  };
  var _addPixelSuffixToValueIfNeeded = function _addPixelSuffixToValueIfNeeded(originalProperty, value) {
    var unPrefixedProperty = _getUnprefixedProperty(originalProperty);
    if (value !== 0 && !isNaN(value) && !isUnitlessNumber[unPrefixedProperty]) {
      return value + 'px';
    }
    return value;
  };
  var _getPrefixedValue = function _getPrefixedValue(componentName, property, value, originalProperty) {
    if (!Array.isArray(value)) {
      if (!isNaN(value) && value !== null) {
        return _addPixelSuffixToValueIfNeeded(originalProperty, value);
      }
      if (typeof value !== 'string') {
        if (value !== null && value !== undefined) {
          value = value.toString();
        } else {
          return value;
        }
      }
      if (!isNaN(parseInt(value, 10))) {
        return value;
      }
    }
    var cacheKey = Array.isArray(value) ? value.join(' || ') : property + value;
    if (prefixedValueCache.hasOwnProperty(cacheKey)) {
      return prefixedValueCache[cacheKey];
    }
    var possibleValues;
    if (Array.isArray(value)) {
      possibleValues = value.map(function(v) {
        return _addPixelSuffixToValueIfNeeded(originalProperty, v);
      });
      possibleValues = possibleValues.concat(value.filter(function(v) {
        return !isNaN(v);
      }).map(function(v) {
        return prefixInfo.cssPrefix + v;
      }));
    } else {
      possibleValues = [value, prefixInfo.cssPrefix + value];
    }
    if (prefixInfo.alternativeValues && prefixInfo.alternativeValues[originalProperty] && prefixInfo.alternativeValues[originalProperty][value]) {
      possibleValues = possibleValues.concat(prefixInfo.alternativeValues[originalProperty][value]);
    }
    var workingValue = arrayFind(possibleValues, function(possibleValue) {
      domStyle[property] = '';
      domStyle[property] = possibleValue;
      return !!domStyle[property];
    });
    if (workingValue) {
      prefixedValueCache[cacheKey] = workingValue;
    } else {
      prefixedValueCache[cacheKey] = value;
      if (process.env.NODE_ENV !== 'production') {
        if (console && console.warn) {
          var componentContext = componentName ? ' in component "' + componentName + '"' : '';
          console.warn('Unsupported CSS value "' + value + '" for property "' + property + '"' + componentContext);
        }
      }
    }
    return prefixedValueCache[cacheKey];
  };
  var getPrefixedStyle = function getPrefixedStyle(style, componentName) {
    if (!ExecutionEnvironment.canUseDOM) {
      return Object.keys(style).reduce(function(newStyle, key) {
        var value = style[key];
        var newValue = Array.isArray(value) ? value[0] : value;
        newStyle[key] = newValue;
        return newStyle;
      }, {});
    }
    var prefixedStyle = {};
    Object.keys(style).forEach(function(property) {
      var value = style[property];
      var newProperty = getPrefixedPropertyName(property);
      if (!newProperty) {
        if (process.env.NODE_ENV !== 'production') {
          if (console && console.warn) {
            var componentContext = componentName ? ' in component "' + componentName + '"' : '';
            console.warn('Unsupported CSS property "' + property + '"' + componentContext);
          }
          return;
        }
      }
      var newValue = _getPrefixedValue(componentName, newProperty, value, property);
      prefixedStyle[newProperty] = newValue;
    });
    return prefixedStyle;
  };
  module.exports = {
    getPrefixedStyle: getPrefixedStyle,
    cssPrefix: prefixInfo.cssPrefix,
    jsPrefix: prefixInfo.jsPrefix
  };
})(require('process'));
