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
        clickType: 'click',
        animateMode: 'swap',
        isStaticMinZones: true
    };

    var isAnimating = false;
    
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

        $('#' + zoneColObj.config.maxZoneId + ' .min').not('[data-nomax]').first()[zoneColObj.config.clickType](function () {
            onMinZoneClick($(this))
        });

        $('#' + zoneColObj.config.zoneCtrId + ' .min').not('[data-nomax]')[zoneColObj.config.clickType](function () {
            onMinZoneClick($(this))
        });

        if (zoneColObj.config.callInit) {
            if (zoneColObj.config.animateMode == 'swap') {

                if (!zoneColObj.config.isStaticMinZones) {
                    initZone($($('#' + zoneColObj.config.maxZoneId).children('[data-config]')[0]), true);
                }
            }
            else if (zoneColObj.config.animateMode == 'load') {
                var firstZone = $('#' + zoneColObj.config.maxZoneId + '_zone0').children('.zone').first();
                $('#' + zoneColObj.config.maxZoneId).data('maxZoneConfig', firstZone.data('config'));
                var firstZoneMax = firstZone.find('.max').first().children();
                $('#' + zoneColObj.config.maxZoneId).find('.max').first().append(firstZoneMax.detach());
                firstZoneMax.show();
                initZone(firstZone, true);
            }

            for (var zone in zoneColObj.zoneInfo) {
                if (zoneColObj.zoneInfo[zone].id != zoneColObj.config.maxZoneId) {
                    if (!$('#' + zoneColObj.zoneInfo[zone].id).is(':empty')) {
                        initZone($($('#' + zoneColObj.zoneInfo[zone].contentId)[0]), false);
                    }
                }
            }
        }

        for (var zoneCfg in zoneColObj.zoneInfo) {

            if (zoneCfg == 'maxZone' && zoneColObj.config.animateMode == 'load') {
                continue;
            }

            if (zoneColObj.config.isStaticMinZones) {
            }
            else {
                zoneConfigs.push($($('#' + zoneColObj.zoneInfo[zoneCfg].contentId)[0]).data().config);
            }
        }

        function onMinZoneClick(minZone) {
            if(!isAnimating)
            {
                isAnimating = true;
                
                var currZone = $(minZone.parents('.' + zoneColObj.config.zoneCls)[0]);
                var currZoneContent = $($(minZone.parents('.' + zoneColObj.config.zoneCls)[0]).children()[0])
                

                var maxZoneId = $('#' + zoneColObj.zoneInfo.maxZone.id).children('[data-config]').attr('id');
                var maxZone = $('#' + maxZoneId);
                var maxZoneContent = $($('#' + maxZoneId).children()[0]);
                var maxZonePlaceholderId = zoneColObj.zoneInfo.maxZone.id;
                var maxZonePlaceholder = $('#' + maxZonePlaceholderId);
                var oldBoxShadow = currZoneContent.css('box-shadow');

                var destZonePlaceholderId = currZone.parent().attr('id');
                var destZonePlaceholder = $('#' + destZonePlaceholderId);

                var currZonePlaceholder = $('#' + currZone.parent().attr('id'));

                if(opts.isStaticMinZones)
                {
                    destZonePlaceholderId = maxZone.data('config');
                    destZonePlaceholder = $('.zonePh[static-config="' + destZonePlaceholderId + '"]');
                }
                else
                {
                    destZonePlaceholderId = currZone.parent().attr('id');
                    destZonePlaceholder = $('#' + destZonePlaceholderId);
                }

                if (opts.animateMode == 'swap') {
                    
                    // Detach the zones that are switching from the HTML so that you can move them
                    addElementToHtmlNode(currZone);
                    addElementToHtmlNode(maxZone);

                    if (zoneColObj.config.enableMask) {

                    }

                    if (navigator.appName == "Microsoft Internet Explorer") {
                        //zoneColObj.config.slideAnimationSpeed = 0;
                    }

                    // Hide all of the elements in the zones, and show the overlays.
                    currZoneContent.find(':not(.zoneOverlay)').css('visibility', 'hidden');
                    currZoneContent.children('.zoneOverlay').css({
                        'opacity': '0.1',
                        'display': 'block'
                    });

                    maxZoneContent.find(':not(.zoneOverlay)').css('visibility', 'hidden');
                    maxZoneContent.children('.zoneOverlay').css({
                        'display': 'block',
                        'opacity': '0.1'
                    });

                    // Hide the Minimized view, show the maximized view.  
                    $(currZone).find('.min').first().hide();
                    $(currZone).find('.max').first().show();

                    // Fire the maxFn so that the zone can init itself.


                    // Hide the maximized view, show the minimized view
                    $(maxZone).find('.max').first().hide();
                    $(maxZone).find('.min').first().show();

                    // Fire the minFn so that the zone can init itself.


                    // Swap the two dashboards
                    //currZoneContent.css('box-shadow', 'none');
                    //maxZoneContent.css('box-shadow', 'none');

                    var destPhTop = destZonePlaceholder.offset().top;
                    if (opts.isStaticMinZones) {
                        currZonePlaceholder.addClass("zonePh-isHidden");
                        destZonePlaceholder.removeClass("zonePh-isHidden");
                        if (navigator.appName != "Microsoft Internet Explorer" || (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 10") > -1)) {
                            
                            destZonePlaceholder.css({
                                'height': destZonePlaceholder.data('origHeight') + 'px'
                            });

                        }
                        else {
                            currZonePlaceholder.animate({
                                height: 0,
                                width: 0
                            }, zoneColObj.config.slideAnimationSpeed);
                            destZonePlaceholder.animate({
                                height: destZonePlaceholder.data('origHeight')
                            }, zoneColObj.config.slideAnimationSpeed);
                        }

                        if ((currZonePlaceholder.offset().top < destZonePlaceholder.offset().top) || currZonePlaceholder.attr('id').indexOf('_zone0') > 0 )//|| (currZonePlaceholder.offset().top == destZonePlaceholder.offset().top && navigator.appVersion.indexOf("MSIE 9") > -1)) {
                        { 
                            destPhTop -= destZonePlaceholder.data('origHeight');
                        }
                    }

                    if (navigator.appName != "Microsoft Internet Explorer" || (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 10") > -1))
                    {
                        currZone.css({
                            'left': maxZone.offset().left,
                            'top': maxZone.offset().top,
                            'height': maxZone.outerHeight(),
                            'width': maxZone.innerWidth()
                        });

                        maxZone.css({
                            'left': destZonePlaceholder.offset().left,
                            'top': destPhTop,
                            'width': destZonePlaceholder.width(),
                            'height': destZonePlaceholder.data('origHeight') + 'px'
                        });
                    }
                    else {
                        currZone.animate({
                            left: maxZone.offset().left,
                            top: maxZone.offset().top,
                            height: maxZone.outerHeight(),
                            width: maxZone.innerWidth()
                        }, zoneColObj.config.slideAnimationSpeed);

                        maxZone.animate({
                            left: destZonePlaceholder.offset().left,
                            top: destPhTop,
                            width: destZonePlaceholder.width(),
                            height: destZonePlaceholder.data('origHeight')
                        }, zoneColObj.config.slideAnimationSpeed);
                    }

                    // After the animation, show all of elements except the overlay
                    setTimeout(function () {
                        currZoneContent.find(':not(.zoneOverlay)').css('visibility', 'visible');
                        currZoneContent.css('box-shadow', oldBoxShadow);

                        maxZoneContent.find(':not(.zoneOverlay)').css('visibility', 'visible');
                        maxZoneContent.css('box-shadow', oldBoxShadow);

                        // Hide the overlay
                        currZoneContent.children('.zoneOverlay').css({
                            'display': 'none'
                        });

                        maxZoneContent.children('.zoneOverlay').css({
                            'display': 'none'
                        });

                        // Now that the animation is complete, re-attach the elements back to the DOM
                        addElementToZone(maxZone, destZonePlaceholder);
                        addElementToZone(currZone, maxZonePlaceholder, true);

                        fireMaxZoneFn(currZone);
                        fireMinZoneFn(maxZone);

                        if (hasResized || hasMaximized) {
                            dashboardRefreshGraphs();
                            hasResized = false;
                            hasMaximized = false;
                        }
                    }, zoneColObj.config.slideAnimationSpeed + 50);

                    // Hide controls while maxmimized
                    $(currZone.find('.zoneControls')[0]).hide();
                    $(maxZone.find('.zoneControls')[0]).show();

                    if (!zoneColObj.config.isStaticMinZones) {
                        zoneColObj.zoneInfo[destZonePlaceholderId].contentId = zoneColObj.zoneInfo.maxZone.contentId;
                        currZone.data('zone', zoneColObj.zoneInfo.maxZone.id);

                        zoneColObj.zoneInfo.maxZone.contentId = currZone.prop('id');
                        maxZone.data('zone', destZonePlaceholderId);
                    }

                    

                }
                else if (opts.animateMode == 'load') {
                    var currZoneLeft = currZoneContent.offset().left;
                    var currZoneTop = currZoneContent.offset().top

                    var currMaxZoneConfig = maxZonePlaceholder.data('maxZoneConfig');
                    var currMaxedZone = $('.zone[data-config="' + currMaxZoneConfig + '"]');
                    currMaxedZone.find('.max').first().append(maxZone.find('.max').first().children().detach());

                    maxZone.find('.max').first().append(currZoneContent.find('.max').children().detach());

                    maxZonePlaceholder.data('maxZoneConfig', currZone.data('config'))

                    fireMaxZoneFn(currZone);
                }
                
                if (sessionStorage) {
                    if (zoneColObj.config.isStaticMinZones) {
                        sessionStorage[zoneColObj.config.maxZoneId] = currZone.data('config');
                    }
                    else {
                        sessionStorage[zoneColObj.config.maxZoneId] = JSON.stringify(zoneColObj.zoneInfo)
                    }
                }

                setTimeout(function() {
                    isAnimating = false;
                }, zoneColObj.config.slideAnimationSpeed * 2)
            }
        }
    };

    function fireMaxZoneFn(elem) {
        window[elem.data('config')]['onMaximize']();
    }

    function fireMinZoneFn(elem) {
        window[elem.data('config')]['onMinimize']();
    }

    function initZone(elem, isMax) {
        window[elem.data('config')]['initialize'](isMax);
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
        obj.appendTo($('html'));
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
            maxZonePlaceholder.css({
                'height': '100%',
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
            });

            zoneColObj.zoneInfo.maxZone = {};
            zoneColObj.zoneInfo.maxZone.id = zoneColObj.config.maxZoneId;
            
            buildZoneDiv(zoneColObj, maxZonePlaceholder.children('[data-config]')[0]);
        }
        else {
            throw new Error("Max Zone doesn't exist, or there are more than one.");
        }

        var zoneContainer = $('#' + zoneColObj.config.zoneCtrId);
        zoneContainer.find('.max').hide();
        if (zoneContainer.length == 1) {
        
            zoneContainer.data('maxZone', zoneColObj.zoneInfo.maxZone.id);
            zoneContainer.css({
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
            });
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
                    buildZoneDiv(zoneColObj, $(elem.children('[data-config]')[0]));
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

        var maxZoneId = zoneColObj.config.maxZoneId + '_maxZone';
        zoneColObj.zoneInfo.maxZone.contentId = maxZoneId;
        maxZonePlaceholder.children('[data-config]').first().prop('id', maxZoneId);

        if (zoneColObj.config.isStaticMinZones) {
            for (zone in zoneColObj.zoneInfo) {
                if (zoneColObj.zoneInfo.hasOwnProperty(zone)) {
                    var zoneInfoObj = zoneColObj.zoneInfo[zone];

                    if (zoneInfoObj.id == zoneColObj.config.maxZoneId) {
                        continue;
                    }

                    $('#' + zoneInfoObj.id).data('origHeight', $('#' + zoneInfoObj.id).height());
                    $('#' + zoneInfoObj.id).data('origWidth', $('#' + zoneInfoObj.id).width());

                    //if (zoneInfoObj.id == zoneColObj.config.maxZoneId + '_zone0') {
                    //    $('#' + zoneInfoObj.id).attr('static-config', $('#' + zoneColObj.config.maxZoneId).find('.zone[data-config]').data('config'));
                    //    $('#' + zoneInfoObj.id).css('height', '0px');
                    //    setTimeout(function () {
                    //        $('#' + zoneInfoObj.id).css({
                    //            'transition': 'height ' + zoneColObj.config.fadeOutSpeed + 'ms',
                    //            '-moz-transition': 'height ' + zoneColObj.config.fadeOutSpeed + 'ms',
                    //            '-webkit-transition': 'height ' + zoneColObj.config.fadeOutSpeed + 'ms',
                    //            '-o-transition': 'height ' + zoneColObj.config.fadeOutSpeed + 'ms'
                    //        });
                    //    }, 1000);
                    //    continue;
                    //}

                    $('#' + zoneInfoObj.id).attr('static-config', $('#' + zoneInfoObj.id).find('.zone[data-config]').data('config'));
                }
            }

            setTimeout(function () {
                $('.zonePh').each(function () {
                    $(this).css({
                        'height': $(this).css('height'),
                        'transition': 'height ' + zoneColObj.config.fadeOutSpeed + 'ms',
                        '-moz-transition': 'height ' + zoneColObj.config.fadeOutSpeed + 'ms',
                        '-webkit-transition': 'height ' + zoneColObj.config.fadeOutSpeed + 'ms',
                        '-o-transition': 'height ' + zoneColObj.config.fadeOutSpeed + 'ms'
                    });
                });
            }, 500);
        }

        if (sessionStorage && sessionStorage[zoneColObj.config.maxZoneId]) {
            if (!zoneColObj.config.isStaticMinZones) {
                var savedState = JSON.parse(sessionStorage[zoneColObj.config.maxZoneId]);

                for (key in savedState) {
                    if (savedState.hasOwnProperty(key)) {
                        var contentId = savedState[key].contentId;
                        var destZone = savedState[key].id;

                        var detachedZone = $('#' + contentId).detach();
                        $('#' + destZone).append(detachedZone);
                    }
                }

                zoneColObj.zoneInfo = savedState;
            }
            else {
                var maxedZonePh = $('.zonePh[static-config="' + sessionStorage[zoneColObj.config.maxZoneId] + '"]');
                maxedZonePh.addClass("zonePh-isHidden");
                var maxedZone = maxedZonePh.children('.zone');
                $('#' + zoneColObj.config.maxZoneId).append(maxedZone.detach());
                fireMaxZoneFn(maxedZone);
            }
        }
        else {
            var firstZonePh = $('#' + zoneColObj.config.zoneCtrId + ' .zonePh').first();
            firstZonePh.addClass("zonePh-isHidden");
            var firstZone = $('#' + zoneColObj.config.zoneCtrId + ' .zonePh').first().children('.zone');
            $('#' + zoneColObj.config.maxZoneId).append(firstZone.detach());
            fireMaxZoneFn(firstZone);
        }

        /*
        contentObj.find('div.min').hide();
            contentObj.find('div.max').show();
            contentObj.css('height', '100%');
            */
        var maxZone = maxZonePlaceholder.children('.' + zoneColObj.config.zoneCls);
        maxZone.data('zone', zoneColObj.config.maxZoneId);
        maxZone.find('div.min').hide();
        maxZone.find('div.max').show();
        maxZone.css('height', '100%');
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
            contentObj.find('div.min').show();
            contentObj.find('div.max').hide();
        
        contentObj.find('.min').not('[data-nomax]').css({
            'height' : '100%',
            'cursor' : 'pointer'
        })

        contentObj.find('.zoneBody').css({
            'height': '100%'
        });
        
        contentObj.css({
            'transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-moz-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-webkit-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms',
            '-o-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms'
        });

        $(contentObj).children('.zoneContent').css({
            'top': $(contentObj).children('.zoneContent').css('top'),
            'left': $(contentObj).children('.zoneContent').css('left'),
            'bottom': $(contentObj).children('.zoneContent').css('bottom'),
            'right': $(contentObj).children('.zoneContent').css('right')
        });
        contentObj.find('.zoneOverlay').css({
            'transition': 'opacity ' + zoneColObj.config.fadeOutSpeed + 'ms',
            '-moz-transition': 'opacity ' + zoneColObj.config.fadeOutSpeed + 'ms',
            '-webkit-transition': 'opacity ' + zoneColObj.config.fadeOutSpeed + 'ms',
            '-o-transition': 'opacity ' + zoneColObj.config.fadeOutSpeed + 'ms',
            'display': 'none',
            'background-color': '#000',
            'opacity': '0.1',
            'top': '0px',
            'left': '0px',
            'position': 'absolute',
            'height': '100%',
            'width': '100%',
            'z-index': '100'
        })

        //if (zoneColObj.config.animateMode == 'grow') {
        //    contentObj.find('.zoneOverlay').after('<div class="zoneOutline"></div>');
            
        //    contentObj.find('.zoneOutline').css({
        //        'transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms, background-color ' + zoneColObj.config.slideAnimationSpeed + 'ms',
        //        '-moz-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms',
        //        '-webkit-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms, background-color ' + zoneColObj.config.slideAnimationSpeed + 'ms',
        //        '-o-transition': 'top ' + zoneColObj.config.slideAnimationSpeed + 'ms, left ' + zoneColObj.config.slideAnimationSpeed + 'ms, height ' + zoneColObj.config.slideAnimationSpeed + 'ms, width ' + zoneColObj.config.slideAnimationSpeed + 'ms',
        //        'display': 'none',
        //        'background-color': 'transparent',
        //        'opacity': '1',
        //        'border': '2px solid black',
        //        'top': '0px',
        //        'left': '0px',
        //        'position': 'absolute',
        //        'height': '100%',
        //        'width': '100%',
        //        'z-index': '100'
        //    })
        //}
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