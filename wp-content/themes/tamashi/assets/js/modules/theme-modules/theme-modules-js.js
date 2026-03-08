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
(function($) {
	"use strict";
	
	var header = {};
	eltd.modules.header = header;
	
	header.eltdSetDropDownMenuPosition     = eltdSetDropDownMenuPosition;
	header.eltdSetDropDownWideMenuPosition = eltdSetDropDownWideMenuPosition;
	
	header.eltdOnDocumentReady = eltdOnDocumentReady;
	header.eltdOnWindowLoad = eltdOnWindowLoad;
	
	$(document).ready(eltdOnDocumentReady);
	$(window).load(eltdOnWindowLoad);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdSetDropDownMenuPosition();
		eltdDropDownMenu();
	}
	
	/*
	 All functions to be called on $(window).load() should be in this function
	 */
	function eltdOnWindowLoad() {
		eltdSetDropDownWideMenuPosition();
	}
	
	/**
	 * Set dropdown position
	 */
	function eltdSetDropDownMenuPosition() {
		var menuItems = $('.eltd-drop-down > ul > li.narrow.menu-item-has-children');
		
		if (menuItems.length) {
			menuItems.each(function (i) {
				var thisItem = $(this),
					menuItemPosition = thisItem.offset().left,
					dropdownHolder = thisItem.find('.second'),
					dropdownMenuItem = dropdownHolder.find('.inner ul'),
					dropdownMenuWidth = dropdownMenuItem.outerWidth(),
					menuItemFromLeft = eltd.windowWidth - menuItemPosition;
				
				if (eltd.body.hasClass('eltd-boxed')) {
					menuItemFromLeft = eltd.boxedLayoutWidth - (menuItemPosition - (eltd.windowWidth - eltd.boxedLayoutWidth ) / 2);
				}
				
				var dropDownMenuFromLeft; //has to stay undefined beacuse 'dropDownMenuFromLeft < dropdownMenuWidth' condition will be true
				
				if (thisItem.find('li.sub').length > 0) {
					dropDownMenuFromLeft = menuItemFromLeft - dropdownMenuWidth;
				}
				
				dropdownHolder.removeClass('right');
				dropdownMenuItem.removeClass('right');
				if (menuItemFromLeft < dropdownMenuWidth || dropDownMenuFromLeft < dropdownMenuWidth) {
					dropdownHolder.addClass('right');
					dropdownMenuItem.addClass('right');
				}
			});
		}
	}
	
	/**
	 * Set dropdown wide position
	 */
	function eltdSetDropDownWideMenuPosition(){
		var menuItems = $(".eltd-drop-down > ul > li.wide");
		
		if(menuItems.length) {
			menuItems.each( function(i) {
				var menuItemSubMenu = $(menuItems[i]).find('.second');
				
				if(menuItemSubMenu.length && !menuItemSubMenu.hasClass('left_position') && !menuItemSubMenu.hasClass('right_position')) {
					menuItemSubMenu.css('left', 0);
					
					var left_position = menuItemSubMenu.offset().left;
					
					if(eltd.body.hasClass('eltd-boxed')) {
						var boxedWidth = $('.eltd-boxed .eltd-wrapper .eltd-wrapper-inner').outerWidth();
						left_position = left_position - (eltd.windowWidth - boxedWidth) / 2;
						
						menuItemSubMenu.css('left', -left_position);
						menuItemSubMenu.css('width', boxedWidth);
					} else {
						menuItemSubMenu.css('left', -left_position);
						menuItemSubMenu.css('width', eltd.windowWidth);
					}
				}
			});
		}
	}
	
	function eltdDropDownMenu() {
		var menu_items = $('.eltd-drop-down > ul > li');
		
		menu_items.each(function(i) {
			if($(menu_items[i]).find('.second').length > 0) {
				var thisItem = $(menu_items[i]),
					dropDownSecondDiv = thisItem.find('.second');
				
				if(thisItem.hasClass('wide')) {
					//set columns to be same height - start
					var tallest = 0,
						dropDownSecondItem = $(this).find('.second > .inner > ul > li');
					
					dropDownSecondItem.each(function() {
						var thisHeight = $(this).height();
						if(thisHeight > tallest) {
							tallest = thisHeight;
						}
					});
					
					dropDownSecondItem.css('height', ''); // delete old inline css - via resize
					dropDownSecondItem.height(tallest);
					//set columns to be same height - end
				}
				
				if(!eltd.menuDropdownHeightSet) {
					thisItem.data('original_height', dropDownSecondDiv.height() + 'px');
					dropDownSecondDiv.height(0);
				}
				
				if(navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
					thisItem.on("touchstart mouseenter", function() {
						dropDownSecondDiv.css({
							'height': thisItem.data('original_height'),
							'overflow': 'visible',
							'visibility': 'visible',
							'opacity': '1'
						});
					}).on("mouseleave", function() {
						dropDownSecondDiv.css({
							'height': '0px',
							'overflow': 'hidden',
							'visibility': 'hidden',
							'opacity': '0'
						});
					});
				} else {
					if(eltd.body.hasClass('eltd-dropdown-animate-height')) {
						thisItem.mouseenter(function() {
							dropDownSecondDiv.css({
								'visibility': 'visible',
								'height': '0px',
								'opacity': '0'
							});
							dropDownSecondDiv.stop().animate({
								'height': thisItem.data('original_height'),
								opacity: 1
							}, 300, function() {
								dropDownSecondDiv.css('overflow', 'visible');
							});
						}).mouseleave(function() {
							dropDownSecondDiv.stop().animate({
								'height': '0px'
							}, 150, function() {
								dropDownSecondDiv.css({
									'overflow': 'hidden',
									'visibility': 'hidden'
								});
							});
						});
					} else {
						var config = {
							interval: 0,
							over: function() {
								setTimeout(function() {
									dropDownSecondDiv.addClass('eltd-drop-down-start');
									dropDownSecondDiv.stop().css({'height': thisItem.data('original_height')});
								}, 150);
							},
							timeout: 150,
							out: function() {
								dropDownSecondDiv.stop().css({'height': '0px'});
								dropDownSecondDiv.removeClass('eltd-drop-down-start');
							}
						};
						thisItem.hoverIntent(config);
					}
				}
			}
		});
		
		$('.eltd-drop-down ul li.wide ul li a').on('click', function(e) {
			if (e.which == 1){
				var $this = $(this);
				setTimeout(function() {
					$this.mouseleave();
				}, 500);
			}
		});
		
		eltd.menuDropdownHeightSet = true;
	}
	
})(jQuery);
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

(function($) {
    'use strict';

    var woocommerce = {};
    eltd.modules.woocommerce = woocommerce;

    woocommerce.eltdOnDocumentReady = eltdOnDocumentReady;
    woocommerce.eltdOnWindowLoad = eltdOnWindowLoad;
    woocommerce.eltdOnWindowResize = eltdOnWindowResize;

    $(document).ready(eltdOnDocumentReady);
    $(window).load(eltdOnWindowLoad);
    $(window).resize(eltdOnWindowResize);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltdInitQuantityButtons();
        eltdInitSelect2();
	    eltdInitSingleProductLightbox();
	    eltdRemoveArrowOnProductList();
    }

    /* 
        All functions to be called on $(window).load() should be in this function
    */
    function eltdOnWindowLoad() {
        eltdInitProductListMasonryShortcode();
    }

    /* 
        All functions to be called on $(window).resize() should be in this function
    */
    function eltdOnWindowResize() {
        eltdInitProductListMasonryShortcode();
    }
	
    /*
    ** Init quantity buttons to increase/decrease products for cart
    */
	function eltdInitQuantityButtons() {
		$(document).on('click', '.eltd-quantity-minus, .eltd-quantity-plus', function (e) {
			e.stopPropagation();
			
			var button = $(this),
				inputField = button.siblings('.eltd-quantity-input'),
				step = parseFloat(inputField.data('step')),
				max = parseFloat(inputField.data('max')),
				minus = false,
				inputValue = parseFloat(inputField.val()),
				newInputValue;
			
			if (button.hasClass('eltd-quantity-minus')) {
				minus = true;
			}
			
			if (minus) {
				newInputValue = inputValue - step;
				if (newInputValue >= 1) {
					inputField.val(newInputValue);
				} else {
					inputField.val(0);
				}
			} else {
				newInputValue = inputValue + step;
				if (max === undefined) {
					inputField.val(newInputValue);
				} else {
					if (newInputValue >= max) {
						inputField.val(max);
					} else {
						inputField.val(newInputValue);
					}
				}
			}
			
			inputField.trigger('change');
		});
	}

    /*
    ** Init select2 script for select html dropdowns
    */
	function eltdInitSelect2() {
		var orderByDropDown = $('.woocommerce-ordering .orderby');
		if (orderByDropDown.length) {
			orderByDropDown.select2({
				minimumResultsForSearch: Infinity
			});
		}
		
		var variableProducts = $('.eltd-woocommerce-page .eltd-content .variations td.value select');
		if (variableProducts.length) {
			variableProducts.select2();
		}
		
		var shippingCountryCalc = $('#calc_shipping_country');
		if (shippingCountryCalc.length) {
			shippingCountryCalc.select2();
		}
		
		var shippingStateCalc = $('.cart-collaterals .shipping select#calc_shipping_state');
		if (shippingStateCalc.length) {
			shippingStateCalc.select2();
		}
	}
	
	/*
	 ** Init Product Single Pretty Photo attributes
	 */
	function eltdInitSingleProductLightbox() {
		var item = $('.eltd-woo-single-page.eltd-woo-single-has-pretty-photo .images .woocommerce-product-gallery__image');
		
		if(item.length) {
			item.children('a').attr('data-rel', 'prettyPhoto[woo_single_pretty_photo]');
			
			if (typeof eltd.modules.common.eltdPrettyPhoto === "function") {
				eltd.modules.common.eltdPrettyPhoto();
			}
		}
	}
	
	/*
	 ** Init Product List Masonry Shortcode Layout
	 */
	function eltdInitProductListMasonryShortcode() {
		var container = $('.eltd-pl-holder.eltd-masonry-layout .eltd-pl-outer');
		
		if (container.length) {
			container.each(function () {
				var thisContainer = $(this);
				
				thisContainer.waitForImages(function () {
					thisContainer.isotope({
						itemSelector: '.eltd-pli',
						resizable: false,
						masonry: {
							columnWidth: '.eltd-pl-sizer',
							gutter: '.eltd-pl-gutter'
						}
					});
					
					setTimeout(function () {
						if (typeof eltd.modules.common.eltdInitParallax === "function") {
							eltd.modules.common.eltdInitParallax();
						}
					}, 1000);
					
					thisContainer.isotope('layout').css('opacity', 1);
				});
			});
		}
	}

	function eltdRemoveArrowOnProductList() {
		$('a.eltd-button-product-list').on('click', function(){
			$(this).prev().addClass('remove');
		})
	}

})(jQuery);
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
(function($) {
    "use strict";

    var headerMinimal = {};
    eltd.modules.headerMinimal = headerMinimal;
	
	headerMinimal.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltdFullscreenMenu();
    }

    /**
     * Init Fullscreen Menu
     */
    function eltdFullscreenMenu() {
	    var popupMenuOpener = $( 'a.eltd-fullscreen-menu-opener');
	    
        if (popupMenuOpener.length) {
            var popupMenuHolderOuter = $(".eltd-fullscreen-menu-holder-outer"),
                cssClass,
            //Flags for type of animation
                fadeRight = false,
                fadeTop = false,
            //Widgets
                widgetAboveNav = $('.eltd-fullscreen-above-menu-widget-holder'),
                widgetBelowNav = $('.eltd-fullscreen-below-menu-widget-holder'),
            //Menu
                menuItems = $('.eltd-fullscreen-menu-holder-outer nav > ul > li > a'),
                menuItemWithChild =  $('.eltd-fullscreen-menu > ul li.has_sub > a'),
                menuItemWithoutChild = $('.eltd-fullscreen-menu ul li:not(.has_sub) a');

            //set height of popup holder and initialize perfectScrollbar
            popupMenuHolderOuter.perfectScrollbar({
                wheelSpeed: 0.6,
                suppressScrollX: true
            });

            //set height of popup holder on resize
            $(window).resize(function() {
                popupMenuHolderOuter.height(eltd.windowHeight);
            });

            if (eltd.body.hasClass('eltd-fade-push-text-right')) {
                cssClass = 'eltd-push-nav-right';
                fadeRight = true;
            } else if (eltd.body.hasClass('eltd-fade-push-text-top')) {
                cssClass = 'eltd-push-text-top';
                fadeTop = true;
            }

            //Appearing animation
            if (fadeRight || fadeTop) {
                if (widgetAboveNav.length) {
                    widgetAboveNav.children().css({
                        '-webkit-animation-delay' : 0 + 'ms',
                        '-moz-animation-delay' : 0 + 'ms',
                        'animation-delay' : 0 + 'ms'
                    });
                }
                menuItems.each(function(i) {
                    $(this).css({
                        '-webkit-animation-delay': (i+1) * 70 + 'ms',
                        '-moz-animation-delay': (i+1) * 70 + 'ms',
                        'animation-delay': (i+1) * 70 + 'ms'
                    });
                });
                if (widgetBelowNav.length) {
                    widgetBelowNav.children().css({
                        '-webkit-animation-delay' : (menuItems.length + 1)*70 + 'ms',
                        '-moz-animation-delay' : (menuItems.length + 1)*70 + 'ms',
                        'animation-delay' : (menuItems.length + 1)*70 + 'ms'
                    });
                }
            }

            // Open popup menu
            popupMenuOpener.on('click',function(e){
                e.preventDefault();

                if (!popupMenuOpener.hasClass('eltd-fm-opened')) {
                    popupMenuOpener.addClass('eltd-fm-opened');
                    eltd.body.removeClass('eltd-fullscreen-fade-out').addClass('eltd-fullscreen-menu-opened eltd-fullscreen-fade-in');
                    eltd.body.removeClass(cssClass);
                    eltd.modules.common.eltdDisableScroll();
                    
                    $(document).keyup(function(e){
                        if (e.keyCode == 27 ) {
                            popupMenuOpener.removeClass('eltd-fm-opened');
                            eltd.body.removeClass('eltd-fullscreen-menu-opened eltd-fullscreen-fade-in').addClass('eltd-fullscreen-fade-out');
                            eltd.body.addClass(cssClass);
                            eltd.modules.common.eltdEnableScroll();

                            $("nav.eltd-fullscreen-menu ul.sub_menu").slideUp(200);
                        }
                    });
                } else {
                    popupMenuOpener.removeClass('eltd-fm-opened');
                    eltd.body.removeClass('eltd-fullscreen-menu-opened eltd-fullscreen-fade-in').addClass('eltd-fullscreen-fade-out');
                    eltd.body.addClass(cssClass);
                    eltd.modules.common.eltdEnableScroll();

                    $("nav.eltd-fullscreen-menu ul.sub_menu").slideUp(200);
                }
            });

            //logic for open sub menus in popup menu
            menuItemWithChild.on('tap click', function(e) {
                e.preventDefault();

                var thisItem = $(this),
	                thisItemParent = thisItem.parent(),
					thisItemParentSiblingsWithDrop = thisItemParent.siblings('.menu-item-has-children');

                if (thisItemParent.hasClass('has_sub')) {
	                var submenu = thisItemParent.find('> ul.sub_menu');
	
	                if (submenu.is(':visible')) {
		                submenu.slideUp(450, 'easeInOutQuint');
		                thisItemParent.removeClass('open_sub');
	                } else {
		                thisItemParent.addClass('open_sub');
		
		                if(thisItemParentSiblingsWithDrop.length === 0) {
			                submenu.slideDown(400, 'easeInOutQuint');
		                } else {
							thisItemParent.closest('li.menu-item').siblings().find('.menu-item').removeClass('open_sub');
			                thisItemParent.siblings().removeClass('open_sub').find('.sub_menu').slideUp(400, 'easeInOutQuint', function() {
				                submenu.slideDown(400, 'easeInOutQuint');
			                });
		                }
	                }
                }
                
                return false;
            });

            //if link has no submenu and if it's not dead, than open that link
            menuItemWithoutChild.click(function (e) {
                if(($(this).attr('href') !== "http://#") && ($(this).attr('href') !== "#")){
                    if (e.which == 1) {
                        popupMenuOpener.removeClass('eltd-fm-opened');
                        eltd.body.removeClass('eltd-fullscreen-menu-opened');
                        eltd.body.removeClass('eltd-fullscreen-fade-in').addClass('eltd-fullscreen-fade-out');
                        eltd.body.addClass(cssClass);
                        $("nav.eltd-fullscreen-menu ul.sub_menu").slideUp(200);
                        eltd.modules.common.eltdEnableScroll();
                    }
                } else {
                    return false;
                }
            });
        }
    }

})(jQuery);
(function($) {
    "use strict";

    var headerVertical = {};
    eltd.modules.headerVertical = headerVertical;
    
    headerVertical.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltdVerticalMenu().init();
    }

    /**
     * Function object that represents vertical menu area.
     * @returns {{init: Function}}
     */
    var eltdVerticalMenu = function() {
        var verticalMenuObject = $('.eltd-vertical-menu-area');
    
        /**
         * Resizes vertical area. Called whenever height of navigation area changes
         * It first check if vertical area is scrollable, and if it is resizes scrollable area
         */
        var resizeVerticalArea = function () {
            if (verticalAreaScrollable()) {
                verticalMenuObject.getNiceScroll().resize();
            }
        };
    
        /**
         * Checks if vertical area is scrollable (if it has eltd-with-scroll class)
         *
         * @returns {bool}
         */
        var verticalAreaScrollable = function () {
            return verticalMenuObject.hasClass('eltd-with-scroll');
        };
    
        /**
         * Initialzes navigation functionality. It checks navigation type data attribute and calls proper functions
         */
        var initNavigation = function () {
            var verticalNavObject = verticalMenuObject.find('.eltd-vertical-menu');

            dropdownFloat();
        
            /**
             * Initializes click toggle navigation type. Works the same for touch and no-touch devices
             */

            function dropdownFloat() {
                var menuItems = verticalNavObject.find('ul li.menu-item-has-children');
                var allDropdowns = menuItems.find(' > .second, > ul');

                menuItems.each(function() {
                    var elementToExpand = $(this).find(' > .second, > ul');
                    var menuItem = this;

                    if(Modernizr.touch) {
                        var dropdownOpener = $(this).find('> a');

                        dropdownOpener.on('click tap', function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if(elementToExpand.hasClass('eltd-float-open')) {
                                elementToExpand.removeClass('eltd-float-open');
                                $(menuItem).removeClass('open');
                            } else {
                                if(!$(this).parents('li').hasClass('open')) {
                                    menuItems.removeClass('open');
                                    allDropdowns.removeClass('eltd-float-open');
                                }

                                elementToExpand.addClass('eltd-float-open');
                                $(menuItem).addClass('open');
                            }
                        });
                    } else {
                        //must use hoverIntent because basic hover effect doesn't catch dropdown
                        //it doesn't start from menu item's edge
                        $(this).hoverIntent({
                            over: function() {
                                elementToExpand.addClass('eltd-float-open');
                                $(menuItem).addClass('open');
                            },
                            out: function() {
                                elementToExpand.removeClass('eltd-float-open');
                                $(menuItem).removeClass('open');
                            },
                            timeout: 300
                        });
                    }
                });
            }
        };

        /**
         * Initializes scrolling in vertical area. It checks if vertical area is scrollable before doing so
         */
        var initVerticalAreaScroll = function() {
            if(verticalAreaScrollable()) {
                verticalMenuObject.niceScroll({
                    scrollspeed: 60,
                    mousescrollstep: 40,
                    cursorwidth: 0,
                    cursorborder: 0,
                    cursorborderradius: 0,
                    cursorcolor: "transparent",
                    autohidemode: false,
                    horizrailenabled: false
                });
            }
        };

        var initHiddenVerticalArea = function() {
            var verticalLogo = $('.eltd-vertical-area-bottom-logo');
            var verticalMenuOpener = verticalMenuObject.find('.eltd-vertical-area-opener');
            var scrollPosition = 0;

            verticalMenuOpener.on('click tap', function() {
                if(isVerticalAreaOpen()) {
                    closeVerticalArea();
                } else {
                    openVerticalArea();
                }
            });

            $(window).scroll(function() {
                if(Math.abs($(window).scrollTop() - scrollPosition) > 400){
                    closeVerticalArea();
                }
            });

            /**
             * Closes vertical menu area by removing 'active' class on that element
             */
            function closeVerticalArea() {
                verticalMenuObject.removeClass('active');

                if(verticalLogo.length) {
                    verticalLogo.removeClass('active');
                }
            }

            /**
             * Opens vertical menu area by adding 'active' class on that element
             */
            function openVerticalArea() {
                verticalMenuObject.addClass('active');

                if(verticalLogo.length) {
                    verticalLogo.addClass('active');
                }
                scrollPosition = $(window).scrollTop();
            }

            function isVerticalAreaOpen() {
                return verticalMenuObject.hasClass('active');
            }
        };

        return {
            /**
             * Calls all necessary functionality for vertical menu area if vertical area object is valid
             */
            init: function() {
                if(verticalMenuObject.length) {
                    initNavigation();
                    initVerticalAreaScroll();

                    if(eltd.body.hasClass('eltd-header-vertical-closed')) {
                        initHiddenVerticalArea();
                    }
                }
            }
        };
    };

})(jQuery);
(function($) {
    "use strict";

    var headerVerticalSliding = {};
    eltd.modules.headerVerticalSliding = headerVerticalSliding;
	
	headerVerticalSliding.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltdVerticalSlidingMenu().init();
    }

    /**
     * Function object that represents vertical menu area.
     * @returns {{init: Function}}
     */
    var eltdVerticalSlidingMenu = function() {
	    var verticalMenuObject = $('.eltd-header-vertical-sliding .eltd-vertical-menu-area');
	
	    var initNavigation = function () {
		    var varticalMenuOpener = verticalMenuObject.find('.eltd-vertical-menu-opener a'),
			    verticalMenuNavHolder = verticalMenuObject.find('.eltd-vertical-menu-nav-holder-outer'),
			    menuItemWithChild = verticalMenuObject.find('.eltd-fullscreen-menu > ul li.has_sub > a'),
			    menuItemWithoutChild = verticalMenuObject.find('.eltd-fullscreen-menu ul li:not(.has_sub) a');
		
		    //set height of vertical menu holder and initialize perfectScrollbar
		    verticalMenuNavHolder.height(eltd.windowHeight);
            verticalMenuNavHolder.perfectScrollbar({
                wheelSpeed: 0.6,
                suppressScrollX: true
            });
		
		    //set height of vertical menu holder on resize
		    $(window).resize(function () {
			    verticalMenuNavHolder.height(eltd.windowHeight);
		    });
		
		    varticalMenuOpener.on('click', function (e) {
			    e.preventDefault();
			
			    if (!verticalMenuNavHolder.hasClass('active')) {
				    verticalMenuNavHolder.addClass('active');
				    verticalMenuObject.addClass('opened');
				    if (!eltd.body.hasClass('page-template-full_screen-php')) {
					    eltd.modules.common.eltdDisableScroll();
				    }
			    } else {
				    verticalMenuNavHolder.removeClass('active');
				    verticalMenuObject.removeClass('opened');
				    if (!eltd.body.hasClass('page-template-full_screen-php')) {
					    eltd.modules.common.eltdEnableScroll();
				    }
			    }
		    });
		
		    $('.eltd-content').on('click', function () {
			    if (verticalMenuNavHolder.hasClass('active')) {
				    verticalMenuNavHolder.removeClass('active');
				    verticalMenuObject.removeClass('opened');
				    if (!eltd.body.hasClass('page-template-full_screen-php')) {
					    eltd.modules.common.eltdEnableScroll();
				    }
			    }
		    });
		
		    //logic for open sub menus in popup menu
		    menuItemWithChild.on('tap click', function (e) {
			    e.preventDefault();
			
			    if ($(this).parent().hasClass('has_sub')) {
				    var submenu = $(this).parent().find('> ul.sub_menu');
				    
				    if (submenu.is(':visible')) {
					    submenu.slideUp(200);
					    $(this).parent().removeClass('open_sub');
				    } else {
					    if ($(this).parent().siblings().hasClass('open_sub')) {
						    $(this).parent().siblings().each(function () {
							    var sibling = $(this);
							    if (sibling.hasClass('open_sub')) {
								    var openedUl = sibling.find('> ul.sub_menu');
								    openedUl.slideUp(200);
								    sibling.removeClass('open_sub');
							    }
							    if (sibling.find('.open_sub')) {
								    var openedUlUl = sibling.find('.open_sub').find('> ul.sub_menu');
								    openedUlUl.slideUp(200);
								    sibling.find('.open_sub').removeClass('open_sub');
							    }
						    });
					    }
					
					    $(this).parent().addClass('open_sub');
					    submenu.slideDown(200);
				    }
			    }
			    return false;
		    });
		
	    };
	
	    return {
		    /**
		     * Calls all necessary functionality for vertical menu area if vertical area object is valid
		     */
		    init: function () {
			    if (verticalMenuObject.length) {
				    initNavigation();
				
			    }
		    }
	    };
    };

})(jQuery);
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
(function($) {
    "use strict";

    var stickyHeader = {};
    eltd.modules.stickyHeader = stickyHeader;
	
	stickyHeader.isStickyVisible = false;
	stickyHeader.stickyAppearAmount = 0;
	stickyHeader.behaviour = '';
	
	stickyHeader.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
	    if(eltd.windowWidth > 1024) {
		    eltdHeaderBehaviour();
	    }
    }

    /*
     **	Show/Hide sticky header on window scroll
     */
    function eltdHeaderBehaviour() {
        var header = $('.eltd-page-header'),
	        stickyHeader = $('.eltd-sticky-header'),
            fixedHeaderWrapper = $('.eltd-fixed-wrapper'),
	        fixedMenuArea = fixedHeaderWrapper.children('.eltd-menu-area'),
	        fixedMenuAreaHeight = fixedMenuArea.outerHeight(),
            sliderHolder = $('.eltd-slider'),
            revSliderHeight = sliderHolder.length ? sliderHolder.outerHeight() : 0,
	        stickyAppearAmount,
	        headerAppear;
        
        var headerMenuAreaOffset = fixedHeaderWrapper.length ? fixedHeaderWrapper.offset().top - eltdGlobalVars.vars.eltdAddForAdminBar : 0;

        switch(true) {
            // sticky header that will be shown when user scrolls up
            case eltd.body.hasClass('eltd-sticky-header-on-scroll-up'):
                eltd.modules.stickyHeader.behaviour = 'eltd-sticky-header-on-scroll-up';
                var docYScroll1 = $(document).scrollTop();
                stickyAppearAmount = parseInt(eltdGlobalVars.vars.eltdTopBarHeight) + parseInt(eltdGlobalVars.vars.eltdLogoAreaHeight) + parseInt(eltdGlobalVars.vars.eltdMenuAreaHeight) + parseInt(eltdGlobalVars.vars.eltdStickyHeaderHeight);
	            
                headerAppear = function(){
                    var docYScroll2 = $(document).scrollTop();
					
                    if((docYScroll2 > docYScroll1 && docYScroll2 > stickyAppearAmount) || (docYScroll2 < stickyAppearAmount)) {
                        eltd.modules.stickyHeader.isStickyVisible = false;
                        stickyHeader.removeClass('header-appear').find('.eltd-main-menu .second').removeClass('eltd-drop-down-start');
                        eltd.body.removeClass('eltd-sticky-header-appear');
                    } else {
                        eltd.modules.stickyHeader.isStickyVisible = true;
                        stickyHeader.addClass('header-appear');
	                    eltd.body.addClass('eltd-sticky-header-appear');
                    }

                    docYScroll1 = $(document).scrollTop();
                };
                headerAppear();

                $(window).scroll(function() {
                    headerAppear();
                });

                break;

            // sticky header that will be shown when user scrolls both up and down
            case eltd.body.hasClass('eltd-sticky-header-on-scroll-down-up'):
                eltd.modules.stickyHeader.behaviour = 'eltd-sticky-header-on-scroll-down-up';

                if(eltdPerPageVars.vars.eltdStickyScrollAmount !== 0){
                    eltd.modules.stickyHeader.stickyAppearAmount = parseInt(eltdPerPageVars.vars.eltdStickyScrollAmount);
                } else {
                    eltd.modules.stickyHeader.stickyAppearAmount = parseInt(eltdGlobalVars.vars.eltdTopBarHeight) + parseInt(eltdGlobalVars.vars.eltdLogoAreaHeight) + parseInt(eltdGlobalVars.vars.eltdMenuAreaHeight) + parseInt(revSliderHeight);
                }

                headerAppear = function(){
                    if(eltd.scroll < eltd.modules.stickyHeader.stickyAppearAmount) {
                        eltd.modules.stickyHeader.isStickyVisible = false;
                        stickyHeader.removeClass('header-appear').find('.eltd-main-menu .second').removeClass('eltd-drop-down-start');
	                    eltd.body.removeClass('eltd-sticky-header-appear');
                    }else{
                        eltd.modules.stickyHeader.isStickyVisible = true;
                        stickyHeader.addClass('header-appear');
	                    eltd.body.addClass('eltd-sticky-header-appear');
                    }
                };

                headerAppear();

                $(window).scroll(function() {
                    headerAppear();
                });

                break;

            // on scroll down, part of header will be sticky
            case eltd.body.hasClass('eltd-fixed-on-scroll'):
                eltd.modules.stickyHeader.behaviour = 'eltd-fixed-on-scroll';
                var headerFixed = function(){
	
	                if(eltd.scroll <= headerMenuAreaOffset) {
		                fixedHeaderWrapper.removeClass('fixed');
		                eltd.body.removeClass('eltd-fixed-header-appear');
		                fixedMenuArea.css({'height': fixedMenuAreaHeight + 'px'});
		                header.css('margin-bottom', '0');
	                } else {
		                fixedHeaderWrapper.addClass('fixed');
		                eltd.body.addClass('eltd-fixed-header-appear');
		                fixedMenuArea.css({'height': (fixedMenuAreaHeight - 30) + 'px'});
		                header.css('margin-bottom', (fixedMenuAreaHeight - 30) + 'px');
	                }
                };

                headerFixed();

                $(window).scroll(function() {
                    headerFixed();
                });

                break;
        }
    }

})(jQuery);
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

(function($) {
    "use strict";

    var searchFullscreen = {};
    eltd.modules.searchFullscreen = searchFullscreen;

    searchFullscreen.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
	    eltdSearchFullscreen();
    }
	
	/**
	 * Init Search Types
	 */
	function eltdSearchFullscreen() {
        if ( eltd.body.hasClass( 'eltd-fullscreen-search' ) ) {

            var searchOpener = $('a.eltd-search-opener');

            if (searchOpener.length > 0) {

                var searchHolder = $('.eltd-fullscreen-search-holder'),
                    searchClose = $('.eltd-fullscreen-search-close');

                searchOpener.click(function (e) {
                    e.preventDefault();

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

                    //Close on click away
                    $(document).mouseup(function (e) {
                        var container = $(".eltd-form-holder-inner");

                        if (!container.is(e.target) && container.has(e.target).length === 0) {
                            e.preventDefault();
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

                //Text input focus change
                var inputSearchField = $('.eltd-fullscreen-search-holder .eltd-search-field'),
                    inputSearchLine = $('.eltd-fullscreen-search-holder .eltd-field-holder .eltd-line');

                inputSearchField.focus(function () {
                    inputSearchLine.css('width', '100%');
                });

                inputSearchField.blur(function () {
                    inputSearchLine.css('width', '0');
                });
            }
        }
	}

})(jQuery);

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
