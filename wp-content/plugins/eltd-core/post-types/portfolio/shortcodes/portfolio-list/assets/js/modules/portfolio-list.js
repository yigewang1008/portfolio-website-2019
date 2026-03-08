(function($) {
    'use strict';

    var portfolioList = {};
    eltd.modules.portfolioList = portfolioList;

    portfolioList.eltdOnDocumentReady = eltdOnDocumentReady;
    portfolioList.eltdOnWindowLoad = eltdOnWindowLoad;
    portfolioList.eltdOnWindowResize = eltdOnWindowResize;
    portfolioList.eltdOnWindowScroll = eltdOnWindowScroll;

    $(document).ready(eltdOnDocumentReady);
    $(window).load(eltdOnWindowLoad);
    $(window).resize(eltdOnWindowResize);
    $(window).scroll(eltdOnWindowScroll);
    
    /* 
     All functions to be called on $(document).ready() should be in this function
     */
    function eltdOnDocumentReady() {
        eltdInitPortfolioFollowsInfo();
        eltdInitPortfolioFullscreenSliderHeight();
    }

    /*
     All functions to be called on $(window).load() should be in this function
     */
    function eltdOnWindowLoad() {
        eltdInitPortfolioMasonry();
        eltdInitPortfolioFilter();
        eltdInitPortfolioListAnimation();
	    eltdInitPortfolioPagination().init();
    }

    /*
     All functions to be called on $(window).resize() should be in this function
     */
    function eltdOnWindowResize() {
        eltdInitPortfolioMasonry();
    }

    /*
     All functions to be called on $(window).scroll() should be in this function
     */
    function eltdOnWindowScroll() {
	    eltdInitPortfolioPagination().scroll();
    }

    /**
     * Initializes portfolio list article animation
     */
    function eltdInitPortfolioListAnimation(){
        var portList = $('.eltd-portfolio-list-holder.eltd-pl-has-animation');

        if(portList.length){
            portList.each(function(){
                var thisPortList = $(this).children('.eltd-pl-inner');

                thisPortList.children('article').each(function(l) {
                    var thisArticle = $(this);

                    thisArticle.appear(function() {
                        thisArticle.addClass('eltd-item-show');

                        setTimeout(function(){
                            thisArticle.addClass('eltd-item-shown');
                        }, 1000);
                    },{accX: 0, accY: 0});
                });
            });
        }
    }

    /**
     * Initializes portfolio list
     */
    function eltdInitPortfolioMasonry(){
        var portList = $('.eltd-portfolio-list-holder.eltd-pl-masonry');

        if(portList.length){
            portList.each(function(){
                var thisPortList = $(this),
                    masonry = thisPortList.children('.eltd-pl-inner'),
                    size = thisPortList.find('.eltd-pl-grid-sizer').width();
                
                eltdResizePortfolioItems(size, thisPortList);

                masonry.isotope({
                    layoutMode: 'packery',
                    itemSelector: 'article',
                    percentPosition: true,
                    packery: {
                        gutter: '.eltd-pl-grid-gutter',
                        columnWidth: '.eltd-pl-grid-sizer'
                    }
                });
                
                setTimeout(function () {
	                eltd.modules.common.eltdInitParallax();
                }, 600);

                masonry.css('opacity', '1');
            });
        }
    }

    /**
     * Init Resize Portfolio Items
     */
    function eltdResizePortfolioItems(size,container){
        if(container.hasClass('eltd-pl-images-fixed')) {
            var padding = parseInt(container.find('article').css('padding-left')),
                defaultMasonryItem = container.find('.eltd-pl-masonry-default'),
                largeWidthMasonryItem = container.find('.eltd-pl-masonry-large-width'),
                largeHeightMasonryItem = container.find('.eltd-pl-masonry-large-height'),
                largeWidthHeightMasonryItem = container.find('.eltd-pl-masonry-large-width-height');

            if (eltd.windowWidth > 680) {
                defaultMasonryItem.css('height', size - 2 * padding);
                largeHeightMasonryItem.css('height', Math.round(2 * size) - 2 * padding);
                largeWidthHeightMasonryItem.css('height', Math.round(2 * size) - 2 * padding);
                largeWidthMasonryItem.css('height', size - 2 * padding);
            } else {
                defaultMasonryItem.css('height', size);
                largeHeightMasonryItem.css('height', size);
                largeWidthHeightMasonryItem.css('height', size);
                largeWidthMasonryItem.css('height', Math.round(size / 2));
            }
        } else if(container.data('enable-fixed-proportions') == 'no' && container.data('enable-equal-height') == 'yes') {
            var padding = parseInt(container.find('article').css('padding-left')),
                defaultMasonryItem = container.find('.eltd-pl-masonry-default'),
                largeWidthMasonryItem = container.find('.eltd-pl-masonry-large-width');
            if (eltd.windowWidth > 680) {
                if(largeWidthMasonryItem.height() > defaultMasonryItem.height()) {
                    defaultMasonryItem.css('height', largeWidthMasonryItem.height());
                    largeWidthMasonryItem.css('height', largeWidthMasonryItem.height());
                } else {
                    largeWidthMasonryItem.css('height', defaultMasonryItem.height());
                    defaultMasonryItem.css('height', defaultMasonryItem.height());
                }
            } 
        }
    }

    /**
     * Initializes portfolio masonry filter
     */
    function eltdInitPortfolioFilter(){
        var filterHolder = $('.eltd-portfolio-list-holder .eltd-pl-filter-holder');

        if(filterHolder.length){
            filterHolder.each(function(){
                var thisFilterHolder = $(this),
                    thisPortListHolder = thisFilterHolder.closest('.eltd-portfolio-list-holder'),
                    thisPortListInner = thisPortListHolder.find('.eltd-pl-inner'),
                    portListHasLoadMore = thisPortListHolder.hasClass('eltd-pl-pag-load-more') ? true : false;

                thisFilterHolder.find('.eltd-pl-filter:first').addClass('eltd-pl-current');
	            
	            if(thisPortListHolder.hasClass('eltd-pl-gallery')) {
		            thisPortListInner.isotope();
	            }

                thisFilterHolder.find('.eltd-pl-filter').click(function(){
                    var thisFilter = $(this),
                        filterValue = thisFilter.attr('data-filter'),
                        filterClassName = filterValue.length ? filterValue.substring(1) : '',
	                    portListHasArticles = thisPortListInner.children().hasClass(filterClassName) ? true : false;

                    thisFilter.parent().children('.eltd-pl-filter').removeClass('eltd-pl-current');
                    thisFilter.addClass('eltd-pl-current');
	
	                if(portListHasLoadMore && !portListHasArticles && filterValue.length) {
		                eltdInitLoadMoreItemsPortfolioFilter(thisPortListHolder, filterValue, filterClassName);
	                } else {
		                filterValue = filterValue.length === 0 ? '*' : filterValue;
                   
                        thisFilterHolder.parent().children('.eltd-pl-inner').isotope({ filter: filterValue });
	                    eltd.modules.common.eltdInitParallax();
                    }
                });
            });
        }
    }

    /**
     * Initializes load more items if portfolio masonry filter item is empty
     */
    function eltdInitLoadMoreItemsPortfolioFilter($portfolioList, $filterValue, $filterClassName) {
        var thisPortList = $portfolioList,
            thisPortListInner = thisPortList.find('.eltd-pl-inner'),
            filterValue = $filterValue,
            filterClassName = $filterClassName,
            maxNumPages = 0;

        if (typeof thisPortList.data('max-num-pages') !== 'undefined' && thisPortList.data('max-num-pages') !== false) {
            maxNumPages = thisPortList.data('max-num-pages');
        }

        var	loadMoreDatta = eltd.modules.common.getLoadMoreData(thisPortList),
            nextPage = loadMoreDatta.nextPage,
	        ajaxData = eltd.modules.common.setLoadMoreAjaxData(loadMoreDatta, 'eltd_core_portfolio_ajax_load_more'),
            loadingItem = thisPortList.find('.eltd-pl-loading');

        if(nextPage <= maxNumPages) {
            loadingItem.addClass('eltd-showing eltd-filter-trigger');
            thisPortListInner.css('opacity', '0');

            $.ajax({
                type: 'POST',
                data: ajaxData,
                url: eltdGlobalVars.vars.eltdAjaxUrl,
                success: function (data) {
                    nextPage++;
                    thisPortList.data('next-page', nextPage);
                    var response = $.parseJSON(data),
                        responseHtml = response.html;

                    thisPortList.waitForImages(function () {
                        thisPortListInner.append(responseHtml).isotope('reloadItems').isotope({sortBy: 'original-order'});
                        var portListHasArticles = !!thisPortListInner.children().hasClass(filterClassName);

                        if(portListHasArticles) {
                            setTimeout(function() {
                                eltdResizePortfolioItems(thisPortListInner.find('.eltd-pl-grid-sizer').width(), thisPortList);
                                thisPortListInner.isotope('layout').isotope({filter: filterValue});
                                loadingItem.removeClass('eltd-showing eltd-filter-trigger');

                                setTimeout(function() {
                                    thisPortListInner.css('opacity', '1');
                                    eltdInitPortfolioListAnimation();
	                                eltd.modules.common.eltdInitParallax();
                                }, 150);
                            }, 400);
                        } else {
                            loadingItem.removeClass('eltd-showing eltd-filter-trigger');
                            eltdInitLoadMoreItemsPortfolioFilter(thisPortList, filterValue, filterClassName);
                        }
                    });
                }
            });
        }
    }
	
	/**
	 * Initializes portfolio pagination functions
	 */
	function eltdInitPortfolioPagination(){
		var portList = $('.eltd-portfolio-list-holder');
		
		var initStandardPagination = function(thisPortList) {
			var standardLink = thisPortList.find('.eltd-pl-standard-pagination li');
			
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
						
						initMainPagFunctionality(thisPortList, pagedLink);
					});
				});
			}
		};
		
		var initLoadMorePagination = function(thisPortList) {
			var loadMoreButton = thisPortList.find('.eltd-pl-load-more a');
			
			loadMoreButton.on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				initMainPagFunctionality(thisPortList);
			});
		};
		
		var initInifiteScrollPagination = function(thisPortList) {
			var portListHeight = thisPortList.outerHeight(),
				portListTopOffest = thisPortList.offset().top,
				portListPosition = portListHeight + portListTopOffest - eltdGlobalVars.vars.eltdAddForAdminBar;
			
			if(!thisPortList.hasClass('eltd-pl-infinite-scroll-started') && eltd.scroll + eltd.windowHeight > portListPosition) {
				initMainPagFunctionality(thisPortList);
			}
		};
		
		var initMainPagFunctionality = function(thisPortList, pagedLink) {
			var thisPortListInner = thisPortList.find('.eltd-pl-inner'),
				nextPage,
				maxNumPages;
			
			if (typeof thisPortList.data('max-num-pages') !== 'undefined' && thisPortList.data('max-num-pages') !== false) {
				maxNumPages = thisPortList.data('max-num-pages');
			}
			
			if(thisPortList.hasClass('eltd-pl-pag-standard')) {
				thisPortList.data('next-page', pagedLink);
			}
			
			if(thisPortList.hasClass('eltd-pl-pag-infinite-scroll')) {
				thisPortList.addClass('eltd-pl-infinite-scroll-started');
			}
			
			var loadMoreDatta = eltd.modules.common.getLoadMoreData(thisPortList),
				loadingItem = thisPortList.find('.eltd-pl-loading');
			
			nextPage = loadMoreDatta.nextPage;
			
			if(nextPage <= maxNumPages || maxNumPages == 0){
				if(thisPortList.hasClass('eltd-pl-pag-standard')) {
					loadingItem.addClass('eltd-showing eltd-standard-pag-trigger');
					thisPortList.addClass('eltd-pl-pag-standard-animate');
				} else {
					loadingItem.addClass('eltd-showing');
				}
				
				var ajaxData = eltd.modules.common.setLoadMoreAjaxData(loadMoreDatta, 'eltd_core_portfolio_ajax_load_more');
				
				$.ajax({
					type: 'POST',
					data: ajaxData,
					url: eltdGlobalVars.vars.eltdAjaxUrl,
					success: function (data) {
						if(!thisPortList.hasClass('eltd-pl-pag-standard')) {
							nextPage++;
						}
						
						thisPortList.data('next-page', nextPage);
						
						var response = $.parseJSON(data),
							responseHtml =  response.html;
						
						if(thisPortList.hasClass('eltd-pl-pag-standard')) {
							eltdInitStandardPaginationLinkChanges(thisPortList, maxNumPages, nextPage);
							
							thisPortList.waitForImages(function(){
								if(thisPortList.hasClass('eltd-pl-masonry')){
									eltdInitHtmlIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
								} else if (thisPortList.hasClass('eltd-pl-gallery') && thisPortList.hasClass('eltd-pl-has-filter')) {
									eltdInitHtmlIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
								} else {
									eltdInitHtmlGalleryNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
								}
							});
						} else {
							thisPortList.waitForImages(function(){
								if(thisPortList.hasClass('eltd-pl-masonry')){
								    if(pagedLink == 1) {
                                        eltdInitHtmlIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
                                    } else {
                                        eltdInitAppendIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
                                    }
								} else if (thisPortList.hasClass('eltd-pl-gallery') && thisPortList.hasClass('eltd-pl-has-filter') && pagedLink != 1) {
									eltdInitAppendIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
								} else {
								    if (pagedLink == 1) {
                                        eltdInitHtmlGalleryNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
                                    } else {
                                        eltdInitAppendGalleryNewContent(thisPortListInner, loadingItem, responseHtml);
                                    }
								}
							});
						}
						
						if(thisPortList.hasClass('eltd-pl-infinite-scroll-started')) {
							thisPortList.removeClass('eltd-pl-infinite-scroll-started');
						}
					}
				});
			}
			
			if(nextPage === maxNumPages){
				thisPortList.find('.eltd-pl-load-more-holder').hide();
			}
		};
		
		var eltdInitStandardPaginationLinkChanges = function(thisPortList, maxNumPages, nextPage) {
			var standardPagHolder = thisPortList.find('.eltd-pl-standard-pagination'),
				standardPagNumericItem = standardPagHolder.find('li.eltd-pl-pag-number'),
				standardPagPrevItem = standardPagHolder.find('li.eltd-pl-pag-prev a'),
				standardPagNextItem = standardPagHolder.find('li.eltd-pl-pag-next a');
			
			standardPagNumericItem.removeClass('eltd-pl-pag-active');
			standardPagNumericItem.eq(nextPage-1).addClass('eltd-pl-pag-active');
			
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
		
		var eltdInitHtmlIsotopeNewContent = function(thisPortList, thisPortListInner, loadingItem, responseHtml) {
            thisPortListInner.find('article').remove();
            thisPortListInner.append(responseHtml);
            eltdResizePortfolioItems(thisPortListInner.find('.eltd-pl-grid-sizer').width(), thisPortList);
            thisPortListInner.isotope('reloadItems').isotope({sortBy: 'original-order'});
			loadingItem.removeClass('eltd-showing eltd-standard-pag-trigger');
			thisPortList.removeClass('eltd-pl-pag-standard-animate');
			
			setTimeout(function() {
				thisPortListInner.isotope('layout');
				eltdInitPortfolioListAnimation();
				eltd.modules.common.eltdInitParallax();
			}, 600);
		};
		
		var eltdInitHtmlGalleryNewContent = function(thisPortList, thisPortListInner, loadingItem, responseHtml) {
			loadingItem.removeClass('eltd-showing eltd-standard-pag-trigger');
			thisPortList.removeClass('eltd-pl-pag-standard-animate');
			thisPortListInner.html(responseHtml);
			eltdInitPortfolioListAnimation();
			eltd.modules.common.eltdInitParallax();
		};
		
		var eltdInitAppendIsotopeNewContent = function(thisPortList, thisPortListInner, loadingItem, responseHtml) {
            thisPortListInner.append(responseHtml);
            eltdResizePortfolioItems(thisPortListInner.find('.eltd-pl-grid-sizer').width(), thisPortList);
            thisPortListInner.isotope('reloadItems').isotope({sortBy: 'original-order'});
			loadingItem.removeClass('eltd-showing');
			
			setTimeout(function() {
				thisPortListInner.isotope('layout');
				eltdInitPortfolioListAnimation();
				eltd.modules.common.eltdInitParallax();
			}, 600);
		};
		
		var eltdInitAppendGalleryNewContent = function(thisPortListInner, loadingItem, responseHtml) {
			loadingItem.removeClass('eltd-showing');
			thisPortListInner.append(responseHtml);
			eltdInitPortfolioListAnimation();
			eltd.modules.common.eltdInitParallax();
		};
		
		return {
			init: function() {
				if(portList.length) {
					portList.each(function() {
						var thisPortList = $(this);
						
						if(thisPortList.hasClass('eltd-pl-pag-standard')) {
							initStandardPagination(thisPortList);
						}
						
						if(thisPortList.hasClass('eltd-pl-pag-load-more')) {
							initLoadMorePagination(thisPortList);
						}
						
						if(thisPortList.hasClass('eltd-pl-pag-infinite-scroll')) {
							initInifiteScrollPagination(thisPortList);
						}
					});
				}
			},
			scroll: function() {
				if(portList.length) {
					portList.each(function() {
						var thisPortList = $(this);
						
						if(thisPortList.hasClass('eltd-pl-pag-infinite-scroll')) {
							initInifiteScrollPagination(thisPortList);
						}
					});
				}
			},
            getMainPagFunction: function(thisPortList, paged) {
                initMainPagFunctionality(thisPortList, paged);
            }
		};
	}

      /**
     * Initializes portfolio list follow info hover
     */
    function eltdInitPortfolioFollowsInfo() {
        var portList = $('.eltd-portfolio-list-holder.eltd-pl-info-follows-cursor .eltd-pl-inner');

        
        if (portList.length) {
            eltd.body.append('<div class="eltd-pl-follow-info-holder">\
                                <div class="eltd-pl-follow-info-inner">\
                                <span class="eltd-pl-follow-info-title"><h4>Title</h4></span>\
                                <span class="eltd-pl-follow-info-category"></span>\
                                </div>\
                                </div>');

            var followInfoHolder = $('.eltd-pl-follow-info-holder'),
                followInfoCategory = followInfoHolder.find('.eltd-pl-follow-info-category'),
                followInfoTitle = followInfoHolder.find('.eltd-pl-follow-info-title h4');
            
            portList.each(function () {
                var thisPortList = $(this);

                //info element position
                thisPortList.on('mousemove', function (e) {
                    followInfoHolder.css({
                        top: e.clientY,
                        left: e.clientX
                    });
                });

                //show/hide info element
                thisPortList.find('.eltd-pl-item').on('mouseenter', function () {
                    var thisArticleItem = $(this),
                        thisArticleItemTitle = thisArticleItem.find('.eltd-pli-title'),
                        thisArticleItemCategory = thisArticleItem.find('.eltd-pli-category-holder a'),
                        modifiedCategoryText = '';
                    
                    if(thisArticleItemTitle.length) {
                        followInfoTitle.text(thisArticleItemTitle.text());
                    }
                    
                    if(thisArticleItemCategory.length) {
                        thisArticleItemCategory.text(function(index, text) {
                            modifiedCategoryText += text;
                        });
                        
                        followInfoCategory.text(modifiedCategoryText);
                    }
                    
                    if (!followInfoHolder.hasClass('eltd-is-active')) {
                        followInfoHolder.addClass('eltd-is-active');
                    }
                }).on('mouseleave', function () {
                    if (followInfoHolder.hasClass('eltd-is-active')) {
                        followInfoHolder.removeClass('eltd-is-active');
                    }
                });

                //check if info element is below or above the targeted portfolio list
                $(window).scroll(function(){
                    if (followInfoHolder.hasClass('eltd-is-active')) {
                        if (followInfoHolder.offset().top < thisPortList.offset().top || followInfoHolder.offset().top > thisPortList.offset().top + thisPortList.outerHeight()) {
                            followInfoHolder.removeClass('eltd-is-active');
                        }
                    }
                });
            });
        }
    }

    function eltdInitPortfolioFullscreenSliderHeight() {
        var holder = $('.eltd-pl-fullscreen-slider');
        var items = holder.find('.owl-item');

        if(items.length) {
            items.each(function(){
                var item = $(this);

                if (eltdPerPageVars.vars.eltdHeaderTransparencyHeight == 0) {
                     item.css('height', eltd.windowHeight - eltdGlobalVars.vars.eltdTopBarHeight - eltdGlobalVars.vars.eltdAddForAdminBar - eltdGlobalVars.vars.eltdLogoAreaHeight);
                } else {
                     item.css('height', eltd.windowHeight - eltdGlobalVars.vars.eltdMenuAreaHeight - eltdGlobalVars.vars.eltdAddForAdminBar - eltdGlobalVars.vars.eltdLogoAreaHeight);
                }

                

            });
        }
    }

})(jQuery);