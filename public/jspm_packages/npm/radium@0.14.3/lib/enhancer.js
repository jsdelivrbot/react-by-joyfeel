/* */ 
(function(process) {
  'use strict';
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  var _get = function get(_x2, _x3, _x4) {
    var _again = true;
    _function: while (_again) {
      var object = _x2,
          property = _x3,
          receiver = _x4;
      desc = parent = getter = undefined;
      _again = false;
      if (object === null)
        object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);
      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
          return undefined;
        } else {
          _x2 = parent;
          _x3 = property;
          _x4 = receiver;
          _again = true;
          continue _function;
        }
      } else if ('value' in desc) {
        return desc.value;
      } else {
        var getter = desc.get;
        if (getter === undefined) {
          return undefined;
        }
        return getter.call(receiver);
      }
    }
  };
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
  var _require = require('react');
  var Component = _require.Component;
  var resolveStyles = require('./resolve-styles');
  var printStyles = require('./print-styles');
  var KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES = ['arguments', 'callee', 'caller', 'length', 'name', 'prototype', 'type'];
  var copyProperties = function copyProperties(source, target) {
    Object.getOwnPropertyNames(source).forEach(function(key) {
      if (KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES.indexOf(key) < 0 && !target.hasOwnProperty(key)) {
        var descriptor = Object.getOwnPropertyDescriptor(source, key);
        Object.defineProperty(target, key, descriptor);
      }
    });
  };
  var enhanceWithRadium = function enhanceWithRadium(configOrComposedComponent) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    if (typeof configOrComposedComponent !== 'function') {
      var newConfig = _extends({}, config, configOrComposedComponent);
      return function(configOrComponent) {
        return enhanceWithRadium(configOrComponent, newConfig);
      };
    }
    var component = configOrComposedComponent;
    var ComposedComponent = component;
    if (!ComposedComponent.render && !ComposedComponent.prototype.render) {
      ComposedComponent = (function(_Component) {
        _inherits(_class, _Component);
        function _class() {
          _classCallCheck(this, _class);
          _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
        }
        _createClass(_class, [{
          key: 'render',
          value: function render() {
            return component(this.props);
          }
        }]);
        return _class;
      })(Component);
      ComposedComponent.displayName = component.displayName || component.name;
    }
    var RadiumEnhancer = (function(_ComposedComponent) {
      _inherits(RadiumEnhancer, _ComposedComponent);
      function RadiumEnhancer() {
        _classCallCheck(this, RadiumEnhancer);
        _get(Object.getPrototypeOf(RadiumEnhancer.prototype), 'constructor', this).apply(this, arguments);
        this.state = this.state || {};
        this.state._radiumStyleState = {};
        this._radiumIsMounted = true;
        if (RadiumEnhancer.printStyleClass) {
          this.printStyleClass = RadiumEnhancer.printStyleClass;
        }
      }
      _createClass(RadiumEnhancer, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (_get(Object.getPrototypeOf(RadiumEnhancer.prototype), 'componentWillUnmount', this)) {
            _get(Object.getPrototypeOf(RadiumEnhancer.prototype), 'componentWillUnmount', this).call(this);
          }
          this._radiumIsMounted = false;
          if (this._radiumMouseUpListener) {
            this._radiumMouseUpListener.remove();
          }
          if (this._radiumMediaQueryListenersByQuery) {
            Object.keys(this._radiumMediaQueryListenersByQuery).forEach(function(query) {
              this._radiumMediaQueryListenersByQuery[query].remove();
            }, this);
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var renderedElement = _get(Object.getPrototypeOf(RadiumEnhancer.prototype), 'render', this).call(this);
          return resolveStyles(this, renderedElement, config);
        }
      }]);
      return RadiumEnhancer;
    })(ComposedComponent);
    copyProperties(ComposedComponent, RadiumEnhancer);
    if (process.env.NODE_ENV !== 'production') {
      copyProperties(ComposedComponent.prototype, RadiumEnhancer.prototype);
    }
    RadiumEnhancer.displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component';
    RadiumEnhancer.printStyleClass = printStyles.addPrintStyles(RadiumEnhancer);
    return RadiumEnhancer;
  };
  module.exports = enhanceWithRadium;
})(require('process'));
