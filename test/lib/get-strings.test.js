'use strict';

var getStrings = require('../../lib/get-strings'),
    path = require('path'),
    gulp = require('gulp'),
    es = require('event-stream');

var testFile = path.join(__dirname, '../files/test.jade');

describe('lib/get-strings', sandbox(function () {
  var json;

  beforeEach(function (done) {
    gulp.src(testFile)
      .pipe(getStrings())
      .pipe(es.map(function (file) {
        json = JSON.parse(file.contents);
        done();
      }));

  });

  it('sets locations', function () {
    json.test.title.locations
      .should.deep.equal([ 'test.jade:4', 'test.jade:6' ]);

    json.test.intro.locations
      .should.deep.equal([ 'test.jade:7' ]);
  });

  it('sets message ids', function () {
    json.test.title.msgid.should.equal('__(test.title)');
    json.test.intro.msgid.should.equal('__(test.intro)');
  });

  it('sets message strings', function () {
    json.test.title.msgstr.should.equal('');
    json.test.intro.msgstr.should.equal('');
  });

  it('sets message comments', function () {
    json.test.title.comments.should.equal('');
    json.test.intro.comments.should.equal('');
  });

}));
