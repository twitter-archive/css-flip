/**
 * Flip a `border-radius` value.
 *
 * @param {String} value Value
 * @return {String}
 */

module.exports = function (value) {
  var elements = value.split(/\s*\/\s*/);

  if (!elements) { return value; }

  switch (elements.length) {
    // 1px 2px 3px 4px => 2px 1px 4px 3px
    case 1: return flipCorners(elements[0]);

    // 1px / 2px 3px => 1px / 3px 2px
    // 1px 2px / 3px 4px => 2px 1px / 4px 3px
    // etc...
    case 2: return flipCorners(elements[0]) + ' / ' + flipCorners(elements[1]);
  }

  return value;
};

/**
 * Flip the corners of a `border-radius` value.
 *
 * @param {String} value Value
 * @return {String}
 */

function flipCorners(value) {
  var elements = value.split(/\s+/);

  if (!elements) { return value; }

  switch (elements.length) {
    // 5px 10px 15px 20px => 10px 5px 20px 15px
    case 4: return [elements[1], elements[0], elements[3], elements[2]].join(' ');

    // 5px 10px 20px => 10px 5px 10px 20px
    case 3: return [elements[1], elements[0], elements[1], elements[2]].join(' ');

    // 5px 10px => 10px 5px
    case 2: return [elements[1], elements[0]].join(' ');
  }

  return value;
}
