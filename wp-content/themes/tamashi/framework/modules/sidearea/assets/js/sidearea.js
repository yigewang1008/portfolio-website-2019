(function($) {
    "use strict";

    var sidearea = {};
    eltd.modules.sidearea = sidearea;

    sidearea.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
	    eltdSideArea();
	    eltdSideAreaScroll();
    }
	
	/**
	 * Show/hide side area
	 */
	function eltdSideArea() {
		var wrapper = $('.eltd-wrapper'),
			sideMenuButtonOpen = $('a.eltd-side-menu-button-opener'),
			cssClass = 'eltd-right-side-menu-opened';
		
		wrapper.prepend('<div class="eltd-cover"/>');
		
		$('a.eltd-side-menu-button-opener, a.eltd-close-side-menu').click( function(e) {
			e.preventDefault();
			
			if(!sideMenuButtonOpen.hasClass('opened')) {
				sideMenuButtonOpen.addClass('opened');
				eltd.body.addClass(cssClass);
				
				$('.eltd-wrapper .eltd-cover').click(function() {
					eltd.body.removeClass('eltd-right-side-menu-opened');
					sideMenuButtonOpen.removeClass('opened');
				});
				
				var currentScroll = $(window).scrollTop();
				$(window).scroll(function() {
					if(Math.abs(eltd.scroll - currentScroll) > 400){
						eltd.body.removeClass(cssClass);
						sideMenuButtonOpen.removeClass('opened');
					}
				});
			} else {
				sideMenuButtonOpen.removeClass('opened');
				eltd.body.removeClass(cssClass);
			}
		});
	}
	
	/*
	 **  Smooth scroll functionality for Side Area
	 */
	function eltdSideAreaScroll(){
		var sideMenu = $('.eltd-side-menu');
		
		if(sideMenu.length){
            sideMenu.perfectScrollbar({
                wheelSpeed: 0.6,
                suppressScrollX: true
            });
		}
	}

})(jQuery);
