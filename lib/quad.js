/**
 * Flip a value consisting of 4 parts.
 *
 * @param {String} value Value
 * @return {String}
 */

module.exports = function (value) {
  // Tokenize any rgb[a]/hsl[a] colors before flipping.
  var colors = [];
  var matches = value.match(/(?:rgb|hsl)a?\([^\)]*\)/g);

  if (matches) {
    matches.forEach(function (color, i) {
      colors[i] = color;
      value = value.replace(color, '_C' + i + '_');
    });
  }

  var elements = value.split(/\s+/);

  if (elements && elements.length == 4) {
    // 1px 2px 3px 4px => 1px 4px 3px 2px
    value = [elements[0], elements[3], elements[2], elements[1]].join(' ');
  }

  if (colors.length) {
    // Replace any tokenized colors.
    return value.replace(/_C(\d+)_/g, function (match, i) {
      return match && colors[i];
    });
  }

  return value;
};
