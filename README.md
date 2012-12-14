# HTML5 Placeholder Polyfill

HTML5 Placeholder are awesome for the user and helps on many places to understand what's needed.
Often they even replace the label all in all. But what's with all the old browsers (http://caniuse.com/#search=placeholder)?
Even in newer browsers (e.g. IE10) placeholders are hidden on focus.

### What the polyfill provides:
* placeholder read from attribute
* is hidden on first typed character (not on focus)

### Known issues:
* works only on rendered elements within the dom
* does it also if the normal placeholder is available

## Compatibility
Tested in IE 7 - 10

## HowTo

    <input type="text" placeholder="Enter some text"/>
    <script>
        $("input").polyfill_placeholder();
    </script>

Thats all the magic.

## Demos
Working example here: http://codepen.io/deFux/full/JKxog

## Dependencies
RequestAnimationFrame from Paul Irish
https://gist.github.com/1579671
