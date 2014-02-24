/* Copyright 2014 Twitter, Inc. and other contributors; Licensed MIT */

var css = require('css');

var RE_IMPORTANT = /\s*!important/;
var RE_NOFLIP = /@noflip/;

// Expose module.
exports = module.exports = flip;

// Expose as Rework plugin.
exports.rework = rework;

/**
 * BiDi flip a CSS string.
 *
 * @param {String} str
 * @param {Object} [options]
 *   @param {Boolean} [options.compress] Whether to slightly compress output.
 *     Some newlines and indentation are removed. Comments stay intact.
 *   @param {String} [options.indent] Default is `'  '` (two spaces).
 * @returns {String}
 */
function flip(str, options) {
  var ast = css.parse(str, options);

  flipNode(ast.stylesheet);

  return css.stringify(ast, options);
}

/**
 * A Rework compatible filter.
 *
 * @returns {Function}
 *   @param {Object} stylesheet A `stylesheet` AST node.
 */
function rework() {
  return flipNode;
}

/**
 * BiDi flip a single AST `node`. If the node contains rules, each rule is
 * passed recursively to `flipNode()`. If the node contains declarations,
 * each flippable declaration is flipped.
 *
 * @param {Object} node
 */
function flipNode(node) {
  var rules = node.rules || node.keyframes || [];

  rules.forEach(function (rule, i, all) {
    if (rule.declarations) {
      if (isFlippable(rule, all[i - 1])) {
        flipDeclarations(rule.declarations);
      }
    } else {
      flipNode(rule);
    }
  });
}

/**
 * Return whether the given `node` is flippable.
 *
 * @param {Object} node
 * @param {Object} prevNode used for @noflip detection
 * @returns {Boolean}
 */
function isFlippable(node, prevNode) {
  if (node.type == 'comment') {
    return false;
  }

  if (prevNode && prevNode.type == 'comment') {
    return !RE_NOFLIP.test(prevNode.comment);
  }

  return true;
}

/**
 * BiDi flip the given `declaration`.
 *
 * @param {Object} declaration
 */
function flipDeclaration(declaration) {
  var name = (declaration.property || declaration.name).toLowerCase();

  declaration.property = flipProperty(name);
  declaration.value = flipValue(name, declaration.value);

  return declaration;
}

/**
 * BiDi flip a list of `declarations`.
 *
 * @param {Array} declarations
 */
function flipDeclarations(declarations) {
  return declarations.map(function (declaration, i, all) {
    if (isFlippable(declaration, all[i - 1])) {
      return flipDeclaration(declaration);
    }

    return declaration;
  });
}

/**
 * BiDi flip the given `property`.
 *
 * @param {String} property
 * @return {String}
 */
function flipProperty(property) {
  return PROPERTIES[property] || property;
}

/**
 * BiDi flip the given `value`.
 *
 * @param {String} property
 * @param {String} value
 * @return {String}
 */
function flipValue(property, value) {
  var flipFn = VALUES[property];

  if (!flipFn) { return value; }

  var important = value.match(RE_IMPORTANT);
  var newValue = flipFn(value.replace(RE_IMPORTANT, '').trim(), property);

  if (important && !RE_IMPORTANT.test(newValue)) {
    newValue += important[0];
  }

  return newValue;
}


// -- Replacement Maps ---------------------------------------------------------

/**
 * Map of property names to their BiDi equivalent.
 */
var PROPERTIES = {
  'margin-left': 'margin-right',
  'margin-right': 'margin-left',
  'padding-left': 'padding-right',
  'padding-right': 'padding-left',
  'border-left': 'border-right',
  'border-right': 'border-left',
  'border-left-color': 'border-right-color',
  'border-right-color': 'border-left-color',
  'border-left-width': 'border-right-width',
  'border-right-width': 'border-left-width',
  'border-left-style': 'border-right-style',
  'border-right-style': 'border-left-style',
  'border-radius-bottomleft': 'border-radius-bottomright',
  'border-radius-bottomright': 'border-radius-bottomleft',
  'border-bottom-right-radius': 'border-bottom-left-radius',
  'border-bottom-left-radius': 'border-bottom-right-radius',
  '-webkit-border-bottom-right-radius': '-webkit-border-bottom-left-radius',
  '-webkit-border-bottom-left-radius': '-webkit-border-bottom-right-radius',
  '-moz-border-radius-bottomright': '-moz-border-radius-bottomleft',
  '-moz-border-radius-bottomleft': '-moz-border-radius-bottomright',
  'border-radius-topleft': 'border-radius-topright',
  'border-radius-topright': 'border-radius-topleft',
  'border-top-right-radius': 'border-top-left-radius',
  'border-top-left-radius': 'border-top-right-radius',
  '-webkit-border-top-right-radius': '-webkit-border-top-left-radius',
  '-webkit-border-top-left-radius': '-webkit-border-top-right-radius',
  '-moz-border-radius-topright': '-moz-border-radius-topleft',
  '-moz-border-radius-topleft': '-moz-border-radius-topright',
  'left': 'right',
  'right': 'left'
};

/**
 * Map of property values to their BiDi flipping functions.
 */
var VALUES = {
  'direction': direction,

  'text-align': rtltr,
  'float': rtltr,
  'clear': rtltr,

  '-webkit-border-radius': radius,
  '-moz-border-radius': radius,
  'border-radius': radius,

  'border-color': quad,
  'border-width': quad,
  'border-style': quad,
  'padding': quad,
  'margin': quad,

  'background-position': bgPosition,
  'background-position-x': bgPosition,
  '-ms-background-position-x': bgPosition,

  '-webkit-box-shadow': boxShadow,
  '-moz-box-shadow': boxShadow,
  'box-shadow': boxShadow
};


// -- BiDi Flipping Functions --------------------------------------------------

/**
 * Flip a `background-position` value.
 *
 * @param {String} value Property value
 * @param {String} property Property name
 * @return {String}
 */
function bgPosition(value, property) {
  var reLeft = /\bleft\b/;
  var reRight = /\bright\b/;

  if (value.match(reLeft)) {
    value = value.replace(reLeft, 'right');
  } else if (value.match(reRight)) {
    value = value.replace(reRight, 'left');
  }

  var elements = value.split(/\s+/);

  if (!elements) { return value; }

  if (elements.length == 1) {
    if (/background-position-x/.test(property)) {
      value = flipPercentage(value);
    }
    else if (value.match(/(\d+)([a-z]{2}|%)/)) {
      value = 'right ' + value;
    }
  }
  else if (elements.length == 2) {
    if (elements[0] == '0') {
      value = '100% ' + elements[1];
    } else if (elements[0].match(/\d+%/)) {
      value = flipPercentage(elements[0]) + ' ' + elements[1];
    }
  }

  return value;
}

/**
 * Flip a `box-shadow` value.
 *
 * @param {String} value Value
 * @return {String}
 */
function boxShadow(value) {
  return value
    // Replace commas inside parens (e.g. rbga colors) with a token.
    .replace(/\([^)]*\)/g, function (s) { return s.replace(/,/g, '_C_'); })
    // Flip each part of the shadow.
    .split(/\s*,\s*/).map(flipShadow).join(', ')
    // Restore commas-in-parens.
    .replace(/_C_/g, ',');
}

/**
 * Flip a `direction` value.
 *
 * @param {String} value Value
 * @return {String}
 */
function direction(value) {
  return value.match(/ltr/) ? 'rtl' : value.match(/rtl/) ? 'ltr' : value;
}

/**
 * Flip a value consisting of 4 parts.
 *
 * @param {String} value Value
 * @return {String}
 */
function quad(value) {
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
}

/**
 * Flip a `border-radius` value.
 *
 * @param {String} value Value
 * @return {String}
 */
function radius(value) {
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
}

/**
 * Flip a `"left"` or `"right"` value.
 *
 * @param {String} value Value
 * @return {String}
 */
function rtltr(value) {
  return value.match(/left/) ? 'right' : value.match(/right/) ? 'left' : value;
}

// -- Helper Functions ---------------------------------------------------------

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

/**
 * Flip a percentage value.
 *
 * @param {String} pct Percentage
 * @return {String}
 */
function flipPercentage(pct) {
  // 30% => 70% (100 - pct)
  return (100 - parseFloat(pct, 10)) + '%';
}
