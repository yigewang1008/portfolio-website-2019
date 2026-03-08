(function($) {
	"use strict";

    var common = {};
    eltd.modules.common = common;

    common.eltdFluidVideo = eltdFluidVideo;
    common.eltdEnableScroll = eltdEnableScroll;
    common.eltdDisableScroll = eltdDisableScroll;
    common.eltdgetScrollX = eltdgetScrollX;
    common.eltdgetScrollY = eltdgetScrollY;
    common.eltdOwlSlider = eltdOwlSlider;
    common.eltdInitParallax = eltdInitParallax;
    common.eltdInitSelfHostedVideoPlayer = eltdInitSelfHostedVideoPlayer;
    common.eltdSelfHostedVideoSize = eltdSelfHostedVideoSize;
    common.eltdPrettyPhoto = eltdPrettyPhoto;
	common.eltdStickySidebarWidget = eltdStickySidebarWidget;
    common.getLoadMoreData = getLoadMoreData;
    common.setLoadMoreAjaxData = setLoadMoreAjaxData;

    common.eltdOnDocumentReady = eltdOnDocumentReady;
    common.eltdOnWindowLoad = eltdOnWindowLoad;
    common.eltdOnWindowResize = eltdOnWindowResize;

    $(document).ready(eltdOnDocumentReady);
    $(window).load(eltdOnWindowLoad);
    $(window).resize(eltdOnWindowResize);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
	    eltdIconWithHover().init();
	    eltdDisableSmoothScrollForMac();
	    eltdInitAnchor().init();
	    eltdInitBackToTop();
	    eltdBackButtonShowHide();
	    eltdInitSelfHostedVideoPlayer();
	    eltdSelfHostedVideoSize();
	    eltdFluidVideo();
	    eltdOwlSlider();
	    eltdPreloadBackgrounds();
	    eltdPrettyPhoto();
	    eltdSearchPostTypeWidget();
    }

    /* 
        All functions to be called on $(window).load() should be in this function
    */
    function eltdOnWindowLoad() {
	    eltdInitParallax();
        eltdSmoothTransition();
	    eltdStickySidebarWidget().init();
    }

    /* 
        All functions to be called on $(window).resize() should be in this function
    */
    function eltdOnWindowResize() {
        eltdSelfHostedVideoSize();
    }
	
	/*
	 ** Disable smooth scroll for mac if smooth scroll is enabled
	 */
	function eltdDisableSmoothScrollForMac() {
		var os = navigator.appVersion.toLowerCase();
		
		if (os.indexOf('mac') > -1 && eltd.body.hasClass('eltd-smooth-scroll')) {
			eltd.body.removeClass('eltd-smooth-scroll');
		}
	}
	
	function eltdDisableScroll() {
		if (window.addEventListener) {
			window.addEventListener('DOMMouseScroll', eltdWheel, false);
		}
		
		window.onmousewheel = document.onmousewheel = eltdWheel;
		document.onkeydown = eltdKeydown;
	}
	
	function eltdEnableScroll() {
		if (window.removeEventListener) {
			window.removeEventListener('DOMMouseScroll', eltdWheel, false);
		}
		
		window.onmousewheel = document.onmousewheel = document.onkeydown = null;
	}

	function eltdgetScrollX() {
        return (window.pageXOffset != null) ? window.pageXOffset : (document.documentElement.scrollLeft != null) ? document.documentElement.scrollLeft : document.body.scrollLeft;
    }
    function eltdgetScrollY() {
        return (window.pageYOffset != null) ? window.pageYOffset : (document.documentElement.scrollTop != null) ? document.documentElement.scrollTop : document.body.scrollTop;
    }
	
	function eltdWheel(e) {
		eltdPreventDefaultValue(e);
	}
	
	function eltdKeydown(e) {
		var keys = [37, 38, 39, 40];
		
		for (var i = keys.length; i--;) {
			if (e.keyCode === keys[i]) {
				eltdPreventDefaultValue(e);
				return;
			}
		}
	}
	
	function eltdPreventDefaultValue(e) {
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
	}
	
	/*
	 **	Anchor functionality
	 */
	var eltdInitAnchor = function() {
		/**
		 * Set active state on clicked anchor
		 * @param anchor, clicked anchor
		 */
		var setActiveState = function(anchor){
			var headers = $('.eltd-main-menu, .eltd-mobile-nav, .eltd-fullscreen-menu');
			
			headers.each(function(){
				var currentHeader = $(this);
				
				if (anchor.parents(currentHeader).length) {
					currentHeader.find('.eltd-active-item').removeClass('eltd-active-item');
					anchor.parent().addClass('eltd-active-item');
					
					currentHeader.find('a').removeClass('current');
					anchor.addClass('current');
				}
			});
		};
		
		/**
		 * Check anchor active state on scroll
		 */
		var checkActiveStateOnScroll = function(){
			var anchorData = $('[data-eltd-anchor]'),
				anchorElement,
				siteURL = window.location.href.split('#')[0];
			
			if (siteURL.substr(-1) !== '/') {
				siteURL += '/';
			}
			
			anchorData.waypoint( function(direction) {
				if(direction === 'down') {
					if ($(this.element).length > 0) {
						anchorElement = $(this.element).data("eltd-anchor");
					} else {
						anchorElement = $(this).data("eltd-anchor");
					}
				
					setActiveState($("a[href='"+siteURL+"#"+anchorElement+"']"));
				}
			}, { offset: '50%' });
			
			anchorData.waypoint( function(direction) {
				if(direction === 'up') {
					if ($(this.element).length > 0) {
						anchorElement = $(this.element).data("eltd-anchor");
					} else {
						anchorElement = $(this).data("eltd-anchor");
					}
					
					setActiveState($("a[href='"+siteURL+"#"+anchorElement+"']"));
				}
			}, { offset: function(){
				return -($(this.element).outerHeight() - 150);
			} });
		};
		
		/**
		 * Check anchor active state on load
		 */
		var checkActiveStateOnLoad = function(){
			var hash = window.location.hash.split('#')[1];
			
			if(hash !== "" && $('[data-eltd-anchor="'+hash+'"]').length > 0){
				anchorClickOnLoad(hash);
			}
		};
		
		/**
		 * Handle anchor on load
		 */
		var anchorClickOnLoad = function ($this) {
			var scrollAmount,
				anchor = $('.eltd-main-menu a, .eltd-mobile-nav a, .eltd-fullscreen-menu a'),
				hash = $this,
				anchorData = hash !== '' ? $('[data-eltd-anchor="' + hash + '"]') : '';
			
			if (hash !== '' && anchorData.length > 0) {
				var anchoredElementOffset = anchorData.offset().top;
				scrollAmount = anchoredElementOffset - headerHeightToSubtract(anchoredElementOffset) - eltdGlobalVars.vars.eltdAddForAdminBar;
				
				if(anchor.length) {
					anchor.each(function(){
						var thisAnchor = $(this);
						
						if(thisAnchor.attr('href').indexOf(hash) > -1) {
							setActiveState(thisAnchor);
						}
					});
				}
				
				eltd.html.stop().animate({
					scrollTop: Math.round(scrollAmount)
				}, 1000, function () {
					//change hash tag in url
					if (history.pushState) {
						history.pushState(null, '', '#' + hash);
					}
				});
				
				return false;
			}
		};
		
		/**
		 * Calculate header height to be substract from scroll amount
		 * @param anchoredElementOffset, anchorded element offset
		 */
		var headerHeightToSubtract = function (anchoredElementOffset) {
			
			if (eltd.modules.stickyHeader.behaviour === 'eltd-sticky-header-on-scroll-down-up') {
				eltd.modules.stickyHeader.isStickyVisible = (anchoredElementOffset > eltd.modules.header.stickyAppearAmount);
			}
			
			if (eltd.modules.stickyHeader.behaviour === 'eltd-sticky-header-on-scroll-up') {
				if ((anchoredElementOffset > eltd.scroll)) {
					eltd.modules.stickyHeader.isStickyVisible = false;
				}
			}
			
			var headerHeight = eltd.modules.stickyHeader.isStickyVisible ? eltdGlobalVars.vars.eltdStickyHeaderTransparencyHeight : eltdPerPageVars.vars.eltdHeaderTransparencyHeight;
			
			if (eltd.windowWidth < 1025) {
				headerHeight = 0;
			}
			
			return headerHeight;
		};
		
		/**
		 * Handle anchor click
		 */
		var anchorClick = function () {
			eltd.document.on("click", ".eltd-main-menu a, .eltd-fullscreen-menu a, .eltd-btn, .eltd-anchor, .eltd-mobile-nav a", function () {
				var scrollAmount,
					anchor = $(this),
					hash = anchor.prop("hash").split('#')[1],
					anchorData = hash !== '' ? $('[data-eltd-anchor="' + hash + '"]') : '';
				
				if (hash !== '' && anchorData.length > 0) {
					var anchoredElementOffset = anchorData.offset().top;
					scrollAmount = anchoredElementOffset - headerHeightToSubtract(anchoredElementOffset) - eltdGlobalVars.vars.eltdAddForAdminBar;
					
					setActiveState(anchor);
					
					eltd.html.stop().animate({
						scrollTop: Math.round(scrollAmount)
					}, 1000, function () {
						//change hash tag in url
						if (history.pushState) {
							history.pushState(null, '', '#' + hash);
						}
					});
					
					return false;
				}
			});
		};
		
		return {
			init: function () {
				if ($('[data-eltd-anchor]').length) {
					anchorClick();
					checkActiveStateOnScroll();
					
					$(window).load(function () {
						checkActiveStateOnLoad();
					});
				}
			}
		};
	};
	
	function eltdInitBackToTop() {
		var backToTopButton = $('#eltd-back-to-top');
		backToTopButton.on('click', function (e) {
			e.preventDefault();
			eltd.html.animate({scrollTop: 0}, eltd.window.scrollTop() / 3, 'linear');
		});
	}
	
	function eltdBackButtonShowHide() {
		eltd.window.scroll(function () {
			var b = $(this).scrollTop(),
				c = $(this).height(),
				d;
			
			if (b > 0) {
				d = b + c / 2;
			} else {
				d = 1;
			}
			
			if (d < 1e3) {
				eltdToTopButton('off');
			} else {
				eltdToTopButton('on');
			}
		});
	}
	
	function eltdToTopButton(a) {
		var b = $("#eltd-back-to-top");
		b.removeClass('off on');
		if (a === 'on') {
			b.addClass('on');
		} else {
			b.addClass('off');
		}
	}
	
	function eltdInitSelfHostedVideoPlayer() {
		var players = $('.eltd-self-hosted-video');
		
		if (players.length) {
			players.mediaelementplayer({
				audioWidth: '100%'
			});
		}
	}
	
	function eltdSelfHostedVideoSize(){
		var selfVideoHolder = $('.eltd-self-hosted-video-holder .eltd-video-wrap');
		
		if(selfVideoHolder.length) {
			selfVideoHolder.each(function(){
				var thisVideo = $(this),
					videoWidth = thisVideo.closest('.eltd-self-hosted-video-holder').outerWidth(),
					videoHeight = videoWidth / eltd.videoRatio;
				
				if(navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)){
					thisVideo.parent().width(videoWidth);
					thisVideo.parent().height(videoHeight);
				}
				
				thisVideo.width(videoWidth);
				thisVideo.height(videoHeight);
				
				thisVideo.find('video, .mejs-overlay, .mejs-poster').width(videoWidth);
				thisVideo.find('video, .mejs-overlay, .mejs-poster').height(videoHeight);
			});
		}
	}
	
	function eltdFluidVideo() {
        fluidvids.init({
			selector: ['iframe'],
			players: ['www.youtube.com', 'player.vimeo.com']
		});
	}
	
	function eltdSmoothTransition() {

		if (eltd.body.hasClass('eltd-smooth-page-transitions')) {

			//check for preload animation
			if (eltd.body.hasClass('eltd-smooth-page-transitions-preloader')) {
				var loader = $('body > .eltd-smooth-transition-loader.eltd-mimic-ajax');

				if(!($('.eltd-tamashi-loader').length)){
					loader.fadeOut(500);

					$(window).bind('pageshow', function (event) {
						if (event.originalEvent.persisted) {
							loader.fadeOut(500);
						}
					});
				} else {
					loader.addClass('eltd-loading-finished');
					$('.eltd-tamashi-loader').fadeOut(200);

					setTimeout(function(){
						loader.fadeOut(500);

						$(window).bind('pageshow', function (event) {
							if (event.originalEvent.persisted) {
								loader.fadeOut(500);
							}
						});
					},500);
				}
			}

			//check for fade out animation
			if (eltd.body.hasClass('eltd-smooth-page-transitions-fadeout')) {
				var linkItem = $('a');
				
				linkItem.click(function (e) {
					var a = $(this);

					if ((a.parents('.eltd-shopping-cart-dropdown').length || a.parent('.product-remove').length) && a.hasClass('remove')) {
						return;
					}

					if (
						e.which === 1 && // check if the left mouse button has been pressed
						a.attr('href').indexOf(window.location.host) >= 0 && // check if the link is to the same domain
						(typeof a.data('rel') === 'undefined') && //Not pretty photo link
						(typeof a.attr('rel') === 'undefined') && //Not VC pretty photo link
                        (!a.hasClass('lightbox-active')) && //Not lightbox plugin active
						(typeof a.attr('target') === 'undefined' || a.attr('target') === '_self') && // check if the link opens in the same window
						(a.attr('href').split('#')[0] !== window.location.href.split('#')[0]) // check if it is an anchor aiming for a different page
					) {
						e.preventDefault();
						$('.eltd-wrapper-inner').fadeOut(1000, function () {
							window.location = a.attr('href');
						});
					}
				});
			}
		}
	}
	
	/*
	 *	Preload background images for elements that have 'eltd-preload-background' class
	 */
	function eltdPreloadBackgrounds(){
		var preloadBackHolder = $('.eltd-preload-background');
		
		if(preloadBackHolder.length) {
			preloadBackHolder.each(function() {
				var preloadBackground = $(this);
				
				if(preloadBackground.css('background-image') !== '' && preloadBackground.css('background-image') !== 'none') {
					var bgUrl = preloadBackground.attr('style');
					
					bgUrl = bgUrl.match(/url\(["']?([^'")]+)['"]?\)/);
					bgUrl = bgUrl ? bgUrl[1] : "";
					
					if (bgUrl) {
						var backImg = new Image();
						backImg.src = bgUrl;
						$(backImg).load(function(){
							preloadBackground.removeClass('eltd-preload-background');
						});
					}
				} else {
					$(window).load(function(){ preloadBackground.removeClass('eltd-preload-background'); }); //make sure that eltd-preload-background class is removed from elements with forced background none in css
				}
			});
		}
	}
	
	function eltdPrettyPhoto() {
		/*jshint multistr: true */
		var markupWhole = '<div class="pp_pic_holder"> \
                        <div class="ppt">&nbsp;</div> \
                        <div class="pp_top"> \
                            <div class="pp_left"></div> \
                            <div class="pp_middle"></div> \
                            <div class="pp_right"></div> \
                        </div> \
                        <div class="pp_content_container"> \
                            <div class="pp_left"> \
                            <div class="pp_right"> \
                                <div class="pp_content"> \
                                    <div class="pp_loaderIcon"></div> \
                                    <div class="pp_fade"> \
                                        <a href="#" class="pp_expand" title="Expand the image">Expand</a> \
                                        <div class="pp_hoverContainer"> \
                                            <a class="pp_next" href="#"><span class="fa fa-angle-right"></span></a> \
                                            <a class="pp_previous" href="#"><span class="fa fa-angle-left"></span></a> \
                                        </div> \
                                        <div id="pp_full_res"></div> \
                                        <div class="pp_details"> \
                                            <div class="pp_nav"> \
                                                <a href="#" class="pp_arrow_previous">Previous</a> \
                                                <p class="currentTextHolder">0/0</p> \
                                                <a href="#" class="pp_arrow_next">Next</a> \
                                            </div> \
                                            <p class="pp_description"></p> \
                                            {pp_social} \
                                            <a class="pp_close" href="#">Close</a> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                            </div> \
                        </div> \
                        <div class="pp_bottom"> \
                            <div class="pp_left"></div> \
                            <div class="pp_middle"></div> \
                            <div class="pp_right"></div> \
                        </div> \
                    </div> \
                    <div class="pp_overlay"></div>';
		
		$("a[data-rel^='prettyPhoto']").prettyPhoto({
			hook: 'data-rel',
			animation_speed: 'normal', /* fast/slow/normal */
			slideshow: false, /* false OR interval time in ms */
			autoplay_slideshow: false, /* true/false */
			opacity: 0.80, /* Value between 0 and 1 */
			show_title: true, /* true/false */
			allow_resize: true, /* Resize the photos bigger than viewport. true/false */
			horizontal_padding: 0,
			default_width: 960,
			default_height: 540,
			counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
			theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
			hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
			wmode: 'opaque', /* Set the flash wmode attribute */
			autoplay: true, /* Automatically start videos: True/False */
			modal: false, /* If set to true, only the close button will close the window */
			overlay_gallery: false, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
			keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
			deeplinking: false,
			custom_markup: '',
			social_tools: false,
			markup: markupWhole
		});
	}

    function eltdSearchPostTypeWidget() {
        var searchPostTypeHolder = $('.eltd-search-post-type');

        if (searchPostTypeHolder.length) {
            searchPostTypeHolder.each(function () {
                var thisSearch = $(this),
                    searchField = thisSearch.find('.eltd-post-type-search-field'),
                    resultsHolder = thisSearch.siblings('.eltd-post-type-search-results'),
                    searchLoading = thisSearch.find('.eltd-search-loading'),
                    searchIcon = thisSearch.find('.eltd-search-icon');

                searchLoading.addClass('eltd-hidden');

                var postType = thisSearch.data('post-type'),
                    keyPressTimeout;

                searchField.on('keyup paste', function() {
                    var field = $(this);
                    field.attr('autocomplete','off');
                    searchLoading.removeClass('eltd-hidden');
                    searchIcon.addClass('eltd-hidden');
                    clearTimeout(keyPressTimeout);

                    keyPressTimeout = setTimeout( function() {
                        var searchTerm = field.val();
                        
                        if(searchTerm.length < 3) {
                            resultsHolder.html('');
                            resultsHolder.fadeOut();
                            searchLoading.addClass('eltd-hidden');
                            searchIcon.removeClass('eltd-hidden');
                        } else {
                            var ajaxData = {
                                action: 'tamashi_elated_search_post_types',
                                term: searchTerm,
                                postType: postType
                            };

                            $.ajax({
                                type: 'POST',
                                data: ajaxData,
                                url: eltdGlobalVars.vars.eltdAjaxUrl,
                                success: function (data) {
                                    var response = JSON.parse(data);
                                    if (response.status === 'success') {
                                        searchLoading.addClass('eltd-hidden');
                                        searchIcon.removeClass('eltd-hidden');
                                        resultsHolder.html(response.data.html);
                                        resultsHolder.fadeIn();
                                    }
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    console.log("Status: " + textStatus);
                                    console.log("Error: " + errorThrown);
                                    searchLoading.addClass('eltd-hidden');
                                    searchIcon.removeClass('eltd-hidden');
                                    resultsHolder.fadeOut();
                                }
                            });
                        }
                    }, 500);
                });

                searchField.on('focusout', function () {
                    searchLoading.addClass('eltd-hidden');
                    searchIcon.removeClass('eltd-hidden');
                    resultsHolder.fadeOut();
                });
            });
        }
    }
	
	/**
	 * Initializes load more data params
	 * @param container with defined data params
	 * return array
	 */
	function getLoadMoreData(container){
		var dataList = container.data(),
			returnValue = {};
		
		for (var property in dataList) {
			if (dataList.hasOwnProperty(property)) {
				if (typeof dataList[property] !== 'undefined' && dataList[property] !== false) {
					returnValue[property] = dataList[property];
				}
			}
		}
		
		return returnValue;
	}
	
	/**
	 * Sets load more data params for ajax function
	 * @param container with defined data params
	 * @param action with defined action name
	 * return array
	 */
	function setLoadMoreAjaxData(container, action) {
		var returnValue = {
			action: action
		};
		
		for (var property in container) {
			if (container.hasOwnProperty(property)) {
				
				if (typeof container[property] !== 'undefined' && container[property] !== false) {
					returnValue[property] = container[property];
				}
			}
		}
		
		return returnValue;
	}
	
	/**
	 * Object that represents icon with hover data
	 * @returns {{init: Function}} function that initializes icon's functionality
	 */
	var eltdIconWithHover = function() {
		//get all icons on page
		var icons = $('.eltd-icon-has-hover');
		
		/**
		 * Function that triggers icon hover color functionality
		 */
		var iconHoverColor = function(icon) {
			if(typeof icon.data('hover-color') !== 'undefined') {
				var changeIconColor = function(event) {
					event.data.icon.css('color', event.data.color);
				};
				
				var hoverColor = icon.data('hover-color'),
					originalColor = icon.css('color');
				
				if(hoverColor !== '') {
					icon.on('mouseenter', {icon: icon, color: hoverColor}, changeIconColor);
					icon.on('mouseleave', {icon: icon, color: originalColor}, changeIconColor);
				}
			}
		};
		
		return {
			init: function() {
				if(icons.length) {
					icons.each(function() {
						iconHoverColor($(this));
					});
				}
			}
		};
	};
	
	/*
	 ** Init parallax
	 */
	function eltdInitParallax(){
		var parallaxHolder = $('.eltd-parallax-row-holder');
		
		if(parallaxHolder.length){
			parallaxHolder.each(function() {
				var parallaxElement = $(this),
					image = parallaxElement.data('parallax-bg-image'),
					speed = parallaxElement.data('parallax-bg-speed') * 0.4,
					height = 0;
				
				if (typeof parallaxElement.data('parallax-bg-height') !== 'undefined' && parallaxElement.data('parallax-bg-height') !== false) {
					height = parseInt(parallaxElement.data('parallax-bg-height'));
				}
				
				parallaxElement.css({'background-image': 'url('+image+')'});
				
				if(height > 0) {
					parallaxElement.css({'min-height': height+'px', 'height': height+'px'});
				}
				
				parallaxElement.parallax('50%', speed);
			});
		}
	}
	
	/*
	 **  Init sticky sidebar widget
	 */
	function eltdStickySidebarWidget(){
		var sswHolder = $('.eltd-widget-sticky-sidebar'),
			headerHolder = $('.eltd-page-header'),
			headerHeight = headerHolder.length ? headerHolder.outerHeight() : 0,
			widgetTopOffset = 0,
			widgetTopPosition = 0,
			sidebarHeight = 0,
			sidebarWidth = 0,
			objectsCollection = [];
		
		function addObjectItems() {
			if (sswHolder.length) {
				sswHolder.each(function () {
					var thisSswHolder = $(this),
						mainSidebarHolder = thisSswHolder.parents('aside.eltd-sidebar'),
						widgetiseSidebarHolder = thisSswHolder.parents('.wpb_widgetised_column'),
						sidebarHolder = '',
						sidebarHolderHeight = 0;
					
					widgetTopOffset = thisSswHolder.offset().top;
					widgetTopPosition = thisSswHolder.position().top;
					sidebarHeight = 0;
					sidebarWidth = 0;
					
					if (mainSidebarHolder.length) {
						sidebarHeight = mainSidebarHolder.outerHeight();
						sidebarWidth = mainSidebarHolder.outerWidth();
						sidebarHolder = mainSidebarHolder;
						sidebarHolderHeight = mainSidebarHolder.parent().parent().outerHeight();
						
						var blogHolder = mainSidebarHolder.parent().parent().find('.eltd-blog-holder');
						if (blogHolder.length) {
							sidebarHolderHeight -= parseInt(blogHolder.css('marginBottom'));
						}
					} else if (widgetiseSidebarHolder.length) {
						sidebarHeight = widgetiseSidebarHolder.outerHeight();
						sidebarWidth = widgetiseSidebarHolder.outerWidth();
						sidebarHolder = widgetiseSidebarHolder;
						sidebarHolderHeight = widgetiseSidebarHolder.parents('.vc_row').outerHeight();
					}
					
					objectsCollection.push({
						'object': thisSswHolder,
						'offset': widgetTopOffset,
						'position': widgetTopPosition,
						'height': sidebarHeight,
						'width': sidebarWidth,
						'sidebarHolder': sidebarHolder,
						'sidebarHolderHeight': sidebarHolderHeight
					});
				});
			}
		}
		
		function initStickySidebarWidget() {
			
			if (objectsCollection.length) {
				$.each(objectsCollection, function (i) {
					var thisSswHolder = objectsCollection[i]['object'],
						thisWidgetTopOffset = objectsCollection[i]['offset'],
						thisWidgetTopPosition = objectsCollection[i]['position'],
						thisSidebarHeight = objectsCollection[i]['height'],
						thisSidebarWidth = objectsCollection[i]['width'],
						thisSidebarHolder = objectsCollection[i]['sidebarHolder'],
						thisSidebarHolderHeight = objectsCollection[i]['sidebarHolderHeight'];
					
					if (eltd.body.hasClass('eltd-fixed-on-scroll')) {
						var fixedHeader = $('.eltd-fixed-wrapper.fixed');
						
						if (fixedHeader.length) {
							headerHeight = fixedHeader.outerHeight() + eltdGlobalVars.vars.eltdAddForAdminBar;
						}
					} else if (eltd.body.hasClass('eltd-no-behavior')) {
						headerHeight = eltdGlobalVars.vars.eltdAddForAdminBar;
					}
					
					if (eltd.windowWidth > 1024 && thisSidebarHolder.length) {
						var sidebarPosition = -(thisWidgetTopPosition - headerHeight),
							sidebarHeight = thisSidebarHeight - thisWidgetTopPosition - 40; // 40 is bottom margin of widget holder
						
						//move sidebar up when hits the end of section row
						var rowSectionEndInViewport = thisSidebarHolderHeight + thisWidgetTopOffset - headerHeight - thisWidgetTopPosition - eltdGlobalVars.vars.eltdTopBarHeight;
						
						if ((eltd.scroll >= thisWidgetTopOffset - headerHeight) && thisSidebarHeight < thisSidebarHolderHeight) {
							if (thisSidebarHolder.hasClass('eltd-sticky-sidebar-appeared')) {
								thisSidebarHolder.css({'top': sidebarPosition + 'px'});
							} else {
								thisSidebarHolder.addClass('eltd-sticky-sidebar-appeared').css({
									'position': 'fixed',
									'top': sidebarPosition + 'px',
									'width': thisSidebarWidth,
									'margin-top': '-10px'
								}).animate({'margin-top': '0'}, 200);
							}
							
							if (eltd.scroll + sidebarHeight >= rowSectionEndInViewport) {
								var absBottomPosition = thisSidebarHolderHeight - sidebarHeight + sidebarPosition - headerHeight;
								
								thisSidebarHolder.css({
									'position': 'absolute',
									'top': absBottomPosition + 'px'
								});
							} else {
								if (thisSidebarHolder.hasClass('eltd-sticky-sidebar-appeared')) {
									thisSidebarHolder.css({
										'position': 'fixed',
										'top': sidebarPosition + 'px'
									});
								}
							}
						} else {
							thisSidebarHolder.removeClass('eltd-sticky-sidebar-appeared').css({
								'position': 'relative',
								'top': '0',
								'width': 'auto'
							});
						}
					} else {
						thisSidebarHolder.removeClass('eltd-sticky-sidebar-appeared').css({
							'position': 'relative',
							'top': '0',
							'width': 'auto'
						});
					}
				});
			}
		}
		
		return {
			init: function () {
				addObjectItems();
				initStickySidebarWidget();
				
				$(window).scroll(function () {
					initStickySidebarWidget();
				});
			},
			reInit: initStickySidebarWidget
		};
	}

    /**
     * Init Owl Carousel
     */
    function eltdOwlSlider() {
        var sliders = $('.eltd-owl-slider');

        if (sliders.length) {
            sliders.each(function(){
                var slider = $(this),
                    owlSlider = $(this),
	                slideItemsNumber = slider.children().length,
	                numberOfItems = 1,
	                loop = true,
	                autoplay = true,
	                autoplayHoverPause = true,
	                sliderSpeed = 5000,
	                sliderSpeedAnimation = 600,
	                margin = 0,
	                responsiveMargin = 0,
	                responsiveMargin1 = 0,
	                stagePadding = 0,
	                stagePaddingEnabled = false,
	                center = false,
	                autoWidth = false,
	                animateInClass = false, // keyframe css animation
	                animateOutClass = false, // keyframe css animation
	                navigation = true,
	                pagination = false,
	                thumbnail = false,
                    thumbnailSlider,
	                sliderIsPortfolio = !!slider.hasClass('eltd-pl-is-slider'),
	                sliderDataHolder = sliderIsPortfolio ? slider.parent() : slider,  // this is condition for portfolio slider
	                positionX,
					holderWidth,
					contentEnteredFlag = false,
					animating = false,
					isFullScreenSlider = slider.parent(".eltd-pl-fullscreen-slider").length,
					mouseWheel = false;
	
	            if (typeof slider.data('number-of-items') !== 'undefined' && slider.data('number-of-items') !== false && !sliderIsPortfolio) {
		            numberOfItems = slider.data('number-of-items');
	            }
	            if (typeof sliderDataHolder.data('number-of-columns') !== 'undefined' && sliderDataHolder.data('number-of-columns') !== false && sliderIsPortfolio) {
		            numberOfItems = sliderDataHolder.data('number-of-columns');
	            }
	            if (sliderDataHolder.data('enable-loop') === 'no') {
		            loop = false;
	            }
	            if (sliderDataHolder.data('enable-autoplay') === 'no') {
		            autoplay = false;
	            }
	            if (sliderDataHolder.data('enable-autoplay-hover-pause') === 'no') {
		            autoplayHoverPause = false;
	            }
	            if (typeof sliderDataHolder.data('slider-speed') !== 'undefined' && sliderDataHolder.data('slider-speed') !== false) {
		            sliderSpeed = sliderDataHolder.data('slider-speed');
	            }
	            if (typeof sliderDataHolder.data('slider-speed-animation') !== 'undefined' && sliderDataHolder.data('slider-speed-animation') !== false) {
		            sliderSpeedAnimation = sliderDataHolder.data('slider-speed-animation');
	            }
	            if (typeof sliderDataHolder.data('slider-margin') !== 'undefined' && sliderDataHolder.data('slider-margin') !== false) {
		            if (sliderDataHolder.data('slider-margin') === 'no') {
			            margin = 0;
		            } else {
			            margin = sliderDataHolder.data('slider-margin');
		            }
	            } else {
		            if(slider.parent().hasClass('eltd-huge-space')) {
			            margin = 60;
		            } else if (slider.parent().hasClass('eltd-large-space')) {
			            margin = 50;
		            } else if (slider.parent().hasClass('eltd-medium-space')) {
			            margin = 40;
		            } else if (slider.parent().hasClass('eltd-normal-space')) {
			            margin = 30;
		            } else if (slider.parent().hasClass('eltd-small-space')) {
			            margin = 20;
		            } else if (slider.parent().hasClass('eltd-tiny-space')) {
			            margin = 10;
		            }
	            }
	            if (sliderDataHolder.data('slider-padding') === 'yes') {
		            stagePaddingEnabled = true;
		            stagePadding = parseInt(slider.outerWidth() * 0.28);
		            margin = 50;
	            }
	            if (sliderDataHolder.data('enable-center') === 'yes') {
		            center = true;
	            }
	            if (sliderDataHolder.data('enable-auto-width') === 'yes') {
		            autoWidth = true;
	            }
	            if (sliderDataHolder.data('enable-mousewheel') === 'yes') {
		            mouseWheel = true;
	            }
	            if (typeof sliderDataHolder.data('slider-animate-in') !== 'undefined' && sliderDataHolder.data('slider-animate-in') !== false) {
		            animateInClass = sliderDataHolder.data('slider-animate-in');
	            }
	            if (typeof sliderDataHolder.data('slider-animate-out') !== 'undefined' && sliderDataHolder.data('slider-animate-out') !== false) {
                    animateOutClass = sliderDataHolder.data('slider-animate-out');
	            }
	            if (sliderDataHolder.data('enable-navigation') === 'no') {
		            navigation = false;
	            }
	            if (sliderDataHolder.data('enable-pagination') === 'yes') {
		            pagination = true;
	            }

	            if (sliderDataHolder.data('enable-thumbnail') === 'yes') {
                    thumbnail = true;
	            }
	            
	            if(navigation && pagination) {
		            slider.addClass('eltd-slider-has-both-nav');
	            }
	
	            if (slideItemsNumber <= 1) {
		            loop       = false;
		            autoplay   = false;
		            navigation = false;
		            pagination = false;
	            }
	
	            var responsiveNumberOfItems1 = 1,
		            responsiveNumberOfItems2 = 2,
		            responsiveNumberOfItems3 = 3,
		            responsiveNumberOfItems4 = numberOfItems;
	
	            if (numberOfItems < 3) {
		            responsiveNumberOfItems2 = numberOfItems;
		            responsiveNumberOfItems3 = numberOfItems;
	            }
	
	            if (numberOfItems > 4) {
		            responsiveNumberOfItems4 = 4;
	            }
	
	            if (stagePaddingEnabled || margin > 30) {
		            responsiveMargin = 20;
		            responsiveMargin1 = 30;
	            }
	
	            if (margin > 0 && margin <= 30) {
		            responsiveMargin = margin;
		            responsiveMargin1 = margin;
	            }

	             var eltdHalfNav = function() {
			  		slider.on('click', function(event){

						if( !contentEnteredFlag && navigation && ( isFullScreenSlider || sliderIsPortfolio ) ) {

				  			if (event.pageX < slider.offset().left  + slider.width()/2) {
					  			slider.trigger('prev.owl.carousel');
					  		} else {
					  			slider.trigger('next.owl.carousel');
					  		}
						}
				  	});
				}

				// enabled pagination for Portfolio FullScreen Single
				if(slider.hasClass('eltd-ps-full-screen-slider-image')) {
						navigation = false;
	                    pagination = true;
				}

	            owlSlider = slider.owlCarousel({
		            items: numberOfItems,
		            loop: loop,
		            autoplay: autoplay,
		            autoplayHoverPause: autoplayHoverPause,
		            autoplayTimeout: sliderSpeed,
		            smartSpeed: sliderSpeedAnimation,
		            margin: margin,
		            stagePadding: stagePadding,
		            center: center,
		            autoWidth: autoWidth,
		            animateIn: animateInClass,
		            animateOut: animateOutClass,
		            dots: pagination,
		            nav: navigation,
		            navText: [
			            '<span class="eltd-prev-icon icon-arrows-left"></span>',
			            '<span class="eltd-next-icon icon-arrows-right"></span>'
		            ],
		            responsive: {
			            0: {
				            items: responsiveNumberOfItems1,
				            margin: responsiveMargin,
				            stagePadding: 0,
				            center: false,
				            autoWidth: false
			            },
			            681: {
				            items: responsiveNumberOfItems2,
				            margin: responsiveMargin1
			            },
			            769: {
				            items: responsiveNumberOfItems3,
				            margin: responsiveMargin1
			            },
			            1025: {
				            items: responsiveNumberOfItems4
			            },
			            1281: {
				            items: numberOfItems
			            }
		            },
		            onInitialize: function () {
			            slider.css('visibility', 'visible');
			            eltdInitParallax();
		            },
		            onInitialized: function () {
	    	            eltdHalfNav();
	    	            if(slider.hasClass('eltd-testimonials')){
						   slider.css('visibility','visible');
						   slider.find('.owl-item').not('.active').addClass('eltd-slide-fade-out');
						   slider.find('.owl-item').filter('.active').addClass('eltd-slide-fade-in');
					   	}
	                },
		            onDrag: function (e) {
			            if (eltd.body.hasClass('eltd-smooth-page-transitions-fadeout')) {
				            var sliderIsMoving = e.isTrigger > 0;
				
				            if (sliderIsMoving) {
					            slider.addClass('eltd-slider-is-moving');
				            }
			            }
		            },
		            onDragged: function () {
			            if (eltd.body.hasClass('eltd-smooth-page-transitions-fadeout') && slider.hasClass('eltd-slider-is-moving')) {
				
				            setTimeout(function () {
					            slider.removeClass('eltd-slider-is-moving');
				            }, 500);
			            }
		            },
		            onChange: function() {
					
					}
                });

                if(thumbnail) {
                    thumbnailSlider = slider.parent().find('.eltd-slider-thumbnail');

                    var numberOfThumbnails = parseInt(thumbnailSlider.data('thumbnail-count'));
                    var numberOfThumbnailsClass = '';

                    switch (numberOfThumbnails % 6) {
                        case 2 :
                            numberOfThumbnailsClass = 'two';
                            break;
                        case 3 :
                            numberOfThumbnailsClass = 'three';
                            break;
                        case 4 :
                            numberOfThumbnailsClass = 'four';
                            break;
                        case 5 :
                            numberOfThumbnailsClass = 'five';
                            break;
                        case 0 :
                            numberOfThumbnailsClass = 'six';
                            break;
                        default :
                            numberOfThumbnailsClass = '';
                            break;
                    }

                    if(numberOfThumbnailsClass !== '') {
                        thumbnailSlider.addClass('eltd-slider-columns-' + numberOfThumbnailsClass)
                    }

                    thumbnailSlider.find('.eltd-slider-thumbnail-item').click(function () {
                        owlSlider.trigger('to.owl.carousel', [$(this).index(), sliderSpeedAnimation]);
                    });
                }

                $(".eltd-pli-text").mouseenter(function(){
				  	contentEnteredFlag = true;
				});

				$(".eltd-pli-text").mouseleave(function() {
				    contentEnteredFlag = false;
				});

				slider.find('.owl-dots').mouseenter(function(){
				  	contentEnteredFlag = true;
				});

				slider.find('.owl-dots').mouseleave(function() {
				    contentEnteredFlag = false;
				});

				slider.on('mousewheel', function (e) {
					if (sliderDataHolder.data('enable-mousewheel') === 'yes') {
						e.preventDefault();
					    e.stopImmediatePropagation();
					}

					if (mouseWheel) {

				    	if(e.deltaY<0 && slideItemsNumber === slider.find('.active').index()+1){
				    		slider.trigger('to.owl.carousel', [0]);
				    	} else if (e.deltaY<0) {
				        	slider.trigger('next.owl.carousel');
				    	} else if (e.deltaY>0 && slider.find('.active').index() === 0){
					    	slider.trigger('to.owl.carousel', [slideItemsNumber-1]);
					    } else if (e.deltaY>0) {
					    	slider.trigger('prev.owl.carousel');
					    }

					    mouseWheel = false;
					    setTimeout(function(){
					    	mouseWheel = true;
					    }, sliderSpeedAnimation);

					}
				});

				if(slider.parents('.eltd-pl-fullscreen-slider').data('fullscreen-slider') !== 'yes'){
					slider.on( "mousemove", function( event ) {

						if((!contentEnteredFlag  && navigation && slideItemsNumber > 1) && ( isFullScreenSlider || sliderIsPortfolio ) ) {
							positionX = 0 - (slider.offset().left - event.pageX);
							holderWidth = slider.width();
							if (positionX < holderWidth/2) {
								slider.find('.owl-stage-outer').attr('style', 'cursor:url(../wp-content/themes/tamashi/assets/img/portfolio-slide-arrow-left.png),w-resize!important');
							  	slider.find('a').attr('style', 'cursor:pointer!important');

							} else {
							  	slider.find('.owl-stage-outer').attr('style', 'cursor:url(../wp-content/themes/tamashi/assets/img/portfolio-slide-arrow-right.png),w-resize!important');
							  	slider.find('a').attr('style', 'cursor:pointer!important');
							}
						} else {
							slider.find('.owl-stage-outer').attr('style', 'cursor:pointer,w-resize!important');
						}

					});

				}

            });
        }


    }

})(jQuery);