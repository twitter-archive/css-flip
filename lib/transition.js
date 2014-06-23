/**
 * Module dependencies.
 */

var flipProperty = require('./flipProperty');

/**
 * Flip properties in transitions.
 *
 * @param {String} value Value
 * @return {String}
 */

function transition(value) {
  var RE_PROP = /^\s*([a-zA-z\-]+)/;
  var parts = value.split(/\s*,\s*/);

  return parts.map(function (part) {
    // extract the property if the value is for the `transition` shorthand
    if (RE_PROP.test(part)) {
      var prop = part.match(RE_PROP)[1];
      var newProp = flipProperty(prop);
      part = part.replace(RE_PROP, newProp);
    }

    return part;
  }).join(', ');
}

/**
 * Module exports.
 */

module.exports = transition;
