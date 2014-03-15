/**
 * Flip a `box-shadow` value.
 *
 * @param {String} value Value
 * @return {String}
 */

module.exports = function (value) {
  return value
    // Replace commas inside parens (e.g. rbga colors) with a token.
    .replace(/\([^)]*\)/g, function (s) { return s.replace(/,/g, '_C_'); })
    // Flip each part of the shadow.
    .split(/\s*,\s*/).map(flipShadow).join(', ')
    // Restore commas-in-parens.
    .replace(/_C_/g, ',');
};

/**
 * Flip a single `box-shadow` value.
 *
 * @param {String} value Value
 * @return {String}
 */

function flipShadow(value) {
  var elements = value.split(/\s+/);

  if (!elements) { return value; }

  var inset = (elements[0] == 'inset') ? elements.shift() + ' ' : '';
  var property = elements[0].match(/^([-+]?\d+)(\w*)$/);

  if (!property) { return value; }

  return inset + [(-1 * +property[1]) + property[2]]
      .concat(elements.splice(1)).join(' ');
}
