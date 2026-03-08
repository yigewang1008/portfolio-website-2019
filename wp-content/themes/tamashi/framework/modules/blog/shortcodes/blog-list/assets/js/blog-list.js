(function($) {
    "use strict";

    var blogListSC = {};
    eltd.modules.blogListSC = blogListSC;

    blogListSC.eltdOnDocumentReady = eltdOnDocumentReady;
    blogListSC.eltdOnWindowLoad = eltdOnWindowLoad;
    blogListSC.eltdOnWindowScroll = eltdOnWindowScroll;

    $(document).ready(eltdOnDocumentReady);
    $(window).load(eltdOnWindowLoad);
    $(window).scroll(eltdOnWindowScroll);

    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function eltdOnDocumentReady() {
        eltdInitBlogListMasonry();
    }

    /*
     All functions to be called on $(window).load() should be in this function
     */
    function eltdOnWindowLoad() {
        eltdInitBlogListShortcodePagination().init();
    }

    /*
     All functions to be called on $(window).scroll() should be in this function
     */
    function eltdOnWindowScroll() {
        eltdInitBlogListShortcodePagination().scroll();
    }

    /**
     * Init blog list shortcode masonry layout
     */
    function eltdInitBlogListMasonry() {
        var holder = $('.eltd-blog-list-holder.eltd-bl-masonry');

        if(holder.length){
            holder.each(function(){
                var thisHolder = $(this),
                    masonry = thisHolder.find('.eltd-blog-list');

                masonry.waitForImages(function() {
                    masonry.isotope({
                        layoutMode: 'packery',
                        itemSelector: '.eltd-bl-item',
                        percentPosition: true,
                        packery: {
                            gutter: '.eltd-bl-grid-gutter',
                            columnWidth: '.eltd-bl-grid-sizer'
                        }
                    });

                    masonry.css('opacity', '1');
                });
            });
        }
    }

    /**
     * Init blog list shortcode pagination functions
     */
    function eltdInitBlogListShortcodePagination(){
        var holder = $('.eltd-blog-list-holder');

        var initStandardPagination = function(thisHolder) {
            var standardLink = thisHolder.find('.eltd-bl-standard-pagination li');

            if(standardLink.length) {
                standardLink.each(function(){
                    var thisLink = $(this).children('a'),
                        pagedLink = 1;

                    thisLink.on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (typeof thisLink.data('paged') !== 'undefined' && thisLink.data('paged') !== false) {
                            pagedLink = thisLink.data('paged');
                        }

                        initMainPagFunctionality(thisHolder, pagedLink);
                    });
                });
            }
        };

        var initLoadMorePagination = function(thisHolder) {
            var loadMoreButton = thisHolder.find('.eltd-blog-pag-load-more a');

            loadMoreButton.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                initMainPagFunctionality(thisHolder);
            });
        };

        var initInifiteScrollPagination = function(thisHolder) {
            var blogListHeight = thisHolder.outerHeight(),
                blogListTopOffest = thisHolder.offset().top,
                blogListPosition = blogListHeight + blogListTopOffest - eltdGlobalVars.vars.eltdAddForAdminBar;

            if(!thisHolder.hasClass('eltd-bl-pag-infinite-scroll-started') && eltd.scroll + eltd.windowHeight > blogListPosition) {
                initMainPagFunctionality(thisHolder);
            }
        };

        var initMainPagFunctionality = function(thisHolder, pagedLink) {
            var thisHolderInner = thisHolder.find('.eltd-blog-list'),
                nextPage,
                maxNumPages;

            if (typeof thisHolder.data('max-num-pages') !== 'undefined' && thisHolder.data('max-num-pages') !== false) {
                maxNumPages = thisHolder.data('max-num-pages');
            }

            if(thisHolder.hasClass('eltd-bl-pag-standard-shortcodes')) {
                thisHolder.data('next-page', pagedLink);
            }

            if(thisHolder.hasClass('eltd-bl-pag-infinite-scroll')) {
                thisHolder.addClass('eltd-bl-pag-infinite-scroll-started');
            }

            var loadMoreDatta = eltd.modules.common.getLoadMoreData(thisHolder),
                loadingItem = thisHolder.find('.eltd-blog-pag-loading');

            nextPage = loadMoreDatta.nextPage;

            if(nextPage <= maxNumPages){
                if(thisHolder.hasClass('eltd-bl-pag-standard-shortcodes')) {
                    loadingItem.addClass('eltd-showing eltd-standard-pag-trigger');
                    thisHolder.addClass('eltd-bl-pag-standard-shortcodes-animate');
                } else {
                    loadingItem.addClass('eltd-showing');
                }

                var ajaxData = eltd.modules.common.setLoadMoreAjaxData(loadMoreDatta, 'tamashi_elated_blog_shortcode_load_more');

                $.ajax({
                    type: 'POST',
                    data: ajaxData,
                    url: eltdGlobalVars.vars.eltdAjaxUrl,
                    success: function (data) {
                        if(!thisHolder.hasClass('eltd-bl-pag-standard-shortcodes')) {
                            nextPage++;
                        }

                        thisHolder.data('next-page', nextPage);

                        var response = $.parseJSON(data),
                            responseHtml =  response.html;

                        if(thisHolder.hasClass('eltd-bl-pag-standard-shortcodes')) {
                            eltdInitStandardPaginationLinkChanges(thisHolder, maxNumPages, nextPage);

                            thisHolder.waitForImages(function(){
                                if(thisHolder.hasClass('eltd-bl-masonry')){
                                    eltdInitHtmlIsotopeNewContent(thisHolder, thisHolderInner, loadingItem, responseHtml);
                                } else {
                                    eltdInitHtmlGalleryNewContent(thisHolder, thisHolderInner, loadingItem, responseHtml);

                                    if (typeof eltd.modules.common.eltdStickySidebarWidget === 'function') {
                                        eltd.modules.common.eltdStickySidebarWidget().reInit();
                                    }
                                }
                            });
                        } else {
                            thisHolder.waitForImages(function(){
                                if(thisHolder.hasClass('eltd-bl-masonry')){
                                    eltdInitAppendIsotopeNewContent(thisHolderInner, loadingItem, responseHtml);
                                } else {
                                    eltdInitAppendGalleryNewContent(thisHolderInner, loadingItem, responseHtml);

                                    if (typeof eltd.modules.common.eltdStickySidebarWidget === 'function') {
                                        eltd.modules.common.eltdStickySidebarWidget().reInit();
                                    }
                                }
                            });
                        }

                        if(thisHolder.hasClass('eltd-bl-pag-infinite-scroll-started')) {
                            thisHolder.removeClass('eltd-bl-pag-infinite-scroll-started');
                        }
                    }
                });
            }

            if(nextPage === maxNumPages){
                thisHolder.find('.eltd-blog-pag-load-more').hide();
            }
        };

        var eltdInitStandardPaginationLinkChanges = function(thisHolder, maxNumPages, nextPage) {
            var standardPagHolder = thisHolder.find('.eltd-bl-standard-pagination'),
                standardPagNumericItem = standardPagHolder.find('li.eltd-bl-pag-number'),
                standardPagPrevItem = standardPagHolder.find('li.eltd-bl-pag-prev a'),
                standardPagNextItem = standardPagHolder.find('li.eltd-bl-pag-next a');

            standardPagNumericItem.removeClass('eltd-bl-pag-active');
            standardPagNumericItem.eq(nextPage-1).addClass('eltd-bl-pag-active');

            standardPagPrevItem.data('paged', nextPage-1);
            standardPagNextItem.data('paged', nextPage+1);

            if(nextPage > 1) {
                standardPagPrevItem.css({'opacity': '1'});
            } else {
                standardPagPrevItem.css({'opacity': '0'});
            }

            if(nextPage === maxNumPages) {
                standardPagNextItem.css({'opacity': '0'});
            } else {
                standardPagNextItem.css({'opacity': '1'});
            }
        };

        var eltdInitHtmlIsotopeNewContent = function(thisHolder, thisHolderInner, loadingItem, responseHtml) {
            thisHolderInner.html(responseHtml).isotope('reloadItems').isotope({sortBy: 'original-order'});
            loadingItem.removeClass('eltd-showing eltd-standard-pag-trigger');
            thisHolder.removeClass('eltd-bl-pag-standard-shortcodes-animate');

            setTimeout(function() {
                thisHolderInner.isotope('layout');

                if (typeof eltd.modules.common.eltdStickySidebarWidget === 'function') {
                    eltd.modules.common.eltdStickySidebarWidget().reInit();
                }
            }, 600);
        };

        var eltdInitHtmlGalleryNewContent = function(thisHolder, thisHolderInner, loadingItem, responseHtml) {
            loadingItem.removeClass('eltd-showing eltd-standard-pag-trigger');
            thisHolder.removeClass('eltd-bl-pag-standard-shortcodes-animate');
            thisHolderInner.html(responseHtml);
        };

        var eltdInitAppendIsotopeNewContent = function(thisHolderInner, loadingItem, responseHtml) {
            thisHolderInner.append(responseHtml).isotope('reloadItems').isotope({sortBy: 'original-order'});
            loadingItem.removeClass('eltd-showing');

            setTimeout(function() {
                thisHolderInner.isotope('layout');

                if (typeof eltd.modules.common.eltdStickySidebarWidget === 'function') {
                    eltd.modules.common.eltdStickySidebarWidget().reInit();
                }
            }, 600);
        };

        var eltdInitAppendGalleryNewContent = function(thisHolderInner, loadingItem, responseHtml) {
            loadingItem.removeClass('eltd-showing');
            thisHolderInner.append(responseHtml);
        };

        return {
            init: function() {
                if(holder.length) {
                    holder.each(function() {
                        var thisHolder = $(this);

                        if(thisHolder.hasClass('eltd-bl-pag-standard-shortcodes')) {
                            initStandardPagination(thisHolder);
                        }

                        if(thisHolder.hasClass('eltd-bl-pag-load-more')) {
                            initLoadMorePagination(thisHolder);
                        }

                        if(thisHolder.hasClass('eltd-bl-pag-infinite-scroll')) {
                            initInifiteScrollPagination(thisHolder);
                        }
                    });
                }
            },
            scroll: function() {
                if(holder.length) {
                    holder.each(function() {
                        var thisHolder = $(this);

                        if(thisHolder.hasClass('eltd-bl-pag-infinite-scroll')) {
                            initInifiteScrollPagination(thisHolder);
                        }
                    });
                }
            }
        };
    }

})(jQuery);