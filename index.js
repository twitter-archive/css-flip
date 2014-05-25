/* Copyright 2014 Twitter, Inc. and other contributors; Licensed MIT */

/**
 * Dependencies
 */

var css = require('css');
var direction = require('./lib/direction');
var backgroundPosition = require('./lib/background-position');
var boxShadow = require('./lib/box-shadow');
var borderRadius = require('./lib/border-radius');
var leftRight = require('./lib/left-right');
var quad = require('./lib/quad');
var flipProperty = require('./lib/flipProperty');

/**
 * Constants
 */

var RE_IMPORTANT = /\s*!important/;
var RE_NOFLIP = /@noflip/;
var RE_REPLACE = /@replace:\s*(.*)?/;

/**
 * Exports
 */

exports = module.exports = flip;
exports.rework = rework;


/**
 * BiDi flip a CSS string.
 *
 * @param {String} str
 * @param {Object} [options]
 *   @param {Boolean} [options.compress] Whether to slightly compress output.
 *     Some newlines and indentation are removed. Comments stay intact.
 *   @param {String} [options.indent] Default is `'  '` (two spaces).
 * @returns {String}
 */

function flip(str, options) {
  var ast = css.parse(str, options);

  flipNode(ast.stylesheet);

  return css.stringify(ast, options);
}

/**
 * A Rework compatible filter.
 *
 * @returns {Function}
 *   @param {Object} stylesheet A `stylesheet` AST node.
 */

function rework() {
  return flipNode;
}

/**
 * BiDi flip a single AST `node`. If the node contains rules, each rule is
 * passed recursively to `flipNode()`. If the node contains declarations,
 * each flippable declaration is flipped.
 *
 * @param {Object} node
 */

function flipNode(node) {
  var rules = node.rules || node.keyframes || [];

  rules.forEach(function (rule, i, all) {
    if (rule.declarations) {
      if (isFlippable(rule, all[i - 1])) {
        processDeclarations(rule.declarations);
      }
    } else {
      flipNode(rule);
    }
  });
}

/**
 * Return whether the given `node` is flippable.
 *
 * @param {Object} node
 * @param {Object} prevNode used for @noflip detection
 * @returns {Boolean}
 */

function isFlippable(node, prevNode) {
  if (node.type == 'comment') {
    return false;
  }

  if (prevNode && prevNode.type == 'comment') {
    return !RE_NOFLIP.test(prevNode.comment);
  }

  return true;
}

/**
 * Return whether the given `node` is replaceable.
 *
 * @param {Object} node
 * @param {Object} prevNode used for @replace detection
 * @returns {Boolean}
 */

function isReplaceable(node, prevNode) {
  if (node.type == 'comment') {
    return false;
  }

  if (prevNode && prevNode.type == 'comment') {
    return RE_REPLACE.test(prevNode.comment);
  }

  return false;
}

/**
 * BiDi flip or replace a list of `declarations`.
 *
 * @param {Array} declarations
 */

function processDeclarations(declarations) {
  return declarations.map(function (declaration, i, all) {
    var prevNode = all[i - 1];

    if (isReplaceable(declaration, prevNode)) {
      return replaceDeclaration(declaration, prevNode);
    }

    if (isFlippable(declaration, prevNode)) {
      return flipDeclaration(declaration);
    }

    return declaration;
  });
}

/**
 * Replace the given `declaration` value.
 *
 * @param {Object} declaration
 */

function replaceDeclaration(declaration, prevNode) {
  declaration.value = prevNode.comment.match(RE_REPLACE)[1];

  return declaration;
}

/**
 * BiDi flip the given `declaration`.
 *
 * @param {Object} declaration
 */

function flipDeclaration(declaration) {
  declaration.property = flipProperty(declaration.property);
  declaration = flipDeclarationValue(declaration);

  return declaration;
}

/**
 * BiDi flip the value of the given `declaration`.
 *
 * @param {String} declaration
 * @return {String}
 */

function flipDeclarationValue(declaration) {
  var property = declaration.property;
  var value = declaration.value;

  var flipFn = VALUES.hasOwnProperty(property) ? VALUES[property] : false;

  if (!flipFn) { return value; }

  var important = value.match(RE_IMPORTANT);
  var newValue = flipFn(value.replace(RE_IMPORTANT, '').trim(), property);

  if (important && !RE_IMPORTANT.test(newValue)) {
    newValue += important[0];
  }

  declaration.value = newValue;

  return declaration;
}

// -- Replacement Maps ---------------------------------------------------------

/**
 * Map of property values to their BiDi flipping functions.
 */

var VALUES = {
  'direction': direction,

  'text-align': leftRight,
  'float': leftRight,
  'clear': leftRight,

  '-webkit-border-radius': borderRadius,
  '-moz-border-radius': borderRadius,
  'border-radius': borderRadius,

  'border-color': quad,
  'border-width': quad,
  'border-style': quad,
  'padding': quad,
  'margin': quad,

  'background-position': backgroundPosition,
  'background-position-x': backgroundPosition,
  '-ms-background-position-x': backgroundPosition,

  '-webkit-box-shadow': boxShadow,
  '-moz-box-shadow': boxShadow,
  'box-shadow': boxShadow
};
