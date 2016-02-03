twigify-patternlab
=======

`twigify-patternlab` is a [Browserify](https://github.com/substack/node-browserify) transform for creating modules of pre-compiled [Twig.js](https://github.com/justjohn/twig.js) templates.
This module is a fork of [twigify](https://github.com/dane-harnett/twigify) wich support [Pattern Lab](http://patternlab.io/) include syntax [patternType]-[patternName]

### Installation ###
With [`npm`](http://npmjs.org/) as a local development dependency:

```bash
npm install --save-dev twigify-patternlab
```

### Usage ###

In `patterns/00-atoms/00-globals/title.twig`:
```html+twig
<h1>{{ title }}</h1>
```

In `title.js`:
```js
var template = require('./patterns/00-atoms/00-globals/title.twig');
var body = template.render({
  title: 'Main Page'
});
$('body').html(body);
```

Including sub templates:

In `patterns/00-molecules/01-alert/warning.twig`:
```html+twig
<h1>{{ title }}</h1>
{% include 'atoms-title' %}
```

In `warning.js`:
```js
// need to require() this so that it is available for warning.twig
require('./patterns/00-atoms/00-globals/title.twig');
var mainTemplate = require('./patterns/00-molecules/01-alert/warning.twig');

var page = mainTemplate.render({
  title: 'Main Page'
});
$('body').html(page);
```

#### Transforming with the command-line ####

```bash
browserify test.js -t twigify-patternlab > test-bundle.js
```
