(function($) {
    "use strict";

    var headerVerticalSliding = {};
    eltd.modules.headerVerticalSliding = headerVerticalSliding;
	
	headerVerticalSliding.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltdVerticalSlidingMenu().init();
    }

    /**
     * Function object that represents vertical menu area.
     * @returns {{init: Function}}
     */
    var eltdVerticalSlidingMenu = function() {
	    var verticalMenuObject = $('.eltd-header-vertical-sliding .eltd-vertical-menu-area');
	
	    var initNavigation = function () {
		    var varticalMenuOpener = verticalMenuObject.find('.eltd-vertical-menu-opener a'),
			    verticalMenuNavHolder = verticalMenuObject.find('.eltd-vertical-menu-nav-holder-outer'),
			    menuItemWithChild = verticalMenuObject.find('.eltd-fullscreen-menu > ul li.has_sub > a'),
			    menuItemWithoutChild = verticalMenuObject.find('.eltd-fullscreen-menu ul li:not(.has_sub) a');
		
		    //set height of vertical menu holder and initialize perfectScrollbar
		    verticalMenuNavHolder.height(eltd.windowHeight);
            verticalMenuNavHolder.perfectScrollbar({
                wheelSpeed: 0.6,
                suppressScrollX: true
            });
		
		    //set height of vertical menu holder on resize
		    $(window).resize(function () {
			    verticalMenuNavHolder.height(eltd.windowHeight);
		    });
		
		    varticalMenuOpener.on('click', function (e) {
			    e.preventDefault();
			
			    if (!verticalMenuNavHolder.hasClass('active')) {
				    verticalMenuNavHolder.addClass('active');
				    verticalMenuObject.addClass('opened');
				    if (!eltd.body.hasClass('page-template-full_screen-php')) {
					    eltd.modules.common.eltdDisableScroll();
				    }
			    } else {
				    verticalMenuNavHolder.removeClass('active');
				    verticalMenuObject.removeClass('opened');
				    if (!eltd.body.hasClass('page-template-full_screen-php')) {
					    eltd.modules.common.eltdEnableScroll();
				    }
			    }
		    });
		
		    $('.eltd-content').on('click', function () {
			    if (verticalMenuNavHolder.hasClass('active')) {
				    verticalMenuNavHolder.removeClass('active');
				    verticalMenuObject.removeClass('opened');
				    if (!eltd.body.hasClass('page-template-full_screen-php')) {
					    eltd.modules.common.eltdEnableScroll();
				    }
			    }
		    });
		
		    //logic for open sub menus in popup menu
		    menuItemWithChild.on('tap click', function (e) {
			    e.preventDefault();
			
			    if ($(this).parent().hasClass('has_sub')) {
				    var submenu = $(this).parent().find('> ul.sub_menu');
				    
				    if (submenu.is(':visible')) {
					    submenu.slideUp(200);
					    $(this).parent().removeClass('open_sub');
				    } else {
					    if ($(this).parent().siblings().hasClass('open_sub')) {
						    $(this).parent().siblings().each(function () {
							    var sibling = $(this);
							    if (sibling.hasClass('open_sub')) {
								    var openedUl = sibling.find('> ul.sub_menu');
								    openedUl.slideUp(200);
								    sibling.removeClass('open_sub');
							    }
							    if (sibling.find('.open_sub')) {
								    var openedUlUl = sibling.find('.open_sub').find('> ul.sub_menu');
								    openedUlUl.slideUp(200);
								    sibling.find('.open_sub').removeClass('open_sub');
							    }
						    });
					    }
					
					    $(this).parent().addClass('open_sub');
					    submenu.slideDown(200);
				    }
			    }
			    return false;
		    });
		
	    };
	
	    return {
		    /**
		     * Calls all necessary functionality for vertical menu area if vertical area object is valid
		     */
		    init: function () {
			    if (verticalMenuObject.length) {
				    initNavigation();
				
			    }
		    }
	    };
    };

})(jQuery);