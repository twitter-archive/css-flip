/* Copyright 2014 Twitter, Inc. and other contributors; Licensed MIT */

/**
 * Module dependencies.
 */

var css = require('css');
var flipProperty = require('./lib/flipProperty');
var flipValueOf = require('./lib/flipValueOf');

/**
 * Constants.
 */

var RE_NOFLIP = /@noflip/;
var RE_REPLACE = /@replace:\s*(.*)?/;

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
      declaration.value = prevNode.comment.match(RE_REPLACE)[1];
    }

    else if (isFlippable(declaration, prevNode)) {
      declaration.property = flipProperty(declaration.property);
      declaration.value = flipValueOf(declaration.property, declaration.value);
    }

    return declaration;
  });
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
  if (typeof str != 'string') {
    throw new Error('input is not a String.');
  }

  var node = css.parse(str, options);

  flipNode(node.stylesheet);

  return css.stringify(node, options);
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
 * Module exports.
 */

exports = module.exports = flip;
exports.rework = rework;
