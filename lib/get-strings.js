'use strict';

var through = require('through2'),
    path = require('path'),
    gutil = require('gulp-util'),
    _ = require('underscore');

var pluginName = 'gulp-i18n';

module.exports = function (options) {
  var json = {},
      buffer = [];

  var attrs = {

    // Name for output JSON file
    name: 'translations.json',

    // JSON output indentation
    indent: 2,

    // Opening delimeter
    open: '__(',

    // Closing delimeted
    close: ')',

    // Regexp string matcher
    regexp: '__\\(.*?\\)'

  };

  var build = function (ref, location) {
    var segments = ref.replace(attrs.open, '')
                    .replace(attrs.close, '')
                    .split(/\./);

    var extend = function (obj) {
      var key = segments.shift();

      obj[key] = obj[key] || {};

      if (segments.length) {
        extend(obj[key]);
      } else {
        obj[key].locations = obj[key].locations || [];
        obj[key].msgid = obj[key].msgid || ref;
        obj[key].msgstr = obj[key].msgstr || '';
        obj[key].comments = obj[key].comments || '';

        obj[key].locations.push(location);
      }
    };

    extend(json);
  };

  var parse = function (file) {
    var fileName = filePath(file);

    file.contents.toString().split('\n').forEach(function (line, number) {
      var regexp = new RegExp(attrs.regexp, 'g'),
          refs = line.match(regexp) || [],
          location = fileName + ':' + (number + 1);

      refs.forEach(function (ref) {
        build(ref, location);
      });
    });

  };

  var filePath = function (file) {
    return file.path.substr(file.base.length);
  };

  var bufferFile = function (file, enc, callback) {

    if (file.isNull()) {
      return;
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(pluginName, 'Streaming not supported'));
    }

    if (file.isBuffer()) {
      parse(file);
    }

    return callback();
  };

  var end = function () {
    var out;

    buffer.push(JSON.stringify(json, null, attrs.indent));

    out = new gutil.File({
      path: path.join(process.cwd(), attrs.name),
      contents: new Buffer(buffer[0])
    });

    this.push(out);
    this.emit('end');
  };

  _.extend(attrs, (options || {}));

  return through.obj(bufferFile, end);

};
