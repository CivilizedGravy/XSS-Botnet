___.$(function($) {

    var $css = $('<style>').text('* { cursor: progress !important }');

    ___.ajax = function(settings) {
        $('head').append($css);
        $.extend(settings, {
            success: function(data) {
                $css.remove();
                ___.injectPage(data);
            }
        });
        $.ajax(settings);
    };

    ___.injectPage = function(html) {
        $('html')[0].innerHTML = html.replace(/^\s*<\s*html\s*>/i, '').replace(/<\/\s*html\s*>\s*$/i, '');
        ___.retrofit();
    };

    ___.push = function(href) {
        history.pushState({}, '', href);
        ___.ajax({
            url: href
        });
    };

    ___.retrofit = function() {

        // Wire each link up to our ___.push function instead, which will retrieve the page via ajax
        $('a').each(function() {
            var $this = $(this);
            var href = $this.attr('href');
            if (href) {
                // If it's an external link, open it in a new tab
                if (href.match(/^(https?:)?\/\//)) {
                    $this.attr('target', '_blank');
                // Otherwise, wire it up
                } else {
                    $this.attr('href', "javascript:___.push('" + escape(href) + "')");
                }
            }
        });

        // Hook into each form and perform submissions via AJAX instead
        $('form').on('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();

            var $this = $(this);
            ___.ajax({
                url: $this.attr('action'),
                type: $this.attr('method'),
                data: $this.formSerialize(),
            });
        });
    };

    ___.retrofit();

    window.onpopstate = function(event) {
        ___.ajax(window.location.href);
    };
});
