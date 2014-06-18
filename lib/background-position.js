/**
 * Flip a `background-position` value.
 *
 * @param {String} value Property value
 * @param {String} property Property name
 * @return {String}
 */

module.exports = function (value, property) {
  var reLeft = /\bleft\b/;
  var reRight = /\bright\b/;
  var rePct = /\d+%/;

  if (value.match(reLeft)) {
    value = value.replace(reLeft, 'right');
  } else if (value.match(reRight)) {
    value = value.replace(reRight, 'left');
  }

  var elements = value.split(/\s+/);

  if (!elements) { return value; }

  if (elements.length == 1) {
    if (/background-position-x/.test(property) && value.match(rePct) || value.match(rePct)) {
      value = flipPercentage(value);
    }
  }
  else if (elements.length == 2) {
    if (elements[0].match(rePct)) {
      value = flipPercentage(elements[0]) + ' ' + elements[1];
    }
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

function flipPercentage(pct) {
  return (100 - parseFloat(pct, 10)) + '%';
}
