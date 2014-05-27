/**
 * Flip a `left` or `right` value.
 *
 * @param {String} value Value
 * @return {String}
 */

module.exports = function (value) {
  return value.match(/^\s*left\s*$/) ? 'right' : value.match(/^\s*right\s*$/) ? 'left' : value;
};
