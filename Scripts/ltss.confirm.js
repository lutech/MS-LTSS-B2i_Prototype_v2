(function (global) {

    var $,
        moduleName = "ltss.confirm",
        dataAttributeNameForMessage = "msg-confirm",
        dataAttributeNameForComment = "msg-confirm-comment",
        msgMissingTemplate = moduleName + " : Dialog template markup is missing on the page",
        msgNoJquery = moduleName + " : This module requires jQuery but it is not present",
        defaultTitle = "Please confirm action...",
        divConfirm,
        formConfirm,
        msg,
        btnYes,
        btnNo,
        divComment,
        commentRequiredIndicator,
        comment,
        divReason,
        actionsToConfirm;
    
    global.ltss = global.ltss || {};
    global.ltss.confirm = global.ltss.confirm || {};
    global.ltss.confirm.confirm = confirm;
    global.ltss.confirm.kendoConfirm = kendoConfirm;

    if (typeof define === "function" && define["amd"]) {
        define(moduleName, ["jquery", "kendo"], init(jQuery));
    } else if (typeof jQuery === "function") {
        init(jQuery);
    } else {
        console.log(msgNoJquery);
    }

    function init(jq) {
        $ = jq;
        
        $(function() {
            divConfirm = $("#divConfirm");
            
            if (!divConfirm || divConfirm.length === 0) {
                console.log(msgMissingTemplate);
                return;
            }
                
            formConfirm = $("#formConfirm", divConfirm);
            msg = $("#msg", divConfirm);
            btnYes = $("#btnYes", divConfirm);
            btnNo = $("#btnNo", divConfirm);
            divComment = $("#div_comment", divConfirm);
            commentRequiredIndicator = $("#commentRequiredIndicator", divConfirm);;
            comment = $("#comment", divConfirm);;
            divReason = $("#div_reason", divConfirm);

            btnNo.click(ltss.overlay.close);
            
            actionsToConfirm = $("a[data-" + dataAttributeNameForMessage + "]");
            actionsToConfirm.click(confirmAction);
        });

        return global.ltss.confirm;
    }
    
    //
    // Exported as ltss.confirm(cfg);
    //
    function confirm(cfg) {
        var config = $.extend({}, cfg);
        config.options = {
            modal: true,
            closeEffect: "none",
            helpers: {
                overlay: {
                    speedOut: 0
                }
            }
        };

        formConfirm.attr("action", config.url);
        msg.html(config.msg);

        if (config.performRedirect) {
            btnYes.click(function () {
                window.location = config.url;
                return false;
            });
        }
        
        ltss.overlay.show({
            contentSelector: "#" + divConfirm[0].id,
            options: config.options
        });
    }

    //
    // Exported as ltss.kendoConfirm(cfg);
    //
    function kendoConfirm(cfg) {
        var config = $.extend({}, cfg),
            confirmWindow = divConfirm.kendoWindow().data("kendoWindow");
        
        formConfirm.attr("action", config.url);
        
        msg.html(config.msg || "");

        if (config.comment) {
            show(divComment);
        } else {
            hide(divComment);
        }

        if (config.commentRequired) {
            commentRequiredIndicator.show();
            comment.addClass("required");
        } else {
            commentRequiredIndicator.hide();
            comment.removeClass("required");
        }

        if (config.reason) {
            show(divReason);
        } else {
            hide(divReason);
        }

        if (config.reason || config.comment) {
           hide(msg);
        } else {
           show(msg);
        }

        confirmWindow.setOptions({
            title: cfg.title,
            modal: true,
            visible: false,
            resizable: false,
            width: config.comment ? 500 : 300
        });

        btnNo.click(function () {
            confirmWindow.close();
        });

        confirmWindow.center().open();
    }
    
    function confirmAction() {
        var message = $(this).data(dataAttributeNameForMessage),
            url = this.href,
            isCommentRequired = $(this).data(dataAttributeNameForComment) || false;

        displayConfirmationDialog(url, message, isCommentRequired);
        return false;
    }

    function displayConfirmationDialog(url, message, isCommentRequired) {
        kendoConfirm({
            url: url,
            msg: message,
            title: (isCommentRequired) ? message : defaultTitle,
            comment: isCommentRequired,
            commentRequired: isCommentRequired
        });
    }
    
    function show(jqObj) {
        jqObj.css("display", "block");
    }
    
    function hide(jqObj) {
        jqObj.css("display", "none");
    }

    // TODO: Eliminate all code that calls global confirm({}).
    // This is bad. We are hijacking the DOM window.confirm() method
    // Use this RegEx "onclick\s*=\s*"\s*confirm\s*\(" and replace it with ltss.confirm.confirm() or ltss.confirm.kendoConfirm()
    global.confirm = confirm;
    global.kendoConfirm = kendoConfirm;
    
})(window);