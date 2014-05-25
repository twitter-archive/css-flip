/**
 * Map of property names to their BiDi equivalent.
 */

var PROPERTIES = {
  'border-left': 'border-right',
  'border-bottom-right-radius': 'border-bottom-left-radius',
  'border-bottom-left-radius': 'border-bottom-right-radius',
  'border-top-right-radius': 'border-top-left-radius',
  'border-top-left-radius': 'border-top-right-radius',
  'border-left-color': 'border-right-color',
  'border-left-style': 'border-right-style',
  'border-left-width': 'border-right-width',
  'border-right': 'border-left',
  'border-right-color': 'border-left-color',
  'border-right-width': 'border-left-width',
  'border-right-style': 'border-left-style',
  'left': 'right',
  'margin-left': 'margin-right',
  'margin-right': 'margin-left',
  'padding-left': 'padding-right',
  'padding-right': 'padding-left',
  'right': 'left'
};

/**
 * BiDi flip the given property.
 *
 * @param {String} prop
 * @return {String}
 */

function flipProperty(prop) {
  var normalizedProperty = prop.toLowerCase();

  return PROPERTIES.hasOwnProperty(normalizedProperty) ? PROPERTIES[normalizedProperty] : prop;
}

/**
 * Module exports.
 */

module.exports = flipProperty;
