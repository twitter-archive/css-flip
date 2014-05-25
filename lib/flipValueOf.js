/**
 * Module dependencies.
 */

var backgroundPosition = require('./background-position');
var borderRadius = require('./border-radius');
var boxShadow = require('./box-shadow');
var direction = require('./direction');
var leftRight = require('./left-right');
var quad = require('./quad');
var transition = require('./transition');

/**
 * Map of property values to their BiDi flipping functions.
 */

var VALUES = {
  'background-position': backgroundPosition,
  'background-position-x': backgroundPosition,
  'border-radius': borderRadius,
  'border-color': quad,
  'border-style': quad,
  'border-width': quad,
  'box-shadow': boxShadow,
  'clear': leftRight,
  'direction': direction,
  'float': leftRight,
  'margin': quad,
  'padding': quad,
  'text-align': leftRight,
  'transition': transition,
  'transition-property': transition
};

/**
 * BiDi flip the value of a property.
 *
 * @param {String} prop
 * @param {String} value
 * @return {String}
 */

function flipValueOf(prop, value) {
  var RE_IMPORTANT = /\s*!important/;
  var RE_PREFIX = /^-[a-zA-Z]+-/;

  // find normalized property name (removing any vendor prefixes)
  var normalizedProperty = prop.toLowerCase().trim();
  normalizedProperty = (RE_PREFIX.test(normalizedProperty) ? normalizedProperty.split(RE_PREFIX)[1] : normalizedProperty);

  var flipFn = VALUES.hasOwnProperty(normalizedProperty) ? VALUES[normalizedProperty] : false;

  if (!flipFn) { return value; }

  var important = value.match(RE_IMPORTANT);
  var newValue = flipFn(value.replace(RE_IMPORTANT, '').trim(), prop);

  if (important && !RE_IMPORTANT.test(newValue)) {
    newValue += important[0];
  }

  return newValue;
}

/**
 * Module exports.
 */

module.exports = flipValueOf;
