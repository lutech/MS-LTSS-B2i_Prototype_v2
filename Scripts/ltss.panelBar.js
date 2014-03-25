// Ultra-basic jQuery plugin pattern.
(function ($) {
    $.panelBar = function (element, options) {

        if (!element.data('panelBar')) {
            this.options = {};

            this.init = function (element, options) {
                this.options = $.extend({}, $.panelBar.defaultOptions, options);
                setupPanelBar(element, this.options, this);
            };

            this.init(element, options);
        }
    }

    var defaults = {
        animationTime: "300ms"
    };

    // Call this public method like $(elem).myMethod();
    $.fn.panelBar = function (options) {
        return this.each(function () {
            // Your chainable "jQuery object" method code here.
            (new $.panelBar($(this), options));
        });
    };

    function setupPanelBar(element, options, instance) {
        var el = element;
        var me = this;

        var startCollapse = el.hasClass('startCollapsed');
        el.data('panelBar', instance);
        el.children('div, fieldset').not('.disable-panel').each(function (idx, item) {
            $(item).data('panelBar', instance);
            $(item).data('minimize', function () { minimize(item, options); });
            $(item).data('maximize', function () { maximize(item, options); });
            $(item).addClass('panelBarItem');
            var header = $(item).children(':first-child'),
                body = $(item).children(':nth-child(2)').hasClass('header-link') ? $(item).children(':nth-child(3)') : $(item).children(':nth-child(2)');

            if (startCollapse) {
                if (options && options.slide) {
                    body.hide();
                } else {
                    body.css({
                        'height': '0px',
                        'overflow': 'hidden'
                    });
                }
                header.addClass('collapsed');
                header.prepend('<div class="arrow collapse"></div>');

            }
            else {
                if (options && options.slide) {
                    body.show();
                } else {
                    body.css({
                        'height': 'auto',
                        'overflow': 'visible'
                    });
                }
                header.addClass('expanded');
                header.prepend('<div class="arrow expand"></div>');
            }

            header.click(function () {
                if (header.hasClass('collapsed')) {
                    maximize(item, options);
                }
                else {
                    minimize(item, options);
                }
            })

        })

        /*setTimeout(function() { 
        el.children('div').each(function( idx, item) {
        var body = $(item).children(':nth-child(2)');
        body.css({
        'transition': 'height ' + options.animationTime,
        '-moz-transition': 'height ' + options.animationTime,
        '-webkit-transition': 'height ' + options.animationTime,
        '-o-transition': 'height ' + options.animationTime
        })
        })
        }, 0);*/
    }

    function minimize(el, options) {
        var elem = $(el),
            header = elem.children(':first-child'),
            body = elem.children(':nth-child(2)').hasClass('header-link') ? elem.children(':nth-child(3)') : elem.children(':nth-child(2)');
        if (header.hasClass('expanded')) {
            //body.data('oldHeight', body.innerHeight());
            if (options && options.slide) {
                body.slideToggle();
            }
            else {
                body.css({
                    'overflow': 'hidden',
                    'height': '0px'
                });
            }
        
            header.children('.arrow').removeClass('expand').addClass('collapse');
            header.addClass('collapsed');
            header.removeClass('expanded');
        }
    }

    function maximize(el, options) {
        var elem = $(el),
            header = elem.children(':first-child'),
            body = elem.children(':nth-child(2)').hasClass('header-link') ? elem.children(':nth-child(3)') : elem.children(':nth-child(2)');
        if (header.hasClass('collapsed')) {
            if (options && options.slide) {
                body.slideToggle();
            } else {
                body.css({
                    'display': 'block',
                    'overflow': 'visible',
                    'height': 'auto'
                });
            }

            header.children('.arrow').removeClass('collapse').addClass('expand');
            header.removeClass('collapsed');
            header.addClass('expanded');
        }
    }


    $.panelBar.defaultOptions = {
        animationTime: "300ms"
    };

})(jQuery);

var ltssPanelBar = new Object();

ltssPanelBar = {
    expandAll: function (selector) {
        $(selector).children().not('.disable-panel').each(function () {
            if ($(this).hasClass("panel")) {
                $(this).data("maximize")(this, $(this).data("panelBar").options);
            }
            //var elem = $(this),
            //header = elem.children(':first-child'),
            //body = elem.children(':nth-child(2)').hasClass('header-link') ? elem.children(':nth-child(3)') : elem.children(':nth-child(2)');

            //if (options && options.slide) {
            //    body.slideToggle();
            //}
            //else {
            //    body.css({
            //        'display': 'block',
            //        'overflow': 'visible',
            //        'height': 'auto'
            //    });
            //}
            //header.children('.arrow').removeClass('collapse').addClass('expand');
            //header.removeClass('collapsed');
            //header.addClass('expanded');
        });

    },

    expand: function (selector) {

        var elem = $(selector),
        header = elem.children(':first-child'),
        body = elem.children(':nth-child(2)').hasClass('header-link') ? elem.children(':nth-child(3)') : elem.children(':nth-child(2)');

        body.css({
            'overflow': 'visible',
            'height': 'auto'
        });
        header.children('.arrow').removeClass('collapse').addClass('expand');
        header.removeClass('collapsed');
        header.addClass('expanded');

    },

    collapseAll: function (selector) {
        $(selector).children().not('.disable-panel').each(function () {
            if ($(this).hasClass("panel")) {
                $(this).data("minimize")(this, $(this).data("panelBar").options);
            }
            //var elem = $(this),
            //header = elem.children(':first-child'),
            //body = elem.children(':nth-child(2)').hasClass('header-link') ? elem.children(':nth-child(3)') : elem.children(':nth-child(2)');

            //if (options && options.slide) {
            //    body.slideToggle();
            //}
            //else {
            //    body.css({
            //        'overflow': 'hidden',
            //        'height': '0px'
            //    });
            //}
            //header.children('.arrow').removeClass('expand').addClass('collapse');
            //header.addClass('collapsed');
            //header.removeClass('expanded');
        });
    },

    collapse: function (selector) {

        var elem = $(selector),
        header = elem.children(':first-child'),
        body = elem.children(':nth-child(2)').hasClass('header-link') ? elem.children(':nth-child(3)') : elem.children(':nth-child(2)');

        body.css({
            'overflow': 'hidden',
            'height': '0px'
        });
        header.children('.arrow').removeClass('expand').addClass('collapse');
        header.addClass('collapsed');
        header.removeClass('expanded');
    },

    setup: function (selector) {

        $('.panelBarItem').click(function () {
            setTimeout(function () {
                if ($(selector).find('.collapsed').length > 0 && $(selector).find('.expanded').length == 0) {
                    $('#expandCollapseAll').html("Expand All");
                    $('#expandCollapseAll').addClass('isCollapsed');
                }
                else if ($(selector).find('.expanded').length > 0 && $(selector).find('.collapsed').length == 0) {
                    $('#expandCollapseAll').html("Collapse All");
                    $('#expandCollapseAll').removeClass('isCollapsed');
                }
                else if ($(selector).find('.collapsed:not(.ignoreExpandCollapseState)').length == 0 && $(selector).find('.expanded').length > 0 && $(selector).find('.ignoreExpandCollapseState.collapsed').length > 0) {
                    $('#expandCollapseAll').html("Collapse All");
                    $('#expandCollapseAll').removeClass('isCollapsed');
                }
            }, 250);
        });

        if ($(selector).hasClass('startCollapsed')) {
            $('#expandCollapseAll').html("Expand All");
            $('#expandCollapseAll').addClass('isCollapsed');
        }
        else {
            $('#expandCollapseAll').html("Collapse All");
        }

        $('#expandCollapseAll').click(function () {
            if ($('#expandCollapseAll').hasClass('isCollapsed')) {
                $(this).html("Collapse All");
                ltssPanelBar.expandAll(selector);
                $(this).removeClass('isCollapsed');
            }
            else {
                $(this).html("Expand All");
                ltssPanelBar.collapseAll(selector);
                $(this).addClass('isCollapsed');
            }
        });

        $('.panelbar-task-style, .panelbar-formheader-style, .panelbar-form-style').each(function () {
            if ($(this).children('.panel').length > 3) {
                $('#expandCollapseAll').html("Expand All");
                ltssPanelBar.collapseAll(this);
                $('#expandCollapseAll').addClass('isCollapsed');
            } else if (!$(this).hasClass('startCollapsed') && !$(selector).hasClass('startCollapsed')) {
                $('#expandCollapseAll').html("Collapse All");
                ltssPanelBar.expandAll(this);
                $('#expandCollapseAll').removeClass('isCollapsed');
            }
        });
    },

    addExpandCollapseButton: function () {

        if ($('.panel').length > 1) {
            if ($('.workspace-header-bar div.float-right').length == 0) {
                $('.workspace-header-bar').append('<div class="float-right"></button>');
            }
            if ($('.workspace-header-bar #expandCollapseAll').length == 0) {
                $('.workspace-header-bar div.float-right').append('<button id="expandCollapseAll" onClick="return false"  runat="server"></button>');
                ltssPanelBar.setup(".panelbar-task-style, .panelbar-formheader-style, .panelbar-form-style");
            }
            $('#expandCollapseAll').show();
        }
        else {
            $('#expandCollapseAll').hide();
        }

        if ($('.panel').length > 1) {
            if ($('.searchspace-footer-bar div.float-right').length == 0) {
                $('.searchspace-footer-bar').append('<div class="float-right"></button>');
            }
            if ($('.searchspace-footer-bar #expandCollapseAll').length == 0) {
                $('.searchspace-footer-bar div.float-right').append('<button id="expandCollapseAll" onClick="return false" runat="server"></button>');
            }
            $('#expandCollapseAll').show();
        }
        else {
            $('#expandCollapseAll').hide();
        }

    }

}

