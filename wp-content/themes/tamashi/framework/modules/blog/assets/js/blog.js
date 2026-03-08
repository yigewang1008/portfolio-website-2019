(function($) {
	"use strict";

    var blog = {};
    eltd.modules.blog = blog;

    blog.eltdOnDocumentReady = eltdOnDocumentReady;
    blog.eltdOnWindowLoad = eltdOnWindowLoad;
    blog.eltdOnWindowResize = eltdOnWindowResize;
    blog.eltdOnWindowScroll = eltdOnWindowScroll;

    $(document).ready(eltdOnDocumentReady);
    $(window).load(eltdOnWindowLoad);
    $(window).resize(eltdOnWindowResize);
    $(window).scroll(eltdOnWindowScroll);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltdInitAudioPlayer();
        eltdInitBlogMasonry();
    }

    /* 
        All functions to be called on $(window).load() should be in this function
    */
    function eltdOnWindowLoad() {
	    eltdInitBlogPagination().init();
    }

    /* 
        All functions to be called on $(window).resize() should be in this function
    */
    function eltdOnWindowResize() {
        eltdInitBlogMasonry();
    }

    /* 
        All functions to be called on $(window).scroll() should be in this function
    */
    function eltdOnWindowScroll() {
	    eltdInitBlogPagination().scroll();
    }

    /**
    * Init audio player for Blog list and single pages
    */
    function eltdInitAudioPlayer() {
        var players = $('audio.eltd-blog-audio');

        players.mediaelementplayer({
            audioWidth: '100%'
        });
    }

    /**
     * Init Resize Blog Items
     */
    function eltdResizeBlogItems(size,container){

        if(container.hasClass('eltd-masonry-images-fixed')) {
            var padding = parseInt(container.find('article').css('padding-left')),
                defaultMasonryItem = container.find('.eltd-post-size-default'),
                largeWidthMasonryItem = container.find('.eltd-post-size-large-width'),
                largeHeightMasonryItem = container.find('.eltd-post-size-large-height'),
                largeWidthHeightMasonryItem = container.find('.eltd-post-size-large-width-height');

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
        }
    }

    /**
    * Init Blog Masonry Layout
    */
    function eltdInitBlogMasonry() {
	    var holder = $('.eltd-blog-holder.eltd-blog-type-masonry');
	
	    if(holder.length){
		    holder.each(function(){
			    var thisHolder = $(this),
				    masonry = thisHolder.children('.eltd-blog-holder-inner'),
                    size = thisHolder.find('.eltd-blog-masonry-grid-sizer').width();
			    
                eltdResizeBlogItems(size, thisHolder);
                
			    masonry.waitForImages(function() {
				    masonry.isotope({
					    layoutMode: 'packery',
					    itemSelector: 'article',
					    percentPosition: true,
					    packery: {
						    gutter: '.eltd-blog-masonry-grid-gutter',
						    columnWidth: '.eltd-blog-masonry-grid-sizer'
					    }
				    });
                    masonry.css('opacity', '1');
				
				    setTimeout(function() {
					    masonry.isotope('layout');
				    }, 800);
                });
		    });
	    }
    }
	
	/**
	 * Initializes blog pagination functions
	 */
	function eltdInitBlogPagination(){
		var holder = $('.eltd-blog-holder');
		
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
			
			if(!thisHolder.hasClass('eltd-blog-pagination-infinite-scroll-started') && eltd.scroll + eltd.windowHeight > blogListPosition) {
				initMainPagFunctionality(thisHolder);
			}
		};
		
		var initMainPagFunctionality = function(thisHolder) {
			var thisHolderInner = thisHolder.children('.eltd-blog-holder-inner'),
				nextPage,
				maxNumPages;
			
			if (typeof thisHolder.data('max-num-pages') !== 'undefined' && thisHolder.data('max-num-pages') !== false) {
				maxNumPages = thisHolder.data('max-num-pages');
			}
			
			if(thisHolder.hasClass('eltd-blog-pagination-infinite-scroll')) {
				thisHolder.addClass('eltd-blog-pagination-infinite-scroll-started');
			}
			
			var loadMoreDatta = eltd.modules.common.getLoadMoreData(thisHolder),
				loadingItem = thisHolder.find('.eltd-blog-pag-loading');
			
			nextPage = loadMoreDatta.nextPage;
			
			if(nextPage <= maxNumPages){
				loadingItem.addClass('eltd-showing');
				
				var ajaxData = eltd.modules.common.setLoadMoreAjaxData(loadMoreDatta, 'tamashi_elated_blog_load_more');
				
				$.ajax({
					type: 'POST',
					data: ajaxData,
					url: eltdGlobalVars.vars.eltdAjaxUrl,
					success: function (data) {
						nextPage++;
						
						thisHolder.data('next-page', nextPage);

						var response = $.parseJSON(data),
							responseHtml =  response.html;

						thisHolder.waitForImages(function(){
							if(thisHolder.hasClass('eltd-blog-type-masonry')){
								eltdInitAppendIsotopeNewContent(thisHolderInner, loadingItem, responseHtml);
                                eltdResizeBlogItems(thisHolderInner.find('.eltd-blog-masonry-grid-sizer').width(), thisHolder);
							} else {
								eltdInitAppendGalleryNewContent(thisHolderInner, loadingItem, responseHtml);
							}
							
							setTimeout(function() {
								eltdInitAudioPlayer();
								eltd.modules.common.eltdOwlSlider();
								eltd.modules.common.eltdFluidVideo();
                                eltd.modules.common.eltdInitSelfHostedVideoPlayer();
                                eltd.modules.common.eltdSelfHostedVideoSize();
								
								if (typeof eltd.modules.common.eltdStickySidebarWidget === 'function') {
									eltd.modules.common.eltdStickySidebarWidget().reInit();
								}

                                // Trigger event.
                                $( document.body ).trigger( 'blog_list_load_more_trigger' );

							}, 400);
						});
						
						if(thisHolder.hasClass('eltd-blog-pagination-infinite-scroll-started')) {
							thisHolder.removeClass('eltd-blog-pagination-infinite-scroll-started');
						}
					}
				});
			}
			
			if(nextPage === maxNumPages){
				thisHolder.find('.eltd-blog-pag-load-more').hide();
			}
		};
		
		var eltdInitAppendIsotopeNewContent = function(thisHolderInner, loadingItem, responseHtml) {
			thisHolderInner.append(responseHtml).isotope('reloadItems').isotope({sortBy: 'original-order'});
			loadingItem.removeClass('eltd-showing');
			
			setTimeout(function() {
				thisHolderInner.isotope('layout');
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
						
						if(thisHolder.hasClass('eltd-blog-pagination-load-more')) {
							initLoadMorePagination(thisHolder);
						}
						
						if(thisHolder.hasClass('eltd-blog-pagination-infinite-scroll')) {
							initInifiteScrollPagination(thisHolder);
						}
					});
				}
			},
			scroll: function() {
				if(holder.length) {
					holder.each(function() {
						var thisHolder = $(this);
						
						if(thisHolder.hasClass('eltd-blog-pagination-infinite-scroll')) {
							initInifiteScrollPagination(thisHolder);
						}
					});
				}
			}
		};
	}

})(jQuery);