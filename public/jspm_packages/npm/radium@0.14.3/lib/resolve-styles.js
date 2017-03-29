/* */ 
(function(process) {
  'use strict';
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
  var _getState = require('./get-state');
  var getStateKey = require('./get-state-key');
  var mergeStyles = require('./merge-styles');
  var Plugins = require('./plugins/index');
  var ExecutionEnvironment = require('exenv');
  var React = require('react');
  var DEFAULT_CONFIG = {plugins: [Plugins.mergeStyleArray, Plugins.checkProps, Plugins.resolveMediaQueries, Plugins.resolveInteractionStyles, Plugins.prefix, Plugins.checkProps]};
  var globalState = {};
  var resolveStyles = ((null));
  var _resolveChildren = function _resolveChildren(_ref) {
    var children = _ref.children;
    var component = _ref.component;
    var config = _ref.config;
    var existingKeyMap = _ref.existingKeyMap;
    if (!children) {
      return children;
    }
    var childrenType = typeof children;
    if (childrenType === 'string' || childrenType === 'number') {
      return children;
    }
    if (childrenType === 'function') {
      return function() {
        var result = children.apply(this, arguments);
        if (React.isValidElement(result)) {
          return resolveStyles(component, result, config, existingKeyMap);
        }
        return result;
      };
    }
    if (React.Children.count(children) === 1 && children.type) {
      var onlyChild = React.Children.only(children);
      return resolveStyles(component, onlyChild, config, existingKeyMap);
    }
    return React.Children.map(children, function(child) {
      if (React.isValidElement(child)) {
        return resolveStyles(component, child, config, existingKeyMap);
      }
      return child;
    });
  };
  var _resolveProps = function _resolveProps(_ref2) {
    var component = _ref2.component;
    var config = _ref2.config;
    var existingKeyMap = _ref2.existingKeyMap;
    var props = _ref2.props;
    var newProps = props;
    Object.keys(props).forEach(function(prop) {
      if (prop === 'children') {
        return;
      }
      var propValue = props[prop];
      if (React.isValidElement(propValue)) {
        newProps = _extends({}, newProps);
        newProps[prop] = resolveStyles(component, propValue, config, existingKeyMap);
      }
    });
    return newProps;
  };
  var _buildGetKey = function _buildGetKey(renderedElement, existingKeyMap) {
    var originalKey = typeof renderedElement.ref === 'string' ? renderedElement.ref : renderedElement.key;
    var key = getStateKey(originalKey);
    var alreadyGotKey = false;
    var getKey = function getKey() {
      if (alreadyGotKey) {
        return key;
      }
      alreadyGotKey = true;
      if (existingKeyMap[key]) {
        throw new Error('Radium requires each element with interactive styles to have a unique ' + 'key, set using either the ref or key prop. ' + (originalKey ? 'Key "' + originalKey + '" is a duplicate.' : 'Multiple elements have no key specified.'));
      }
      existingKeyMap[key] = true;
      return key;
    };
    return getKey;
  };
  var _setStyleState = function _setStyleState(component, key, stateKey, value) {
    if (!component._radiumIsMounted) {
      return;
    }
    var existing = component._lastRadiumState || component.state && component.state._radiumStyleState || {};
    var state = {_radiumStyleState: _extends({}, existing)};
    state._radiumStyleState[key] = _extends({}, state._radiumStyleState[key]);
    state._radiumStyleState[key][stateKey] = value;
    component._lastRadiumState = state._radiumStyleState;
    component.setState(state);
  };
  var _runPlugins = function _runPlugins(_ref3) {
    var component = _ref3.component;
    var config = _ref3.config;
    var existingKeyMap = _ref3.existingKeyMap;
    var props = _ref3.props;
    var renderedElement = _ref3.renderedElement;
    if (!React.isValidElement(renderedElement) || typeof renderedElement.type !== 'string' || !props.style) {
      return props;
    }
    var newProps = props;
    var plugins = config.plugins || DEFAULT_CONFIG.plugins;
    var getKey = _buildGetKey(renderedElement, existingKeyMap);
    var newStyle = props.style;
    plugins.forEach(function(plugin) {
      var result = plugin({
        ExecutionEnvironment: ExecutionEnvironment,
        componentName: component.constructor.displayName || component.constructor.name,
        config: config,
        getComponentField: function getComponentField(key) {
          return component[key];
        },
        getGlobalState: function getGlobalState(key) {
          return globalState[key];
        },
        getState: function getState(stateKey, elementKey) {
          return _getState(component.state, elementKey || getKey(), stateKey);
        },
        mergeStyles: mergeStyles,
        props: newProps,
        setState: function setState(stateKey, value, elementKey) {
          return _setStyleState(component, elementKey || getKey(), stateKey, value);
        },
        style: newStyle
      }) || {};
      newStyle = result.style || newStyle;
      newProps = result.props && Object.keys(result.props).length ? _extends({}, newProps, result.props) : newProps;
      var newComponentFields = result.componentFields || {};
      Object.keys(newComponentFields).forEach(function(fieldName) {
        component[fieldName] = newComponentFields[fieldName];
      });
      var newGlobalState = result.globalState || {};
      Object.keys(newGlobalState).forEach(function(key) {
        globalState[key] = newGlobalState[key];
      });
    });
    if (newStyle !== props.style) {
      newProps = _extends({}, newProps, {style: newStyle});
    }
    return newProps;
  };
  var _cloneElement = function _cloneElement(renderedElement, newProps, newChildren) {
    if (typeof renderedElement.type === 'string') {
      newProps = _extends({}, newProps, {_radiumDidResolveStyles: true});
    }
    return React.cloneElement(renderedElement, newProps, newChildren);
  };
  resolveStyles = function(component, renderedElement, config, existingKeyMap) {
    if (config === undefined)
      config = DEFAULT_CONFIG;
    existingKeyMap = existingKeyMap || {};
    if (!renderedElement || renderedElement.props && renderedElement.props._radiumDidResolveStyles) {
      return renderedElement;
    }
    var newChildren = _resolveChildren({
      children: renderedElement.props.children,
      component: component,
      config: config,
      existingKeyMap: existingKeyMap
    });
    var newProps = _resolveProps({
      component: component,
      config: config,
      existingKeyMap: existingKeyMap,
      props: renderedElement.props
    });
    newProps = _runPlugins({
      component: component,
      config: config,
      existingKeyMap: existingKeyMap,
      props: newProps,
      renderedElement: renderedElement
    });
    if (newChildren === renderedElement.props.children && newProps === renderedElement.props) {
      return renderedElement;
    }
    return _cloneElement(renderedElement, newProps !== renderedElement.props ? newProps : {}, newChildren);
  };
  resolveStyles.__clearStateForTests = function() {
    globalState = {};
  };
  module.exports = resolveStyles;
})(require('process'));
