# css-flip [![Build Status](https://travis-ci.org/twitter/css-flip.png)](https://travis-ci.org/twitter/css-flip)

A CSS BiDi flipper.

## Usage

```sh
npm install --save-dev css-flip
```


```js
var flip = require('css-flip');

flip(css);
```

Source:

```css
p {
  border-left: 1px;
}
```

Yields:

```css
p {
  border-right: 1px;
}
```

### @noflip

Use the `@noflip` directive to prevent a single declaration from being flipped.

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
  /*@noflip*/ float: left;
  clear: right;
}
```

Use the `@noflip` directive to prevent entire rules from being flipped.

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
/*@noflip*/
p {
  float: left;
  clear: left;
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

## Known issues

Some complex CSS features including multiple backgrounds, CSS3 positioning,
CSS3 transforms, `background-image`, `border-image`, and `text-shadow` are
not supported.

## License and Acknowledgements

Copyright 2014 Twitter, Inc. and other contributors.

Licensed under the MIT License

css-flip was inspired by [ded/R2](https://github.com/ded/R2) and
[Closure Stylesheets](https://code.google.com/p/closure-stylesheets/).
