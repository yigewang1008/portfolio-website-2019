(function($) {
    "use strict";

    var title = {};
    eltd.modules.title = title;

    title.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
	    eltdParallaxTitle();
    }

    /*
     **	Title image with parallax effect
     */
	function eltdParallaxTitle() {
		var parallaxBackground = $('.eltd-title-holder.eltd-bg-parallax');
		
		if (parallaxBackground.length > 0 && eltd.windowWidth > 1024) {
			var parallaxBackgroundWithZoomOut = parallaxBackground.hasClass('eltd-bg-parallax-zoom-out'),
				titleHeight = parseInt(parallaxBackground.data('height')),
				imageWidth = parseInt(parallaxBackground.data('background-width')),
				parallaxRate = titleHeight / 10000 * 7,
				parallaxYPos = -(eltd.scroll * parallaxRate),
				adminBarHeight = eltdGlobalVars.vars.eltdAddForAdminBar;
			
			parallaxBackground.css({'background-position': 'center ' + (parallaxYPos + adminBarHeight) + 'px'});
			
			if (parallaxBackgroundWithZoomOut) {
				parallaxBackgroundWithZoomOut.css({'background-size': imageWidth - eltd.scroll + 'px auto'});
			}
			
			//set position of background on window scroll
			$(window).scroll(function () {
				parallaxYPos = -(eltd.scroll * parallaxRate);
				parallaxBackground.css({'background-position': 'center ' + (parallaxYPos + adminBarHeight) + 'px'});
				
				if (parallaxBackgroundWithZoomOut) {
					parallaxBackgroundWithZoomOut.css({'background-size': imageWidth - eltd.scroll + 'px auto'});
				}
			});
		}
	}

})(jQuery);
