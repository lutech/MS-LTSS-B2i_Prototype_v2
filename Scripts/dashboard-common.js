

function setupDateRange(startDateInput, endDateInput, infoIcon, ssrsLink, dashboardConfigObj) {
    var dayRangeInMs = 30 * 24 * 60 * 60 * 1000;
    var yearsPast = 5 * 365 * 24 * 60 * 60 * 1000;

    endDateInput.kendoDatePicker({
        min: dashboardConfigObj.getReportEnd(),
        max: dashboardConfigObj.getReportEnd()
    });

    startDateInput.kendoDatePicker({
        min: new Date(dashboardConfigObj.getReportStart().getTime() - yearsPast),
        max: dashboardConfigObj.getReportStart()
    });

    startDateInput.data().kendoDatePicker.value(dashboardConfigObj.getReportStart());
    startDateInput.data().kendoDatePicker.bind('change', function (e) {
        if (startDateInput.data().kendoDatePicker.value() && endDateInput.data().kendoDatePicker.value() && dashboardConfigObj.getReportStart() != startDateInput.data().kendoDatePicker.value()) {
            dashboardConfigObj.setReportStart(startDateInput.data().kendoDatePicker.value());

            endDateInput.data().kendoDatePicker.min(dashboardConfigObj.getReportStart());
            endDateInput.data().kendoDatePicker.max(new Date(dashboardConfigObj.getReportStart().getTime() + dayRangeInMs));

            if (dashboardConfigObj.getReportEnd().getTime() > dashboardConfigObj.getReportStart().getTime() + dayRangeInMs || startDateInput.data().kendoDatePicker.value() > endDateInput.data().kendoDatePicker.value()) {
                return;
            }

            dashboardConfigObj.refresh();
        }
    });

    endDateInput.data().kendoDatePicker.value(dashboardConfigObj.getReportEnd());
    endDateInput.data().kendoDatePicker.bind('change', function (e) {
        if (startDateInput.data().kendoDatePicker.value() && endDateInput.data().kendoDatePicker.value() && dashboardConfigObj.getReportEnd() != endDateInput.data().kendoDatePicker.value()) {
            dashboardConfigObj.setReportEnd(endDateInput.data().kendoDatePicker.value());
            dashboardConfigObj.refresh();
        }
    });

    endDateInput.change(function (e) {
        checkInvalidDate(this);
    });

    startDateInput.change(function (e) {
        checkInvalidDate(this);
    });

    startDateInput.keydown(function (e) {
        if (e.keyCode == 13) {
            checkInvalidDate(this);
        }
    });


    function checkInvalidDate(dt) {
        var date = new Date($(dt).val());
        var startDate = new Date(startDateInput.val());
        var endDate = new Date(endDateInput.val());
        if (date != 'Invalid Date') {
            $(dt).qtip('hide');
            if (startDate != 'Invalid Date' && endDate != 'Invalid Date') {
                $(dt).qtip('hide');
                setTimeout(function() {
                    $(dt).qtip('option', 'content.text', $(dt).data('originalTip'));
                }, 500);

                if (startDate <= endDate) {
                    $(dt).qtip('hide');
                    //if(startDate.getTime() < new Date().getTime() - yearsPast)
                    //{
                    //    $(startDateInput).qtip('option', 'content.text', 'Please enter a valid date');
                    //    $(startDateInput).qtip('show');
                    //}
                    //else
                    //{
                    if (endDate.getTime() > startDate.getTime() + dayRangeInMs) {
                        infoIcon.qtip('show');
                    }
                    else {
                        infoIcon.qtip('hide');
                    }
                    //}
                }
                else {
                    infoIcon.qtip('hide');
                    $(dt).qtip('show');
                }
            }
        }
        else {
            $(dt).qtip('option', 'content.text', 'Please enter a valid date');
            $(dt).qtip('show');
        }
    }

    infoIcon.qtip({
        content: {
            text: "For date ranges larger than 30 days, and/or for data older than 5 years, please click the \"SSRS Report\" Link."
        },
        position: {
            my: 'bottom center',
            at: 'top center'
        },
        events: {
            show: function (event, api) {
                ssrsLink.qtip('show');
            },
            hide: function (event, api) {
                ssrsLink.qtip('hide');
            }
        },
        style: {
            classes: 'qtip-dark'
        }
    });

    ssrsLink.qtip({
        content: {
            text: "SSRS Report for larger date ranges."
        },
        position: {
            my: 'bottom center',
            at: 'top center',
            viewport: $('#body-content')
        },
        show: {
            event: false
        },
        style: {
            classes: 'qtip-dark'
        }
    });

    startDateInput.qtip({
        content: {
            text: "Start Date must be before End Date"
        },
        position: {
            my: 'bottom right',
            at: 'top left'
        },
        show: {
            event: false
        },
        hide: {
            event: false
        },
        style: {
            classes: 'qtip-dark',
            tip: {
                corner: true,
                height: 12
            }
        }
    });

    startDateInput.data('originalTip', "Start Date must be before End Date");

    endDateInput.qtip({
        content: {
            text: "End Date must be after Start Date"
        },
        position: {
            my: 'bottom right',
            at: 'top left'
        },
        show: {
            event: false
        },
        hide: {
            event: false
        },
        style: {
            classes: 'qtip-dark',
            tip: {
                corner: true,
                height: 12
            }
        }
    });

    endDateInput.data('originalTip', "End Date must be after Start Date");
}