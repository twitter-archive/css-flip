/**
 * Flip a `"left"` or `"right"` value.
 *
 * @param {String} value Value
 * @return {String}
 */

module.exports = function (value) {
  return value.match(/left/) ? 'right' : value.match(/right/) ? 'left' : value;
};
