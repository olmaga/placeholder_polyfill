/**
* Placeholder polyfill for "real" placeholders also in IE > 6.
*
* based on code: https://github.com/ginader/HTML5-placeholder-polyfill
*/

(function ($) {
    var animId;
    function showPlaceholderIfEmpty (input, label, options) {
        if (!input.val() || input.val() === '') {
            $("span", label).removeClass(options.hideClass);
        } else {
            $("span", label).addClass(options.hideClass);
        }
    }
    function hidePlaceholder (input, options) {
        input.addClass(options.hideClass);
    }
    function positionPlaceholder (placeholder, label, input) {
        var ta = input.is('textarea');
      
        // padding + margin + border
        var padleft = parseInt(input.css("padding-left").replace("px"), 10);
        var margleft = parseInt(input.css("margin-left").replace("px"), 10);
        var bordleft = parseInt(input.css("border-left-width").replace("px"), 10);
        var left = (padleft ? padleft : 0) + (margleft ? margleft : 0) + (bordleft ? bordleft : 0);
      
        // just seems to be right to do one pixel less
        var padtop = parseInt(input.css("padding-top").replace("px"), 10);
        var margtop = parseInt(input.css("margin-top").replace("px"), 10);
        var bordtop = parseInt(input.css("border-top-width").replace("px"), 10);
        var top = (padtop ? padtop : 0) + (margtop ? margtop : 0) + (bordtop ? bordtop : 0) + 1;

        // inputs have just the height of the input as line-height to be vertically aligned
        var lineheight = input.innerHeight();
        if (ta) {  
            // if a textarea, the lineheight is set to either the line-height of the textarea (if set)
            var lh = parseInt(input.css("line-height").replace("px"), 10);
            if (isNaN(lh)) {
                // if not we set it to 1.3 times the font-size
                lineheight = parseInt(input.css("font-size").replace("px"), 10) * 1.3;
            } else {
                lineheight = lh;
            } 
            // and we add the padding/margin/border (twice for textareas)
            lineheight += top;
        }
        // and we add the padding/margin/border
        lineheight += top;
      
        placeholder.css({
            "font-size": input.css("font-size"),
            "line-height": lineheight + "px",
            "padding-left": left + "px",
            "overflow": 'hidden',
            "width": input.outerWidth() + "px",
            "height": input.outerHeight() + "px"
        });
    }
    function startFilledCheckChange (input, label, options) {
        var val = input.val();
        (function checkloop () {
            animId = requestAnimationFrame(checkloop);
            if (input.val() !== val) {
                hidePlaceholder(input, options);
                stopCheckChange();
                startEmptiedCheckChange(input, label, options);
            }
        }());
    } 
    function startEmptiedCheckChange (input, label, options) {
        (function checkloop () {
            animId = requestAnimationFrame(checkloop);
            showPlaceholderIfEmpty(input, label, options);
        }());
    }
    function stopCheckChange () {
        cancelAnimationFrame(animId);
    }

    $.fn.polyfill_placeholder = function (config) {
        var o = this;
        this.options = $.extend({
            className: 'placeholder', // css class that is used to style the placeholder
            visibleToScreenreaders: true, // expose the placeholder text to screenreaders or not
            visibleToScreenreadersHideClass: 'placeholder-hide-except-screenreader', // css class is used to visually hide the placeholder
            visibleToNoneHideClass: 'placeholder-hide', // css class used to hide the placeholder for all
            removeLabelClass: 'visuallyhidden', // remove this class from a label (to fix hidden labels)
            hiddenOverrideClass: 'visuallyhidden-with-placeholder', // replace the label above with this class
            forceApply: false
        // apply the polyfill even for browser with native support
        }, config);
        this.options.hideClass = this.options.visibleToScreenreaders ? this.options.visibleToScreenreadersHideClass : this.options.visibleToNoneHideClass;
        return $(this).each(function (index) {
            var input = $(this);
            var txt = input.attr('placeholder');
            if (!txt) {
                return;
            }
            var id = input.attr('id');

            // ie 10 does NOT support the placeholder, even he thinks so
            if (('placeholder' in document.createElement('input')) || $.browser.msie && $.browser.version.indexOf("10") > -1) {
                input.removeAttr('placeholder');
            }

            // if there is no label add one
            var label = $('<label class="visuallyhidden"/>', {
                'for': id,
                css: {
                    margin: 0,
                    height: 0
                }
            });
            input.before(label);

            // already added a polyfill?
            var polyfilled = $(label).find('.placeholder');
            if (polyfilled.size() > 0) {
                positionPlaceholder(polyfilled, label,  input);
                polyfilled.text(txt);
                return input;
            }

            // now add a polyfill
            if (label.hasClass(o.options.removeLabelClass)) {
                label.removeClass(o.options.removeLabelClass).addClass(o.options.hiddenOverrideClass);
            }
            label.append($('<span>').addClass(o.options.className).text(txt))
            var placeholder = $("span", label);

            // add title if placeholder longer than input
            var titleNeeded = (placeholder.width() > input.width());
            if (titleNeeded) {
                placeholder.attr('title', txt);
            }

            // pass the focus onclick ie7 needs a timeout here
            label.click(function () {
                setTimeout(function() { input.focus(); }, 1);
            });
            placeholder.click(function () {
                setTimeout(function() { input.focus(); }, 1);
            });

            positionPlaceholder(placeholder, label, input);

            input.focusout(function () {
                showPlaceholderIfEmpty(input, label, o.options);
                if (window.cancelAnimationFrame) {
                    stopCheckChange();
                }
            });
            input.focusin(function () {
                showPlaceholderIfEmpty(input, label, o.options);
                if (window.cancelAnimationFrame) {
                    startFilledCheckChange(input, label, o.options);
                }
            });

            // we start it already, cause autofocus (tabindex=1) does not trigger focusin
            if (window.requestAnimationFrame) {
                startFilledCheckChange(input, label, o.options);
            }
            
            showPlaceholderIfEmpty(input, label, o.options);

            // reformat on window resize and optional reformat on font resize - requires: http://www.tomdeater.com/jquery/onfontresize/
            $(document).bind("fontresize resize", function () {
                positionPlaceholder(placeholder, label,  input);
            });
            return this;
        });
    };
}(jQuery));