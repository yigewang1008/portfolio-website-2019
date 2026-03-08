(function($) {
    "use strict";

    var searchFullscreenWithSidebar = {};
    eltd.modules.searchFullscreenWithSidebar = searchFullscreenWithSidebar;

    searchFullscreenWithSidebar.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltdSearchFullscreenWithSidebar();
    }

	
	/**
	 * Init Search Types
	 */
	function eltdSearchFullscreenWithSidebar() {
        if ( eltd.body.hasClass( 'eltd-fullscreen-search-with-sidebar' ) ) {


            var searchOpener = $('a.eltd-search-opener');

            if (searchOpener.length > 0) {

                var searchHolder = $('.eltd-fullscreen-with-sidebar-search-holder'),
                    searchClose = $('.eltd-fullscreen-search-close');

                searchOpener.click(function (e) {
                    e.preventDefault();


                    searchHolder.perfectScrollbar({
                        wheelSpeed: 0.6,
                        suppressScrollX: true
                    });

                    if (searchHolder.hasClass('eltd-animate')) {
                        eltd.body.removeClass('eltd-fullscreen-search-opened eltd-search-fade-out');
                        eltd.body.removeClass('eltd-search-fade-in');
                        searchHolder.removeClass('eltd-animate');

                        setTimeout(function () {
                            searchHolder.find('.eltd-search-field').val('');
                            searchHolder.find('.eltd-search-field').blur();
                        }, 300);

                        eltd.modules.common.eltdEnableScroll();
                    } else {
                        eltd.body.addClass('eltd-fullscreen-search-opened eltd-search-fade-in');
                        eltd.body.removeClass('eltd-search-fade-out');
                        searchHolder.addClass('eltd-animate');

                        setTimeout(function () {
                           searchHolder.find('.eltd-search-field').focus();
                        }, 900);

                        eltd.modules.common.eltdDisableScroll();
                    }


                    searchClose.click(function (e) {
                        e.preventDefault();
                        eltd.body.removeClass('eltd-fullscreen-search-opened eltd-search-fade-in');
                        eltd.body.addClass('eltd-search-fade-out');
                        searchHolder.removeClass('eltd-animate');

                        setTimeout(function () {
                            searchHolder.find('.eltd-search-field').val('');
                            searchHolder.find('.eltd-search-field').blur();
                        }, 300);

                        eltd.modules.common.eltdEnableScroll();
                    });


                    //Close on escape
                    $(document).keyup(function (e) {
                        if (e.keyCode == 27) { //KeyCode for ESC button is 27
                            eltd.body.removeClass('eltd-fullscreen-search-opened eltd-search-fade-in');
                            eltd.body.addClass('eltd-search-fade-out');
                            searchHolder.removeClass('eltd-animate');

                            setTimeout(function () {
                                searchHolder.find('.eltd-search-field').val('');
                                searchHolder.find('.eltd-search-field').blur();
                            }, 300);

                            eltd.modules.common.eltdEnableScroll();
                        }
                    });
                });
            }
        }
	}

})(jQuery);
