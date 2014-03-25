var ltss = new Object();

ltss.kendoPanelBar = {
    applyStyle: function () {
        $(".auto-dynamicform-style, .task-panelbar-style").kendoPanelBar();
        $('.auto-dynamicform-style li:nth-child(even)').addClass('alternate');
    },
    expand: function (selector) {
        var bar = $(selector).data("kendoPanelBar");
        $(selector).find(".k-item").each(function (i, item) {
            bar.expand($(item), false);
        });
    },
    expandAll: function (selector) {
        if (selector) {
            $(selector).each(function () {
                var bar = $(this).data("kendoPanelBar");
                if (bar != null) {
                    $(selector + " .k-item").each(function (i, item) {
                        bar.expand($(item), false);
                    });
                }
            });
        }
        else {
            $(".k-panelbar:not(.no-auto-expand)").each(function () {
                var bar = $(this).data("kendoPanelBar");
                if (bar != null) {
                    $(".k-panelbar .k-item").each(function (i, item) {
                        bar.expand($(item), false);
                    });
                }
            });
        }
    },
    expandFirst: function () {
        var bar = $(".k-panelbar:not(.no-auto-expand)").data("kendoPanelBar");
        if (bar != null) {
            $(".k-panelbar .k-item").each(function (i, item) {
                bar.expand($(item), false);
            });
        }
    },
    collapse: function (selector) {
        var bar = $(selector).data("kendoPanelBar");
        $(selector).find(".k-item").each(function (i, item) {
            bar.collapse($(item), false);
        });
    },
    collapseAll: function (selector) {
        if (selector) {
            var bar = $(selector).data("kendoPanelBar");
            $(selector + " .k-item").each(function (i, item) {
                bar.collapse($(item), false);
            });
        }
        else {
            var bar = $(".k-panelbar").data("kendoPanelBar");
            $(".k-panelbar .k-item").each(function (i, item) {
                bar.collapse($(item), false);
            });
        }
    },

    expandCollapseAllToggleButton: function (selector) {

        $('.k-item').click(function () {
            setTimeout(function () {
                if ($(selector).children('.k-state-default').length > 0 && $(selector).children('.k-state-active').length == 0) {
                    $('#expandCollapseAll').html("Expand All");
                    $('#expandCollapseAll').addClass('isCollapsed');
                }
                else if ($(selector).children('.k-state-default').length == 0 && $(selector).children('.k-state-active').length > 0) {
                    $('#expandCollapseAll').html("Collapse All");
                    $('#expandCollapseAll').removeClass('isCollapsed');
                }
                else if ($(selector).children('.k-state-default:not(.ignoreExpandCollapseState)').length == 0 && $(selector).children('.k-state-active').length > 0 && $(selector).children('.ignoreExpandCollapseState.k-state-default').length > 0) {
                    $('#expandCollapseAll').html("Collapse All");
                    $('#expandCollapseAll').removeClass('isCollapsed');
                }
            }, 250);
        });

        if ($(selector).hasClass('no-auto-expand')) {
            $('#expandCollapseAll').html("Expand All");
            $('#expandCollapseAll').addClass('isCollapsed');
        }
        else {
            $('#expandCollapseAll').html("Collapse All");
        }

        $('#expandCollapseAll').click(function () {
            if ($('#expandCollapseAll').hasClass('isCollapsed')) {
                $(this).html("Collapse All");
                ltss.kendoPanelBar.expandAll(selector);
                ltssPanelBar.expandAll(selector);
                $(this).removeClass('isCollapsed');
            }
            else {
                $(this).html("Expand All");
                ltss.kendoPanelBar.collapseAll(selector);
                ltssPanelBar.collapseAll(selector);
                $(this).addClass('isCollapsed');
            }
        });


    }
};

ltss.kendo = {
	dateToDatePicker: function (selector) {
		if (selector) {
			$(selector).kendoDatePicker({ format: "@CommonLabels.Format_Date" });
		} else {
			$('.date[data-role != "datepicker"]').each(function () {
				var datePickerOpts = {
					format: "MM/dd/yyyy"
				};

				if ($(this).data('dateobj')) {
					datePickerOpts.value = new Date($(this).data('dateobj'));
				}
				else if ($(this).data('initdate')) {
				    if ($(this).data('initdate') == 'today') {
				        datePickerOpts.value = new Date();
				    }
				}

				$(this).kendoDatePicker(datePickerOpts);

				if ($('.genericform-style :input').not('[type=hidden]').first().hasClass('date')){
				    $(this).focus();
				}
			})
		}
	}
};
