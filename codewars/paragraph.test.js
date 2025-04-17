const { describe, it } = require('node:test');
const {assert, config, expect} = require("chai");
const nicePara = require('./paragraph');

var inText1 = 'Hi, I am some text and I need to be arranged.';
var inText2 = 'Her peculiar, electric wisdom rushed forth from her agile brain in a wave of striking lucidity.';
var inText3 = 'The words and the meanings would be soaking wet, and the meaning would grow with its increasing layers. ';
var inText4 = 'Rhubarb crumble mate... Mmm Mmmmm....    ';
var inText5 = "The answer to that question is, 'Inheritance is incompatible with equality.'";
var inText6 = "''Yes'', ''that'' ''was'' ''the'' ''main'' ''problem''... ''I'm'' ''going'' ''to'' ''Barmouth''. ''I'm'' ''going'' ''to'' ''Lisbon''. ''I'' ''have'' ''a'' ''membership'' ''of'' ''Senate'' ''House'' ''Library''.";
var inText7 = "There're — few — reasons — to — write — a — sentence — with — all — these — dashes — but — here's — one.";
var inText8 = "If I had an up-to-date, down-to-earth, back-to-basics, right-on, no-nonsense, hard-hitting, rock-solid, yet chilled-out, zen-like, laid-back kinda cat, I could go about my day with an up-to-date, down-to-earth, back-to-basics, right-on, no-nonsense, hard-hitting, rock-solid, yet chilled-out, zen-like, laid-back kinda attitude.";
var inText9 = 'A lot of different plans are marching under the basic income banner. If you want to know what their true colours are, then don’t be fooled by the all-things-to-all-people language used about them. Look at the bottom line. How are they going to pay for it? The devil is in the detail.'

describe('\n\nInput text: \'' + inText1 + '\'\n\nLine length: ' + 15, function() {
  var results = `Hi, I am some\ntext and I need\nto be arranged.`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText1, 15) + '</pre>', function() {
    assert.strictEqual(nicePara(inText1, 15), results);
  });
});

describe('\n\nInput text: \'' + inText2 + '\'\n\nLine length: ' + 23, function() {
  var results = `Her peculiar, electric\nwisdom rushed forth fr-\nom her agile brain in a\nwave of striking lucid-\nity.`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText2, 23) + '</pre>', function() {
    assert.strictEqual(nicePara(inText2, 23), results);
  });
});

describe('\n\nInput text: \'' + inText3 + '\'\n\nLine length: ' + 47, function() {
  var results = `The words and the meanings would be soaking\nwet, and the meaning would grow with its incre-\nasing layers.`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText3, 47) + '</pre>', function() {
    assert.strictEqual(nicePara(inText3, 47), results);
  });
});

describe('\n\nInput text: \'' + inText4 + '\'\n\nLine length: ' + 20, function() {
  var results = `Rhubarb crumble ma-\nte... Mmm Mmmmm....`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText4, 20) + '</pre>', function() {
    assert.strictEqual(nicePara(inText4, 20), results);
  });
});

describe('\n\nInput text: \'' + inText5 + '\'\n\nLine length: ' + 35, function() {
  var results = `The answer to that question is,\n\'Inheritance is incompatible with\nequality.\'`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText5, 35) + '</pre>', function() {
    assert.strictEqual(nicePara(inText5, 35), results);
  });
});

describe('\n\nInput text: \'' + inText6 + '\'\n\nLine length: ' + 15, function() {
  var results = `\'\'Yes\'\', \'\'th-\nat\'\' \'\'was\'\'\n\'\'the\'\' \'\'ma-\nin\'\' \'\'probl-\nem\'\'... \'\'I\'m\'\'\n\'\'going\'\'\n\'\'to\'\' \'\'Barmo-\nuth\'\'. \'\'I\'m\'\'\n\'\'going\'\'\n\'\'to\'\' \'\'Lisb-\non\'\'. \'\'I\'\'\n\'\'have\'\' \'\'a\'\'\n\'\'membership\'\'\n\'\'of\'\' \'\'Sena-\nte\'\' \'\'House\'\'\n\'\'Library\'\'.`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText6, 15) + '</pre>', function() {
    assert.strictEqual(nicePara(inText6, 15), results);
  });
});

describe('\n\nInput text: \'' + inText7 + '\'\n\nLine length: ' + 15, function() {
  var results = `There\'re — few\n— reasons — to\n— write — a —\nsentence — with\n— all — these —\ndashes — but —\nhere\'s — one.`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText7, 15) + '</pre>', function() {
    assert.strictEqual(nicePara(inText7, 15), results);
  });
});

describe('\n\nInput text: \'' + inText8 + '\'\n\nLine length: ' + 15, function() {
  var results = `If I had an up-\nto-date, down-\nto-earth, back-\nto-basics, rig-\nht-on, no-nons-\nense, hard-hit-\nting, rock-sol-\nid, yet chill-\ned-out, zen-li-\nke, laid-back\nkinda cat, I\ncould go about\nmy day with an\nup-to-date, do-\nwn-to-earth,\nback-to-basics,\nright-on, no-\nnonsense, hard-\nhitting, rock-\nsolid, yet chi-\nlled-out, zen-\nlike, laid-back\nkinda attitude.`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText8, 15) + '</pre>', function() {
    assert.strictEqual(nicePara(inText8, 15), results);
  });
});

describe("Some edge case tests", function() {
  var Cases = [
    ["aaaaaaaaaa          ", 15, "aaaaaaaaaa"],
  ];

  it("Testing for edge cases", function() {
    Cases.forEach(function([text, size, answer]) {
      var result = nicePara(text, size);
      assert.strictEqual(
        result,
        answer,
        `\n\nInput text: \n\n${text}\n\nLine length: ${size}\n\n* Correct answer: \n\n${answer}\n\n* Answer returned: \n\n${result}\n`
      );
    });
  });
});

describe('\n\nInput text: \'' + inText9 + '\'\n\nLine length: ' + 21, function() {
  var results = `A lot of different\nplans are marching\nunder the basic inco-\nme banner. If you wa-\nnt to know what their\ntrue colours are, th-\nen don’t be fooled by\nthe all-things-to-\nall-people language\nused about them. Look\nat the bottom line.\nHow are they going to\npay for it? The devil\nis in the detail.`;
  it('Correct answer: \n<pre>' + results +'</pre>\nAnswer returned: \n<pre>' + nicePara(inText8, 15) + '</pre>', function() {
    assert.strictEqual(nicePara(inText9, 21), results);
  });
});