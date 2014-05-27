# css-flip [![Build Status](https://travis-ci.org/twitter/css-flip.png)](https://travis-ci.org/twitter/css-flip)

A CSS BiDi flipper. Generate left-to-right (LTR) or right-to-left (RTL) CSS from your source.

## Installation

```sh
npm install css-flip
```

## Example use

```js
var flip = require('css-flip');
var css = 'div { float: left; }';

flip(css);
// => 'div { float: right; }'
```

As a [Rework](https://github.com/reworkcss/rework) plugin:

```js
var flip = require('css-flip');
var rework = require('rework');
var css = 'div { float: left; }';

rework(css).use(flip.rework()).toString();
// => 'div { float: right; }'
```

## Supported CSS Properties (a-z)

`background-position`,
`background-position-x`,
`border-bottom-left-radius`,
`border-bottom-right-radius`,
`border-color`,
`border-left`,
`border-left-color`,
`border-left-style`,
`border-left-width`,
`border-radius`,
`border-right`,
`border-right-color`,
`border-right-style`,
`border-right-width`,
`border-style`,
`border-top-left-radius`,
`border-top-right-radius`,
`border-width`,
`box-shadow`,
`clear`,
`direction`,
`float`,
`left`,
`margin`,
`margin-left`,
`margin-right`,
`padding`,
`padding-left`,
`padding-right`,
`right`,
`text-align`
`transition`
`transition-property`

## Processing directives

css-flip provides a way to ignore declarations or rules that should not be
flipped, and precisely replace property values.

### @noflip

Prevent a single declaration from being flipped.

Source:

```css
p {
  /*@noflip*/ float: left;
  clear: left;
}
```

Yields:

```css
p {
  float: left;
  clear: right;
}
```

Prevent all declarations in a rule from being flipped.

Source:

```css
/*@noflip*/
p {
  float: left;
  clear: left;
}
```

Yields:

```css
p {
  float: left;
  clear: left;
}
```

### @replace

Replace the value of a single declaration. Useful for custom LTR/RTL
adjustments, e.g., changing background sprite positions or using a
different glyph in an icon font.

Source:

```css
p {
  /*@replace: -32px -32px*/ background-position: -32px 0;
  /*@replace: ">"*/ content: "<";
}
```

Yields:

```css
p {
  background-position: -32px -32px;
  content: ">";
}
```

## CLI

The CLI can be used globally or locally in a package.

View available options:

```
css-flip --help
```

Example use:

```sh
css-flip path/to/file.css > path/to/file.rtl.css
```

## Development

Run the lint and unit tests:

```
npm test
```

Just the JSHint tests:

```
npm run lint
```

Just the Mocha unit tests:

```
npm run unit
```

Run Mocha unit tests in "watch" mode:

```
npm run watch
```

## License and Acknowledgements

Copyright 2014 Twitter, Inc. and other contributors.

Licensed under the MIT License

css-flip was inspired by [ded/R2](https://github.com/ded/R2) and
[Closure Stylesheets](https://code.google.com/p/closure-stylesheets/).
