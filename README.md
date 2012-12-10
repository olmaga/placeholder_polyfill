HTML5 Placeholder Polyfill
==========================

HTML5 Placeholder are awesome for the user and helps on many places to understand what's needed.
Often they even replace the label all in all. But what's with all the old browsers (http://caniuse.com/#search=placeholder)?
Even in newer browsers (e.g. IE10) placeholders are hidden on focus.

What the polyfill provides:
- placeholder read from attribute
- is hidden on first typed character (not on focus)
- works for ie>6

What the problems are:
- works only on rendered elements within the dom
- positioning of the placeholder can be off by 1-2 pixels

Demos:
------
Working example here: http://codepen.io/deFux/full/JKxog

Dependencies:
-------------

RequestAnimationFrame from Paul Irish
https://gist.github.com/1579671