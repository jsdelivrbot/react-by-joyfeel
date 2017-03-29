/* */ 
'use strict';
var MouseUpListener = require('./mouse-up-listener');
var _isInteractiveStyleField = function _isInteractiveStyleField(styleFieldName) {
  return styleFieldName === ':hover' || styleFieldName === ':active' || styleFieldName === ':focus';
};
var resolveInteractionStyles = function resolveInteractionStyles(config) {
  var ExecutionEnvironment = config.ExecutionEnvironment;
  var getComponentField = config.getComponentField;
  var getState = config.getState;
  var mergeStyles = config.mergeStyles;
  var props = config.props;
  var setState = config.setState;
  var style = config.style;
  var newComponentFields = {};
  var newProps = {};
  if (style[':hover']) {
    var existingOnMouseEnter = props.onMouseEnter;
    newProps.onMouseEnter = function(e) {
      existingOnMouseEnter && existingOnMouseEnter(e);
      setState(':hover', true);
    };
    var existingOnMouseLeave = props.onMouseLeave;
    newProps.onMouseLeave = function(e) {
      existingOnMouseLeave && existingOnMouseLeave(e);
      setState(':hover', false);
    };
  }
  if (style[':active']) {
    var existingOnMouseDown = props.onMouseDown;
    newProps.onMouseDown = function(e) {
      existingOnMouseDown && existingOnMouseDown(e);
      newComponentFields._lastMouseDown = Date.now();
      setState(':active', 'viamousedown');
    };
    var existingOnKeyDown = props.onKeyDown;
    newProps.onKeyDown = function(e) {
      existingOnKeyDown && existingOnKeyDown(e);
      if (e.key === ' ' || e.key === 'Enter') {
        setState(':active', 'viakeydown');
      }
    };
    var existingOnKeyUp = props.onKeyUp;
    newProps.onKeyUp = function(e) {
      existingOnKeyUp && existingOnKeyUp(e);
      if (e.key === ' ' || e.key === 'Enter') {
        setState(':active', false);
      }
    };
  }
  if (style[':focus']) {
    var existingOnFocus = props.onFocus;
    newProps.onFocus = function(e) {
      existingOnFocus && existingOnFocus(e);
      setState(':focus', true);
    };
    var existingOnBlur = props.onBlur;
    newProps.onBlur = function(e) {
      existingOnBlur && existingOnBlur(e);
      setState(':focus', false);
    };
  }
  if (style[':active'] && !getComponentField('_radiumMouseUpListener') && ExecutionEnvironment.canUseEventListeners) {
    newComponentFields._radiumMouseUpListener = MouseUpListener.subscribe(function() {
      Object.keys(getComponentField('state')._radiumStyleState).forEach(function(key) {
        if (getState(':active') === 'viamousedown') {
          setState(':active', false, key);
        }
      });
    });
  }
  var interactionStyles = Object.keys(style).filter(function(name) {
    return _isInteractiveStyleField(name) && getState(name);
  }).map(function(name) {
    return style[name];
  });
  var newStyle = mergeStyles([style].concat(interactionStyles));
  newStyle = Object.keys(newStyle).reduce(function(styleWithoutInteractions, name) {
    if (!_isInteractiveStyleField(name)) {
      styleWithoutInteractions[name] = newStyle[name];
    }
    return styleWithoutInteractions;
  }, {});
  return {
    componentFields: newComponentFields,
    props: newProps,
    style: newStyle
  };
};
module.exports = resolveInteractionStyles;
