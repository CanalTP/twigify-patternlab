'use strict';

var twig    = require('twig').twig;
var through = require('through2');

var ext = /\.(twig)$/;

function compile(id, str) {
  var template = twig({
    ref: id
  });
  var minified = minifyTwig(str.toString());
  if (!template) {
    template = twig({
      id: id,
      data: minified
    });
  }

  var tokens = JSON.stringify(template.tokens);

  // the id will be the filename and path relative to the require()ing module
  return 'twig({ id: "' + getRefName(id) + '", data:' + tokens + ', precompiled: true, allowInlineIncludes: true })';
}

function process(source) {
  return (
    'var twig = require(\'twig\').twig;\n' +
    'module.exports = ' + source + ';\n'
  );
}

function twigify(file, opts) {
  if (!ext.test(file)) return through();
  if (!opts) opts = {};

  var id = file;
  // @TODO: pass a path via CLI to use for relative file paths
  //opts.path ? file.replace(opts.path, '') : file;

  var buffers = [];

  function push(chunk, enc, next) {
    buffers.push(chunk);
    next();
  }

  function end(next) {
    var str = Buffer.concat(buffers).toString();
    var compiledTwig;

    try {
      compiledTwig = compile(id, str);
    } catch(e) {
      return this.emit('error', e);
    }

    this.push(process(compiledTwig));
    next();
  }

  return through(push, end);
}

function getRefName(path) {
    var refName = path;
    var match = path.match(/\/(\d{2}-)?(atoms|molecules|organisms|templates|pages)\/(.*\/)?(\d{2}-)?(.+)\.twig/);
    if (match) {
        refName = match[2] + '-' + match[5];
    }

    return refName;
}

function minifyTwig(str) {
    return str.replace(new RegExp('\\n+ *', 'g'), '');
}

module.exports = twigify;
module.exports.compile = compile;
