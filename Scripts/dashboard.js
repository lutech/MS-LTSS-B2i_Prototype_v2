var zoneConfigs = [];
var resizeTimeout = 300;
var resizeTimeoutObj = {};

var dashboard = function () {
    // TODO: Make sure all of these work.
    var defaults = {
        zoneMinCls: 'min',
        zoneMaxCls: 'max',
        zoneCls: 'zone',
        slideAnimationSpeed: 500,
        fadeOutSpeed: 500,
        enableMask: false,
        enableMinimize: true,
        callInit: true,
        minHeightOffset: 30,
    };

    var zoneCollection = {};
    var create = function (opts) {

        if (opts == undefined || !opts.maxZoneId || !opts.zoneCtrId) {
            throw new Error("Cannot create dashboard without maxZoneId and zoneCtrId");
        }
        else if (zoneCollection[opts.maxZoneId]) {
            throw new Error("Max zone container is already being used");
        }
        else if ($('#' + opts.zoneCtrId).data('maxZone')) {
            throw new Error("Zone Container is already being used");
        }

        zoneCollection[opts.maxZoneId] = {};
        var zoneColObj = zoneCollection[opts.maxZoneId];

        zoneColObj.config = {};
        zoneColObj.zoneInfo = {};

        $.extend(zoneColObj.config, defaults, opts);

        buildZones(zoneColObj);

        $('#' + zoneColObj.config.maxZoneId + ' .min .zoneHeader').first().click(function () {
            onHeaderClick($(this))
        });

        $('#' + zoneColObj.config.zoneCtrId + ' .min .zoneHeader').click(function () {
            onHeaderClick($(this))
        });

        if (zoneColObj.config.enableMinimize) {
            $('#' + zoneColObj.config.maxZoneId + ' .zoneHeader, ' + '#' + zoneColObj.config.zoneCtrId + ' .zoneHeader').toggle(
                function (e) {
                    if ($(e.target).hasClass("max")) {
                        return false;
                    }

                    var currZone = $($(this).parents('.' + zoneColObj.config.zoneCls).find('.zoneBody .min')[0]);
                    var currZoneHeader = $(this);
                    currZoneHeader.addClass('minimized');
                    currZone.data('prevHeight', currZone.innerHeight());

                    if (navigator.appName != "Microsoft Internet Explorer") {
                        currZone.css({
                            'height': 0,
                            'overflow-y': 'hidden'
                        });
                    }
                    else {
                        currZone.css('overflow-y', 'hidden');
                        currZone.animate({
                            height: 0
                        }, zoneColObj.config.slideAnimationSpeed);
                    }
                },
                function () {
                    var currZone = $($(this).parents('.' + zoneColObj.config.zoneCls).find('.zoneBody .min')[0]);
                    var currZoneHeader = $(this);
                    currZoneHeader.removeClass('minimized');

                    if (navigator.appName != "Microsoft Internet Explorer") {
                        currZone.css({
                            'height': currZone.data('prevHeight')
                        });
                    }
                    else {
                        currZone.animate({
                            height: currZone.data('prevHeight')
                        }, zoneColObj.config.slideAnimationSpeed);
                    }

                    setTimeout(function () {
                        currZone.css('overflow-y', 'visible');
                    }, zoneColObj.config.slideAnimationSpeed);
                }
             );
        }
        
        if (zoneColObj.config.callInit) {
            initZone($($('#' + zoneColObj.config.maxZoneId).children()[0]), true);

            for (var zone in zoneColObj.zoneInfo) {
                if (zoneColObj.zoneInfo[zone].id != zoneColObj.config.maxZoneId) {
                    initZone($($('#' + zoneColObj.zoneInfo[zone].contentId)[0]), false);
                }
            }
        }

        for (var zoneCfg in zoneColObj.zoneInfo) {
            zoneConfigs.push($($('#' + zoneColObj.zoneInfo[zoneCfg].contentId)[0]).data().config);
        }

        function onHeaderClick(hdr) {
            var currZone = $(hdr.parents('.' + zoneColObj.config.zoneCls)[0]);
            var currZoneContent = $($(hdr.parents('.' + zoneColObj.config.zoneCls)[0]).children()[0])
            var currZonePlaceholderId = currZone.data('zone');
            var currZonePlaceholder = $('#' + currZonePlaceholderId);

            var maxZoneId = zoneColObj.zoneInfo.maxZone.contentId;
            var maxZone = $('#' + maxZoneId);
            var maxZoneContent = $($('#' + maxZoneId).children()[0]);
            var maxZonePlaceholderId = zoneColObj.zoneInfo.maxZone.id;
            var maxZonePlaceholder = $('#' + maxZonePlaceholderId);
            var oldBoxShadow = currZoneContent.css('box-shadow');
            addElementToHtmlNode(currZone);
            addElementToHtmlNode(maxZone);

            if (zoneColObj.config.enableMask) {

            }

            $('.qtip').qtip('hide');

            currZoneContent.find(':not(.zoneOverlay)').css('visibility', 'hidden');
            currZoneContent.children('.zoneOverlay').css({
                'opacity': '0.1',
                'display': 'block'
            });
            // Add the zone to the max zone
           

            currZoneContent.css('box-shadow', 'none');
            if (true)//(navigator.appName != "Microsoft Internet Explorer") 
            {
                currZone.css({
                    'left': maxZone.offset().left,
                    'top': maxZone.offset().top,
                    'height': maxZone.innerHeight(),
                    'width': maxZone.innerWidth()
                });
            }
            else {
                currZone.animate({
                    left: maxZone.offset().left,
                    top: maxZone.offset().top,
                    height: maxZone.innerHeight(),
                    width: maxZone.innerWidth()
                }, zoneColObj.config.slideAnimationSpeed);
            }

            if (navigator.appName == "Microsoft Internet Explorer") {
                zoneColObj.config.slideAnimationSpeed = 0;
            }
            // Hide the Minimized view, show the maximized view.
            setTimeout(function () {
                $(currZone).find('.min').first().hide();
                $(currZone).find('.max').first().show();

                fireMaxZoneFn(currZone);

                currZoneContent.find(':not(.zoneOverlay)').css('visibility', 'visible');
                currZoneContent.css('box-shadow', oldBoxShadow);

            }, zoneColObj.config.slideAnimationSpeed);

            setTimeout(function () {
                currZoneContent.children('.zoneOverlay').css({
                    'display': 'none'
                });
            }, zoneColObj.config.slideAnimationSpeed);

            /*setTimeout(function() {
            currZoneContent.children('.zoneOverlay').css({
            'display': 'none'
            })
            }, zoneColObj.config.slideAnimationSpeed  + zoneColObj.config.fadeOutSpeed)*/

            // Hide controls while maxmimized
            $(currZone.find('.zoneControls')[0]).hide();

            // Add the max zone to the old zone

            // Hide the max'd view of the max zone, show the min view
            maxZoneContent.find(':not(.zoneOverlay)').css('visibility', 'hidden');
            maxZoneContent.children('.zoneOverlay').css({
                'display': 'block',
                'opacity': '0.1'
            });

            maxZoneContent.css('box-shadow', 'none');
            if (true)//(navigator.appName != "Microsoft Internet Explorer")
            {
                maxZone.css({
                    'left': currZonePlaceholder.offset().left,
                    'top': currZonePlaceholder.offset().top,
                    'width': currZonePlaceholder.width(),
                    'height': currZonePlaceholder.height()
                });
            }
            else {
                maxZone.animate({
                    left: currZonePlaceholder.offset().left,
                    top: currZonePlaceholder.offset().top,
                    width: currZonePlaceholder.width(),
                    height: currZonePlaceholder.height()
                }, zoneColObj.config.slideAnimationSpeed);
            }

            setTimeout(function () {
                $(maxZone).find('.max').first().hide();
                $(maxZone).find('.min').first().show();
                fireMinZoneFn(maxZone);
                maxZoneContent.find(':not(.zoneOverlay)').css('visibility', 'visible');
                maxZoneContent.css('box-shadow', oldBoxShadow);
            }, zoneColObj.config.slideAnimationSpeed);

            setTimeout(function () {
                maxZoneContent.children('.zoneOverlay').css({
                    'display': 'none'
                });
            }, zoneColObj.config.slideAnimationSpeed);

            /*setTimeout(function() {
            maxZoneContent.children('.zoneOverlay').css({
            'display': 'none'
            })
            }, zoneColObj.config.slideAnimationSpeed + zoneColObj.config.fadeOutSpeed)*/

            $(maxZone.find('.zoneControls')[0]).show();

            zoneColObj.zoneInfo[currZonePlaceholderId].contentId = zoneColObj.zoneInfo.maxZone.contentId;
            currZone.data('zone', zoneColObj.zoneInfo.maxZone.id);

            zoneColObj.zoneInfo.maxZone.contentId = currZone.prop('id');
            maxZone.data('zone', currZonePlaceholderId);

            setTimeout(function () {
                addElementToZone(maxZone, currZonePlaceholder);
                addElementToZone(currZone, maxZonePlaceholder, true);

                if (hasResized || hasMaximized) {
                    dashboardRefreshGraphs();
                    hasResized = false;
                    hasMaximized = false;
                }
            }, zoneColObj.config.slideAnimationSpeed);
        }
    };

    function fireMaxZoneFn(elem) {
        window[elem.data('config')]['max']();
    }

    function fireMinZoneFn(elem) {
        window[elem.data('config')]['min']();
    }

    function initZone(elem, isMax) {
        window[elem.data('config')]['init'](isMax);
    }

    function addElementToHtmlNode(obj) {
        objData = {
            height: obj.innerHeight(),
            width: obj.innerWidth(),
            left: obj.offset().left,
            top: obj.offset().top
        };
        obj.detach();
        obj.css({
            'height': objData.height,
            'width': objData.width,
            'left': objData.left,
            'top': objData.top,
            'position': 'absolute'
        });
        obj.appendTo('#main-layout');
    }

    function addElementToZone(obj, zone, isMax) {
        obj.detach();
        obj.css({
            //'height': (isMax ? '100%' : 'auto'),
            'width': 'auto',
            'position': 'relative',
            'height': '100%',
            'left': 'auto',
            'top': 'auto'
        });

        zone.html(obj);
    }

    function buildZones(zoneColObj) {
        var maxZonePlaceholder = $('#' + zoneColObj.config.maxZoneId);
        if (maxZonePlaceholder.length == 1) {
            maxZonePlaceholder.addClass('maxZone');

            zoneColObj.zoneInfo.maxZone = {};
            zoneColObj.zoneInfo.maxZone.id = zoneColObj.config.maxZoneId;
            buildZoneDiv(zoneColObj, maxZonePlaceholder.children(0), true);

            var maxZone = maxZonePlaceholder.children('.' + zoneColObj.config.zoneCls);
            var maxZoneId = zoneColObj.config.maxZoneId + '_maxZone';
            maxZone.prop('id', maxZoneId);
            maxZone.data('zone', zoneColObj.config.maxZoneId);
      
            zoneColObj.zoneInfo.maxZone.contentId = maxZoneId;

            if (zoneColObj.config.enableMask) {

            }
        }
        else {
            throw new Error("Max Zone doesn't exist, or there are more than one.");
        }

        var zoneContainer = $('#' + zoneColObj.config.zoneCtrId);
        zoneContainer.find('.max').hide();
        if (zoneContainer.length == 1) {

            //zoneContainer.parent().css('position', 'relative');
            //switch (zoneColObj.config.numZones) {
            //    case 1:
            //        zoneContainer.addClass('zoneCtr-one-zone');
            //        break;
            //    case 2:
            //        zoneContainer.addClass('zoneCtr-two-zones');
            //        break;
            //    default:
            //        throw new Error("Must provide number of zones in the 'numZones' option");
            //}
            zoneContainer.data('maxZone', zoneColObj.zoneInfo.maxZone.id);
            //zoneContainer
            zoneContainer.children('div').each(function (idx, el) {
                if($(el).parents('div').first().prop('id') == zoneContainer.prop('id'))
                {
                    var elem = $(el);
                    var zoneId = zoneColObj.zoneInfo.maxZone.id + '_zone' + idx;
                    elem.prop('id', zoneId);
                    zoneColObj.zoneInfo[zoneId] = {};
                    zoneColObj.zoneInfo[zoneId].id = zoneId;

                    var zoneContentId = zoneColObj.zoneInfo.maxZone.id + '_zoneContent' + (idx + 1);
                    //elem.height(elem.outerHeight());
                    //elem.width(elem.outerWidth());
                    buildZoneDiv(zoneColObj, $(elem.children(0)));
                    //elem.css('vertical-align', 'top');
                    elem.children('.' + zoneColObj.config.zoneCls).prop('id', zoneContentId);
                    elem.children('.' + zoneColObj.config.zoneCls).data('zone', zoneId);
                    elem.addClass("zoneDiv");
                    
                    zoneColObj.zoneInfo[zoneId].contentId = zoneContentId;
                }
            });
        }
        else {
            throw new Error("Zone Container doesn't exist, or there are more than one.");
        }
    }

    function buildZoneDiv(zoneColObj, parent, isMax) {
        var tpl =
        '<div class="' + zoneColObj.config.zoneCls + '">' +
            '<div class="zoneContent">' +
                '<div class="zoneHeader" style="display:none">' +
                    '<div class="zoneTitle"></div>' +
                    '<div class="zoneControls">' +
                        '<span class="max">(+)</span>' +
                    '</div>' +
                    '<br clear="both">' +
                '</div>' +
                '<div class="zoneBody">' +
                '</div>' +
                '<div class="zoneOverlay">' +
                '</div>' +
                '<div class="zoneOverlayLoading">' +
                '</div>' +
            '</div>' +
        '</div>';

        //var zoneDivObj = $(tpl);
        var contentObj = $(parent);
        contentObj.css('height', '100%');

        // Show the min/max sections based on whether this is the max or min zone
        if (isMax) {
            contentObj.find('.zoneControls').hide();
            contentObj.find('div.min').hide();
            contentObj.find('div.max').show();
            contentObj.css('height', '100%');
        }
        else {
            contentObj.find('div.min').show();
            contentObj.find('div.max').hide();
        }

        contentObj.css({
            'transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-moz-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-webkit-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-o-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms'
        });

        contentObj.find('.zoneOverlay').css({
            'transition': 'opacity ' + zoneColObj.config.fadeOutSpeed + 'ms',
            '-moz-transition': 'opacity ' + zoneColObj.config.fadeOutSpeed + 'ms',
            '-webkit-transition': 'opacity ' + zoneColObj.config.fadeOutSpeed + 'ms',
            '-o-transition': 'opacity ' + zoneColObj.config.fadeOutSpeed + 'ms'
        })
        // Set the title of the zone.
        contentObj.find('div.zoneTitle').html(contentObj.data("title"));

        contentObj.find('.btnMinMax').first().toggle(function () {
        
            var parent = contentObj.parents('.maxZone').first().parent();
            var width = parent.width();
            var parentWidth = parent.offsetParent().width();
            var percent = 100*width/parentWidth;
            hasMaximized = true;

            parent.data("oldWidth", percent + '%');
            parent.width('100%');
            parent.siblings().hide();
            $(this).removeClass('btnMax').addClass('btnMin');
            dashboardRefreshGraphs();
        },
        function () {
            var parent = contentObj.parents('.maxZone').first().parent();
            parent.width(parent.data("oldWidth"));
            parent.siblings().show();
            $(this).removeClass('btnMin').addClass('btnMax');
            dashboardRefreshGraphs();
        });


        // Put the content in the zone object
        //zoneDivObj.find('div.zoneBody').html(contentObj);

        contentObj.find('.zoneBody .min').css({
            'transition': 'height ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-moz-transition': 'height ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-webkit-transition': 'height ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-o-transition': 'height ' + zoneColObj.config.slideAnimationSpeed + 'ms'
        });

        // Add the new zone object to the parent
        //parent.html(zoneDivObj);

        //contentObj.data("configObj", contentObj.data("config"));

        if (!isMax && zoneColObj.config.minZoneHeight == undefined) {
            //zoneColObj.config.minZoneHeight = zoneDivObj.outerHeight();
           // zoneColObj.config.minZoneWidth = zoneDivObj.outerWidth();
        }
    }

    return {
        create: create
    }
}();

var hasResized = false;
var hasMaximized = false;
$(document).ready(function () {
    $(window).resize(function () {
        hasResized = true;
        clearTimeout(resizeTimeoutObj)
        resizeTimeoutObj = setTimeout(dashboardRefreshGraphs, resizeTimeout);
    })

    
});

function dashboardRefreshGraphs() {
    $.each(zoneConfigs, function (idx, el) {
        window[el]['onResize']();
    });
}