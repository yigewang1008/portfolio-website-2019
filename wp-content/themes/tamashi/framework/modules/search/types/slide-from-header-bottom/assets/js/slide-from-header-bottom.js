(function($) {
    "use strict";

    var searchSlideFromHB = {};
    eltd.modules.searchSlideFromHB = searchSlideFromHB;

    searchSlideFromHB.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
	    eltdSearchSlideFromHB();
    }
	
	/**
	 * Init Search Types
	 */
	function eltdSearchSlideFromHB() {
        if ( eltd.body.hasClass( 'eltd-slide-from-header-bottom' ) ) {

            var searchOpener = $('a.eltd-search-opener');

            if (searchOpener.length > 0) {
                //Check for type of search
                searchOpener.click(function (e) {
                    e.preventDefault();

                    var thisSearchOpener = $(this),
                        searchIconPosition = parseInt(eltd.windowWidth - thisSearchOpener.offset().left - thisSearchOpener.outerWidth());

                    if (eltd.body.hasClass('eltd-boxed') && eltd.windowWidth > 1024) {
                        searchIconPosition -= parseInt((eltd.windowWidth - $('.eltd-boxed .eltd-wrapper .eltd-wrapper-inner').outerWidth()) / 2);
                    }

                    var searchFormHeaderHolder = $('.eltd-page-header'),
                        searchFormTopOffset = '100%',
                        searchFormTopHeaderHolder = $('.eltd-top-bar'),
                        searchFormFixedHeaderHolder = searchFormHeaderHolder.find('.eltd-fixed-wrapper.fixed'),
                        searchFormMobileHeaderHolder = $('.eltd-mobile-header'),
                        searchForm = $('.eltd-slide-from-header-bottom-holder'),
                        searchFormIsInTopHeader = !!thisSearchOpener.parents('.eltd-top-bar').length,
                        searchFormIsInFixedHeader = !!thisSearchOpener.parents('.eltd-fixed-wrapper.fixed').length,
                        searchFormIsInStickyHeader = !!thisSearchOpener.parents('.eltd-sticky-header').length,
                        searchFormIsInMobileHeader = !!thisSearchOpener.parents('.eltd-mobile-header').length;

                    searchForm.removeClass('eltd-is-active');

                    //Find search form position in header and height
                    if (searchFormIsInTopHeader) {
                        searchFormTopHeaderHolder.find('.eltd-slide-from-header-bottom-holder').addClass('eltd-is-active');

                    } else if (searchFormIsInFixedHeader) {
                        searchFormTopOffset = searchFormFixedHeaderHolder.outerHeight() + eltdGlobalVars.vars.eltdAddForAdminBar;
                        searchFormHeaderHolder.children('.eltd-slide-from-header-bottom-holder').addClass('eltd-is-active');

                    } else if (searchFormIsInStickyHeader) {
                        searchFormTopOffset = eltdGlobalVars.vars.eltdStickyHeaderHeight + eltdGlobalVars.vars.eltdAddForAdminBar;
                        searchFormHeaderHolder.children('.eltd-slide-from-header-bottom-holder').addClass('eltd-is-active');

                    } else if (searchFormIsInMobileHeader) {
                        if (searchFormMobileHeaderHolder.hasClass('mobile-header-appear')) {
                            searchFormTopOffset = searchFormMobileHeaderHolder.children('.eltd-mobile-header-inner').outerHeight() + eltdGlobalVars.vars.eltdAddForAdminBar;
                        }
                        searchFormMobileHeaderHolder.find('.eltd-slide-from-header-bottom-holder').addClass('eltd-is-active');

                    } else {
                        searchFormHeaderHolder.children('.eltd-slide-from-header-bottom-holder').addClass('eltd-is-active');
                    }

                    if (searchForm.hasClass('eltd-is-active')) {
                        searchForm.css({
                            'right': searchIconPosition,
                            'top': searchFormTopOffset
                        }).stop(true).slideToggle(300, 'easeOutBack');
                    }

                    //Close on escape
                    $(document).keyup(function (e) {
                        if (e.keyCode == 27) { //KeyCode for ESC button is 27
                            searchForm.stop(true).fadeOut(0);
                        }
                    });

                    $(window).scroll(function () {
                        searchForm.stop(true).fadeOut(0);
                    });
                });
            }
        }
	}

})(jQuery);
