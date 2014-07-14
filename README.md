# gulp-i18n [![Build Status](https://secure.travis-ci.org/mattyod/gulp-i18n.png?branch=master)](http://travis-ci.org/mattyod/gulp-i18n) [![NPM version](http://badge.fury.io/js/gulp-i18n.svg)](https://www.npmjs.org/package/gulp-i18n)

Tools for building internationalised templates.

## Tools

### get-strings( [options] )

Take a Jade template called _index.jade_ such as:

```
html
  body
    h1 __(mysite.header)
    p __(mysite.intro)
```

And output a json file:

```
{
  "mysite": {
    "header": {
      "locations": ["index.jade:3"],
      "msgid": "__(mysite.header)",
      "msgstr": "",
      "comments": ""
    },
    "intro": {
      "locations": ["index.jade:4"],
      "msgid": "__(mysite.intro)",
      "msgstr": "",
      "comments": ""
    }
  }
}
```

#### Example usage:

```
var gulp = require('gulp'),
    i18n = require('gulp-i18n');

gulp.task('getStrings', function () {
  gulp.src(['./src/templates/**/*.jade'])
      .pipe(i18n.getStrings())
      .pipe('./src/translations/dev');
});

```
#### Options

Get-strings can be passed an options object to override any defaults. These are:

**name** _string_

Name of the output file.

```
Default: translations.json
```

**indent** number

Number of spaces to indent the output file JSON.

```
Default: 2
```

**open** _string_

Opening delimiter for string references.

```
Default: __(
```

**close** _string_

Closing delimiter for string references.

```
Default: )
```

**regexp** _string_

Regexp for matching string references. **N.B.** you must also update this if you change the open & close options.

```
Default: __\\(.*?\\)
```
