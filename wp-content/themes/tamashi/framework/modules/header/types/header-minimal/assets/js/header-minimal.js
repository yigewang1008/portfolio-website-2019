(function($) {
    "use strict";

    var headerMinimal = {};
    eltd.modules.headerMinimal = headerMinimal;
	
	headerMinimal.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltdFullscreenMenu();
    }

    /**
     * Init Fullscreen Menu
     */
    function eltdFullscreenMenu() {
	    var popupMenuOpener = $( 'a.eltd-fullscreen-menu-opener');
	    
        if (popupMenuOpener.length) {
            var popupMenuHolderOuter = $(".eltd-fullscreen-menu-holder-outer"),
                cssClass,
            //Flags for type of animation
                fadeRight = false,
                fadeTop = false,
            //Widgets
                widgetAboveNav = $('.eltd-fullscreen-above-menu-widget-holder'),
                widgetBelowNav = $('.eltd-fullscreen-below-menu-widget-holder'),
            //Menu
                menuItems = $('.eltd-fullscreen-menu-holder-outer nav > ul > li > a'),
                menuItemWithChild =  $('.eltd-fullscreen-menu > ul li.has_sub > a'),
                menuItemWithoutChild = $('.eltd-fullscreen-menu ul li:not(.has_sub) a');

            //set height of popup holder and initialize perfectScrollbar
            popupMenuHolderOuter.perfectScrollbar({
                wheelSpeed: 0.6,
                suppressScrollX: true
            });

            //set height of popup holder on resize
            $(window).resize(function() {
                popupMenuHolderOuter.height(eltd.windowHeight);
            });

            if (eltd.body.hasClass('eltd-fade-push-text-right')) {
                cssClass = 'eltd-push-nav-right';
                fadeRight = true;
            } else if (eltd.body.hasClass('eltd-fade-push-text-top')) {
                cssClass = 'eltd-push-text-top';
                fadeTop = true;
            }

            //Appearing animation
            if (fadeRight || fadeTop) {
                if (widgetAboveNav.length) {
                    widgetAboveNav.children().css({
                        '-webkit-animation-delay' : 0 + 'ms',
                        '-moz-animation-delay' : 0 + 'ms',
                        'animation-delay' : 0 + 'ms'
                    });
                }
                menuItems.each(function(i) {
                    $(this).css({
                        '-webkit-animation-delay': (i+1) * 70 + 'ms',
                        '-moz-animation-delay': (i+1) * 70 + 'ms',
                        'animation-delay': (i+1) * 70 + 'ms'
                    });
                });
                if (widgetBelowNav.length) {
                    widgetBelowNav.children().css({
                        '-webkit-animation-delay' : (menuItems.length + 1)*70 + 'ms',
                        '-moz-animation-delay' : (menuItems.length + 1)*70 + 'ms',
                        'animation-delay' : (menuItems.length + 1)*70 + 'ms'
                    });
                }
            }

            // Open popup menu
            popupMenuOpener.on('click',function(e){
                e.preventDefault();

                if (!popupMenuOpener.hasClass('eltd-fm-opened')) {
                    popupMenuOpener.addClass('eltd-fm-opened');
                    eltd.body.removeClass('eltd-fullscreen-fade-out').addClass('eltd-fullscreen-menu-opened eltd-fullscreen-fade-in');
                    eltd.body.removeClass(cssClass);
                    eltd.modules.common.eltdDisableScroll();
                    
                    $(document).keyup(function(e){
                        if (e.keyCode == 27 ) {
                            popupMenuOpener.removeClass('eltd-fm-opened');
                            eltd.body.removeClass('eltd-fullscreen-menu-opened eltd-fullscreen-fade-in').addClass('eltd-fullscreen-fade-out');
                            eltd.body.addClass(cssClass);
                            eltd.modules.common.eltdEnableScroll();

                            $("nav.eltd-fullscreen-menu ul.sub_menu").slideUp(200);
                        }
                    });
                } else {
                    popupMenuOpener.removeClass('eltd-fm-opened');
                    eltd.body.removeClass('eltd-fullscreen-menu-opened eltd-fullscreen-fade-in').addClass('eltd-fullscreen-fade-out');
                    eltd.body.addClass(cssClass);
                    eltd.modules.common.eltdEnableScroll();

                    $("nav.eltd-fullscreen-menu ul.sub_menu").slideUp(200);
                }
            });

            //logic for open sub menus in popup menu
            menuItemWithChild.on('tap click', function(e) {
                e.preventDefault();

                var thisItem = $(this),
	                thisItemParent = thisItem.parent(),
					thisItemParentSiblingsWithDrop = thisItemParent.siblings('.menu-item-has-children');

                if (thisItemParent.hasClass('has_sub')) {
	                var submenu = thisItemParent.find('> ul.sub_menu');
	
	                if (submenu.is(':visible')) {
		                submenu.slideUp(450, 'easeInOutQuint');
		                thisItemParent.removeClass('open_sub');
	                } else {
		                thisItemParent.addClass('open_sub');
		
		                if(thisItemParentSiblingsWithDrop.length === 0) {
			                submenu.slideDown(400, 'easeInOutQuint');
		                } else {
							thisItemParent.closest('li.menu-item').siblings().find('.menu-item').removeClass('open_sub');
			                thisItemParent.siblings().removeClass('open_sub').find('.sub_menu').slideUp(400, 'easeInOutQuint', function() {
				                submenu.slideDown(400, 'easeInOutQuint');
			                });
		                }
	                }
                }
                
                return false;
            });

            //if link has no submenu and if it's not dead, than open that link
            menuItemWithoutChild.click(function (e) {
                if(($(this).attr('href') !== "http://#") && ($(this).attr('href') !== "#")){
                    if (e.which == 1) {
                        popupMenuOpener.removeClass('eltd-fm-opened');
                        eltd.body.removeClass('eltd-fullscreen-menu-opened');
                        eltd.body.removeClass('eltd-fullscreen-fade-in').addClass('eltd-fullscreen-fade-out');
                        eltd.body.addClass(cssClass);
                        $("nav.eltd-fullscreen-menu ul.sub_menu").slideUp(200);
                        eltd.modules.common.eltdEnableScroll();
                    }
                } else {
                    return false;
                }
            });
        }
    }

})(jQuery);