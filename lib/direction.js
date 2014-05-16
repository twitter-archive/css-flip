/**
 * Flip a `direction` value.
 *
 * @param {String} value Value
 * @return {String}
 */

module.exports = function (value) {
  return value.match(/ltr/) ? 'rtl' : value.match(/rtl/) ? 'ltr' : value;
};
