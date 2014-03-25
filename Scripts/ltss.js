// Ltss javascript functions
var localstoragekeys = {
    "interRaiAssessment": "stdAssessments",
    "nurseMonitoring": "nurseMonitoring",
    "assessmentParams": "assessmentParams",
    "nurseMonitoringParams": "nurseMonitoringParams",
    "backupStdAssessments": "backupStdAssessments",
    "staffInfo": "staffInfo",
    "messageNestPage": "messageNextPage",
    "programtasklist": "programtasklist",
    "backupNurseMonitoring":"backupNurseMonitoring"
}
var oTable;

var defaultDataTableOptions = {
    "oLanguage": {
        "sSearch": "Filter all columns:"
    },
    //"aLengthMenu":[[10,25, 50, -1], [10,25, 50, "All"]],
    "sScrollY": "100%",
    "sScrollX": "100%",
    "bPaginate": false,
    //"bPaginate": true,
    //"bScrollInfinite": true,
    "sDom": 'rt<"dataTableInfoPanelWrap"<"dataTableInfoPanel"if>>',
    "bDeferRender": true,
    "bScrollCollapse": true,
    "bSort": true,
    "aaSorting": [], /*no init sort*/
    "aoColumnDefs": [],
    "bRetrieve": true,
    "bJQueryUI": true,
    "bAutoWidth": false,
    "fnDrawCallback": function (oSettings) {
        /*if (!$('#' + oSettings.sInstance).hasClass('inline-dataTable') && !$('#' + oSettings.sInstance).hasClass('generalTable')) {
            var colStr = '';

            $.each($('#' + oSettings.sInstance + '_wrapper .dataTables_scrollHead table').find('tr[role=row]:has(th)').first().children('th'), function () {
                if (!($(this).width() == 0 || !$(this).is(':visible'))) {
                colStr += '<col style="width:' + $(this).outerWidth() + 'px">';
                }
            });

            if ($('#' + oSettings.sInstance).find('colgroup').length == 0) {
                $('#' + oSettings.sInstance).find('thead').replaceWith('<colgroup>' + colStr + '</colgroup>')
            }
            else {
                $('#' + oSettings.sInstance).find('thead').remove();

                    if (!$('#' + oSettings.sInstance).data('colgroup')) {
                        $('#' + oSettings.sInstance).data('colgroup', '<colgroup>' + colStr + '</colgroup>');
            }

                    $('#' + oSettings.sInstance).find('colgroup').replaceWith($('#' + oSettings.sInstance).data('colgroup'))
            }

            //$.each($('#' + oSettings.sInstance).find('tr[role=row]:has(td)').first().children('td'), function () {
            //    colStr += '<col style="width:' + $(this).outerWidth() + 'px">';
            //});
            //if ($('#' + oSettings.sInstance).find('colgroup').length == 0) {
            //    $('#' + oSettings.sInstance).find('thead').replaceWith('<colgroup>' + colStr + '</colgroup>')
            //}
            //else {
            //    $('#' + oSettings.sInstance).find('thead').remove();
            //    $('#' + oSettings.sInstance).find('colgroup').replaceWith('<colgroup>' + colStr + '</colgroup>')
            //}

            //this.fnAdjustColumnSizing(false);
        }*/

        if ($('#' + oSettings.sInstance + '_filterSearch').length > 0) {
            $('<a name="filter_search_results" id="filter_search_results" class="ui-hide"></a>')
                .insertAfter($('#' + oSettings.sInstance + '_wrapper .dataTables_scroll'));

            $('<a href="#Search_Results" class="ui-hide js-skip-link">Skip back to Search Results</a>')
                .insertAfter($('#' + oSettings.sInstance + '_wrapper .dataTableInfoPanelWrap'));
        }

        if ($('#' + oSettings.sInstance).data('afterrender')) {
            window[$('#' + oSettings.sInstance).data('afterrender')]($('#' + oSettings.sInstance));
        }
    }

}

function applyDataTables() {
    
    //sort
    //date format: <span id="date" class="display-date">mm/dd/yyyy</span>
    jQuery.fn.dataTableExt.aTypes.unshift(
        function (sData) {
            if (sData) {
                if (typeof sData == 'string' && sData.indexOf("display-date") >= 0) {
                    return 'date-mmddyyyy';
                }
                else {
                    return null;
                }
            }
        }
     );
    jQuery.fn.dataTableExt.oSort['date-mmddyyyy-asc'] = function (a, b) {
        var x = 19000101;
        var y = 19000101;
        if (a.search(/[\d]{2}\/[\d]{2}\/[\d]{4}/) > 0) {
            var Datea = (a.substr(a.search(/[\d]{2}\/[\d]{2}\/[\d]{4}/), 10)).split('/');
            x = (Datea[2] + Datea[0] + Datea[1]) * 1;
        }
        if (b.search(/[\d]{2}\/[\d]{2}\/[\d]{4}/) > 0) {
            var Dateb = (b.substr(b.search(/[\d]{2}\/[\d]{2}\/[\d]{4}/), 10)).split('/');
            y = (Dateb[2] + Dateb[0] + Dateb[1]) * 1;
        }
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    };

    jQuery.fn.dataTableExt.oSort['date-mmddyyyy-desc'] = function (a, b) {
        var x = 19000101;
        var y = 19000101;
        if (a.search(/[\d]{2}\/[\d]{2}\/[\d]{4}/) > 0) {
            var Datea = (a.substr(a.search(/[\d]{2}\/[\d]{2}\/[\d]{4}/), 10)).split('/');
            x = (Datea[2] + Datea[0] + Datea[1]) * 1;
        }
        if (b.search(/[\d]{2}\/[\d]{2}\/[\d]{4}/) > 0) {
            var Dateb = (b.substr(b.search(/[\d]{2}\/[\d]{2}\/[\d]{4}/), 10)).split('/');
            y = (Dateb[2] + Dateb[0] + Dateb[1]) * 1;
        }
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    };

    $(".dataTable:not(.rowgrouping)").not('[noInit]').each(function (idx, el) {
        buildDataTable($(this));
        });
    $(".dataTableWithColumnFilter").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "oLanguage": {
                "sSearch": "Filter all columns xxx:"
            },
            "sScrollY": "300px",
            "sScrollX": "250%",
        },
        "columnFilter");
    });

    $(".dataTable.rowgrouping").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "100%",
        },
        "rowGrouping");
    });

    $(".inline-dataTable:not(.rowgrouping)").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "250%",
            "sDom": '',
        });
    });
    $(".generalTable").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "250%",
            "sDom": '',
        });
    });

    $(".inline-dataTable.rowgrouping").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "100%",
            "sDom": '',
        },
        "rowGrouping");
    });

    $(".inline-table-noFilter").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "100%",
            "sDom": '',
        });
    });

    $.fn.dataTableExt.oJUIClasses.sWrapper = "dataTable-summarylist-style";

    $(".dataTable-list-style").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "100%",
        });
    });

    $.fn.dataTableExt.oJUIClasses.sWrapper = "dataTable-summarylist-style-footer";

    $(".dataTable-list-style-footer").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "100%",
            "sDom": 'rt',
            "bInfo": false,
            "bfilter": false,
        });
    });

    $.fn.dataTableExt.oJUIClasses.sWrapper = "dataTable-list-style-footer-filter";

    $(".dataTable-first-column-checkbox").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "sWidth": "30px",
                    "aTargets": [0]
                }
            ]
        });
    });

    $.fn.dataTableExt.oJUIClasses.sWrapper = "dataTable-summarylist-style-footer-filter";

    $(".dataTable-first-column-checkbox-filter").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "sWidth": "30px",
                    "aTargets": [0],
                    "sDom": 'rt',
                }
            ]
        });
    });
    
    $.fn.dataTableExt.oJUIClasses.sWrapper = "dataTable-list-style-footer-filter";

    $(".dataTable-footer-filter:not(.rowgrouping)").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "100%",
        });
    });
    $.fn.dataTableExt.oJUIClasses.sWrapper = "dataTable-list-style-footer-filter";

    $(".dataTable-footer-filter.rowgrouping").not('[noInit]').each(function () {
        buildDataTable($(this), {
            "sScrollY": "330px",
            "sScrollX": "100%",
        },
        "rowGrouping");
    });
                }

function buildDataTable(table, opts, plugin) {

    var expr = new RegExp('>[ \t\r\n\v\f]*<', 'g');
    var tbhtml = table.html();
    table.html(tbhtml.replace(expr, '><'));
   
    var options = $.extend(true, {}, defaultDataTableOptions, opts);

    // Check for unsortable columns
    var unsortableColumns = [];
    $.each(table.find('th'), function (idx, el) {
        if ($.trim($(this).text()).match(/^action|editing/i) || $(el).data('nosorting')) {
            unsortableColumns.push(idx)
            }
    });

    if (unsortableColumns.length > 0) {
        options.aoColumnDefs.push({
            "bSortable": false,
            "aTargets": unsortableColumns
        });
    }

    if (plugin == "rowGrouping") {
        options.fnDrawCallback = null;
    }

    if (table.data('nosorting')) {
        options.bSort = false;
    }

    if (table.data('nofooter')) {
        options.sDom = "rt";
    }

    if (table.data('scrolly')) {
        options.sScrollY = table.data('scrolly').toString();
        options.sScrollX = "100%";
    }
    
    if (table.data('displaylength')) {
        options.bPaginate = true;
        options.iDisplayLength = table.data('displaylength');
    }

    if (table.data('isajax')) {
        var aoColumnsArr = [];

        table.children('thead').children('tr').children('th').each(function () {
            aoColumnsArr.push({
                "mData": $(this).data('datatablefield') ? $(this).data('datatablefield') : null
            });

            if ($(this).data('oncellrender')) {
                options.aoColumnDefs.push({
                    "mRender": eval($(this).data('oncellrender')),
                    "aTargets": [$(this).index()]
                });
            }
            if ($(this).data('datatablesort')) {
                if ($(this).data('datatablesort') == "asc") {
                    options.aaSorting.push([$(this).index(), "asc"]);
                }
            }
            if ($(this).data('datatablesort')) {
                if ($(this).data('datatablesort') == "desc") {
                    options.aaSorting.push([$(this).index(), "desc"]);
                }
            }
        });
        if (table.data('ajaxload')) {
            options.bServerSide = false;
            options.sAjaxSource = table.data('ajaxsource');
            options.sDom = 't<"dataTableInfoPanelWrap"<"dataTableInfoPanel"i<"dataTableInfoPanelRight clearfix"lfp>>>r';
            options.iDisplayLength = 25;
            options.bPaginate = true;
            
            options.sPaginationType = "full_numbers";
            $(table.data('sessioncleartag')).click(function () {
                DataSessionStorageClear();
            })
        }
        if (table.data('isserverside')) {
            options.bServerSide = true;
            options.bProcessing = true;
        }

        if (table.data('serverparams')) {
            options.fnServerParams = function (aoData) {
                window[$(table).data('serverparams')](aoData);
            }
        }
        if (table.data('onrowrender')) {
            options.fnCreatedRow = eval($(table).data('onrowrender'));
        }

        if (table.data('nosorting')) {
            options.bSort = false;
        }

        if (table.data('nofooter')) {
            options.sDom = "rt";
        }

        if (table.data('initialdata')) {
            options.aaData = eval(table.data('initialdata'));
        }
        if (table.data('lengthmenu')) {
            options.aLengthMenu = eval(table.data('lengthmenu'));
        }
        if (!options.aoColumns) {
            options.aoColumns = aoColumnsArr;
        }
    }

    var dtInstance;
    switch (plugin) {
        case "columnFilter":
            dtInstance = table.dataTable(options).columnFilter();
            break;
        case "rowGrouping":
            dtInstance = table.dataTable(options).rowGrouping();
            break;
        default:
            dtInstance = table.dataTable(options);
    }

    if (table.data('initsort')) {
        dtInstance.fnSort(eval(table.data('initsort')));
    }

    table.data('dataTableInstance', dtInstance);

    $('#txtGridFilter').each(function () {
        $(this).keyup(function () {
            dtInstance.fnFilter($(this).val());
        });
    });
}
function DataSessionStorageClear() {
    var table = $.fn.dataTable.fnTables(true);
    if (table.length > 0) {
        $.each(table, function(index, value) {
            sessionStorage.removeItem(value.id);
        });
    }
}

window.onbeforeunload = function(e) {
    DataSessionStorageClear();
};

function dataTableAjaxLoad(table, url, params, successFn) {
    var dataTableObj = table.data().dataTableInstance;
    dataTableObj.fnClearTable();
    //var msgDiv = $('#' + table.attr('id') + '_message');
    //table.attr('aria-hidden', true);
    //msgDiv.text('Loading search results');
    //msgDiv.attr('role', 'alert');
    ajaxRequest = $.getJSON(
        url,
        params,
        function (data) {
            HandleAjaxResult(data, function () {
                var dataObj = data.data;
                if (dataObj.length > 0) {
                    dataTableObj.fnAddData(dataObj);
                    //table.attr('role', 'alert');
                    /*setTimeout(function () {
                        msgDiv.text('Results complete.  A total of ' + dataObj.length + ' results were found.');
                    }, 1000);*/
                    //table.attr('aria-hidden', false);
                }

                if (successFn) {
                    successFn(dataObj);
                }
            });
        });
}

function ApplyDollarAmt() {

    $(".dollarAmt").each(function () {
        if (isNaN(this.value) || this.value == "") {
            return;
        }
        var amount = parseFloat(this.value).toFixed(2);
        this.value = amount;
    });
}

function FormatDollarAmt(value) {
    if (isNaN(value) || value == "") {
        return "";
    }
    return amount = parseFloat(value).toFixed(2);
}

$(".dollarAmt").live("change", function () {
    if (isNaN(this.value) || this.value == "") {
        return;
    }
    var amount = parseFloat(this.value).toFixed(2);
    this.value = amount;
});

function parseDates(data) {
    var dateFields = new Array();
    var dataSourceSchema = this;
    for (var propertyName in dataSourceSchema.fields) {
        if (dataSourceSchema.fields[propertyName].type == "date") {
            dateFields.push(propertyName);
        }
    }
    if (dateFields.length > 0) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < dateFields.length; j++) {
                if (data[i][dateFields[j]]) {
                    data[i][dateFields[j]] = new Date(data[i][dateFields[j]]);

                    alert(data[i][dateFields[j]]);

                }
                else {
                    data[i][dateFields[j]] = "";
                }
            }
        }
    }
    return data;
}

function checkTimeOrder(beforeTime, afterTime, fnValid, fnInvalid) {
    var isValid = true;
    
    if (beforeTime instanceof Date && afterTime instanceof Date) {
        isValid = afterTime > beforeTime;
    }
    else {
        var timePatt = /^(\d{2})\/(\d{2})\/(\d{4})\s((?:0?[1-9])|(?:1[0-2])):([0-5][0-9])\s((?:a|p)m)/i;

        var beforeTimeDayStr,
            beforeTimeMonthStr,
            beforeTimeYearStr,
            beforeTimeHourStr,
            beforeTimeMinStr,
            beforeTimeAmPmStr,
            afterTimeDayStr,
            afterTimeMonthStr,
            afterTimeYearStr,
            afterTimeHourStr,
            afterTimeMinStr,
            afterTimeAmPmStr;

        var beforeTimeReFound = timePatt.exec(beforeTime);
        beforeTimeDayStr = beforeTimeReFound[2];
        beforeTimeMonthStr = beforeTimeReFound[1];
        beforeTimeYearStr = beforeTimeReFound[3];
        beforeTimeHourStr = beforeTimeReFound[4];
        beforeTimeMinStr = beforeTimeReFound[5];
        beforeTimeAmPmStr = beforeTimeReFound[6];

        var afterTimeReFound = timePatt.exec(afterTime);
        afterTimeDayStr = afterTimeReFound[2];
        afterTimeMonthStr = afterTimeReFound[1];
        afterTimeYearStr = afterTimeReFound[3];
        afterTimeHourStr = afterTimeReFound[4];
        afterTimeMinStr = afterTimeReFound[5];
        afterTimeAmPmStr = afterTimeReFound[6];


        var beforeTimeHour = parseInt(beforeTimeHourStr);

        if (beforeTimeAmPmStr.toLowerCase() == 'pm' && beforeTimeHour != 12) {
            beforeTimeHour += 12;
        }

        if (beforeTimeAmPmStr.toLowerCase() == 'am' && beforeTimeHour == 12) {
            beforeTimeHour = 0;
        }

        var afterTimeHour = parseInt(afterTimeHourStr);

        if (afterTimeAmPmStr.toLowerCase() == 'pm' && afterTimeHour != 12) {
            afterTimeHour += 12;
        }

        if (afterTimeAmPmStr.toLowerCase() == 'am' && afterTimeHour == 12) {
            afterTimeHour = 0;
        }

        beforeTimeHourStr = beforeTimeHour < 10 ? '0' + beforeTimeHour : beforeTimeHour.toString();
        afterTimeHourStr = afterTimeHour < 10 ? '0' + afterTimeHour : afterTimeHour.toString();

        var beforeTimeDateInt = parseInt(beforeTimeYearStr + beforeTimeMonthStr + beforeTimeDayStr + beforeTimeHourStr + beforeTimeMinStr);
        var afterTimeDateInt = parseInt(afterTimeYearStr + afterTimeMonthStr + afterTimeDayStr + afterTimeHourStr + afterTimeMinStr);

        if (afterTimeDateInt < beforeTimeDateInt) {
            isValid = false;
        }
    }
    
    if (!isValid) {
        fnInvalid();
        return false;
    }
    else {
        fnValid();
        return true;
    }
}

function JSONtoDate(value) {
    if (value == null) {
        return "";
    }
    var dateRegExp = /^\/Date\((.*?)\)\/$/;
    var date = dateRegExp.exec(value);
    return new Date(parseInt(date[1]));
}

function clearFormElements(ele) {
    $(ele).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}

// Handle AjaxResult json object
// ajaxResult: javascript object or json string
// onsuccess: callback function invoked when ajaxResult succeed
function HandleAjaxResult(ajaxResult, onsuccess) {
    var result = ajaxResult;
    if (typeof ajaxResult == "string") {
        try {
            result = $.parseJSON(ajaxResult);
        }
        catch (err) {
        }
    }

    if (result.Redirect) {
        if (result.Redirect == "_reload") {
            window.location.reload();
        }
        else {
            window.location.href = result.Redirect;
        }
    }
    else if (result.Message) {
        showMessage(result.Message);
    }
    else {
        if (onsuccess) {
            onsuccess(result);
        }
    }
}

function showMessage(msg) {
    $("#messages").html(msg);
}

//define emun for message type
if (typeof MessageType == "undefined") {
    var MessageType = {
        Success: 1,
        Info: 2,
        Error: 3
    };
}

function buildMessage(msg, messageType) {

    var cssClassName = "";
    var messagePrepend = "";
    switch (messageType) {
        case MessageType.Success:
            cssClassName = "message-success";
            messagePrepend = "Success: ";
            break;
        case MessageType.Info:
            cssClassName = "message-info";
            messagePrepend = "Info: "
            break;
        case MessageType.Error:
            cssClassName = "message-error";
            messagePrepend = "Error: "
            break;
    }
    var result = "";
    if ($.isArray(msg) && msg.length > 0) {

        result = "<div class='" + cssClassName + "'>";
        for (var i = 0; i < msg.length; i++) {
            result += "<div class=\"notification\">" + messagePrepend + msg[i] + "<div class=\"closeButton\" onclick=\"closeMessage(this);\"></div></div>";
        }
        result += "</div>";
    }
    else if (typeof (msg) == "string") {
        result = "<div class='" + cssClassName + "'>";
        result += "<div class=\"notification\" role='alert'>" + messagePrepend + msg + "<div class=\"closeButton\" onclick=\"closeMessage(this);\"></div></div>";
        result += "</div>";

    }
    return result;
}

function closeMessage(exitBtn) {
    if (!exitBtn) {
        $("#messages").html('');
    }
    else {
        $(exitBtn).parent().fadeOut(250, "linear", function () {
            $(this).remove();
        });
    }
}
function showInfoMessage(msg) {
    var result = buildMessage(msg, MessageType.Info);
    $("#messages").html(result);
}
function showErrorMessage(msg) {
    var result = buildMessage(msg, MessageType.Error);
    $("#messages").html(result);
    $.unblockUI();
}
function showSuccessMessage(msg, timeout) {
    var result = buildMessage(msg, MessageType.Success);
    $("#messages").html(result);

    if (timeout) {
        $("#messages").delay(2000).fadeOut(timeout, 'linear', function () {
            $("#messages").empty();
            $("#messages").show();
        });
    }
}

function discardConfirm(msg) {
    if (!msg) {
        msg = "Do you want to discard?";
    }
    var answer = confirm(msg);
    if (answer) {
        return true;
    }
    return false;
}

function htmlEncode(value) {
    if (value) {
        return $('<div />').text(value).html();
    }
    else {
        return '';
    }
}

function htmlDecode(value) {
    if (value) {
        return $('<div />').html(value).text();
    }
    else {
        return '';
    }
}

// Initialize popup dialog for create/edit screen.
// The following layout should be applied to the partial view for displaying error message in the dialog.
//     Layout = "~/Views/Shared/_DialogLayout.cshtml".
// Paramter callbackAfterSave is a function like function(dialogDiv) { ... }.
// This method depend on method buildMessage(), ajaxResultPartialView(), applyDataTables().
//  popupDialogOptions example:
//            {
//                dialogId: "CertificationDialog",
//                dialogWidth: 720,
//                createFormId: null,
//                editFormId: EditCertification,
//                createTitle: "",
//                editTitle: editTitle,
//                refreshPanelId: "div_Certification",
//                callbackAfterSave: function() {
//                },
//             addLink: {},
//             editLink: $("a#EditCertificationLink")
//            }
function InitPopupDialog(popupDialogOptions) {
    var options = popupDialogOptions || {};
    options = {
        dialogId: options.dialogId || null,
        dialogWidth: options.dialogWidth || 800,
        createFormId: options.createFormId || null,
        editFormId: options.editFormId || null,
        createTitle: options.createTitle || "Create",
        editTitle: options.editTitle || "Edit",
        refreshPanelId: options.refreshPanelId || null,
        callbackAfterSave: options.callbackAfterSave || function () {
        },
        addLink: options.addLink || {},
        editLink: options.editLink || {},
        hideButtons: options.hideButtons || null,
        saveBtnText: options.saveBtnText || null,
        cancelBtnText: options.cancelBtnText||null
    };

    var dialogDiv = $("#" + options.dialogId);
    var refreshPanelDiv = options.refreshPanelId ? $("#" + options.refreshPanelId) : null;
    var saveButtonSelector = ".ui-dialog-buttonpane button:contains('Save')";

    var save = function (shouldCloseDialog) {
        //$(dialogDiv).block();

        var isEditMode = $(dialogDiv).attr("dialogType") == "edit";
        var formId = isEditMode ? options.editFormId : options.createFormId;
        var url = $("form#" + formId).attr("action");
        var postdata = $("form#" + formId).serialize();

        if (jQuery.validator) {
            if (!$("form#" + formId).valid()) {
                return;
            }
        }
        
        $(saveButtonSelector).button("disable");
        
        $.post(url, postdata, function (data) {

            var hasGlobalError = !IsJsonString(data) && $(data).find("#messages:has(.error, .message-error)").children().length > 0;
            var hasFieldError = !IsJsonString(data) && $(data).find("span.field-validation-error").length > 0;

            $(saveButtonSelector).button("enable");

            if (hasGlobalError || hasFieldError) {
                $(dialogDiv).html(data);
            }
            else {
                    if (!ajaxResultPartialView(data) && refreshPanelDiv) {
                    $(refreshPanelDiv).html(data);
                }
                //applyDataTables();

                // emtpy the error msg and input validation error sytles
                $(dialogDiv).find("#messages").empty();
                $(dialogDiv).find(".input-validation-error").removeClass("input-validation-error");
                $(dialogDiv).find("span.field-validation-error").remove();
                //$(dialogDiv).unblock();
                // call callback function
                if (options.callbackAfterSave) {
                    options.callbackAfterSave(dialogDiv, data);
                }

                var successMsg = buildMessage("Record has been saved.", MessageType.Success);

                if (shouldCloseDialog) {
                    var globalMsgDiv = $("body").find("#messages")[0];
                    $(globalMsgDiv).html(successMsg).show();
                    $(globalMsgDiv).fadeOut(2000, "linear", function () {
                        $(globalMsgDiv).empty();
                    });

                    $(dialogDiv).dialog("close");
                }
                else {
                    // show save success info
                    var dialogMsgDiv = $(dialogDiv).find("#messages");
                    $(dialogMsgDiv).html(successMsg).show();
                    $(dialogMsgDiv).fadeOut(2000, "linear", function () {
                        $(dialogMsgDiv).empty();
                    });
                }
            }
        }, "html");
        //}
    };

    $(dialogDiv).dialog({
        autoOpen: false,
        width: options.dialogWidth,
        modal: true,
        close: function () {
            $(this).html("");
            $(saveButtonSelector).button("enable");
            //$(dialogDiv).unblock(); // seems no use

            // once close, init again - NOTE: not work well with this
            //InitPopupDialog(dialogId, dialogWidth, createFormId, editFormId, createTitle, editTitle, refreshPanelId);
        },
        buttons: {

        },
        open: function () { if (options.hideCloseIcon) { $(".ui-dialog-titlebar-close").hide() } }
    });

    $(options.editLink).bind("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        $(dialogDiv).attr("dialogType", "edit");
        var buttons = {};
        var saveBtnText = options.saveBtnText || 'Save & Close';
        var cancelBtnText = options.cancelBtnText || 'Cancel';
        if (!options.hideButtons) {
            buttons = [
            {
                text: saveBtnText,
                click: function () {
                    save(true);
        }
            }, {
                text: cancelBtnText,
                    click: function () {
                        $(dialogDiv).dialog("close");
                    }
                }
            ];
        }

        var url = this.href;

        $(dialogDiv).html("")
            .dialog("option", "title", options.editTitle)
            .dialog("option", "buttons", buttons)
            .load(url, function (data, status) {
                // show dialog if no error
                if (status == "success" && !ajaxResultPartialView(data)) {
                    $(dialogDiv).dialog("open");
                }
            });
    });

    $(options.addLink).bind("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var saveBtnText = options.saveBtnText || 'Save & Close';
        var cancelBtnText = options.cancelBtnText || 'Cancel';
        $(dialogDiv).attr("dialogType", "create");

        var buttons = {};

        if (!options.hideButtons) {
            buttons = [
            {
                text: saveBtnText,
                click: function () {
                    save(true);
                }
            }, {
                text: cancelBtnText,
                    click: function () {
                        $(dialogDiv).dialog("close");
                    }
                }
            ];
        }

        var url = this.href;
        $(dialogDiv).html("")
            .dialog("option", "title", options.createTitle)
            .dialog("option", "buttons", buttons)
            .load(url, function (data, status) {
                // show dialog if no error
                if (status == "success" && !ajaxResultPartialView(data)) {
                    $(dialogDiv).dialog("open");
                }
            });
    });
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
// End of InitPopupDialog

// check if the returned html data is AjaxResult partial view or not
// if it is AjaxResult partial view, then it means there is error occured.
function ajaxResultPartialView(data) {
    return data.indexOf("<!-- __AjaxResult_PartialView_Error_Flag__ -->") != -1;
}

/***
* jQuery extensions
*/
//  Load options from data
$.fn.loadOptions = function (data, textProperty, valueProperty, blank) {
    if (textProperty == undefined) {
        textProperty = "Text";
    }
    if (valueProperty == undefined) {
        valueProperty = "Value";
    }
    if (blank != false) {
        blank = true;
    }
    return this.each(function () {
        if (this.tagName == 'SELECT') {
            var selectElement = this;
            if (blank) {
                $("<option></option>").val("").text("").appendTo(selectElement);
            }
            $.each(data, function (i, item) {
                $("<option></option>")
                    .val(item[valueProperty])
                    .text(item[textProperty])
                    .appendTo(selectElement);
            });
        }
    });
};

$.fn.blankText = function (text) {
    return this.each(function () {
        if (this.tagName == 'SELECT') {
            var options = $(this).find("option[value='']");
            if (options.length == 1) {
                options.remove();
            }
            $("<option></option>").val("").text(text).prependTo(this);
        }
    });
};

//auto-selected if there is only one non-blank item
$.fn.autoSelect = function (selectedValue) {
    return this.each(function () {
        if (this.tagName == 'SELECT') {
            // if specify the selected option value, then select it automatically
            if (selectedValue) {
                var selectedOptions = $(this).find("option[value='" + selectedValue + "']");
                if (selectedOptions.length == 1) {
                    selectedOptions.attr("selected", "selected");
                    $(this).change();
                    return;
                }
            }

            // if only one non-blank option, then select it automatically
            var options = $(this).find("option[value!='']");
            if (options.length == 1) {
                options.attr("selected", "selected");
                $(this).change();
                return;
            }

            // if only one blank, then we also select it and trigger change event
            options = $(this).find("option");
            if (options.length == 1) {
                options.attr("selected", "selected");
                $(this).change();
                return;
            }
        }
    });
};

$.fn.readonly = function (isTrue) {
    return this.each(function () {
        if (isTrue) {
            if ($(this).hasClass("required")) {
                $(this).removeClass("required");
                $(this).siblings('.field-validation-error').addClass('field-validation-valid').removeClass('field-validation-error');
                $(this).removeClass('input-validation-error');
                //$(this).next("span.required-indicator").remove();

            }
            if ($(this).hasClass("disabled")) {
                $(this).removeClass("disabled");
                $(this).removeAttr("disabled");
            }
            if (!$(this).hasClass("readonly")) {
                $(this).addClass("readonly");
                $(this).attr("readonly", "true");
            }
        }
        else {
            if ($(this).hasClass("readonly")) {
                $(this).removeClass("readonly");
                $(this).removeAttr("readonly");
            }
        }
    });
};
$.fn.disabled = function (isTrue) {
    return this.each(function () {
        if (isTrue) {
            if ($(this).hasClass("required")) {
                $(this).removeClass("required");
                //$(this).next("span.required-indicator").remove();

            }
            //            if ($(this).hasClass("readonly")) {
            //                $(this).removeClass("readonly");
            //                $(this).removeAttr("readonly");
            //            }
            if (!$(this).hasClass("disabled")) {
                $(this).addClass("disabled");
                $(this).attr("disabled", "true");
            }
        }
        else {
            if ($(this).hasClass("disabled")) {
                $(this).removeClass("disabled");
                $(this).removeAttr("disabled");
            }
        }
    });
};
$.fn.required = function (isTrue) {
    return this.each(function () {
        if (isTrue) {
            if ($(this).hasClass("readonly")) {
                $(this).removeClass("readonly");
                $(this).removeAttr("readonly");
            }
            if ($(this).hasClass("disabled")) {
                $(this).removeClass("disabled");
                $(this).removeAttr("disabled");
            }
            if (!$(this).hasClass("required")) {
                $(this).addClass("required");
                //if ($(this).next("span.required-indicator").size() == 0) {
                //   $(this).after('<span class="required-indicator">*</span>');
                //}
            }
        }
        else {
            if ($(this).hasClass("required")) {
                $(this).removeClass("required");
                //$(this).next("span.required-indicator").remove();
            }
        }
    });
};

$.fn.completeRequired = function () {
    return this.each(function () {
        if (!$(this).hasClass("complete-required")) {
            if ($(this).children('.complete-required-indicator').length == 1) {
                $(this).children('span.complete-required-indicator').remove();
                $(this).children('span.complete-required-title').remove();
            }
        }
        else {
            if ($(this).children('.complete-required-indicator').length == 0) {
                $(this).append('<span class="ui-hide complete-required-title">This field is required to save.</span><span class="complete-required-indicator" title="This field is required to save." aria-hidden="true" role="presentation">*</span>');
            }
        }
    });     
};

//$.fn.selectionRequired = function () {
//    return this.each(function () {
//        if (!$(this).hasClass("selection-required")) {
//            $(this).addClass("selection-required");
//        }
//        if ($(this).children('.complete-required-indicator').length == 0) {
//            $(this).append('<span class="offset complete-required-title">At least one selection is required to save.</span><span class="complete-required-indicator" title="At least one selection is required to save.">*</span>');
//        }
//    });
//};

$.fn.selectionRequired = function () {
    return this.each(function () {
        if (!$(this).hasClass("selection-required")) {
            if ($(this).children('.complete-required-indicator').length == 1) {
                $(this).children('span.complete-required-indicator').remove();
                $(this).children('span.complete-required-title').remove();
            }
        }
        else {
            if ($(this).children('[class*="-indicator"]').length == 0) {
                $(this).append('<span class="ui-hide complete-required-title">At least one selection is required to save.</span><span class="complete-required-indicator" title="At least one selection is required to save." aria-hidden="true" role="presentation">*</span>');
            }
        }
    });
};

$.fn.completeToSubmitRequired = function () {
    return this.each(function () {
        if (!$(this).hasClass("complete-required")) {
            if ($(this).children('.submit-required-indicator').length == 1) {
                $(this).children('span.submit-required-indicator').remove();
                $(this).children('span.submit-required-title').remove();
            }
        }
        else {
            if ($(this).children('.submit-required-indicator').length == 0) {
                $(this).append('<span class="ui-hide submit-required-title">This field is required to submit.</span><span class="submit-required-indicator" title="This field is required to submit." aria-hidden="true" role="presentation">**</span>');
            }
        }
    });
};

$.fn.submitRequired = function () {
    return this.each(function () {
        if (!$(this).hasClass("submit-required")) {
            if ($(this).children('.submit-required-indicator').length == 1) {
                $(this).children('span.submit-required-indicator').remove();
                $(this).children('span.submit-required-title').remove();
            }
        }
        else {
            if ($(this).children('.submit-required-indicator').length == 0) {
                $(this).append('<span class="ui-hide submit-required-title">This field is required to submit.</span><span class="submit-required-indicator" title="This field is required to submit." aria-hidden="true" role="presentation">**</span>');
            }
        }
    });
};

//$.fn.sectionSubmitRequired = function () {
//    return this.each(function () {
//        if (!$(this).hasClass("section-submit-required")) {
//            $(this).addClass("section-submit-required");
//        }
//        if ($(this).hasClass('section-submit-required')) {
//            $(this).append('<span class="ui-hide submit-required-title">Completion of this section is required to submit.</span><span class="section-submit-required-indicator" title="Completion of this section is required to submit.">**</span>');
//        }
//    });
//};

$.fn.sectionSubmitRequired = function () {
    return this.each(function () {
        if (!$(this).hasClass("section-submit-required")) {
            if ($(this).children('.section-submit-required-indicator').length == 1) {
                $(this).children('span.section-submit-required-indicator').remove();
                $(this).children('span.section-submit-required-title').remove();
            }
        }
        else {
            if ($(this).children('.section-submit-required-indicator').length == 0) {
                $(this).append('<span class="ui-hide section-submit-required-title">Completion of this section is required to submit.</span><span class="section-submit-required-indicator" title="Completion of this section is required to submit." aria-hidden="true" role="presentation">**</span>');
            }
        }
    });
};

$.fn.selectionSubmitRequired = function () {
    return this.each(function () {
        if (!$(this).hasClass("selection-submit-required") && !$(this).hasClass('selection-required')) {
            $(this).removeClass('submit-required');
            if ($(this).children('.submit-required-indicator').length == 1) {
                $(this).children('span.submit-required-indicator').remove();
                $(this).children('span.submit-required-title').remove();
            }
        }
        else if ($(this).children('.submit-required-indicator').length == 0) {
            $(this).addClass('submit-required');
            $(this).append('<span class="ui-hide submit-required-title">At least one selection is required to submit.</span><span class="submit-required-indicator" title="At least one selection is required to submit." aria-hidden="true" role="presentation">**</span>');
        }
    });
};

//$.fn.selectionSubmitRequired = function () {
//    return this.each(function () {
//        if (!$(this).hasClass("submit-required, selection-submit-required")) {
//            if ($(this).children('.submit-required-indicator').length == 1) {
//                $(this).children('span.submit-required-indicator').remove();
//                $(this).children('span.submit-required-title').remove();
//            }
//        }
//        else {
//            if ($(this).children('.submit-required-indicator').length == 0) {
//                $(this).append('<span class="ui-hide submit-required-title">At least one selection is required to submit.</span><span class="submit-required-indicator" title="At least one selection is required to submit." aria-hidden="true" role="presentation">**</span>');
//            }
//        }
//    });
//};

//$.fn.filterRequired = function () {
//    return this.each(function () {
//        if (!$(this).hasClass("filter-required")) {
//            $(this).addClass("filter-required");
//        }
//        if ($(this).children('.filter-required-indicator').length == 0) {
//            $(this).append('<span class="filter-required-indicator" title="Selection required to apply filter.">*</span>');
//        }
//    });
//};

$.fn.filterRequired = function () {
    return this.each(function () {
        if (!$(this).hasClass("filter-required")) {
            if ($(this).children('.filter-required-indicator').length == 1) {
                $(this).children('span.filter-required-indicator').remove();
                $(this).children('span.filter-required-title').remove();
            }
        }
        else {
            if ($(this).children('.filter-required-indicator').length == 0) {
                $(this).append('<span class="ui-hide filter-required-title">Selection required to apply filter.</span><span class="filter-required-indicator" title="Selection required to apply filter." aria-hidden="true" role="presentation">*</span>');
            }
        }
    });
};

// For ARIA (Accessibility) only. This functions seeks radiobutton groups and adds additional context to it's fieldset legend from it's parent Fieldset Legend.//
$.fn.radioGroupByLegend = function () {
    return this.each(function () {
        var parentLegend = $(this).parents('fieldset').first().children('legend').text();
        $(this).children('legend').prepend('<span class="ui-hide">' + parentLegend + '</span>');
    });
};

$.fn.ltssIconContainerRight = function () {
    return this.each(function () {
        if (!$(this).hasClass("ltss-icon-right")) {
            $(this).addClass("ltss-icon-right");
        }
        $(this).append('<span class="ltss-icon-container icon-right"></span>');
    });
};
$.fn.ltssIconContainerLeft = function () {
    return this.each(function () {
        if (!$(this).hasClass("ltss-icon-left")) {
            $(this).addClass("ltss-icon-left");
        }
        $(this).prepend('<span class="ltss-icon-container icon-left"></span>');
    });
};
$.fn.ltssIconContainerArrow = function () {
    return this.each(function () {
        if (!$(this).hasClass("ltss-icon-arrow")) {
            $(this).addClass("ltss-icon-arrow");
        }
        $(this).append('<span role="presentation" class="ltss-icon-container icon-arrow"></span>');
    });
};

function requiredToSaveAndSubmitByParent(parent) {
    //apply style for selectionRequired elements
    parent.find(".complete-required").completeRequired();
    parent.find(".submit-required").submitRequired();
    parent.find(".selection-required").selectionRequired();
    parent.find(".filter-required").selectionRequired();
}

//End of jQuery extensions

//This function will re-size an input text field depending on the amount of characters in the field.

function dynamicTextboxWidth(textBox) {
        var charCount = textBox.val().length;
        if (charCount < 26) {
            textBox.removeClass('textbox-medium');
            textBox.removeClass('textbox-large');
        }
        else if (charCount >= 26 && charCount < 44) {
            textBox.removeClass('textbox-medium');
            textBox.removeClass('textbox-large');
            textBox.addClass('textbox-medium');
        }
        else if (charCount >= 44) {
            textBox.removeClass('textbox-medium');
            textBox.removeClass('textbox-large');
            textBox.addClass('textbox-large');
        }
}

//This function will re-size a select input depending on the amount of characters in the field.
function dynamicSelectWidth(select) {
    var charCount = select.find('option:selected').text().length;
    if (charCount < 26) {
        select.removeClass('selector-medium');
        select.removeClass('selector-large');
    }
    else if (charCount >= 26 && charCount < 44) {
        select.removeClass('selector-medium');
        select.removeClass('selector-large');
        select.addClass('selector-medium');
    }
    else if (charCount >= 44) {
        select.removeClass('selector-medium');
        select.removeClass('selector-large');
        select.addClass('selector-large');
    }
}

function deleteConfirm(url, msg) {
    if (!msg) {
        msg = "Do you want to delete?";
    }
    var answer = confirm(msg);
    if (answer) {
        $.post(url, function (data) {
            if (data.Url) {
                window.location.href = data.Url;
            }
            else {
                window.location.reload();
            }
        });
    }
    // always return false because we use ajax post to delete
    return false;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function initDotDotDot(selector, maxHeight) {
    var startingHeight = 100;

    if (maxHeight) {
        startingHeight = maxHeight;
    }

    $(selector).css('max-height', startingHeight + 'px');

    $(selector).dotdotdot(
		{
		    callback: function (isTruncated, orgContent) {
		        if (isTruncated) {
		            var me = $(this);
		            me.wrap("<div style='position:relative; padding-bottom:10px; padding-right:15px'/>");
		            me.after('<div class="plusMinus plus"></div>');
		            var plusMinus = $(this).siblings('.plusMinus');
		            plusMinus.toggle(function () {
		                plusMinus.removeClass('plus').addClass('minus');
		                $('.minus').attr({ title: 'Collapse text area', tabindex: '0' });
		                me.parent().css('max-height', 'auto');
		                me.css('max-height', 'none');
		                me.trigger('destroy');
		            }, function () {
		                plusMinus.removeClass('minus').addClass('plus');
		                $('.plus').attr({ title: 'Expand text area', tabindex: '0' });
		                me.parent().css('height', 'auto');
		                me.css('max-height', startingHeight + 'px');
		                me.dotdotdot();
		            });
		        }
		        //console.log($(this));
		    }
		}
	);
}

function getLocalStorageObject(name) {
    if (localStorage[name]) {
        return JSON.parse(localStorage[name]);
    }
    else {
        return undefined;
    }
}

function setLocalStorageObject(name, obj) {
    if (JSON.stringify(obj)) {
    localStorage[name] = JSON.stringify(obj);
}
}

function getSessionStorageObject(name) {
    if (sessionStorage[name]) {
        return JSON.parse(sessionStorage[name]);
    }
    
    return undefined;
}

function setSessionStorageObject(name, obj) {
    sessionStorage[name] = JSON.stringify(obj);
}

$(document).ready(function () {
    if (sessionStorage["hasFormError"]) {
        hasSubmitErrors(true)
        sessionStorage.removeItem("hasFormError");
    }
});

function hasSubmitErrors(showHighlight, showErrorMsg) {

    function textChanged() {
        var errorBox = $(this).closest('div.row, fieldset');
        if ($(this).text() != "") {
            errorBox.removeClass('errorBox');
            if (showErrorMsg && $(this).parents('form').first(':has(.errorBox)').length > 0) {
                closeMessage();
            }
        }
        else {
            errorBox.addClass('errorBox');
            if (showErrorMsg) {
                showErrorMessage("There are missing fields that prevent submission.");
            }

        }
    }

    function valChanged() {
        var errorBox = $(this).closest('div.row, fieldset');
        if ($(this).val() != "") {
            errorBox.removeClass('errorBox');
            if (showErrorMsg && $(this).parents('form').first(':has(.errorBox)').length > 0) {
                closeMessage();
            }
        }
        else {
            errorBox.addClass('errorBox');
            if (showErrorMsg) {
                showErrorMessage("There are missing fields that prevent submission.");
            }

        }
    }

    function checkedChanged() {
        var errorBox = $(this).closest('div.row');
        if ($(this).is(':checked')) {
            errorBox.removeClass('errorBox');
            if (showErrorMsg && $(this).parents('form').first(':has(.errorBox)').length > 0) {
                closeMessage();
            }
        }
    }

    var hasError = false;
    var errLabels = new Array();

    //iform = radio list
    $('form .submit-required').each(function (idx, el) {
        var isError = false;

        if ($(el).attr('for')) {
            var valueEl = $('#' + $(el).attr('for'));
            if (valueEl.is('select')) {
                if (valueEl.val() == "") {
                    isError = hasError = true;
                }
                valueEl.on("change", valChanged);
            }

            if (valueEl.is('input:text')) {
                if (valueEl.text() == "") {
                    isError = hasError = true;
                }
                valueEl.on("keydown", textChanged);
            }
        }
        else if ($(el).parents('div.row').first().has('.iform-fieldset')) {
            if ($(el).parents('div.row').first().find('.iform-fieldset').find(':checked').length == 0) {
                hasError = isError = true;

                $(el).parents('div.row').first().find('.iform-fieldset').find('input[type=radio]').on('change', checkedChanged);
            }
        }

        if (isError) {
            if (showHighlight) {
                $(this).closest('.iform-fieldset').addClass('errorBox');
            }

            if (showErrorMsg) {
                showErrorMessage("There are missing fields that prevent submission.");
            }
        }
    });

    if (hasError) {
        sessionStorage["hasFormError"] = "true";
    }
    return hasError;
}

var wrongPassword = true;

function setupAssessmentPasswordDialog(callback) {

    if (localStorage[localstoragekeys.interRaiAssessment]) {
        $("#dialog-password").attr('title', 'Enter existing password');
    }
    else {
        $("#dialog-password").attr('title', 'Enter new password');
    }

    $("#dialog-password").dialog({
        autoOpen: false,
        height: 300,
        width: 300,
        modal: true,
        close: function () {
            if (typeof isOffline != "undefined" && isOffline) {
                if (wrongPassword) {
                    if (localStorage[localstoragekeys.interRaiAssessment]) {
                        window.location.href = timeoutUrl;
                    }
                }
            }
        },
        buttons: {
            "Ok": function () {
                if (localStorage[localstoragekeys.interRaiAssessment]) {
                    var superPassword;
                    var stdAssessmentsJson = localStorage.getItem(localstoragekeys.interRaiAssessment);
                    var stdAssessments = JSON.parse(stdAssessmentsJson);

                    var password = $("#password").val();
                    $("#password").val('');
                    if (password) {
                        for (key in stdAssessments) {
                            var hashObj = new jsSHA(password, "ASCII");
                            superPassword = hashObj.getHash("SHA-512", "HEX")
                            try {
                                JSON.parse($.jCryption.decrypt(stdAssessments[key], superPassword));
                                sessionStorage["password"] = superPassword

                                //update the password date
                                sessionStorage["pwUpdDt"] = JSON.stringify(new Date().getTime());
                                wrongPassword = false;
                                $("#dialog-password").dialog("close");

                                //pwDialogCallback(superPassword);
                                callback(superPassword);
                            }
                            catch (err) {
                                // display message in dialog window of invalid password, have them try again
                                wrongPassword = true;
                                alert("Please enter the valid password!")
                            }
                            break;
                        }
                    }
                    else {
                        wrongPassword = true;
                        if (confirm('Are you sure you want to cancel the password entry form?')) {
                            $("#dialog-password").dialog("close");
                        }

                        // Display error message of invalid password, have them try again
                    }

                }
                else {
                    var password = $("#password").val();
                    $("#password").val('');
                    if (password) {
                        hashObj = new jsSHA(password, "ASCII");
                        superPassword = hashObj.getHash("SHA-512", "HEX");
                        sessionStorage["password"] = superPassword;
                        sessionStorage["pwUpdDt"] = JSON.stringify(new Date().getTime());
                        wrongPassword = false;
                        $("#dialog-password").dialog("close");
                        callback(superPassword);
                    }
                    else {
                        if (confirm('Are you sure you want to cancel the password entry form?')) {
                            wrongPassword = true;
                            $("#dialog-password").dialog("close");
                            window.location.href = timeoutUrl;
                        }

                    }

                }
            },
            "Cancel": function () {
                $("#password").val('');

                if (confirm('Are you sure you want to cancel the password entry form?')) {
                    wrongPassword = true;
                    $("#dialog-password").dialog("close");
                }
            }
        }

    })
}

function validatePassword(callback) {

    if (sessionStorage["password"]) {
        superPassword = sessionStorage["password"];
        callback(superPassword);
    }
    else {
        setupAssessmentPasswordDialog(callback);
        $("#dialog-password").dialog("open");
    }

}

function isAtLeastOneOfflineAssessment(stdAssessments) {
    for (var key in stdAssessments) {
        if (stdAssessments[key].Assessment == undefined || stdAssessments[key].Assessment && stdAssessments[key].Assessment.OfflineStaffId) {
            return true;
        }
    }

    return false;
}

function decryptAssessmentObj(stdAssessments, aferDecryptedCallback) {
    var decryptAssessment;
    //var lsAssessmentsObj = JSON.parse(localStorage[localStorageKey]);
    //if (localStorage[localstoragekeys.interRaiAssessment]) {
    validatePassword(function (validatedPassword) {
        if (validatedPassword) {
            var lsAssessmentsObj = {};
            for (var key in stdAssessments) {
                if (stdAssessments[key].Assessment == undefined || stdAssessments[key].Assessment && stdAssessments[key].Assessment.OfflineStaffId) {
                    //var decryptContent = $.jCryption.decrypt(stdAssessments[key], superPassword);
                    decryptAssessment = $.jCryption.decrypt(stdAssessments[key], validatedPassword);
                    var assessmentObj = JSON.parse(decryptAssessment);
                    lsAssessmentsObj[assessmentObj.Assessment.Id] = {};
                    lsAssessmentsObj[assessmentObj.Assessment.Id] = JSON.stringify(assessmentObj);
                }
            }
            aferDecryptedCallback(lsAssessmentsObj);
        }
        else {
            window.location.href = timeoutUrl;

        }
    });
    //}
}
//referrance url http://wangli1314666.blog.163.com/blog/static/23331789201092321619860/
function number_format(number, decimals, dec_point, thousands_sep) {
    var n = !isFinite(+number) ? 0 : +number,
         prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
         sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
         dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
         s = '',
         toFixedFix = function (n, prec) {
             var k = Math.pow(10, prec);
             return '' + Math.round(n * k) / k;
         };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;   
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

var dataTableRedrawTimeout;

function onWindowResizeRedrawTable() {
    $('.dataTables_scrollHeadInner').each(function (idx, el) {
        $(el).width($(el).parent().width() - 17);
    });

    clearTimeout(dataTableRedrawTimeout);

    dataTableRedrawTimeout = setTimeout(function () {

        $.each($('table'), function (idx, el) {
            if ($(el).data() && $(el).data().dataTableInstance) {
                if ($(el).find('.dataTables_scrollHeadInner').length > 0) {
                    //$(el).data().dataTableInstance.fnAdjustColumnSizing(false);

                    //$('#' + oSettings.sInstance).find('thead').remove();
                    $('#' + oSettings.sInstance).find('colgroup').empty();

                    $('#' + oSettings.sInstance + '_wrapper .dataTables_scrollHeadInner table th').each(function () {
                        $('#' + oSettings.sInstance).find('colgroup').append('<col style="width:' + $(this).outerWidth() + 'px">');
                    });
                }
            }
        });
    }, 100);
}

function clearFormErrors(element) {
    $(element).find('span.field-validation-error').find('label').remove();
    $(element).find('span.field-validation-error').removeClass('field-validation-error')
        .addClass('field-validation-valid').removeAttr('role');
    
    $(element).find('.input-validation-error').removeClass('input-validation-error').removeAttr('aria-invalid').removeAttr('aria-required');

    $(element).find('span.error').remove();
}

    $(document).ready(function () {
        $('.tableRowEdit').prepend('<span class="offset-hidden">Editing</span>')
    });

function resizeFixedWorkarea() {
    if ($('.js-workarea-panel').length == 1) {
        if ($('.fieldset-container-searcharea').length == 1) {
        $('.LeftNav-Fixed-Workarea').css('top', $('.js-workarea-panel').height());
        } 
        else {
        $('.LeftNav-Fixed-Workarea').css('top', $('.js-workarea-panel').height() + 10);
        } 
    }
    if ($('.workspacenav-container').length == 1) {
        $('.fullworkspace-content-container').css('top', $('.workspacenav-container').height());
    }

    if ($('.search-doubleRow-popup').length > 0) {
        $('.search-doubleRow-popup').each(function() {
            var newHeight = $(this).siblings('.js-workarea-panel').height() + 20;
            $(this).find('.dataTable-summarylist-style').css('margin-top', newHeight);
        });
    }
}
function resizeTableHeaderBody() {
    if ($('.dataTables_scroll').length > 0) {
        $('.dataTables_scroll').each(function () {
            $(this).find('.dataTables_scrollBody').first().css('top', $(this).find('.dataTables_scrollHead').first().height());
        });
    }
}

function repoAlertTitle() {
    $(".alertTitle").each(function () {
        var newTop = $(this).height() / 2;
        $(this).css("margin-top", "-" + newTop + "px");
    });
}

function jsonEscape(jsonStr) {
    return jsonStr.replace(/\n/g, "\\n");
}

function repoAlertTitle() {
    $(".alertTitle").each(function () {
        var newTop = $(this).height() / 2;
        $(this).css("margin-top", "-" + newTop + "px");
    });
}

function jsonEscape(jsonStr) {
    return jsonStr.replace(/\n/g, "\\n");
}

function positionAnchorMenu() {
    if ($('.anchor-groupcontainer').length >= 1) {
        var offsetTop = $('.workspace-content-container').offset().top;
        var offsetLeft = $('.workspace-content-container').offset().left;

        $('.anchor-groupcontainer').css({
            'top': offsetTop,
            'left': offsetLeft
        });
    }
}

var isFullscreen = false
function setFullscreenButton(select) {

    var offsetTopOrigin = 67;
    var offsetLeftOrigin = 0;

    $(select).toggle(
        function () {
            isFullscreen = true;
            $('#workspace .workspace').addClass('isFullscreen');
            $(this).html('<span class="icon-resize-small"></span>');
            $(this).attr('title', 'Exit Fullscreen mode.');
            $("#mainHeader-MenuBar").css("z-index", "0");
            $("#ltss-mainmenu").css("z-index", "0");
            $("#workspace .workspace").animate({ left: "0", top: "-79" }, 500, "easeOutCirc");
            $('.anchor-groupcontainer').animate({
                'top': offsetTopOrigin,
                'left': offsetLeftOrigin
            }, 500, "easeOutCirc");

            offsetTopOrigin = $('.workspace-content-container').offset().top;
            offsetLeftOrigin = $('.workspace-content-container').offset().left;
        }
        ,
        function () {
            isFullscreen = false;
            if (parseInt($('.genericform-style').css('margin-right')) + 10 >= $('.anchor-groupcontainer').width()) {
                $('#workspace .workspace').removeClass('isFullscreen');
            }
            $(this).html('<span class="icon-resize-full"></span>');
            $(this).attr('title', 'Enter Fullscreen mode.');
            $("#workspace .workspace").animate({ left: "301", top: "0" }, 500, "easeOutCirc");


            $('.anchor-groupcontainer').animate({
                'top': offsetTopOrigin,
                'left': offsetLeftOrigin
            }, 500, "easeOutCirc");

            setTimeout(function() {
                $("#mainHeader-MenuBar").css("z-index", "9999");
                $("#ltss-mainmenu").css("z-index", "99");
            }, 500);

            offsetTopOrigin = $('.workspace-content-container').offset().top;
            offsetLeftOrigin = $('.workspace-content-container').offset().left;
        }
    );
};


function setupAnchorMenu(parentContainer, section) {
    if ($('.anchor-groupcontainer').length >= 1) {
        var sections = {};
        var subSections = {};
        $(function () {

            var _height = $(parentContainer).height();
            // Grab positions of our sections
            calculateSections();

            function snapToAnchorMenu() {
                var marginRight = (($('#workspace .workspace').width() - $('.genericform-style').width()) / 2) - 10;

                if ($(window).width() >= 1201 && marginRight < $('.anchor-groupcontainer').outerWidth() + 10) {
                    $('#workspace .workspace').addClass('isFullscreen');
                } else if (!$('#workspace .workspace').hasClass('isFullscreen') && isFullscreen == true) {
                    $('#workspace .workspace').addClass('isFullscreen');
                } else if (marginRight >= $('.anchor-groupcontainer').width() && isFullscreen == true) {
                    $('#workspace .workspace').removeClass('isFullscreen');
                } else if ($(window).width() < 1201 && $(window).width() >= 950 && isFullscreen == false) {
                    $('#workspace .workspace').removeClass('isFullscreen');
                }
                else if ($(window).width() < 950 && isFullscreen == false) {
                    $('#workspace .workspace').addClass('isFullscreen');
                }
            }

            snapToAnchorMenu();

            function activateAnchor() {
                calculateSections();
                // Look in the sections object and see if any section is viewable on the screen.
                // If two are viewable, the lower one will be the active one.
                $('.anchor-groupcontainer a').removeClass('active');
                $('.anchor-groupcontainer .leftnav-sublink li, .anchor-groupcontainer .leftnav-sublink li.active').removeClass('active first-active last-active');
                for (sectionNumber in subSections) {
                    if (subSections[sectionNumber] > 0 && subSections[sectionNumber] < _height && $('#' + sectionNumber).parents(".body").first().prev('.header').hasClass("expanded")) {

                        $('.anchor-groupcontainer .leftnav-sublink li[name=' + sectionNumber + ']').addClass('active');
                    }
                }
                for (sectionNumber in sections) {

                    if (sections[sectionNumber].bottom > 0 && !(sections[sectionNumber].bottom > _height && sections[sectionNumber].top > _height) && $('#' + sectionNumber).find('.header').first().hasClass("expanded")) {

                        $('.anchor-groupcontainer li a[name=' + sectionNumber + ']').not('.leftnav-sublink li a').addClass('active');
                    }
                }
                for (sectionNumber in sections) {

                    if (sections[sectionNumber].bottom > 0 && !(sections[sectionNumber].bottom > _height && sections[sectionNumber].top > _height) && $('#' + sectionNumber).find('.header').first().hasClass("expanded")) {

                        $('.anchor-groupcontainer .leftnav-sublink li[name=' + sectionNumber + ']').addClass('active');
                    }
                }
                $('.anchor-groupcontainer .leftnav-sublink').find('li.active').first().addClass('first-active');
                $('.anchor-groupcontainer .leftnav-sublink').find('li.active').last().addClass('last-active');
                $('.anchor-groupcontainer .leftnav-sublink li').each(function () {
                    if ($(this).prevAll('.first-active').length > 0 && $(this).nextAll('.last-active').length > 0) {
                        $(this).addClass('active');
            }
                });
            }

            $(parentContainer).scroll(function () {
                activateAnchor();
            });

            var resizeTimeout;
            $(window).resize(function () {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function () {
                    activateAnchor();
                    snapToAnchorMenu();
                }, 50);
            });

            $('#expandCollapseAll').on('click', function () {
                setTimeout(function () {
                    activateAnchor();
                }, 5);
            });
            $('#fullscreen-button').on('click', function () {
                setTimeout(function () {
                    activateAnchor();
                    snapToAnchorMenu();
                }, 501);
            });
            $('.panelBarItem').click(function () {
                setTimeout(function () {
                    activateAnchor();
                }, 50);
            });
            $('.anchor-groupcontainer li').click(function () {
                setTimeout(function () {
                    activateAnchor();
                }, 50);
            });
        });

        function calculateSections() {
            $(section).each(function () {
                sections[$(this).attr('id')] = {
                    top: $(this).position().top + 50,
                    bottom: $(this).position().top + ($(this).height() - 50)
                };
                subSections[$(this).attr('id')] = $(this).position().top + $(this).height() / 4;
            });
        }

        (function () {
            $(section).each(function() {
                var sectionName = $(this).attr('id');
                $('.anchor-groupcontainer li a[name=' + sectionName + ']').click(function() {
                    ltssPanelBar.expand("#" + sectionName);
                    location.hash = "#" + sectionName;
                    $("#" + sectionName).find(".iform-fieldset").first().focus();
                    $("#" + sectionName)[0].scrollIntoView();
                    return false;
                });
                $('.anchor-groupcontainer .leftnav-sublink a[name=' + sectionName + ']').click(function() {
                    var panelBarName = $("#" + sectionName).parents(".panel").first().attr("id");
                    ltssPanelBar.expand("#" + panelBarName);
                    location.hash = "#" + panelBarName;
                    $("#" + sectionName).find(".iform-fieldset").first().focus();
                    $("#" + sectionName)[0].scrollIntoView();
                    return false;
                });
            });
        })();
    }
}

function backupAssessment(assessmentId, mode, key) {
    var assessmentsObj = getLocalStorageObject(key);
    
    if (key = localstoragekeys.interRaiAssessment) {
        key = localstoragekeys.backupStdAssessments;
    } else if (key = localstoragekeys.nurseMonitoring) {
        key = localstoragekeys.backupNurseMonitoring;
    } else {
        showErrorMessage("backup localstorage key error. Please contact developer.");
    }
    
    var backedUpAssessment = assessmentsObj[assessmentId];

    var backupStdAssessments;

    function isBackupExists(assessId) {
        var foundIdx = -1;
        $.each(backupStdAssessments, function (idx, el) {
            if (el.Assessment.Id == assessId && el.backupMode == "Save") {
                foundIdx = idx;
            }
        });

        return foundIdx;
    }

    if (localStorage[key]) {
        backupStdAssessments = getLocalStorageObject(key);
    }
    else {
        backupStdAssessments = [];
    }

    backedUpAssessment.uploadDate = new Date();

    if (mode == "upload") {
        backedUpAssessment.backupMode = "Upload";
        backupStdAssessments.push(backedUpAssessment);
    }
    else {
        backedUpAssessment.backupMode = "Save";
        
        var idx = isBackupExists(assessmentId);

        if (idx > -1) {
            backupStdAssessments.splice(idx, 1, backedUpAssessment);
        }
        else {
            backupStdAssessments.push(backedUpAssessment);
        }
    }

    setLocalStorageObject(key, backupStdAssessments);
}

function highlightTd(selector) {
    $(selector).find('a:contains("Edit")').on('click', function () {
        $(this).parents('tr').first().addClass("tableRowHighlight");
    });
}
function removeHighlightTd() {
    $('.tableRowHighlight').removeClass('tableRowHighlight');
}

function assessmentRefreshOffline(refreshOfflineUrl, offlineAssessmentListUrl) { // get called through callRefreshOffline
    $.getJSON(refreshOfflineUrl,
        function (result) {
            var assessmentJson = result.data;
            var assessmentObjs = JSON.parse(assessmentJson);
            var serverAssessmentObjs = assessmentObjs

            var lsAssessmentsObj;
            lsAssessmentsObjNew = {};
            if (localStorage[localstoragekeys.interRaiAssessment]) {
                lsAssessmentsObj = JSON.parse(localStorage[localstoragekeys.interRaiAssessment]);
            }
            else {
                lsAssessmentsObj = {};
            }

            function ServerContains(assessmentId) {
                for (var i = 0; i < serverAssessmentObjs.length; i++) {
                    if (assessmentId == serverAssessmentObjs[i].Assessment.Id) {
                        return true;
                    }
                }
                return false;
            }

            //clear orphaned assessment
            for (prop in lsAssessmentsObj) {
                if (lsAssessmentsObj.hasOwnProperty(prop)) {
                    if (!ServerContains(prop)) {
                        delete lsAssessmentsObj[prop];
                    }
                }
            }

            if (assessmentObjs.length > 0) {
                for (var index = 0; index < assessmentObjs.length; index++) {
                    var assessmentObj = assessmentObjs[index];
                    if (lsAssessmentsObj[assessmentObj.Assessment.Id]) {
                        lsAssessmentsObjNew[assessmentObj.Assessment.Id] = lsAssessmentsObj[assessmentObj.Assessment.Id];
                        continue;
                    }
                    else {
                        fixDates(assessmentObj);
                        lsAssessmentsObjNew[assessmentObj.Assessment.Id] = assessmentObj;
                    }
                }
                localStorage.removeItem(localstoragekeys.interRaiAssessment);
                localStorage[localstoragekeys.interRaiAssessment] = JSON.stringify(lsAssessmentsObjNew);
                showSuccessMessage("Offline assessments refreshed.");
                window.location = offlineAssessmentListUrl;
            }
            else {
                showErrorMessage("You do not have any prepared offline assessments.");
            }
        });

  
}

function nurseMonitoringRefreshOffline(refreshOfflineUrl, downloadLink, redirectUrl) { // get called through callRefreshOffline
    $.ajax({
        url: refreshOfflineUrl,
        type: "POST",
        async: false,
        success: function (data) {
            if (data.OfflineNurseMonitoringList.length > 0) {
                for (idx in data.OfflineNurseMonitoringList) {
                    var lsProcesses;
                    var serverProcessList = data.OfflineNurseMonitoringList;

                    if (localStorage[localstoragekeys.nurseMonitoring]) {
                        lsProcesses = getLocalStorageObject(localstoragekeys.nurseMonitoring);
                    } else {
                        lsProcesses = {};
                    }

                    function ServerContains(processId) {
                        for (idx in serverProcessList) {
                            if (processId == serverProcessList[idx].ProcessId) {
                                serverProcessList.splice(idx, 1); // if localstorage have the process remove from list, all left in list will be downloaded.
                                return true;
                            }
                        }
                        return false;
                    }

                    for (prop in lsProcesses) {
                        if (lsProcesses.hasOwnProperty(prop)) {
                            if (!ServerContains(prop)) {
                                delete lsProcesses[prop];
                            }
                        }
                    }
                    setLocalStorageObject(localstoragekeys.nurseMonitoring, lsProcesses);
                    for (idx in serverProcessList) {
                        downloadNurseMonitoringProcess(serverProcessList[idx].ProcessId, serverProcessList[idx].ClientId, downloadLink);
                    }
                }
                pushMessageToSessionStorage("Offline assessments refreshed.");
                if (redirectUrl) {
                    window.location = redirectUrl;
                }
            } else {
                showErrorMessage("You do not have any prepared offline assessments.");
            }
        }
    });
}

function downloadNurseMonitoringProcess(processId, clientId, downloadLink) {
    //var browserType = getBrowserType();
    //var platform = getPlatform();
    //var time = new Date();
    var requestData = {
        clientId: clientId,
        id: processId,
        //offlineTracking: {
        //    AssessmentId: assessmentId,
        //    ClientId: clientId,
        //    ActionTime: time,
        //    BrowserType: browserType,
        //    BrowserVersion: $.browser.version,
        //    Platform: platform,
        //    AssessmentCount: getNurseMonitoringCount(),
        //    ActionName: "download"
        //}
    };
    $.ajax({
        url: downloadLink,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        data: JSON.stringify(requestData),
        success: function (result) {
            if (result.Message) {
                showErrorMessage(result.Message);
            }
            else if (result.ErrorMessage) {
                pushMessageToSessionStorage(result.ErrorMessage, "error");
            }
            else {
                var processJson = result.data;
                var processObj = JSON.parse(processJson);

                // save assessment
                var viewModel = {
                    Assessment: processObj.Assessment,
                    ClientInfo: processObj.ClientInfo,
                    StaffInfo: processObj.StaffInfo,
                    ProcessInfo: processObj.MarylandNurseMonitoringProcess
                };
                viewModel.ProcessInfo.ApprovedPersonalAssistanceProviders = processObj.ApprovedPersonalAssistanceProviders;
                viewModel.Assessment.Contacts = processObj.Contacts;
                fixDates(viewModel);
                var lsProcessObj;
                if (localStorage[localstoragekeys.nurseMonitoring]) {
                    lsProcessObj = getLocalStorageObject(localstoragekeys.nurseMonitoring);
                } else {
                    lsProcessObj = {};
                    lsProcessObj[viewModel.ProcessInfo.Id] = {};
                }
                lsProcessObj[viewModel.ProcessInfo.Id] = viewModel;
                setLocalStorageObject(localstoragekeys.nurseMonitoring, lsProcessObj);

                // save staffInfo
                var lsStaffInfo = getLocalStorageObject(localstoragekeys.staffInfo);
                if (typeof (lsStaffInfo) == "undefined") { // no staff defined.
                    lsStaffInfo = {};
                }
                if (typeof (lsStaffInfo[viewModel.StaffInfo.StaffId]) == "undefined") { // current staff not in localstorage
                    lsStaffInfo.StaffId = viewModel.StaffInfo.StaffId;
                    lsStaffInfo.StaffName = viewModel.StaffInfo.StaffName;
                    lsStaffInfo.StaffPhone = processObj.CaseMonitorPhoneNumbers;
                    //lsStaffInfo.permission = {
                    //    "nurseMonitoring": processObj.NurseMonitoringOfflinePermission,
                    //    "interRAI": processObj.InterRaiOfflinePermission
                    //};
                } else {
                    lsStaffInfo.StaffId = viewModel.StaffInfo.StaffId;
                    lsStaffInfo.StaffName = viewModel.StaffInfo.StaffName;
                    lsStaffInfo.StaffPhone = processObj.CaseMonitorPhoneNumbers;
                    //lsStaffInfo.permission = {
                    //    "nurseMonitoring": processObj.NurseMonitoringOfflinePermission,
                    //    "interRAI": processObj.InterRaiOfflinePermission
                    //};
                }

                setLocalStorageObject(localstoragekeys.staffInfo, lsStaffInfo);

                showSuccessMessage("Assessment successfully downloaded", 2000);
            }
        }
        });
}

  
function pushMessageToSessionStorage(content, type, id) {
    var messages = getSessionStorageObject(localstoragekeys.messageNestPage);
    if (typeof (messages) == "undefined") {
        messages = new Array();
    }
    message = {
        id: id ? id : undefined,
        type: type,
        content: content
    };
    messages.push(message);
    setSessionStorageObject(localstoragekeys.messageNestPage, messages);
}

function popMessageFromSessionStorage(id, time) {
    var messages = getSessionStorageObject(localstoragekeys.messageNestPage);
    if (typeof (messages) == "undefined") {
        console.log("message " + id + " undefined");
    } else {
        for (idx in messages) {
            if (messages[idx].Id == id) {
                switch (messages[idx].type) {
                    case "success":
                        showSuccessMessage(messages[idx].content);
                        break;
                    case "error":
                        showErrorMessage(messages[idx].content);
                        break;
                    case "info":
                        showInfoMessage(messages[idx].content);
                        break;
                }
                messages.splice(idx, 1);
                return;
            }
        }
        setSessionStorageObject(localstoragekeys.messageNestPage, messages);
}
}

function fixDates(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] instanceof Object) {
                fixDates(obj[prop]);
            }
            else {
                var patt = /\/Date\((\d+)\)\//
                if (typeof obj[prop] == "string" && obj[prop].match(patt)) {
                    obj[prop] = new Date(parseInt(obj[prop].match(patt)[1]));
                }
            }
        }
    }
}

function getBrowserType() {
    for (var prop in $.browser) {
        switch (prop) {
            case "chrome": {
                return "Chrome";
                break;
            }
            case "msie": {
                return "IE";
                break;
            }
            case "safari": {
                return "Safari";
                break;
            }
            case "mozilla": {
                return "Firefox";
                return;
            }
            default: {
                return "unknow";
                break;
            }
        }
    }
}

function getPlatform() {
    var ua = navigator.userAgent.toLowerCase();
    if (/windows/.test(ua)) {
        //if (/windows nt 5.0/.test(ua)) {
        //    return "Win2K";
        //}
        //if (/windows nt 5.1/.test(ua)) {
        //    return "WinXP";
        //}
        //if (/windows nt 6.0/.test(ua)) {
        //    return "WinVista";
        //}
        //if (/windows nt 6.1/.test(ua)) {
        //    return "Win7";
        //}
        return "Windows"
    }
    else if (/ipad/.test(ua)) {
        return "iPad";
    }
    else if (/mac/.test(ua)) {
        return "Mac"
    }
}

function getAssessmentCount() {
    var length = 0;
    if (localStorage[localstoragekeys.interRaiAssessment]) {
        for (var i in JSON.parse(localStorage[localstoragekeys.interRaiAssessment]))
            length++;
    }
    return length;
}

function getNurseMonitoringCount() {
    var length = 0;
    if (localStorage[localstoragekeys.nurseMonitoring]) {
        for (var i in getLocalStorageObject(localstoragekeys.nurseMonitoring)) {
            length++;
    }
    }
    return length;
}

function resizeKendoWindow() {

    var windowHeight = $(window).height() * .6;
    var kWindowContent = $('.k-window-content:visible').children().first().height();
    if (kWindowContent > windowHeight) {
        $('.k-window-content:visible').parent(".k-window").css({ "height": "75%" })       
    }
    else {
        $('.k-window-content:visible').parent(".k-window").css({ "height": "auto" })        
    }
}

function initCheckForErrors(form) {
    form.valid();

    $('.submit-required').each(function (idx, el) {
        if (!$(this).attr('dataval') || $(this).attr('dataval') === "") {
            var parent = $(this).closest('.iform-fieldset, .row');
            parent.addClass('errorBox');
        }
    });

    $('.input-validation-error').each(function () {
        var parent = $(this).closest('.iform-fieldset, .row');
        parent.addClass('errorBox');
        $(this).attr('hasValidationError', true);
    });

    showErrorMessage("There are errors in this section that prevent submission.");

    $('input[type=radio], select, input[type=text], textarea').change(function () {
        checkErrorsForElement($(this), form);
    });

    $('input[type=text]').keyup(function () {
        if ($(this).attr('hasValidationError')) {
            form.valid();
            if (($(form.data().validator.currentElements).is($(this)) && $(this).hasClass('valid')) && $(this).val() != "") {
                $(this).closest('.errorBox').removeClass('errorBox');
            }
            else {
                $(this).closest('.iform-fieldset, .row').addClass('errorBox');
            }

            if ($('.errorBox:visible').length == 0) {
                closeMessage();
            } else {
                showErrorMessage("There are errors in this section that prevent submission.");
            }
        }
        else {
            if (!form.valid()) {
                $('.input-validation-error').each(function () {
                    var parent = $(this).closest('.iform-fieldset, .row');
                    parent.addClass('errorBox');
                    $(this).attr('hasValidationError', true);
                });
            }
        }

    });
}

function checkErrorsForElement(el, form) {
    var element = el;

    var iFormParent = element.parents('.iform-fieldset').first();
    var rowParent = element.parents('.row').first();

    var parent = iFormParent[0] ? iFormParent : rowParent;
    if (parent.find('.submit-required').length > 0) {
        if (element.val() != "" || (element.attr('ko-val') && eval(element.attr('ko-val')) != null && eval(element.attr('ko-val')) != "")) {
            if (element.attr('hasValidationError')) {
                if (form.valid()) {
                    element.closest('.errorBox').removeClass('errorBox');
                }
            }
            else {
                element.closest('.errorBox').removeClass('errorBox');
            }

            form.valid();
        } else {
            parent.addClass('errorBox');
        }

        if ($('.errorBox:visible').length == 0) {
            closeMessage();
        } else {
            showErrorMessage("There are errors in this section that prevent submission.");
        }
    }
}

$(function () {
    var messages = getSessionStorageObject(localstoragekeys.messageNestPage);
    if (messages) {
        for (idx in messages) {
            if (!messages[idx].Id) {
                switch (messages[idx].type) {
                case "success":
                    showSuccessMessage(messages[idx].content, 5000);
                    break;
                case "error":
                    showErrorMessage(messages[idx].content, 5000);
                    break;
                case "info":
                    showInfoMessage(messages[idx].content, 5000);
                    break;
                }
                messages.splice(idx, 1);
            }
        }
        setSessionStorageObject(localstoragekeys.messageNestPage, messages);
    }
});

function saveBackProcess(process) {
    var processObj = getLocalStorageObject(localstoragekeys.nurseMonitoring);
    processObj[process.ProcessInfo.Id] = process;
    setLocalStorageObject(localstoragekeys.nurseMonitoring, processObj);
}

function removeProcess(processId) {
    var processObj = getLocalStorageObject(localstoragekeys.nurseMonitoring);
    delete processObj[processId];
    setLocalStorageObject(localstoragekeys.nurseMonitoring, processObj);
}

function saveBackAssessment(assessment) {
    var assessmentObj = getLocalStorageObject(localstoragekeys.interRaiAssessment);
    assessmentObj[assessment.Id] = assessment;
    setLocalStorageObject(localstoragekeys.interRaiAssessment, assessmentObj);
}

function removeAssessment(assessmentId) {
    var assessmentsObj = getLocalStorageObject(localstoragekeys.interRaiAssessment);
    delete assessmentsObj[assessmentId];
    setLocalStorageObject(localstoragekeys.interRaiAssessment, assessmentsObj);
}

function uploadAssessment(id, uploadInterRaiUrl, uploadNurseMonitoringUrl, uploadProviderEvaluationUrl, uploadProviderInstructionUrl) {
    var assessmentId;
    var processId;
    var assessmentObj;
    var processObj;
    var failUploadCount = 0;
    if (id.toLowerCase().indexOf("assessment") > -1) {
        assessmentId = id;
        assessmentObj = getLocalStorageObject(localstoragekeys.interRaiAssessment)[assessmentId];
        if (assessmentObj.MatchingNurseMonitoringProcessId) {
            processId = assessmentObj.MatchingNurseMonitoringProcessId;
            processObj = getLocalStorageObject(localstoragekeys.nurseMonitoring)[processId];
        }
    }
    else if (id.toLowerCase().indexOf("process") > -1) {
        processId = id;
        processObj = getLocalStorageObject(localstoragekeys.nurseMonitoring)[processId];
        if (processObj.ProcessInfo.MarylandStandardizedAssessmentId) {
            assessmentId = processObj.ProcessInfo.MarylandStandardizedAssessmentId;
            assessmentObj = getLocalStorageObject(localstoragekeys.interRaiAssessment)[assessmentId];
        }
    }
    
    if (assessmentId) {
        $.ajax({
            url: uploadInterRaiUrl,
            type: "POST",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(assessmentObj),
            context: assessmentObj,
            async: false,
            success: function (result) {
                if (assessmentObj.MatchingNurseMonitoringProcessId) {// change the id of the assessment, also in the process
                    if (result.AssessmentId) {
                        var tempId = assessmentObj.Id;
                        processObj = getLocalStorageObject(localstoragekeys.nurseMonitoring)[assessmentObj.MatchingNurseMonitoringProcessId];
                        processObj.ProcessInfo.MarylandStandardizedAssessmentId = result.AssessmentId;
                        saveBackProcess(processObj);
                        var assessments = getLocalStorageObject(localstoragekeys.interRaiAssessment);
                        assessments[result.AssessmentId] = assessments[tempId];
                        assessments[result.AssessmentId].Id = result.AssessmentId;
                        delete assessments[tempId];
                        setLocalStorageObject(localstoragekeys.interRaiAssessment, assessments);
                    }
                }
            }
        });
    }
    if (processId) {
        for (var i = 0 ; i < processObj.Assessment.ProviderEvaluations.length; i++) {
            uploadProviderEvaluation(processObj.Assessment.ProviderEvaluations[i]);
        }
        for (var i = 0 ; i < processObj.Assessment.ProviderInstructions.length; i++) {
            uploadProviderInstruction(processObj.Assessment.ProviderInstructions[i]);
        }
        var copyOfList = {
            "ProviderEvaluations": processObj.Assessment.ProviderEvaluations,
            "ProviderInstructions": processObj.Assessment.ProviderInstructions
        };
        delete processObj.Assessment.ProviderEvaluations;
        delete processObj.Assessment.ProviderInstructions;

        var requestData = {
            assessment: processObj.Assessment,
            processInfo: processObj.ProcessInfo,
        };
        $.ajax({
            url: uploadNurseMonitoringUrl,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(requestData),
            context: processObj,
            async: false,
            success: function (result) {
                var contextSelf = this;
                //pendingAssessmentCount--;
                if (result.Message || failUploadCount != 0) {
                    //clientAssessmentDic.Get(contextSelf.Assessment.ClientId).IncrementFailedCount();
                    contextSelf.Assessment.ProviderEvaluations = copyOfList.ProviderEvaluations;
                    contextSelf.Assessment.ProviderInstructions = copyOfList.ProviderInstructions;
                    saveBackAssessment(contextSelf);
                    pushMessageToSessionStorage('Fail to upload assessment for ' + processObj.ClientInfo.FirstName + ' ' + processObj.ClientInfo.LastName + '.', "error");
                }
                else {
                    pushMessageToSessionStorage('Assessment uploaded for ' + processObj.ClientInfo.FirstName + ' ' + processObj.ClientInfo.LastName + '.', "success");
                    removeProcess(contextSelf.ProcessInfo.Id);
                    removeAssessment(contextSelf.ProcessInfo.MarylandStandardizedAssessmentId);
                    

                }

                //if (pendingAssessmentCount == 0) {
                //    setTimeout(function () { window.location.reload() }, 1000);
                //}
            } //success
        }); //ajax
    }
    function uploadProviderEvaluation(providerEvaluation) {
        $.ajax({
            url: uploadProviderEvaluationUrl,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(providerEvaluation),
            context: providerEvaluation,
            async: false,
            success: function (result) {
                if (result) {
                    if (result.Message) {
                        console.log(result.Message);
                        failUploadCount++;
                        return false;
                    }
                    if (result.newId) {
                        providerEvaluation.Id = result.newId;
                    }
                }
                return true;
            },
            error: function (result) {
                if (result) {
                    if (result.Message) {
                        console.log(result.Message);
                    }
                }
                failUploadCount++;
                return false;
            }
        });
    }
    function uploadProviderInstruction(providerInstruction) {
        $.ajax({
            url: uploadProviderInstructionUrl,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(providerInstruction),
            context: providerInstruction,
            async: false,
            success: function (result) {
                if (result) {
                    if (result.Message) {
                        console.log(result.Message);
                        failUploadCount++;
                        return false;
                    }
                    if (result.newId) {
                        providerInstruction.Id = result.newId;
                    }
                }
                return true;
            },
            error: function (result) {
                if (result) {
                    if (result.Message) {
                        console.log(result.Message);
                    }
                }
                failUploadCount++;
                return false;
            }
        });
    }
}

function ListGridView_Date(data, type, row) {

    if (data != null) {
        var dt = new Date(data);
        return formatDate(dt);
    }
    else {
        return "N/A";
    }
}
function formatDate(dt) {
    var dtObj;
    if (dt instanceof Date) {
        dtObj = dt;
    }
    else {
        dtObj = new Date(dt);
    }

    var month;
    var day;
    var year;

    month = dtObj.getMonth() < 9 ? '0' + (dtObj.getMonth() + 1) : dtObj.getMonth() + 1;
    day = dtObj.getDate() < 10 ? '0' + dtObj.getDate().toString() : dtObj.getDate().toString();
    year = dtObj.getFullYear().toString();

    return month.toString() + "/" + day + "/" + year;
}

function getFormattedDateAndTime(dt) {
    var dtObj;
    if (dt instanceof Date) {
        dtObj = dt;
    }
    else {
        dtObj = new Date(dt);
    }

    var month;
    var day;
    var year;

    month = dtObj.getMonth() < 9 ? '0' + (dtObj.getMonth() + 1) : dtObj.getMonth() + 1;
    day = dtObj.getDate() < 10 ? '0' + dtObj.getDate().toString() : dtObj.getDate().toString();
    year = dtObj.getFullYear().toString();

    hour = dtObj.getHours();
    min = dtObj.getMinutes();
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (min < 10) {
        min = "0" + min;
    }

    return month.toString() + "/" + day + "/" + year + " " + hour + ":" + min;
}

function statusComment(table) {
    $("[data-qtip=comment]").each(function (idx, elm) {
        $(this).qtip({
            content: {
                text: $(this).siblings(".js-qtip-content").html(),
                title: "Comment"
            },
            show: {
                solo: true,
                event: 'click',
                effect: function () {
                    $(this).fadeTo(500, 1);
                }
            },
            hide: {
                event: 'unfocus click',
                effect: function () {
                    $(this).slideUp();
                }
            },
            position: {
                my: 'bottom right',
                at: 'left top'
            }
        });
    });
    $(function() {
        window.onkeydown = function (e) {
            if (e.keyCode == 27) {
                $("[data-qtip=comment]").qtip("hide");
            }
        };
    });
}
