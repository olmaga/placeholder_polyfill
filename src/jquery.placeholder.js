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
    function positionPlaceholder (placeholder, input) {
        var ta = input.is('textarea');

        placeholder.css({
            width: input.innerWidth() - (ta ? 20 : 4),
            height: input.outerHeight() + "px",
            "line-height": ta ? input.css("line-height") : input.outerHeight() + "px",
            whiteSpace: ta ? 'normal' : 'nowrap',
            overflow: 'hidden',
            "padding-left": (parseInt(input.css("padding-left").replace("px"),10) +2) + "px",
            "margin-top": input.css("margin-top")
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
                positionPlaceholder(polyfilled, input);
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

            positionPlaceholder(placeholder, input);

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
                positionPlaceholder(placeholder, input);
            });
            return this;
        });
    };
}(jQuery));