var assert = require('assert');
var css = require('css');
var flip = require('..');

function ensure(input, output, options) {
  output || (output = input);
  options || (options = {compress: true});

  assert.equal(flip(input, options), output, input + ' => ' + output);
}

describe('background-position', function () {
  it('should flip direction', function () {
    ensure('p{background-position:left top;}', 'p{background-position:right top;}');
    ensure('p{background-position:20px;}', 'p{background-position:20px;}');
    ensure('p{background-position:20%;}', 'p{background-position:80%;}');
    ensure('p{background-position:0% 0;}', 'p{background-position:100% 0;}');
    ensure('p{background-position:24.5% 0;}', 'p{background-position:75.5% 0;}');
    ensure('p{background-position:+2.45e1% 0;}', 'p{background-position:75.5% 0;}');
    ensure('p{background-position:-20% 0;}', 'p{background-position:120% 0;}');
    ensure('p{background-position:20% top;}', 'p{background-position:80% top;}');
    ensure('p{background-position:100% 0;}', 'p{background-position:0% 0;}');

    ensure('p{background-position-x:20px;}', 'p{background-position-x:20px;}');
    ensure('p{background-position-x:20%;}', 'p{background-position-x:80%;}');
    ensure('p{-ms-background-position-x:30%;}', 'p{-ms-background-position-x:70%;}');
  });
});

describe('border', function () {
  it('should flip border-{side}', function () {
    ensure('p{border-left:1px;}', 'p{border-right:1px;}');
    ensure('p{border-right:1px;}', 'p{border-left:1px;}');
    ensure('p{border-right:1px solid #000;}', 'p{border-left:1px solid #000;}');
  });

  it('should flip border-style', function () {
    ensure('p{border-style:solid;}');
    ensure('p{border-style:none solid;}');
    ensure('p{border-style:none solid dashed;}');
    ensure('p{border-style:none solid dashed double;}', 'p{border-style:none double dashed solid;}');
  });

  it('should flip border-{side}-color', function () {
    ensure('p{border-left-color:#fff;}', 'p{border-right-color:#fff;}');
    ensure('p{border-right-color:#fff;}', 'p{border-left-color:#fff;}');
  });

  it('should flip border-{side}-style', function () {
    ensure('p{border-left-style:solid;}', 'p{border-right-style:solid;}');
    ensure('p{border-left-style:none;}', 'p{border-right-style:none;}');
    ensure('p{border-right-style:dashed;}', 'p{border-left-style:dashed;}');
    ensure('p{border-right-style:double;}', 'p{border-left-style:double;}');
  });

  it('should flip border-width', function () {
    ensure('p{border-width:0;}');
    ensure('p{border-width:0 1px;}');
    ensure('p{border-width:0 1px 2px;}');
    ensure('p{border-width:0 1px 2px 3px;}', 'p{border-width:0 3px 2px 1px;}');
  });

  it('should flip border-{side}-width', function () {
    ensure('p{border-left-width:0;}', 'p{border-right-width:0;}');
    ensure('p{border-right-width:0;}', 'p{border-left-width:0;}');
  });
});

describe('border-color', function () {
  it('should flip hex colors', function () {
    ensure('p{border-color:#fff;}');
    ensure('p{border-color:#fff #000;}');
    ensure('p{border-color:#000 #111111 #fff;}');
    ensure('p{border-color:#000 #111111 #222222 #333;}', 'p{border-color:#000 #333 #222222 #111111;}');
  });

  it('should flip keyword colors', function () {
    ensure('p{border-color:white;}');
    ensure('p{border-color:white black;}');
    ensure('p{border-color:white red black;}');
    ensure('p{border-color:white blue yellow black;}', 'p{border-color:white black yellow blue;}');
  });

  it('should flip rbg[a] colors', function () {
    ensure('p{border-color:rgb(255,255,255);}');
    ensure('p{border-color:rgb(255, 255, 255) rgb(0, 0, 0);}');
    ensure('p{border-color:rgb(255,255,255) rgb(0,0,0) rgb(128,128,128);}');
    ensure(
      'p{border-color:rgb(0,0,0) rgb(10,10,10) rgb(20,20,20) rgb(30,30,30);}',
      'p{border-color:rgb(0,0,0) rgb(30,30,30) rgb(20,20,20) rgb(10,10,10);}'
    );

    ensure('p{border-color:rgba(255,255,255,1);}');
    ensure('p{border-color:rgba(255, 255, 255, 1) rgba(0, 0, 0, 1);}');
    ensure('p{border-color:rgba(255,255,255,1) rgba(0,0,0,1) rgba(128,128,128,1);}');
    ensure(
      'p{border-color:rgba(0,0,0,1) rgba(10,10,10,1) rgba(20,20,20,1) rgba(30,30,30,1);}',
      'p{border-color:rgba(0,0,0,1) rgba(30,30,30,1) rgba(20,20,20,1) rgba(10,10,10,1);}'
    );
  });

  it('should flip hsl[a] colors', function () {
    ensure('p{border-color:hsl(255,255,255);}');
    ensure('p{border-color:hsl(255, 255, 255) hsl(0, 0, 0);}');
    ensure('p{border-color:hsl(255,255,255) hsl(0,0,0) hsl(128,128,128);}');
    ensure(
      'p{border-color:rgb(0,0,0) rgb(10,10,10) rgb(20,20,20) rgb(30,30,30);}',
      'p{border-color:rgb(0,0,0) rgb(30,30,30) rgb(20,20,20) rgb(10,10,10);}'
    );

    ensure('p{border-color:hsla(255,255,255,1);}');
    ensure('p{border-color:hsla(255, 255, 255, 1) hsla(0, 0, 0, 1);}');
    ensure('p{border-color:hsla(255,255,255,1) hsla(0,0,0,1) hsla(128,128,128,1);}');
    ensure(
      'p{border-color:hsla(0,0,0,1) hsla(10,10,10,1) hsla(20,20,20,1) hsla(30,30,30,1);}',
      'p{border-color:hsla(0,0,0,1) hsla(30,30,30,1) hsla(20,20,20,1) hsla(10,10,10,1);}'
    );
  });
});

describe('border-radius', function () {
  it('should flip border-radius', function () {
    ensure('p{border-radius:0;}');

    // top-left+bottom-right top-right+bottom-left
    ensure('p{border-radius:0 1px;}', 'p{border-radius:1px 0;}');

    // top-left top-right+bottom-left bottom-right
    ensure('p{border-radius:0 1px 2px;}', 'p{border-radius:1px 0 1px 2px;}');

    // top-left top-right bottom-left bottom-right
    ensure('p{border-radius:0 1px 2px 3px;}', 'p{border-radius:1px 0 3px 2px;}');
  });

  it('should flip elliptical values', function () {
    // radii-x / radii-y
    ensure('p{border-radius:1px/2px 3px;}', 'p{border-radius:1px / 3px 2px;}');
    ensure('p{border-radius:1px 2px 3px 4px/5px;}', 'p{border-radius:2px 1px 4px 3px / 5px;}');

    ensure('p{border-radius:1px / 2px;}');
    ensure('p{border-radius:1px 2px / 3px;}', 'p{border-radius:2px 1px / 3px;}');
    ensure('p{border-radius:1px 2px 3px / 4px;}', 'p{border-radius:2px 1px 2px 3px / 4px;}');
    ensure('p{border-radius:1px 2px 3px 4px / 5px;}', 'p{border-radius:2px 1px 4px 3px / 5px;}');

    ensure('p{border-radius:1px / 2px 3px;}', 'p{border-radius:1px / 3px 2px;}');
    ensure('p{border-radius:1px / 2px 3px 4px;}', 'p{border-radius:1px / 3px 2px 3px 4px;}');
    ensure('p{border-radius:1px / 2px 3px 4px 5px;}', 'p{border-radius:1px / 3px 2px 5px 4px;}');
  });

  it('should flip border-top-left-radius', function () {
    ensure('p{border-top-left-radius:0;}', 'p{border-top-right-radius:0;}');
  });

  it('should flip border-top-right-radius', function () {
    ensure('p{border-top-right-radius:0;}', 'p{border-top-left-radius:0;}');
  });

  it('should flip border-bottom-left-radius', function () {
    ensure('p{border-bottom-left-radius:0;}', 'p{border-bottom-right-radius:0;}');
  });

  it('should flip border-bottom-right-radius', function () {
    ensure('p{border-bottom-right-radius:0;}', 'p{border-bottom-left-radius:0;}');
  });
});

describe('box-shadow', function () {
  it('should flip shorthand properties', function () {
    ensure('p{box-shadow:5px 10px #000;}','p{box-shadow:-5px 10px #000;}');
    ensure('p{box-shadow:5px 10px 20px #000;}','p{box-shadow:-5px 10px 20px #000;}');
    ensure('p{box-shadow:5px 10px 20px 30px #000;}','p{box-shadow:-5px 10px 20px 30px #000;}');
    ensure('p{box-shadow:inset 5px 10px 20px 30px #000;}','p{box-shadow:inset -5px 10px 20px 30px #000;}');
  });

  it('should flip multiple values', function () {
    ensure('p{box-shadow:5px 10px #000, 6px 11px #111}','p{box-shadow:-5px 10px #000, -6px 11px #111;}');
    ensure('p{box-shadow:5px 10px #000, inset 6px 11px #111, 7px 12px #222;}','p{box-shadow:-5px 10px #000, inset -6px 11px #111, -7px 12px #222;}');
    ensure('p{box-shadow:5px 10px rgba(0,0,0,1), 6px 11px rgba(10,10,10,1)}','p{box-shadow:-5px 10px rgba(0,0,0,1), -6px 11px rgba(10,10,10,1);}');
  });

  it('should flip vendor prefixed properties', function () {
    ensure('p{-webkit-box-shadow:5px 10px #000;}', 'p{-webkit-box-shadow:-5px 10px #000;}');
    ensure('p{-moz-box-shadow:5px 10px #000;}', 'p{-moz-box-shadow:-5px 10px #000;}');
  });

  it('should handle the value "none"', function () {
    ensure('p{box-shadow:none;}');
  });
});

describe('clear', function () {
  it('should flip direction', function () {
    ensure('p{clear:left;}', 'p{clear:right;}');
    ensure('p{clear:right;}', 'p{clear:left;}');
  });
});

describe('direction', function () {
  it('should flip direction', function () {
    ensure('p{direction:ltr;}', 'p{direction:rtl;}');
    ensure('p{direction:rtl;}', 'p{direction:ltr;}');
  });
});

describe('float', function () {
  it('should flip direction', function () {
    ensure('p{float:left;}', 'p{float:right;}');
    ensure('p{float:right;}', 'p{float:left;}');
  });
});

describe('margin', function () {
  it('should flip shorthand properties', function () {
    ensure('p{margin:0;}');
    ensure('p{margin:0 1px;}');
    ensure('p{margin:0 1px 2px;}');
    ensure('p{margin:0 1px 2px 3px;}', 'p{margin:0 3px 2px 1px;}');
  });

  it('should flip margin-{side}', function () {
    ensure('p{margin-left:0;}', 'p{margin-right:0;}');
    ensure('p{margin-right:0;}', 'p{margin-left:0;}');
  });
});

describe('padding', function () {
  it('should flip shorthand properties', function () {
    ensure('p{padding:0;}');
    ensure('p{padding:0 1px;}');
    ensure('p{padding:0 1px 2px;}');
    ensure('p{padding:0 1px 2px 3px;}', 'p{padding:0 3px 2px 1px;}');
  });

  it('should flip padding-{side}', function () {
    ensure('p{padding-left:0;}', 'p{padding-right:0;}');
    ensure('p{padding-right:0;}', 'p{padding-left:0;}');
  });
});

describe('position', function () {
  it('should flip direction', function () {
    ensure('p{left:50%;}', 'p{right:50%;}');
    ensure('p{right:50%;}', 'p{left:50%;}');
  });
});

describe('text-align', function () {
  it('should flip direction', function () {
    ensure('p{text-align:left;}', 'p{text-align:right;}');
    ensure('p{text-align:right;}', 'p{text-align:left;}');
  });
});

describe('transition', function () {
  it('should flip properties', function () {
    ensure('p{-webkit-transition:left 1s, top 1s;}', 'p{-webkit-transition:right 1s, top 1s;}');
    ensure('p{transition:margin-right 1s ease;}', 'p{transition:margin-left 1s ease;}');
  });
});

describe('transition-property', function () {
  it('should flip properties', function () {
    ensure('p{-webkit-transition-property:left;}', 'p{-webkit-transition-property:right;}');
    ensure('p{transition-property:margin-right;}', 'p{transition-property:margin-left;}');
    ensure('p{transition-property:left, right, padding-left, color;}', 'p{transition-property:right, left, padding-right, color;}');
  });
});

describe('!important', function () {
  it('should be retained', function () {
    ensure('p{color:blue !important;}');
    ensure('p{float:left !important;}', 'p{float:right !important;}');
  });
});

describe('@noflip', function () {
  it('should advise individual declarations', function () {
    ensure('p{/*@noflip*/border-left:1px;padding-right:1px;}', 'p{border-left:1px;padding-left:1px;}');
    ensure('p{border-left:1px;/*@noflip*/padding-right:1px;}', 'p{border-right:1px;padding-right:1px;}');
  });

  it('should advise entire rules', function () {
    ensure('/*@noflip*/p {border-left:1px;padding-right:1px;}', 'p{border-left:1px;padding-right:1px;}');
  });
});

describe('@replace', function () {
  it('should replace individual declaration value', function () {
    ensure('p{/*@replace:-30px 0*/background-position:0 0;}', 'p{background-position:-30px 0;}');
    ensure('p{/*@replace:linear-gradient(to right, blue, green)*/background:linear-gradient(to left, blue, green);}', 'p{background:linear-gradient(to right, blue, green);}');
    ensure('p{/*@replace:"<°"*/content:">°";}', 'p{content:"<°";}');
  });
});

describe('nested blocks', function () {
  it('should be flipped', function () {
    ensure('@keyframes foo{from{float:left;}to{float:right;}}',
      '@keyframes foo{from{float:right;}to{float:left;}}');
    ensure('@media print{.foo{float:right;}}','@media print{.foo{float:left;}}');
    ensure('@supports (box-shadow){@media print{.foo{float:right;}}}',
      '@supports (box-shadow){@media print{.foo{float:left;}}}');
  });
});

describe('lettercase', function () {
  it('should not lowercase property names that have not been flipped', function () {
    ensure(':root{--Custom-prop:red;}', ':root{--Custom-prop:red;}');
  });

  it('should lowercase property names that have been flipped', function () {
    ensure('p{BORDER-LEFT:1px;}', 'p{border-right:1px;}');
  });

  it('should not lowercase property values', function () {
    ensure('p{border-left:1PX;}', 'p{border-right:1PX;}');
  });
});

describe('invalid CSS', function () {
  it('should not crash', function () {
    ensure('p{__proto__:42;toString:lolwat;}', 'p{__proto__:42;toString:lolwat;}');
  });
});

describe('rework', function () {
  var input = 'p{border-left:1px;}';
  var expect = 'p{border-right:1px;}';

  it('should support the Rework API', function () {
    var ast = css.parse(input);
    flip.rework()(ast.stylesheet);
    var out = css.stringify(ast, {compress: true});

    assert.equal(out, expect, out + ' != ' + expect);
  });
});
