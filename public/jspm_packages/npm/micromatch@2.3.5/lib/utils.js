/* */ 
(function(process) {
  'use strict';
  var path = require('path');
  var fileRe = require('filename-regex');
  var win32 = process && process.platform === 'win32';
  var utils = require('lazy-cache')(require);
  var fn = require;
  require = utils;
  require('arr-diff', 'diff');
  require('array-unique', 'unique');
  require('braces');
  require('expand-brackets', 'brackets');
  require('extglob');
  require('is-extglob');
  require('is-glob', 'isGlob');
  require('kind-of', 'typeOf');
  require('normalize-path', 'normalize');
  require('object.omit', 'omit');
  require('parse-glob');
  require('regex-cache', 'cache');
  utils.filename = function filename(fp) {
    var seg = fp.match(fileRe());
    return seg && seg[0];
  };
  utils.isPath = function isPath(pattern, opts) {
    return function(fp) {
      return pattern === utils.unixify(fp, opts);
    };
  };
  utils.hasPath = function hasPath(pattern, opts) {
    return function(fp) {
      return utils.unixify(pattern, opts).indexOf(fp) !== -1;
    };
  };
  utils.matchPath = function matchPath(pattern, opts) {
    var fn = (opts && opts.contains) ? utils.hasPath(pattern, opts) : utils.isPath(pattern, opts);
    return fn;
  };
  utils.hasFilename = function hasFilename(re) {
    return function(fp) {
      var name = utils.filename(fp);
      return name && re.test(name);
    };
  };
  utils.arrayify = function arrayify(val) {
    return !Array.isArray(val) ? [val] : val;
  };
  utils.unixify = function unixify(fp, opts) {
    if (opts && opts.unixify === false)
      return fp;
    if (opts && opts.unixify === true || win32 || path.sep === '\\') {
      return utils.normalize(fp, false);
    }
    if (opts && opts.unescape === true) {
      return fp ? fp.toString().replace(/\\(\w)/g, '$1') : '';
    }
    return fp;
  };
  utils.escapePath = function escapePath(fp) {
    return fp.replace(/[\\.]/g, '\\$&');
  };
  utils.unescapeGlob = function unescapeGlob(fp) {
    return fp.replace(/[\\"']/g, '');
  };
  utils.escapeRe = function escapeRe(str) {
    return str.replace(/[-[\\$*+?.#^\s{}(|)\]]/g, '\\$&');
  };
  require = fn;
  module.exports = utils;
})(require('process'));
