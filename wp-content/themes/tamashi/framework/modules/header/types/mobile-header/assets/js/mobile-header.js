(function ($) {
	"use strict";
	
	var mobileHeader = {};
	eltd.modules.mobileHeader = mobileHeader;
	
	mobileHeader.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
		All functions to be called on $(document).ready() should be in this function
	*/
	function eltdOnDocumentReady() {
		eltdInitMobileNavigation();
		eltdMobileHeaderBehavior();
	}
	
	function eltdInitMobileNavigation() {
        var mobileHeader = $('.eltd-mobile-header'),
		    navigationOpener = $('.eltd-mobile-header .eltd-mobile-menu-opener'),
			navigationHolder = $('.eltd-mobile-header .eltd-mobile-nav'),
			dropdownOpener = $('.eltd-mobile-nav .mobile_arrow, .eltd-mobile-nav h6, .eltd-mobile-nav a.eltd-mobile-no-link'),
            mobileHeaderHeight = mobileHeader.length ? mobileHeader.height() : 0;
		
		//whole mobile menu opening / closing
		if (navigationOpener.length && navigationHolder.length) {
			navigationOpener.on('tap click', function (e) {
				e.stopPropagation();
				e.preventDefault();
				
				if (navigationHolder.is(':visible')) {
					navigationHolder.slideUp(450, 'easeInOutQuint');
					navigationOpener.removeClass('eltd-mobile-menu-opened');
				} else {
					navigationHolder.slideDown(450, 'easeInOutQuint');
					navigationOpener.addClass('eltd-mobile-menu-opened');
				}
			});
		}

        //init scrollable menu
        var scrollHeight = navigationHolder.outerHeight() + mobileHeaderHeight > eltd.windowHeight - 100 ?  eltd.windowHeight - mobileHeaderHeight - 100 : navigationHolder.height();
        navigationHolder.height(scrollHeight);
        navigationHolder.perfectScrollbar({
            wheelSpeed: 0.6,
            suppressScrollX: true
        });

        //set height of popup holder on resize
        $(window).resize(function() {
            var scrollHeight = navigationHolder.outerHeight() + mobileHeaderHeight > eltd.windowHeight - 100 ?  eltd.windowHeight - mobileHeaderHeight - 100 : navigationHolder.height();
            navigationHolder.height(scrollHeight);
        });
		

		//dropdown opening / closing
		if(dropdownOpener.length) {
			dropdownOpener.each(function() {
				var thisItem = $(this);
				
				thisItem.on('tap click', function(e) {
					var thisItemParent = thisItem.parent('li');
					
					if (thisItemParent.hasClass('has_sub')) {
						var submenu = thisItemParent.find('> ul.sub_menu');
						
						if (submenu.is(':visible')) {
							submenu.slideUp(450, 'easeInOutQuint');
							thisItemParent.removeClass('eltd-opened');
						} else {
							thisItemParent.addClass('open_sub');
							
							if(thisItem.closest('.sub_menu').find('> .has_sub').length === 1) {
								thisItemParent.removeClass('eltd-opened').find('.sub_menu').slideUp(400, 'easeInOutQuint', function() {
									submenu.slideDown(400, 'easeInOutQuint');
								});
							} else {
								thisItemParent.siblings().removeClass('eltd-opened').find('.sub_menu').slideUp(400, 'easeInOutQuint', function() {
									submenu.slideDown(400, 'easeInOutQuint');
								});
							}
						}
					}
				});
			});
		}
		
		$('.eltd-mobile-nav a, .eltd-mobile-logo-wrapper a').on('click tap', function (e) {
			if ($(this).attr('href') !== 'http://#' && $(this).attr('href') !== '#') {
				navigationHolder.slideUp(450, 'easeInOutQuint');
				navigationOpener.removeClass("eltd-mobile-menu-opened");
			}
		});
	}
	
	function eltdMobileHeaderBehavior() {
		var mobileHeader = $('.eltd-mobile-header'),
			mobileMenuOpener = mobileHeader.find('.eltd-mobile-menu-opener'),
			mobileHeaderHeight = mobileHeader.length ? mobileHeader.outerHeight() : 0;
		
		if (eltd.body.hasClass('eltd-content-is-behind-header') && mobileHeaderHeight > 0 && eltd.windowWidth <= 1024) {
			$('.eltd-content').css('marginTop', -mobileHeaderHeight);
		}
		
		if (eltd.body.hasClass('eltd-sticky-up-mobile-header')) {
			var stickyAppearAmount,
				adminBar = $('#wpadminbar');
			
			var docYScroll1 = $(document).scrollTop();
			stickyAppearAmount = mobileHeaderHeight + eltdGlobalVars.vars.eltdAddForAdminBar;
			
			$(window).scroll(function () {
				var docYScroll2 = $(document).scrollTop();
				
				if (docYScroll2 > stickyAppearAmount) {
					mobileHeader.addClass('eltd-animate-mobile-header');
				} else {
					mobileHeader.removeClass('eltd-animate-mobile-header');
				}
				
				if ((docYScroll2 > docYScroll1 && docYScroll2 > stickyAppearAmount && !mobileMenuOpener.hasClass('eltd-mobile-menu-opened')) || (docYScroll2 < stickyAppearAmount)) {
					mobileHeader.removeClass('mobile-header-appear');
					mobileHeader.css('margin-bottom', 0);
					
					if (adminBar.length) {
						mobileHeader.find('.eltd-mobile-header-inner').css('top', 0);
					}
				} else {
					mobileHeader.addClass('mobile-header-appear');
					mobileHeader.css('margin-bottom', stickyAppearAmount);
				}
				
				docYScroll1 = $(document).scrollTop();
			});
		}
	}
	
})(jQuery);