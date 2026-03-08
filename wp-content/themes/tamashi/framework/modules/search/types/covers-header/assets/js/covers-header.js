(function($) {
    "use strict";

    var searchCoversHeader = {};
    eltd.modules.searchCoversHeader = searchCoversHeader;

    searchCoversHeader.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
	    eltdSearchCoversHeader();
    }
	
	/**
	 * Init Search Types
	 */
	function eltdSearchCoversHeader() {
        if ( eltd.body.hasClass( 'eltd-search-covers-header' ) ) {

            var searchOpener = $('a.eltd-search-opener');

            if (searchOpener.length > 0) {
                searchOpener.click(function (e) {
                    e.preventDefault();

                    var thisSearchOpener = $(this),
                        searchFormHeight,
                        searchFormHeaderHolder = $('.eltd-page-header'),
                        searchFormTopHeaderHolder = $('.eltd-top-bar'),
                        searchFormFixedHeaderHolder = searchFormHeaderHolder.find('.eltd-fixed-wrapper.fixed'),
                        searchFormMobileHeaderHolder = $('.eltd-mobile-header'),
                        searchForm = $('.eltd-search-cover'),
                        searchFormIsInTopHeader = !!thisSearchOpener.parents('.eltd-top-bar').length,
                        searchFormIsInFixedHeader = !!thisSearchOpener.parents('.eltd-fixed-wrapper.fixed').length,
                        searchFormIsInStickyHeader = !!thisSearchOpener.parents('.eltd-sticky-header').length,
                        searchFormIsInMobileHeader = !!thisSearchOpener.parents('.eltd-mobile-header').length;

                    searchForm.removeClass('eltd-is-active');

                    //Find search form position in header and height
                    if (searchFormIsInTopHeader) {
                        searchFormHeight = eltdGlobalVars.vars.eltdTopBarHeight;
                        searchFormTopHeaderHolder.find('.eltd-search-cover').addClass('eltd-is-active');

                    } else if (searchFormIsInFixedHeader) {
                        searchFormHeight = searchFormFixedHeaderHolder.outerHeight();
                        searchFormHeaderHolder.children('.eltd-search-cover').addClass('eltd-is-active');

                    } else if (searchFormIsInStickyHeader) {
                        searchFormHeight = eltdGlobalVars.vars.eltdStickyHeaderHeight;
                        searchFormHeaderHolder.children('.eltd-search-cover').addClass('eltd-is-active');

                    } else if (searchFormIsInMobileHeader) {
                        if (searchFormMobileHeaderHolder.hasClass('mobile-header-appear')) {
                            searchFormHeight = searchFormMobileHeaderHolder.children('.eltd-mobile-header-inner').outerHeight();
                        } else {
                            searchFormHeight = searchFormMobileHeaderHolder.outerHeight();
                        }

                        searchFormMobileHeaderHolder.find('.eltd-search-cover').addClass('eltd-is-active');

                    } else {
                        searchFormHeight = searchFormHeaderHolder.outerHeight();
                        searchFormHeaderHolder.children('.eltd-search-cover').addClass('eltd-is-active');
                    }

                    if (searchForm.hasClass('eltd-is-active')) {
                        searchForm.height(searchFormHeight).stop(true).fadeIn(600).find('input[type="text"]').focus();
                    }

                    searchForm.find('.eltd-search-close').click(function (e) {
                        e.preventDefault();
                        searchForm.stop(true).fadeOut(450);
                    });

                    searchForm.blur(function () {
                        searchForm.stop(true).fadeOut(450);
                    });

                    $(window).scroll(function () {
                        searchForm.stop(true).fadeOut(450);
                    });
                });
            }
        }
	}

})(jQuery);
