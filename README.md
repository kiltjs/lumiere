
# lumiere

Animation wrapper based on rAF (requestAnimationFrame)

[![npm](https://img.shields.io/npm/v/lumiere.svg)](https://www.npmjs.com/package/lumiere)
[![Build Status](https://travis-ci.org/kiltjs/lumiere.svg?branch=master)](https://travis-ci.org/kiltjs/lumiere)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> npm

``` sh
npm i lumiere --save
```

> yarn

``` sh
yarn add lumiere
```

### Usage

``` html
<script src="https://cdn.rawgit.com/kiltjs/lumiere/2449a6f3/dist/lumiere.min.js"></script>
```

``` js
import lumiere from 'lumiere';

var initial_scroll = document.scrollingElement.scrollTop,
    scroll_length = 100; // scroll down 100px

lumiere(400, function (progress) {

  document.scrollingElement.scrollTop = initial_scroll + scroll_length*progress;

}, function (progress) {

  // example of easeInQuad
  return progress*progress;

  // check out https://gist.github.com/gre/1650294 for more easing functions
  // also check out https://github.com/gre/bezier-easing

}).then(function () {

  // animation finished

});
```
