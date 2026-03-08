(function($) {
    "use strict";

    var searchSlideFromWT = {};
    eltd.modules.searchSlideFromWT = searchSlideFromWT;

    searchSlideFromWT.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
	    eltdSearchSlideFromWT();
    }
	
	/**
	 * Init Search Types
	 */
	function eltdSearchSlideFromWT() {
        if ( eltd.body.hasClass( 'eltd-search-slides-from-window-top' ) ) {

            var searchOpener = $('a.eltd-search-opener');

            if ( searchOpener.length > 0 ) {

                var searchForm = $('.eltd-search-slide-window-top'),
                    searchClose = $('.eltd-swt-search-close');

                searchOpener.click( function(e) {
                    e.preventDefault();

                    if ( searchForm.height() == "0") {
                        $('.eltd-search-slide-window-top input[type="text"]').focus();
                        //Push header bottom
                        eltd.body.addClass('eltd-search-open');
                    } else {
                        eltd.body.removeClass('eltd-search-open');
                    }

                    $(window).scroll(function() {
                        if ( searchForm.height() != '0' && eltd.scroll > 50 ) {
                            eltd.body.removeClass('eltd-search-open');
                        }
                    });

                    searchClose.click(function(e){
                        e.preventDefault();
                        eltd.body.removeClass('eltd-search-open');
                    });
                });
            }
		}
	}

})(jQuery);
