var reLeft = /\bleft\b/;
var reRight = /\bright\b/;
var rePct = /^[+-]?\d*(?:\.\d+)?(?:[Ee][+-]?\d+)?%/;

/**
 * Flip a `background-position` value.
 *
 * @param {String} value Property value
 * @param {String} property Property name
 * @return {String}
 */

module.exports = function (value) {
  if (value.match(reLeft)) {
    value = value.replace(reLeft, 'right');
  } else if (value.match(reRight)) {
    value = value.replace(reRight, 'left');
  }

  var elements = value.split(/\s+/);

  if (!elements) { return value; }

  if (elements.length == 1) {
    value = flipPercentage(elements[0]);
  }
  else if (elements.length == 2) {
    value = flipPercentage(elements[0]) + ' ' + elements[1];
  }

  return value;
};

/**
 * Flip a percentage value.
 * 30% => 70% (100 - pct)
 *
 * @param {String} pct Percentage
 * @return {String}
 */

function flipPercentage(value) {
  if (rePct.test(value)) {
    return (100 - parseFloat(value, 10)) + '%';
  }

  return value;
}
