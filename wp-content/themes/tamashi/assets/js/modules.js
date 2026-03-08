(function($) {
    "use strict";

    window.eltd = {};
    eltd.modules = {};

    eltd.scroll = 0;
    eltd.window = $(window);
    eltd.document = $(document);
    eltd.windowWidth = $(window).width();
    eltd.windowHeight = $(window).height();
    eltd.body = $('body');
    eltd.html = $('html, body');
    eltd.htmlEl = $('html');
    eltd.menuDropdownHeightSet = false;
    eltd.defaultHeaderStyle = '';
    eltd.minVideoWidth = 1500;
    eltd.videoWidthOriginal = 1280;
    eltd.videoHeightOriginal = 720;
    eltd.videoRatio = 1.61;

    eltd.eltdOnDocumentReady = eltdOnDocumentReady;
    eltd.eltdOnWindowLoad = eltdOnWindowLoad;
    eltd.eltdOnWindowResize = eltdOnWindowResize;
    eltd.eltdOnWindowScroll = eltdOnWindowScroll;

    $(document).ready(eltdOnDocumentReady);
    $(window).load(eltdOnWindowLoad);
    $(window).resize(eltdOnWindowResize);
    $(window).scroll(eltdOnWindowScroll);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function eltdOnDocumentReady() {
        eltd.scroll = $(window).scrollTop();

        //set global variable for header style which we will use in various functions
        if(eltd.body.hasClass('eltd-dark-header')){ eltd.defaultHeaderStyle = 'eltd-dark-header';}
        if(eltd.body.hasClass('eltd-light-header')){ eltd.defaultHeaderStyle = 'eltd-light-header';}
    }

    /* 
        All functions to be called on $(window).load() should be in this function
    */
    function eltdOnWindowLoad() {

    }

    /* 
        All functions to be called on $(window).resize() should be in this function
    */
    function eltdOnWindowResize() {
        eltd.windowWidth = $(window).width();
        eltd.windowHeight = $(window).height();
    }

    /* 
        All functions to be called on $(window).scroll() should be in this function
    */
    function eltdOnWindowScroll() {
        eltd.scroll = $(window).scrollTop();
    }

    //set boxed layout width variable for various calculations

    switch(true){
        case eltd.body.hasClass('eltd-grid-1300'):
            eltd.boxedLayoutWidth = 1350;
            break;
        case eltd.body.hasClass('eltd-grid-1200'):
            eltd.boxedLayoutWidth = 1250;
            break;
        case eltd.body.hasClass('eltd-grid-1000'):
            eltd.boxedLayoutWidth = 1050;
            break;
        case eltd.body.hasClass('eltd-grid-800'):
            eltd.boxedLayoutWidth = 850;
            break;
        default :
            eltd.boxedLayoutWidth = 1150;
            break;
    }

})(jQuery);
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
(function($) {
    'use strict';

    var like = {};
    
    like.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /**
    *  All functions to be called on $(document).ready() should be in this function
    **/
    function eltdOnDocumentReady() {
        eltdLikes();
    }

    function eltdLikes() {
        $(document).on('click','.eltd-like', function() {
            var likeLink = $(this),
                id = likeLink.attr('id'),
                type;

            if ( likeLink.hasClass('liked') ) {
                return false;
            }

            if (typeof likeLink.data('type') !== 'undefined') {
                type = likeLink.data('type');
            }

            var dataToPass = {
                action: 'tamashi_elated_like',
                likes_id: id,
                type: type
            };

            var like = $.post(eltdGlobalVars.vars.eltdAjaxUrl, dataToPass, function( data ) {
                likeLink.html(data).addClass('liked').attr('title', 'You already like this!');
            });

            return false;
        });
    }
    
})(jQuery);
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

(function($) {
    'use strict';

    var portfolio = {};
    eltd.modules.portfolio = portfolio;

    portfolio.eltdOnWindowLoad = eltdOnWindowLoad;

    $(window).load(eltdOnWindowLoad);

    /*
     All functions to be called on $(window).load() should be in this function
     */
    function eltdOnWindowLoad() {
        initPortfolioSingleMasonry();
        eltdPortfolioSingleFollow().init();
        eltdInitPortfolioSingleFullscreenSliderHeight();
        eltdFullScreenSliderInfo();
        eltdScrollSlider();
    }
	
	var eltdPortfolioSingleFollow = function() {
		var info = $('.eltd-follow-portfolio-info .eltd-portfolio-single-holder .eltd-ps-info-sticky-holder');
		
		if (info.length) {
			var infoHolder = info.parent(),
				infoHolderOffset = infoHolder.offset().top,
				infoHolderHeight = infoHolder.height(),
				mediaHolder = $('.eltd-ps-image-holder'),
				mediaHolderHeight = mediaHolder.height(),
				header = $('.header-appear, .eltd-fixed-wrapper'),
				headerHeight = (header.length) ? header.height() : 0;
		}
		
		var infoHolderPosition = function() {
			if(info.length) {
				if (mediaHolderHeight > infoHolderHeight) {
					if(eltd.scroll > infoHolderOffset) {
						var marginTop = eltd.scroll - infoHolderOffset + eltdGlobalVars.vars.eltdAddForAdminBar + headerHeight;
						// if scroll is initially positioned below mediaHolderHeight
						if(marginTop + infoHolderHeight > mediaHolderHeight){
							marginTop = mediaHolderHeight - infoHolderHeight;
						}
						info.stop().animate({
							marginTop: marginTop
						});
					}
				}
			}
		};
		
		var recalculateInfoHolderPosition = function() {
			if (info.length) {
				if(mediaHolderHeight > infoHolderHeight) {
					if(eltd.scroll > infoHolderOffset) {
						
						if(eltd.scroll + headerHeight + eltdGlobalVars.vars.eltdAddForAdminBar + infoHolderHeight + 50 < infoHolderOffset + mediaHolderHeight) { //50 to prevent mispositioning
							
							//Calculate header height if header appears
							if ($('.header-appear, .eltd-fixed-wrapper').length) {
								headerHeight = $('.header-appear, .eltd-fixed-wrapper').height();
							}
							info.stop().animate({
								marginTop: (eltd.scroll - infoHolderOffset + eltdGlobalVars.vars.eltdAddForAdminBar + headerHeight)
							});
							//Reset header height
							headerHeight = 0;
						}
						else{
							info.stop().animate({
								marginTop: mediaHolderHeight - infoHolderHeight
							});
						}
					} else {
						info.stop().animate({
							marginTop: 0
						});
					}
				}
			}
		};
		
		return {
			init : function() {
				infoHolderPosition();
				$(window).scroll(function(){
					recalculateInfoHolderPosition();
				});
			}
		};
	};
	
	function initPortfolioSingleMasonry(){
		var masonryHolder = $('.eltd-portfolio-single-holder .eltd-ps-masonry-images'),
			masonry = masonryHolder.children();
		
		if(masonry.length){
            masonry.isotope({
                layoutMode: 'packery',
                itemSelector: '.eltd-ps-image',
                percentPosition: true,
                packery: {
                    gutter: '.eltd-ps-grid-gutter',
                    columnWidth: '.eltd-ps-grid-sizer'
                }
            });

            masonry.css('opacity', '1');
		}
	}

	function eltdInitPortfolioSingleFullscreenSliderHeight() {
        var holder = $('.eltd-ps-full-screen-slider-layout');
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

	function eltdFullScreenSliderInfo() {


		var sliderHolder = $('.eltd-ps-full-screen-slider-holder');
		var sliders = $('.eltd-ps-full-screen-slider-image');

        if (sliderHolder.length) {

            var sliderContent = $('.eltd-portfolio-slider-content');
            var close = $('.eltd-control.eltd-close');
            var description = $('.eltd-description');
            var info = $('.eltd-portfolio-slider-content-info');

            sliderContent.on('click',function(e){
                e.preventDefault();
                if (!sliderContent.hasClass('opened')) {
                    description.fadeOut(400, function() {
                        sliderContent.addClass('opened');
                        setTimeout(function(){
                            info.fadeIn(400);
                        }, 400);
                        setTimeout(function(){
                            $(".eltd-portfolio-slider-content-info").niceScroll({
                                scrollspeed: 60,
                                mousescrollstep: 40,
                                cursorwidth: 0,
                                cursorborder: 0,
                                cursorborderradius: 0,
                                cursorcolor: "transparent",
                                autohidemode: false,
                                horizrailenabled: false
                            });
                        }, 800);
                    });
                }
            });

            close.on('click',function(e){
                e.preventDefault();
                e.stopPropagation();
                info.fadeOut( 400, function() {
                    sliderContent.removeClass('opened');
                    setTimeout(function() {
                        description.fadeIn(400);
                    }, 400);
                });
            });

        }

    }

    function eltdScrollSlider() { 
		var sliders = $('.eltd-scroll-slider');

		if(sliders.length){
			sliders.each(function(){
				var slider = $(this),
					currentSlideIndex 	= 0,
					xPosition			= 0,
					sliderWidth			= 0,
					limiter				= 0,
					numberOfSlides		= slider.children('.eltd-pl-item').length;

					//slider.children('.eltd-pl-item').height(slider.height() - slider.find('.eltd-pl-item .eltd-pli-text-holder').height());
					slider.children('.eltd-pl-item').height($(window).height() - slider.find('.eltd-pl-item .eltd-pli-text-holder').height() - 250);
					slider.parent().css('overflow','visible');

					// calculate slider total width
					slider.children('.eltd-pl-item').each(function(i){
						sliderWidth = sliderWidth + slider.children('.eltd-pl-item').eq(i).width();
					});

					limiter	= Math.round($(window).width() / (sliderWidth/numberOfSlides)) + 1;

					// move slider to desired item
					var sliderSlide = function(){
						slider.css({
						  '-webkit-transform' : 'translate3d(' + -xPosition + 'px,0,0)',
						  'transform'         : 'translate3d(' + -xPosition + 'px,0,0)'
						});
					}	

					// Add class when slider moves, remove after it stopped moving
					var sliderClasses = function(){ 
						slider.addClass('eltd-scroll-slider-sliding');
					    slider.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e){
					    	e.stopPropagation();
					    	slider.removeClass('eltd-scroll-slider-sliding');
					    });

					    setTimeout(function(){
					    	slider.removeClass('eltd-scroll-slider-sliding');
					    },1500);
					}

					slider.on('mousewheel', function (e) {
						e.preventDefault();

						// prev slide logic
					    if (e.deltaY>0 && currentSlideIndex>0 && !slider.hasClass('eltd-scroll-slider-sliding')) {
					        var slideWidth = slider.children('.eltd-pl-item').eq(currentSlideIndex-1).outerWidth();
					        xPosition = xPosition - slideWidth;
					        if(xPosition < 0){
					        	xPosition = 0;
					        }
					        sliderSlide();
					        sliderClasses();
					        currentSlideIndex--;
					    } 

					    // next slide logic
					    else if(e.deltaY<0 && currentSlideIndex < numberOfSlides-limiter && !slider.hasClass('eltd-scroll-slider-sliding')) {
					        var slideWidth = slider.children('.eltd-pl-item').eq(currentSlideIndex).outerWidth();
					        xPosition = xPosition + slideWidth;
					        sliderSlide();
					        sliderClasses();
					        currentSlideIndex++;
					    }

					    else if(e.deltaY<0 && currentSlideIndex == numberOfSlides-limiter && !slider.hasClass('eltd-scroll-slider-sliding')) {
					    	xPosition = sliderWidth - $(window).width() + 100;
					    	sliderSlide();
					        sliderClasses();
					        currentSlideIndex++;
					    }

					});
			});
		}
    }

})(jQuery);
(function($) {
    'use strict';
	
	var accordions = {};
	eltd.modules.accordions = accordions;
	
	accordions.eltdInitAccordions = eltdInitAccordions;
	
	
	accordions.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitAccordions();
	}
	
	/**
	 * Init accordions shortcode
	 */
	function eltdInitAccordions(){
		var accordion = $('.eltd-accordion-holder');
		
		if(accordion.length){
			accordion.each(function(){
				var thisAccordion = $(this);

				if(thisAccordion.hasClass('eltd-accordion')){
					thisAccordion.accordion({
						animate: "swing",
						collapsible: true,
						active: 0,
						icons: "",
						heightStyle: "content"
					});
				}

				if(thisAccordion.hasClass('eltd-toggle')){
					var toggleAccordion = $(this),
						toggleAccordionTitle = toggleAccordion.find('.eltd-accordion-title'),
						toggleAccordionContent = toggleAccordionTitle.next();

					toggleAccordion.addClass("accordion ui-accordion ui-accordion-icons ui-widget ui-helper-reset");
					toggleAccordionTitle.addClass("ui-accordion-header ui-state-default ui-corner-top ui-corner-bottom");
					toggleAccordionContent.addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide();

					toggleAccordionTitle.each(function(){
						var thisTitle = $(this);
						
						thisTitle.hover(function(){
							thisTitle.toggleClass("ui-state-hover");
						});

						thisTitle.on('click',function(){
							thisTitle.toggleClass('ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom');
							thisTitle.next().toggleClass('ui-accordion-content-active').slideToggle(400);
						});
					});
				}
			});
		}
	}

})(jQuery);
(function($) {
	'use strict';
	
	var animationHolder = {};
	eltd.modules.animationHolder = animationHolder;
	
	animationHolder.eltdInitAnimationHolder = eltdInitAnimationHolder;
	
	
	animationHolder.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitAnimationHolder();
	}
	
	/*
	 *	Init animation holder shortcode
	 */
	function eltdInitAnimationHolder(){
		var elements = $('.eltd-grow-in, .eltd-fade-in-down, .eltd-element-from-fade, .eltd-element-from-left, .eltd-element-from-right, .eltd-element-from-top, .eltd-element-from-bottom, .eltd-flip-in, .eltd-x-rotate, .eltd-z-rotate, .eltd-y-translate, .eltd-fade-in, .eltd-fade-in-left-x-rotate'),
			animationClass,
			animationData,
			animationDelay;
		
		if(elements.length){
			elements.each(function(){
				var thisElement = $(this);
				
				thisElement.appear(function() {
					animationData = thisElement.data('animation');
					animationDelay = parseInt(thisElement.data('animation-delay'));
					
					if(typeof animationData !== 'undefined' && animationData !== '') {
						animationClass = animationData;
						var newClass = animationClass+'-on';
						
						setTimeout(function(){
							thisElement.addClass(newClass);
						},animationDelay);
					}
				},{accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var button = {};
	eltd.modules.button = button;
	
	button.eltdButton = eltdButton;
	
	
	button.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdButton().init();
	}
	
	/**
	 * Button object that initializes whole button functionality
	 * @type {Function}
	 */
	var eltdButton = function() {
		//all buttons on the page
		var buttons = $('.eltd-btn');
		
		/**
		 * Initializes button hover color
		 * @param button current button
		 */
		var buttonHoverColor = function(button) {
			if(typeof button.data('hover-color') !== 'undefined') {
				var changeButtonColor = function(event) {
					event.data.button.css('color', event.data.color);
				};
				
				var originalColor = button.css('color');
				var hoverColor = button.data('hover-color');
				
				button.on('mouseenter', { button: button, color: hoverColor }, changeButtonColor);
				button.on('mouseleave', { button: button, color: originalColor }, changeButtonColor);
			}
		};
		
		/**
		 * Initializes button hover background color
		 * @param button current button
		 */
		var buttonHoverBgColor = function(button) {
			if(typeof button.data('hover-bg-color') !== 'undefined') {
				var changeButtonBg = function(event) {
					event.data.button.css('background-color', event.data.color);
				};
				
				var originalBgColor = button.css('background-color');
				var hoverBgColor = button.data('hover-bg-color');
				
				button.on('mouseenter', { button: button, color: hoverBgColor }, changeButtonBg);
				button.on('mouseleave', { button: button, color: originalBgColor }, changeButtonBg);
			}
		};
		
		/**
		 * Initializes button border color
		 * @param button
		 */
		var buttonHoverBorderColor = function(button) {
			if(typeof button.data('hover-border-color') !== 'undefined') {
				var changeBorderColor = function(event) {
					event.data.button.css('border-color', event.data.color);
				};
				
				var originalBorderColor = button.css('borderTopColor'); //take one of the four sides
				var hoverBorderColor = button.data('hover-border-color');
				
				button.on('mouseenter', { button: button, color: hoverBorderColor }, changeBorderColor);
				button.on('mouseleave', { button: button, color: originalBorderColor }, changeBorderColor);
			}
		};
		
		return {
			init: function() {
				if(buttons.length) {
					buttons.each(function() {
						buttonHoverColor($(this));
						buttonHoverBgColor($(this));
						buttonHoverBorderColor($(this));
					});
				}
			}
		};
	};
	
})(jQuery);
(function($) {
	'use strict';
	
	var countdown = {};
	eltd.modules.countdown = countdown;
	
	countdown.eltdInitCountdown = eltdInitCountdown;
	
	
	countdown.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitCountdown();
	}
	
	/**
	 * Countdown Shortcode
	 */
	function eltdInitCountdown() {
		var countdowns = $('.eltd-countdown'),
			date = new Date(),
			currentMonth = date.getMonth(),
			year,
			month,
			day,
			hour,
			minute,
			timezone,
			monthLabel,
			dayLabel,
			hourLabel,
			minuteLabel,
			secondLabel;
		
		if (countdowns.length) {
			countdowns.each(function(){
				//Find countdown elements by id-s
				var countdownId = $(this).attr('id'),
					countdown = $('#'+countdownId),
					digitFontSize,
					labelFontSize;
				
				//Get data for countdown
				year = countdown.data('year');
				month = countdown.data('month');
				day = countdown.data('day');
				hour = countdown.data('hour');
				minute = countdown.data('minute');
				timezone = countdown.data('timezone');
				monthLabel = countdown.data('month-label');
				dayLabel = countdown.data('day-label');
				hourLabel = countdown.data('hour-label');
				minuteLabel = countdown.data('minute-label');
				secondLabel = countdown.data('second-label');
				digitFontSize = countdown.data('digit-size');
				labelFontSize = countdown.data('label-size');

				if( currentMonth != month ) {
					month = month - 1;
				}
				
				//Initialize countdown
				countdown.countdown({
					until: new Date(year, month, day, hour, minute, 44),
					labels: ['', monthLabel, '', dayLabel, hourLabel, minuteLabel, secondLabel],
					format: 'ODHMS',
					timezone: timezone,
					padZeroes: true,
					onTick: setCountdownStyle
				});
				
				function setCountdownStyle() {
					countdown.find('.countdown-amount').css({
						'font-size' : digitFontSize+'px',
						'line-height' : digitFontSize+'px'
					});
					countdown.find('.countdown-period').css({
						'font-size' : labelFontSize+'px'
					});
				}
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var counter = {};
	eltd.modules.counter = counter;
	
	counter.eltdInitCounter = eltdInitCounter;
	
	
	counter.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitCounter();
	}
	
	/**
	 * Counter Shortcode
	 */
	function eltdInitCounter() {
		var counterHolder = $('.eltd-counter-holder');
		
		if (counterHolder.length) {
			counterHolder.each(function() {
				var thisCounterHolder = $(this),
					thisCounter = thisCounterHolder.find('.eltd-counter');
				
				thisCounterHolder.appear(function() {
					thisCounterHolder.css('opacity', '1');
					
					//Counter zero type
					if (thisCounter.hasClass('eltd-zero-counter')) {
						var max = parseFloat(thisCounter.text());
						thisCounter.countTo({
							from: 0,
							to: max,
							speed: 1500,
							refreshInterval: 100
						});
					} else {
						thisCounter.absoluteCounter({
							speed: 2000,
							fadeInDelay: 1000
						});
					}
				},{accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
			});
		}
	}
	
})(jQuery);
(function ($) {
	'use strict';
	
	var customFont = {};
	eltd.modules.customFont = customFont;
	
	customFont.eltdCustomFontResize = eltdCustomFontResize;
	customFont.eltdCustomFontTypeOut = eltdCustomFontTypeOut;
	
	
	customFont.eltdOnDocumentReady = eltdOnDocumentReady;
	customFont.eltdOnWindowLoad = eltdOnWindowLoad;
	
	$(document).ready(eltdOnDocumentReady);
	$(window).load(eltdOnWindowLoad);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdCustomFontResize();
	}
	
	/*
	 All functions to be called on $(window).load() should be in this function
	 */
	function eltdOnWindowLoad() {
		eltdCustomFontTypeOut();
	}
	
	/*
	 **	Custom Font resizing style
	 */
	function eltdCustomFontResize() {
		var holder = $('.eltd-custom-font-holder');
		
		if (holder.length) {
			holder.each(function () {
				var thisItem = $(this),
					itemClass = '',
					smallLaptopStyle = '',
					ipadLandscapeStyle = '',
					ipadPortraitStyle = '',
					mobileLandscapeStyle = '',
					style = '',
					responsiveStyle = '';
				
				if (typeof thisItem.data('item-class') !== 'undefined' && thisItem.data('item-class') !== false) {
					itemClass = thisItem.data('item-class');
				}
				
				if (typeof thisItem.data('font-size-1280') !== 'undefined' && thisItem.data('font-size-1280') !== false) {
					smallLaptopStyle += 'font-size: ' + thisItem.data('font-size-1280') + ' !important;';
				}
				if (typeof thisItem.data('font-size-1024') !== 'undefined' && thisItem.data('font-size-1024') !== false) {
					ipadLandscapeStyle += 'font-size: ' + thisItem.data('font-size-1024') + ' !important;';
				}
				if (typeof thisItem.data('font-size-768') !== 'undefined' && thisItem.data('font-size-768') !== false) {
					ipadPortraitStyle += 'font-size: ' + thisItem.data('font-size-768') + ' !important;';
				}
				if (typeof thisItem.data('font-size-680') !== 'undefined' && thisItem.data('font-size-680') !== false) {
					mobileLandscapeStyle += 'font-size: ' + thisItem.data('font-size-680') + ' !important;';
				}
				
				if (typeof thisItem.data('line-height-1280') !== 'undefined' && thisItem.data('line-height-1280') !== false) {
					smallLaptopStyle += 'line-height: ' + thisItem.data('line-height-1280') + ' !important;';
				}
				if (typeof thisItem.data('line-height-1024') !== 'undefined' && thisItem.data('line-height-1024') !== false) {
					ipadLandscapeStyle += 'line-height: ' + thisItem.data('line-height-1024') + ' !important;';
				}
				if (typeof thisItem.data('line-height-768') !== 'undefined' && thisItem.data('line-height-768') !== false) {
					ipadPortraitStyle += 'line-height: ' + thisItem.data('line-height-768') + ' !important;';
				}
				if (typeof thisItem.data('line-height-680') !== 'undefined' && thisItem.data('line-height-680') !== false) {
					mobileLandscapeStyle += 'line-height: ' + thisItem.data('line-height-680') + ' !important;';
				}
				
				if (smallLaptopStyle.length || ipadLandscapeStyle.length || ipadPortraitStyle.length || mobileLandscapeStyle.length) {
					
					if (smallLaptopStyle.length) {
						responsiveStyle += "@media only screen and (max-width: 1280px) {.eltd-custom-font-holder." + itemClass + " { " + smallLaptopStyle + " } }";
					}
					if (ipadLandscapeStyle.length) {
						responsiveStyle += "@media only screen and (max-width: 1024px) {.eltd-custom-font-holder." + itemClass + " { " + ipadLandscapeStyle + " } }";
					}
					if (ipadPortraitStyle.length) {
						responsiveStyle += "@media only screen and (max-width: 768px) {.eltd-custom-font-holder." + itemClass + " { " + ipadPortraitStyle + " } }";
					}
					if (mobileLandscapeStyle.length) {
						responsiveStyle += "@media only screen and (max-width: 680px) {.eltd-custom-font-holder." + itemClass + " { " + mobileLandscapeStyle + " } }";
					}
				}
				
				if (responsiveStyle.length) {
					style = '<style type="text/css">' + responsiveStyle + '</style>';
				}
				
				if (style.length) {
					$('head').append(style);
				}
			});
		}
	}
	
	/*
	 * Init Type out functionality for Custom Font shortcode
	 */
	function eltdCustomFontTypeOut() {
		var eltdTyped = $('.eltd-cf-typed');
		
		if (eltdTyped.length) {
			eltdTyped.each(function () {
				
				//vars
				var thisTyped = $(this),
					typedWrap = thisTyped.parent('.eltd-cf-typed-wrap'),
					customFontHolder = typedWrap.parent('.eltd-custom-font-holder'),
					str = [],
					string_1 = thisTyped.find('.eltd-cf-typed-1').text(),
					string_2 = thisTyped.find('.eltd-cf-typed-2').text(),
					string_3 = thisTyped.find('.eltd-cf-typed-3').text(),
					string_4 = thisTyped.find('.eltd-cf-typed-4').text();
				
				if (string_1.length) {
					str.push(string_1);
				}
				
				if (string_2.length) {
					str.push(string_2);
				}
				
				if (string_3.length) {
					str.push(string_3);
				}
				
				if (string_4.length) {
					str.push(string_4);
				}
				
				customFontHolder.appear(function () {
					thisTyped.typed({
						strings: str,
						typeSpeed: 90,
						backDelay: 700,
						loop: true,
						contentType: 'text',
						loopCount: false,
						cursorChar: '_'
					});
				}, {accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var elementsHolder = {};
	eltd.modules.elementsHolder = elementsHolder;
	
	elementsHolder.eltdInitElementsHolderResponsiveStyle = eltdInitElementsHolderResponsiveStyle;
	
	
	elementsHolder.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitElementsHolderResponsiveStyle();
	}
	
	/*
	 **	Elements Holder responsive style
	 */
	function eltdInitElementsHolderResponsiveStyle(){
		var elementsHolder = $('.eltd-elements-holder');
		
		if(elementsHolder.length){
			elementsHolder.each(function() {
				var thisElementsHolder = $(this),
					elementsHolderItem = thisElementsHolder.children('.eltd-eh-item'),
					style = '',
					responsiveStyle = '';
				
				elementsHolderItem.each(function() {
					var thisItem = $(this),
						itemClass = '',
						largeLaptop = '',
						smallLaptop = '',
						ipadLandscape = '',
						ipadPortrait = '',
						mobileLandscape = '',
						mobilePortrait = '';
					
					if (typeof thisItem.data('item-class') !== 'undefined' && thisItem.data('item-class') !== false) {
						itemClass = thisItem.data('item-class');
					}
					if (typeof thisItem.data('1280-1600') !== 'undefined' && thisItem.data('1280-1600') !== false) {
						largeLaptop = thisItem.data('1280-1600');
					}
					if (typeof thisItem.data('1024-1280') !== 'undefined' && thisItem.data('1024-1280') !== false) {
						smallLaptop = thisItem.data('1024-1280');
					}
					if (typeof thisItem.data('768-1024') !== 'undefined' && thisItem.data('768-1024') !== false) {
						ipadLandscape = thisItem.data('768-1024');
					}
					if (typeof thisItem.data('680-768') !== 'undefined' && thisItem.data('680-768') !== false) {
						ipadPortrait = thisItem.data('680-768');
					}
					if (typeof thisItem.data('680') !== 'undefined' && thisItem.data('680') !== false) {
						mobileLandscape = thisItem.data('680');
					}
					
					if(largeLaptop.length || smallLaptop.length || ipadLandscape.length || ipadPortrait.length || mobileLandscape.length || mobilePortrait.length) {
						
						if(largeLaptop.length) {
							responsiveStyle += "@media only screen and (min-width: 1281px) and (max-width: 1600px) {.eltd-eh-item-content."+itemClass+" { padding: "+largeLaptop+" !important; } }";
						}
						if(smallLaptop.length) {
							responsiveStyle += "@media only screen and (min-width: 1025px) and (max-width: 1280px) {.eltd-eh-item-content."+itemClass+" { padding: "+smallLaptop+" !important; } }";
						}
						if(ipadLandscape.length) {
							responsiveStyle += "@media only screen and (min-width: 769px) and (max-width: 1024px) {.eltd-eh-item-content."+itemClass+" { padding: "+ipadLandscape+" !important; } }";
						}
						if(ipadPortrait.length) {
							responsiveStyle += "@media only screen and (min-width: 681px) and (max-width: 768px) {.eltd-eh-item-content."+itemClass+" { padding: "+ipadPortrait+" !important; } }";
						}
						if(mobileLandscape.length) {
							responsiveStyle += "@media only screen and (max-width: 680px) {.eltd-eh-item-content."+itemClass+" { padding: "+mobileLandscape+" !important; } }";
						}
					}
				});
				
				if(responsiveStyle.length) {
					style = '<style type="text/css">'+responsiveStyle+'</style>';
				}
				
				if(style.length) {
					$('head').append(style);
				}
				
				if (typeof eltd.modules.common.eltdOwlSlider === "function") {
					eltd.modules.common.eltdOwlSlider();
				}
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var fullScreenSections = {};
	eltd.modules.fullScreenSections = fullScreenSections;
	
	fullScreenSections.eltdInitFullScreenSections = eltdInitFullScreenSections;
	
	
	fullScreenSections.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitFullScreenSections();
	}
	
	/*
	 **	Init full screen sections shortcode
	 */
	function eltdInitFullScreenSections(){
		var fullScreenSections = $('.eltd-full-screen-sections');
		
		if(fullScreenSections.length){
			fullScreenSections.each(function() {
				var thisFullScreenSections = $(this),
					fullScreenSectionsWrapper = thisFullScreenSections.children('.eltd-fss-wrapper'),
					fullScreenSectionsItems = fullScreenSectionsWrapper.children('.eltd-fss-item'),
					fullScreenSectionsItemsNumber = fullScreenSectionsItems.length,
					fullScreenSectionsItemsHasHeaderStyle = fullScreenSectionsItems.hasClass('eltd-fss-item-has-style'),
					enableContinuousVertical = false,
					enableNavigationData = '',
					enablePaginationData = '';
				
				var defaultHeaderStyle = '';
				if (eltd.body.hasClass('eltd-light-header')) {
					defaultHeaderStyle = 'light';
				} else if (eltd.body.hasClass('eltd-dark-header')) {
					defaultHeaderStyle = 'dark';
				}
				
				if (typeof thisFullScreenSections.data('enable-continuous-vertical') !== 'undefined' && thisFullScreenSections.data('enable-continuous-vertical') !== false && thisFullScreenSections.data('enable-continuous-vertical') === 'yes') {
					enableContinuousVertical = true;
				}
				if (typeof thisFullScreenSections.data('enable-navigation') !== 'undefined' && thisFullScreenSections.data('enable-navigation') !== false) {
					enableNavigationData = thisFullScreenSections.data('enable-navigation');
				}
				if (typeof thisFullScreenSections.data('enable-pagination') !== 'undefined' && thisFullScreenSections.data('enable-pagination') !== false) {
					enablePaginationData = thisFullScreenSections.data('enable-pagination');
				}
				
				var enableNavigation = enableNavigationData !== 'no',
					enablePagination = enablePaginationData !== 'no';
				
				fullScreenSectionsWrapper.fullpage({
					sectionSelector: '.eltd-fss-item',
					scrollingSpeed: 1200,
					verticalCentered: false,
					continuousVertical: enableContinuousVertical,
					navigation: enablePagination,
					onLeave: function(index, nextIndex, direction){
						if(fullScreenSectionsItemsHasHeaderStyle) {
							checkFullScreenSectionsItemForHeaderStyle($(fullScreenSectionsItems[nextIndex - 1]).data('header-style'), defaultHeaderStyle);
						}
						
						if(enableNavigation) {
							checkActiveArrowsOnFullScrrenTemplate(thisFullScreenSections, fullScreenSectionsItemsNumber, nextIndex);
						}
					},
					afterRender: function(){
						if(fullScreenSectionsItemsHasHeaderStyle) {
							checkFullScreenSectionsItemForHeaderStyle(fullScreenSectionsItems.first().data('header-style'), defaultHeaderStyle);
						}
						
						if(enableNavigation) {
							checkActiveArrowsOnFullScrrenTemplate(thisFullScreenSections, fullScreenSectionsItemsNumber, 1);
							thisFullScreenSections.children('.eltd-fss-nav-holder').css('visibility','visible');
						}
						
						fullScreenSectionsWrapper.css('visibility','visible');
					}
				});
				
				setResposniveData(thisFullScreenSections);
				
				if(enableNavigation) {
					thisFullScreenSections.find('#eltd-fss-nav-up').on('click', function() {
						$.fn.fullpage.moveSectionUp();
						return false;
					});
					
					thisFullScreenSections.find('#eltd-fss-nav-down').on('click', function() {
						$.fn.fullpage.moveSectionDown();
						return false;
					});
				}
			});
		}
	}
	
	function checkFullScreenSectionsItemForHeaderStyle(section_header_style, default_header_style) {
		if (section_header_style !== undefined && section_header_style !== '') {
			eltd.body.removeClass('eltd-light-header eltd-dark-header').addClass('eltd-' + section_header_style + '-header');
		} else if (default_header_style !== '') {
			eltd.body.removeClass('eltd-light-header eltd-dark-header').addClass('eltd-' + default_header_style + '-header');
		} else {
			eltd.body.removeClass('eltd-light-header eltd-dark-header');
		}
	}
	
	function checkActiveArrowsOnFullScrrenTemplate(thisFullScreenSections, fullScreenSectionsItemsNumber, index){
		var thisHolder = thisFullScreenSections,
			thisHolderArrowsUp = thisHolder.find('#eltd-fss-nav-up'),
			thisHolderArrowsDown = thisHolder.find('#eltd-fss-nav-down'),
			enableContinuousVertical = false;
		
		if (typeof thisFullScreenSections.data('enable-continuous-vertical') !== 'undefined' && thisFullScreenSections.data('enable-continuous-vertical') !== false && thisFullScreenSections.data('enable-continuous-vertical') === 'yes') {
			enableContinuousVertical = true;
		}
		
		if (index === 1 && !enableContinuousVertical) {
			thisHolderArrowsUp.css({'opacity': '0', 'height': '0', 'visibility': 'hidden'});
			thisHolderArrowsDown.css({'opacity': '0', 'height': '0', 'visibility': 'hidden'});
			
			if(index !== fullScreenSectionsItemsNumber){
				thisHolderArrowsDown.css({'opacity': '1', 'height': 'auto', 'visibility': 'visible'});
			}
		} else if (index === fullScreenSectionsItemsNumber && !enableContinuousVertical) {
			thisHolderArrowsDown.css({'opacity': '0', 'height': '0', 'visibility': 'hidden'});
			
			if(fullScreenSectionsItemsNumber === 2){
				thisHolderArrowsUp.css({'opacity': '1', 'height': 'auto', 'visibility': 'visible'});
			}
		} else {
			thisHolderArrowsUp.css({'opacity': '1', 'height': 'auto', 'visibility': 'visible'});
			thisHolderArrowsDown.css({'opacity': '1', 'height': 'auto', 'visibility': 'visible'});
		}
	}
	
	function setResposniveData(thisFullScreenSections) {
		var fullScreenSections = thisFullScreenSections.find('.eltd-fss-item'),
			responsiveStyle = '',
			style = '';
		
		fullScreenSections.each(function(){
			var thisSection = $(this),
				itemClass = '',
				imageLaptop = '',
				imageTablet = '',
				imagePortraitTablet = '',
				imageMobile = '';
			
			if (typeof thisSection.data('item-class') !== 'undefined' && thisSection.data('item-class') !== false) {
				itemClass = thisSection.data('item-class');
			}
			if (typeof thisSection.data('laptop-image') !== 'undefined' && thisSection.data('laptop-image') !== false) {
				imageLaptop = thisSection.data('laptop-image');
			}
			if (typeof thisSection.data('tablet-image') !== 'undefined' && thisSection.data('tablet-image') !== false) {
				imageTablet = thisSection.data('tablet-image');
			}
			if (typeof thisSection.data('tablet-portrait-image') !== 'undefined' && thisSection.data('tablet-portrait-image') !== false) {
				imagePortraitTablet = thisSection.data('tablet-portrait-image');
			}
			if (typeof thisSection.data('mobile-image') !== 'undefined' && thisSection.data('mobile-image') !== false) {
				imageMobile = thisSection.data('mobile-image');
			}
			
			if (imageLaptop.length || imageTablet.length || imagePortraitTablet.length || imageMobile.length) {
				
				if (imageLaptop.length) {
					responsiveStyle += "@media only screen and (max-width: 1280px) {.eltd-fss-item." + itemClass + " { background-image: url(" + imageLaptop + ") !important; } }";
				}
				if (imageTablet.length) {
					responsiveStyle += "@media only screen and (max-width: 1024px) {.eltd-fss-item." + itemClass + " { background-image: url( " + imageTablet + ") !important; } }";
				}
				if (imagePortraitTablet.length) {
					responsiveStyle += "@media only screen and (max-width: 800px) {.eltd-fss-item." + itemClass + " { background-image: url( " + imagePortraitTablet + ") !important; } }";
				}
				if (imageMobile.length) {
					responsiveStyle += "@media only screen and (max-width: 680px) {.eltd-fss-item." + itemClass + " { background-image: url( " + imageMobile + ") !important; } }";
				}
			}
		});
		
		if (responsiveStyle.length) {
			style = '<style type="text/css">' + responsiveStyle + '</style>';
		}
		
		if (style.length) {
			$('head').append(style);
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var glideSlider = {};
	eltd.modules.glideSlider = glideSlider;
	
	glideSlider.eltdInitGlideSlider = eltdInitGlideSlider;
	
	
	glideSlider.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitGlideSlider();
	}

	/*
     ** Glide slider
     */
    function eltdInitGlideSlider() {

        var glideSlider = $('.swiper-container.eltd-glide-slider');

        if (glideSlider.length) {
            glideSlider.each(function () {
                var swiper = $(this);

                var mouseWheelControl = swiper.data('mouse-wheel-control') == 'yes' ? true : false;
                var activeSlide = swiper.find('.eltd-swiper-active-slide');
                var allSlides = swiper.find('.eltd-swiper-all-slides');
                var contentEnteredFlag = false;
                var positionX,
                    holderWidth,
                    swiperWrapper = swiper.find('.swiper-wrapper');

                var eltdHalfNav = function() {
                    swiperWrapper.on('click', function(event){

                        if(!contentEnteredFlag){
                            if (event.pageX < swiper.offset().left  + swiper.width()/2) {
                                $('.eltd-swiper-button-prev').trigger("click");
                            } else {
                                $('.eltd-swiper-button-next').trigger("click");
                            }
                        }
                    });
                }

                var swiperSlider = new Swiper(swiper, {
                    loop: true,
                    parallax: true,
                    speed: 1000,
                    mousewheelControl: mouseWheelControl,
                    nextButton: '.eltd-swiper-button-next',
                    prevButton: '.eltd-swiper-button-prev',
                    onInit: function (mySwiper) {
                        var slidesNumber = mySwiper.slides.length - 2;

                        if (slidesNumber < 10) {
                            slidesNumber = '0' + slidesNumber;
                        }

                        allSlides.html(slidesNumber);
                        eltdHalfNav();
                    },
                    onSlideChangeEnd: function (mySwiper) {
                        var activeIndex = mySwiper.realIndex + 1;

                        if (activeIndex < 10) {
                            activeIndex = '0' + activeIndex;
                        }

                        activeSlide.html(activeIndex);
                    }
                });

                $(".eltd-slide-info-holder").mouseenter(function(){
                    contentEnteredFlag = true;
                });

                $(".eltd-slide-info-holder").mouseleave(function() {
                    contentEnteredFlag = false;
                });


                swiperWrapper.on( "mousemove", function( event ) {

                    if(!contentEnteredFlag){
                        positionX = 0 - (swiper.offset().left - event.pageX);
                        holderWidth = swiper.width();
                        if (positionX < holderWidth/2) {
                            swiper.attr('style', 'cursor:url(../wp-content/plugins/eltd-core/assets/img/glide-slide-arrow-left.png),w-resize!important');
                            swiper.find('a').attr('style', 'cursor:pointer!important');

                        } else {
                            swiper.attr('style', 'cursor:url(../wp-content/plugins/eltd-core/assets/img/glide-slide-arrow-right.png),w-resize!important');
                            swiper.find('a').attr('style', 'cursor:pointer!important');
                        }
                    } else {
                        swiperWrapper.find('.swiper-wrapper').attr('style', 'cursor:pointer,w-resize!important');
                    }

                });
            });
        }
    }
	
})(jQuery);
(function($) {
	'use strict';
	
	var googleMap = {};
	eltd.modules.googleMap = googleMap;
	
	googleMap.eltdShowGoogleMap = eltdShowGoogleMap;
	
	
	googleMap.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdShowGoogleMap();
	}
	
	/*
	 **	Show Google Map
	 */
	function eltdShowGoogleMap(){
		var googleMap = $('.eltd-google-map');
		
		if(googleMap.length){
			googleMap.each(function(){
				var element = $(this);
				
				var predefinedStyle = false;
				if(typeof element.data('predefined-style') !== 'undefined' && element.data('predefined-style') === 'yes') {
					predefinedStyle = true;
				}
				
				var customMapStyle;
				if(typeof element.data('custom-map-style') !== 'undefined') {
					customMapStyle = element.data('custom-map-style');
				}
				
				var colorOverlay;
				if(typeof element.data('color-overlay') !== 'undefined' && element.data('color-overlay') !== false) {
					colorOverlay = element.data('color-overlay');
				}
				
				var saturation;
				if(typeof element.data('saturation') !== 'undefined' && element.data('saturation') !== false) {
					saturation = element.data('saturation');
				}
				
				var lightness;
				if(typeof element.data('lightness') !== 'undefined' && element.data('lightness') !== false) {
					lightness = element.data('lightness');
				}
				
				var zoom;
				if(typeof element.data('zoom') !== 'undefined' && element.data('zoom') !== false) {
					zoom = element.data('zoom');
				}
				
				var pin;
				if(typeof element.data('pin') !== 'undefined' && element.data('pin') !== false) {
					pin = element.data('pin');
				}
				
				var mapHeight;
				if(typeof element.data('height') !== 'undefined' && element.data('height') !== false) {
					mapHeight = element.data('height');
				}
				
				var uniqueId;
				if(typeof element.data('unique-id') !== 'undefined' && element.data('unique-id') !== false) {
					uniqueId = element.data('unique-id');
				}
				
				var scrollWheel;
				if(typeof element.data('scroll-wheel') !== 'undefined') {
					scrollWheel = element.data('scroll-wheel');
				}
				var addresses;
				if(typeof element.data('addresses') !== 'undefined' && element.data('addresses') !== false) {
					addresses = element.data('addresses');
				}
				
				var map = "map_"+ uniqueId;
				var geocoder = "geocoder_"+ uniqueId;
				var holderId = "eltd-map-"+ uniqueId;
				
				eltdInitializeGoogleMap(predefinedStyle, customMapStyle, colorOverlay, saturation, lightness, scrollWheel, zoom, holderId, mapHeight, pin,  map, geocoder, addresses);
			});
		}
	}
	
	/*
	 **	Init Google Map
	 */
	function eltdInitializeGoogleMap(predefinedStyle, customMapStyle, color, saturation, lightness, wheel, zoom, holderId, height, pin,  map, geocoder, data){
		
		if(typeof google !== 'object') {
			return;
		}
		
		var mapStyles = [];
		if(predefinedStyle) {
			mapStyles = [
			    {
			        "featureType": "all",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "saturation": 36
			            },
			            {
			                "color": "#333333"
			            },
			            {
			                "lightness": 40
			            }
			        ]
			    },
			    {
			        "featureType": "all",
			        "elementType": "labels.text.stroke",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#ffffff"
			            },
			            {
			                "lightness": 16
			            }
			        ]
			    },
			    {
			        "featureType": "all",
			        "elementType": "labels.icon",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "color": "#fefefe"
			            },
			            {
			                "lightness": 20
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "color": "#fefefe"
			            },
			            {
			                "lightness": 17
			            },
			            {
			                "weight": 1.2
			            }
			        ]
			    },
			    {
			        "featureType": "landscape",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "lightness": 20
			            },
			            {
			                "color": "#ececec"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape.man_made",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#f0f0ef"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape.man_made",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#f0f0ef"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape.man_made",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#d4d4d4"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape.natural",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#ececec"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "lightness": 21
			            },
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#d4d4d4"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "color": "#303030"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "labels.icon",
			        "stylers": [
			            {
			                "saturation": "-100"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.attraction",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.business",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.government",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.medical",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.park",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.park",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#dedede"
			            },
			            {
			                "lightness": 21
			            }
			        ]
			    },
			    {
			        "featureType": "poi.place_of_worship",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.school",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.school",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "lightness": "-61"
			            },
			            {
			                "gamma": "0.00"
			            },
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.sports_complex",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "color": "#ffffff"
			            },
			            {
			                "lightness": 17
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "color": "#ffffff"
			            },
			            {
			                "lightness": 29
			            },
			            {
			                "weight": 0.2
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#ffffff"
			            },
			            {
			                "lightness": 18
			            }
			        ]
			    },
			    {
			        "featureType": "road.local",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#ffffff"
			            },
			            {
			                "lightness": 16
			            }
			        ]
			    },
			    {
			        "featureType": "transit",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#f2f2f2"
			            },
			            {
			                "lightness": 19
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#dadada"
			            },
			            {
			                "lightness": 17
			            }
			        ]
			    }
			];
		} else {
			mapStyles = [
				{
					stylers: [
						{hue: color },
						{saturation: saturation},
						{lightness: lightness},
						{gamma: 1}
					]
				}
			];
		}
		
		var googleMapStyleId;
		
		if(predefinedStyle || customMapStyle === 'yes'){
			googleMapStyleId = 'eltd-style';
		} else {
			googleMapStyleId = google.maps.MapTypeId.ROADMAP;
		}
		
		if(wheel === 'yes'){
			wheel = true;
		} else {
			wheel = false;
		}
		
		var qoogleMapType = new google.maps.StyledMapType(mapStyles, {name: "Elated Google Map"});
		
		geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(-34.397, 150.644);
		
		if (!isNaN(height)){
			height = height + 'px';
		}
		
		var myOptions = {
			zoom: zoom,
			scrollwheel: wheel,
			center: latlng,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			scaleControl: false,
			scaleControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			streetViewControl: false,
			streetViewControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			panControl: false,
			panControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			mapTypeControl: false,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'eltd-style'],
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			mapTypeId: googleMapStyleId
		};
		
		map = new google.maps.Map(document.getElementById(holderId), myOptions);
		map.mapTypes.set('eltd-style', qoogleMapType);
		
		var index;
		
		for (index = 0; index < data.length; ++index) {
			eltdInitializeGoogleAddress(data[index], pin, map, geocoder);
		}
		
		var holderElement = document.getElementById(holderId);
		holderElement.style.height = height;
	}
	
	/*
	 **	Init Google Map Addresses
	 */
	function eltdInitializeGoogleAddress(data, pin, map, geocoder){
		if (data === '') {
			return;
		}
		
		var contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent">'+
			'<p>'+data+'</p>'+
			'</div>'+
			'</div>';
		
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		
		geocoder.geocode( { 'address': data}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					icon:  pin,
					title: data.store_title
				});
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});
				
				google.maps.event.addDomListener(window, 'resize', function() {
					map.setCenter(results[0].geometry.location);
				});
			}
		});
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var icon = {};
	eltd.modules.icon = icon;
	
	icon.eltdIcon = eltdIcon;
	
	
	icon.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdIcon().init();
	}
	
	/**
	 * Object that represents icon shortcode
	 * @returns {{init: Function}} function that initializes icon's functionality
	 */
	var eltdIcon = function() {
		var icons = $('.eltd-icon-shortcode');
		
		/**
		 * Function that triggers icon animation and icon animation delay
		 */
		var iconAnimation = function(icon) {
			if(icon.hasClass('eltd-icon-animation')) {
				icon.appear(function() {
					icon.parent('.eltd-icon-animation-holder').addClass('eltd-icon-animation-show');
				}, {accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
			}
		};
		
		/**
		 * Function that triggers icon hover color functionality
		 */
		var iconHoverColor = function(icon) {
			if(typeof icon.data('hover-color') !== 'undefined') {
				var changeIconColor = function(event) {
					event.data.icon.css('color', event.data.color);
				};
				
				var iconElement = icon.find('.eltd-icon-element');
				var hoverColor = icon.data('hover-color');
				var originalColor = iconElement.css('color');
				
				if(hoverColor !== '') {
					icon.on('mouseenter', {icon: iconElement, color: hoverColor}, changeIconColor);
					icon.on('mouseleave', {icon: iconElement, color: originalColor}, changeIconColor);
				}
			}
		};
		
		/**
		 * Function that triggers icon holder background color hover functionality
		 */
		var iconHolderBackgroundHover = function(icon) {
			if(typeof icon.data('hover-background-color') !== 'undefined') {
				var changeIconBgColor = function(event) {
					event.data.icon.css('background-color', event.data.color);
				};
				
				var hoverBackgroundColor = icon.data('hover-background-color');
				var originalBackgroundColor = icon.css('background-color');
				
				if(hoverBackgroundColor !== '') {
					icon.on('mouseenter', {icon: icon, color: hoverBackgroundColor}, changeIconBgColor);
					icon.on('mouseleave', {icon: icon, color: originalBackgroundColor}, changeIconBgColor);
				}
			}
		};
		
		/**
		 * Function that initializes icon holder border hover functionality
		 */
		var iconHolderBorderHover = function(icon) {
			if(typeof icon.data('hover-border-color') !== 'undefined') {
				var changeIconBorder = function(event) {
					event.data.icon.css('border-color', event.data.color);
				};
				
				var hoverBorderColor = icon.data('hover-border-color');
				var originalBorderColor = icon.css('borderTopColor');
				
				if(hoverBorderColor !== '') {
					icon.on('mouseenter', {icon: icon, color: hoverBorderColor}, changeIconBorder);
					icon.on('mouseleave', {icon: icon, color: originalBorderColor}, changeIconBorder);
				}
			}
		};
		
		return {
			init: function() {
				if(icons.length) {
					icons.each(function() {
						iconAnimation($(this));
						iconHoverColor($(this));
						iconHolderBackgroundHover($(this));
						iconHolderBorderHover($(this));
					});
				}
			}
		};
	};
	
})(jQuery);
(function($) {
	'use strict';
	
	var iconListItem = {};
	eltd.modules.iconListItem = iconListItem;
	
	iconListItem.eltdInitIconList = eltdInitIconList;
	
	
	iconListItem.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitIconList().init();
	}
	
	/**
	 * Button object that initializes icon list with animation
	 * @type {Function}
	 */
	var eltdInitIconList = function() {
		var iconList = $('.eltd-animate-list');
		
		/**
		 * Initializes icon list animation
		 * @param list current slider
		 */
		var iconListInit = function(list) {
			setTimeout(function(){
				list.appear(function(){
					list.addClass('eltd-appeared');
				},{accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
			},30);
		};
		
		return {
			init: function() {
				if(iconList.length) {
					iconList.each(function() {
						iconListInit($(this));
					});
				}
			}
		};
	};
	
})(jQuery);
(function($) {
    'use strict';
	
	var imageGallery = {};
	eltd.modules.imageGallery = imageGallery;
	
	imageGallery.eltdInitImageGalleryMasonry = eltdInitImageGalleryMasonry;
	
	
	imageGallery.eltdOnWindowLoad = eltdOnWindowLoad;
	
	$(window).load(eltdOnWindowLoad);
	
	/*
	 ** All functions to be called on $(window).load() should be in this function
	 */
	function eltdOnWindowLoad() {
		eltdInitImageGalleryMasonry();
	}
	
	/*
	 ** Init Image Gallery shortcode - Masonry layout
	 */
	function eltdInitImageGalleryMasonry(){
		var holder = $('.eltd-image-gallery.eltd-ig-masonry-type');
		
		if(holder.length){
			holder.each(function(){
				var thisHolder = $(this),
					masonry = thisHolder.find('.eltd-ig-masonry');
				
				masonry.waitForImages(function() {
					masonry.isotope({
						layoutMode: 'packery',
						itemSelector: '.eltd-ig-image',
						percentPosition: true,
						packery: {
							gutter: '.eltd-ig-grid-gutter',
							columnWidth: '.eltd-ig-grid-sizer'
						}
					});
					
					setTimeout(function() {
						masonry.isotope('layout');
						eltd.modules.common.eltdInitParallax();
					}, 1500);
					
					masonry.css('opacity', '1');
				});
			});
		}
	}

})(jQuery);
(function($) {
    'use strict';

    var interactiveLinkShowcase = {};
    eltd.modules.interactiveLinkShowcase = interactiveLinkShowcase;

    interactiveLinkShowcase.eltdInitInteractiveLinkShowcase = eltdInitInteractiveLinkShowcase;


    interactiveLinkShowcase.eltdOnDocumentReady = eltdOnDocumentReady;
    interactiveLinkShowcase.eltdOnWindowResize = eltdOnWindowResize;
    interactiveLinkShowcase.eltdOnWindowLoad = eltdOnWindowLoad;

    $(document).ready(eltdOnDocumentReady);
    $(window).resize(eltdOnWindowResize);
    $(window).load(eltdOnWindowLoad);


    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function eltdOnWindowLoad() {
        eltdInitInteractiveLinkShowcase();
        eltdInitInteractiveLinkResizing();
    }

    /*
     All functions to be called on $(document).load() should be in this function
     */
    function eltdOnDocumentReady() {
        eltdInteractiveLinkShowcaseHeight();
    }

    /*
     All functions to be called on $(window).resize() should be in this function
     */
    function eltdOnWindowResize() {
        eltdInitInteractiveLinkShowcase();
        eltdInitInteractiveLinkResizing();
    }

    function eltdInteractiveLinkShowcaseHeight() {
        var holder = $('.eltd-ils');
        var items = holder.find('.eltd-ils-image-holder');

        if (eltd.windowWidth > 1024) {
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
        
    }

    /**
     * Init item showcase shortcode
     */
    function eltdInitInteractiveLinkShowcase() {
        var interactiveLinkShowcase = $('.eltd-ils');

        if (interactiveLinkShowcase.length && !eltd.htmlEl.hasClass('touch')) {
            interactiveLinkShowcase.each(function(){
                var thisInteractiveLinkShowcase = $(this),
                	items = thisInteractiveLinkShowcase.find('.eltd-ils-item-content');

                // var windowHeight = eltd.windowWidth > 1024 ? eltd.windowHeight : eltd.windowHeight - eltdGlobalVars.vars.eltdMobileHeaderHeight;

                if (eltd.windowWidth > 1024) {
                // thisInteractiveLinkShowcase.css('height', windowHeight);
                    thisInteractiveLinkShowcase.css('width', eltd.windowWidth);
                }
                var singleImage = thisInteractiveLinkShowcase.find('.eltd-ils-item-image'),
                    singleLink  = thisInteractiveLinkShowcase.find('.eltd-ils-item-link');

                singleImage.eq(0).addClass('active');
                singleLink.parent().eq(0).addClass('active');
                singleLink.parent().addClass('loaded');

                singleLink.on('mouseenter', function() {
                    singleImage.removeClass('active');
                    singleLink.parent().removeClass('active');
                    var thisLink = $(this),
                        index = thisLink.parent().index();
                    thisLink.parent().addClass('active');
                    singleImage.eq(index).addClass('active');
                });
            });
        }
    }

    function eltdInitInteractiveLinkResizing(){
        var interactiveLinkShowcase = $('.eltd-ils');

        if (interactiveLinkShowcase.length) {
            interactiveLinkShowcase.each(function(){
                var thisInteractiveLinkShowcase = $(this),
                	items = thisInteractiveLinkShowcase.find('.eltd-ils-item-content'),
                	itemsCopy = thisInteractiveLinkShowcase.find('.eltd-ils-item-content-copy');

				items.each(function (e) {
					var thisItem = $(this),
						thisItemCopy = itemsCopy.eq(e),
						itemFontSize = parseInt(thisItem.css('font-size')),
						coef1 = 1,
						coef2 = 1;

					if (typeof(thisItem.data('font-size')) == 'undefined'){
						thisItem.data('font-size',itemFontSize);
					} else {
						itemFontSize = thisItem.data('font-size');
					}

	                if (eltd.windowWidth < 1400){
	                    coef2 = 0.85;
	                }

	                if (eltd.windowWidth < 1300){
	                    coef1 = 0.8;
	                    coef2 = 0.7;
	                }

	                if (eltd.windowWidth < 1024){
	                    coef1 = 0.7;
	                    coef2 = 0.6;
	                }

	                if (eltd.windowWidth < 769){
	                    coef1 = 0.6;
	                    coef2 = 0.5;
	                }

	                if (eltd.windowWidth < 600){
	                    coef1 = 0.5;
	                    coef2 = 0.4;
	                }

	                if (eltd.windowWidth < 480){
	                    coef1 = 0.4;
	                    coef2 = 0.27;
	                }


                    if  (itemFontSize > 100){
                        itemFontSize = Math.round(itemFontSize*coef2);
                    }
                    else if (itemFontSize > 50) {
                        itemFontSize = Math.round(itemFontSize*coef1);
                    }

                    thisItem.css('font-size',itemFontSize + 'px');
                    thisItemCopy.css('font-size',itemFontSize + 'px');
				});
            });
        }

    }

})(jQuery);
(function($) {
	'use strict';
	
	var itemShowcase = {};
	eltd.modules.itemShowcase = itemShowcase;
	
	itemShowcase.eltdInitItemShowcase = eltdInitItemShowcase;
	
	
	itemShowcase.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitItemShowcase();
	}
	
	/**
	 * Init item showcase shortcode
	 */
	function eltdInitItemShowcase() {
		var itemShowcase = $('.eltd-item-showcase-holder');
		
		if (itemShowcase.length) {
			itemShowcase.each(function(){
				var thisItemShowcase = $(this),
					leftItems = thisItemShowcase.find('.eltd-is-left'),
					rightItems = thisItemShowcase.find('.eltd-is-right'),
					itemImage = thisItemShowcase.find('.eltd-is-image');
				
				//logic
				leftItems.wrapAll( "<div class='eltd-is-item-holder eltd-is-left-holder' />");
				rightItems.wrapAll( "<div class='eltd-is-item-holder eltd-is-right-holder' />");
				thisItemShowcase.animate({opacity:1},200);
				
				setTimeout(function(){
					thisItemShowcase.appear(function(){
						itemImage.addClass('eltd-appeared');
						thisItemShowcase.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
							function(e) {
								if(eltd.windowWidth > 1200) {
									itemAppear('.eltd-is-left-holder .eltd-is-item');
									itemAppear('.eltd-is-right-holder .eltd-is-item');
								} else {
									itemAppear('.eltd-is-item');
								}
							});
					},{accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
				},100);
				
				//appear animation trigger
				function itemAppear(itemCSSClass) {
					thisItemShowcase.find(itemCSSClass).each(function(i){
						var thisListItem = $(this);
						setTimeout(function(){
							thisListItem.addClass('eltd-appeared');
						}, i*150);
					});
				}
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var pieChart = {};
	eltd.modules.pieChart = pieChart;
	
	pieChart.eltdInitPieChart = eltdInitPieChart;
	
	
	pieChart.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitPieChart();
	}
	
	/**
	 * Init Pie Chart shortcode
	 */
	function eltdInitPieChart() {
		var pieChartHolder = $('.eltd-pie-chart-holder');
		
		if (pieChartHolder.length) {
			pieChartHolder.each(function () {
				var thisPieChartHolder = $(this),
					pieChart = thisPieChartHolder.children('.eltd-pc-percentage'),
					barColor = '#25abd1',
					trackColor = '#f7f7f7',
					lineWidth = 3,
					size = 176;
				
				if(typeof pieChart.data('size') !== 'undefined' && pieChart.data('size') !== '') {
					size = pieChart.data('size');
				}
				
				if(typeof pieChart.data('bar-color') !== 'undefined' && pieChart.data('bar-color') !== '') {
					barColor = pieChart.data('bar-color');
				}
				
				if(typeof pieChart.data('track-color') !== 'undefined' && pieChart.data('track-color') !== '') {
					trackColor = pieChart.data('track-color');
				}
				
				pieChart.appear(function() {
					initToCounterPieChart(pieChart);
					thisPieChartHolder.css('opacity', '1');
					
					pieChart.easyPieChart({
						barColor: barColor,
						trackColor: trackColor,
						scaleColor: false,
						lineCap: 'butt',
						lineWidth: lineWidth,
						animate: 1500,
						size: size
					});
				},{accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
			});
		}
	}
	
	/*
	 **	Counter for pie chart number from zero to defined number
	 */
	function initToCounterPieChart(pieChart){
		var counter = pieChart.find('.eltd-pc-percent'),
			max = parseFloat(counter.text());
		
		counter.countTo({
			from: 0,
			to: max,
			speed: 1500,
			refreshInterval: 50
		});
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var process = {};
	eltd.modules.process = process;
	
	process.eltdInitProcess = eltdInitProcess;
	
	
	process.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitProcess()
	}
	
	/**
	 * Inti process shortcode on appear
	 */
	function eltdInitProcess() {
		var holder = $('.eltd-process-holder');
		
		if(holder.length) {
			holder.each(function(){
				var thisHolder = $(this);
				
				thisHolder.appear(function(){
					thisHolder.addClass('eltd-process-appeared');
				},{accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var progressBar = {};
	eltd.modules.progressBar = progressBar;
	
	progressBar.eltdInitProgressBars = eltdInitProgressBars;
	
	
	progressBar.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitProgressBars();
	}
	
	/*
	 **	Horizontal progress bars shortcode
	 */
	function eltdInitProgressBars(){
		var progressBar = $('.eltd-progress-bar');
		
		if(progressBar.length){
			progressBar.each(function() {
				var thisBar = $(this),
					thisBarContent = thisBar.find('.eltd-pb-content'),
					percentage = thisBarContent.data('percentage');
				
				thisBar.appear(function() {
					eltdInitToCounterProgressBar(thisBar, percentage);
					
					thisBarContent.css('width', '0%');
					thisBarContent.animate({'width': percentage+'%'}, 2000);
				});
			});
		}
	}
	
	/*
	 **	Counter for horizontal progress bars percent from zero to defined percent
	 */
	function eltdInitToCounterProgressBar(progressBar, $percentage){
		var percentage = parseFloat($percentage),
			percent = progressBar.find('.eltd-pb-percent');
		
		if(percent.length) {
			percent.each(function() {
				var thisPercent = $(this);
				thisPercent.css('opacity', '1');
				
				thisPercent.countTo({
					from: 0,
					to: percentage,
					speed: 2000,
					refreshInterval: 50
				});
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var tabs = {};
	eltd.modules.tabs = tabs;
	
	tabs.eltdInitTabs = eltdInitTabs;
	
	
	tabs.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitTabs();
	}
	
	/*
	 **	Init tabs shortcode
	 */
	function eltdInitTabs(){
		var tabs = $('.eltd-tabs');
		
		if(tabs.length){
			tabs.each(function(){
				var thisTabs = $(this);
				
				thisTabs.children('.eltd-tab-container').each(function(index){
					index = index + 1;
					var that = $(this),
						link = that.attr('id'),
						navItem = that.parent().find('.eltd-tabs-nav li:nth-child('+index+') a'),
						navLink = navItem.attr('href');
					
					link = '#'+link;

					if(link.indexOf(navLink) > -1) {
						navItem.attr('href',link);
					}
				});
				
				thisTabs.tabs();

                $('.eltd-tabs a.eltd-external-link').unbind('click');
			});
		}
	}
	
})(jQuery);
(function($) {
    'use strict';

    var uncoveringSections = {};
    eltd.modules.uncoveringSections = uncoveringSections;

    uncoveringSections.eltdInitUncoveringSections = eltdInitUncoveringSections;


    uncoveringSections.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);

    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function eltdOnDocumentReady() {
        eltdInitUncoveringSections();
    }

    /*
     **	Init full screen sections shortcode
     */
    function eltdInitUncoveringSections(){
        var uncoveringSections = $('.eltd-uncovering-sections');

        if(uncoveringSections.length){
            uncoveringSections.each(function() {
                var thisUS = $(this),
                    thisCurtain = uncoveringSections.find('.curtains'),
                    curtainItems = thisCurtain.find('.eltd-uss-item'),
                    curtainShadow = uncoveringSections.find('.eltd-fss-shadow');
                var body = eltd.body;
                var defaultHeaderStyle = '';
                if (body.hasClass('eltd-light-header')) {
                    defaultHeaderStyle = 'light';
                } else if (body.hasClass('eltd-dark-header')) {
                    defaultHeaderStyle = 'dark';
                }

                body.addClass('eltd-uncovering-section-on-page');
                if(eltdPerPageVars.vars.eltdHeaderVerticalWidth > 0 && eltd.windowWidth > 1024) {
                    curtainItems.css({
                        left : eltdPerPageVars.vars.eltdHeaderVerticalWidth,
                        width: 'calc(100% - ' + eltdPerPageVars.vars.eltdHeaderVerticalWidth + 'px)'
                    });

                    curtainShadow.css({
                        left : eltdPerPageVars.vars.eltdHeaderVerticalWidth,
                        width: 'calc(100% - ' + eltdPerPageVars.vars.eltdHeaderVerticalWidth + 'px)'
                    });
                }

                thisCurtain.curtain({
                    scrollSpeed: 400,
                    nextSlide: function() { checkFullScreenSectionsItemForHeaderStyle(thisCurtain, defaultHeaderStyle); },
                    prevSlide: function() { checkFullScreenSectionsItemForHeaderStyle(thisCurtain, defaultHeaderStyle);}
                });

                checkFullScreenSectionsItemForHeaderStyle(thisCurtain, defaultHeaderStyle);
                setResposniveData(thisCurtain);

                thisUS.addClass('eltd-loaded');
            });
        }
    }

    function checkFullScreenSectionsItemForHeaderStyle(thisUncoveringSections, default_header_style) {
        var section_header_style = thisUncoveringSections.find('.current').data('header-style');
        if (section_header_style !== undefined && section_header_style !== '') {
            eltd.body.removeClass('eltd-light-header eltd-dark-header').addClass('eltd-' + section_header_style + '-header');
        } else if (default_header_style !== '') {
            eltd.body.removeClass('eltd-light-header eltd-dark-header').addClass('eltd-' + default_header_style + '-header');
        } else {
            eltd.body.removeClass('eltd-light-header eltd-dark-header');
        }
    }

    function setResposniveData(thisUncoveringSections) {
        var uncoveringSections = thisUncoveringSections.find('.eltd-uss-item'),
            responsiveStyle = '',
            style = '';

        uncoveringSections.each(function(){
            var thisSection = $(this),
                thisSectionImage = thisSection.find('.eltd-uss-image-holder'),
                itemClass = '',
                imageLaptop = '',
                imageTablet = '',
                imagePortraitTablet = '',
                imageMobile = '';

            if (typeof thisSection.data('item-class') !== 'undefined' && thisSection.data('item-class') !== false) {
                itemClass = thisSection.data('item-class');
            }

            if (typeof thisSectionImage.data('laptop-image') !== 'undefined' && thisSectionImage.data('laptop-image') !== false) {
                imageLaptop = thisSectionImage.data('laptop-image');
            }
            if (typeof thisSectionImage.data('tablet-image') !== 'undefined' && thisSectionImage.data('tablet-image') !== false) {
                imageTablet = thisSectionImage.data('tablet-image');
            }
            if (typeof thisSectionImage.data('tablet-portrait-image') !== 'undefined' && thisSectionImage.data('tablet-portrait-image') !== false) {
                imagePortraitTablet = thisSectionImage.data('tablet-portrait-image');
            }
            if (typeof thisSectionImage.data('mobile-image') !== 'undefined' && thisSectionImage.data('mobile-image') !== false) {
                imageMobile = thisSectionImage.data('mobile-image');
            }


            if (imageLaptop.length || imageTablet.length || imagePortraitTablet.length || imageMobile.length) {

                if (imageLaptop.length) {
                    responsiveStyle += "@media only screen and (max-width: 1280px) {.eltd-uss-item." + itemClass + " .eltd-uss-image-holder { background-image: url(" + imageLaptop + ") !important; } }";
                }
                if (imageTablet.length) {
                    responsiveStyle += "@media only screen and (max-width: 1024px) {.eltd-uss-item." + itemClass + " .eltd-uss-image-holder { background-image: url( " + imageTablet + ") !important; } }";
                }
                if (imagePortraitTablet.length) {
                    responsiveStyle += "@media only screen and (max-width: 800px) {.eltd-uss-item." + itemClass + " .eltd-uss-image-holder { background-image: url( " + imagePortraitTablet + ") !important; } }";
                }
                if (imageMobile.length) {
                    responsiveStyle += "@media only screen and (max-width: 680px) {.eltd-uss-item." + itemClass + " .eltd-uss-image-holder { background-image: url( " + imageMobile + ") !important; } }";
                }
            }
        });

        if (responsiveStyle.length) {
            style = '<style type="text/css">' + responsiveStyle + '</style>';
        }

        if (style.length) {
            $('head').append(style);
        }
    }

})(jQuery);
(function($) {
	'use strict';
	
	var verticalSplitSlider = {};
	eltd.modules.verticalSplitSlider = verticalSplitSlider;
	
	verticalSplitSlider.eltdInitVerticalSplitSlider = eltdInitVerticalSplitSlider;
	
	
	verticalSplitSlider.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitVerticalSplitSlider();
	}
	
	/*
	 **	Vertical Split Slider
	 */
	function eltdInitVerticalSplitSlider() {
		var slider = $('.eltd-vertical-split-slider');
		
		if (slider.length) {
			if (eltd.body.hasClass('eltd-vss-initialized')) {
				eltd.body.removeClass('eltd-vss-initialized');
				$.fn.multiscroll.destroy();
			}
			
			slider.height(eltd.windowHeight).animate({opacity: 1}, 300);
			
			var defaultHeaderStyle = '';
			if (eltd.body.hasClass('eltd-light-header')) {
				defaultHeaderStyle = 'light';
			} else if (eltd.body.hasClass('eltd-dark-header')) {
				defaultHeaderStyle = 'dark';
			}
			
			slider.multiscroll({
				scrollingSpeed: 700,
				easing: 'easeInOutQuart',
				navigation: true,
				useAnchorsOnLoad: false,
				sectionSelector: '.eltd-vss-ms-section',
				leftSelector: '.eltd-vss-ms-left',
				rightSelector: '.eltd-vss-ms-right',
				afterRender: function () {
					eltdCheckVerticalSplitSectionsForHeaderStyle($('.eltd-vss-ms-left .eltd-vss-ms-section:first-child').data('header-style'), defaultHeaderStyle);
					eltd.body.addClass('eltd-vss-initialized');
					
					var contactForm7 = $('div.wpcf7 > form');
					if (contactForm7.length) {
						contactForm7.each(function(){
							var thisForm = $(this);
							
							thisForm.find('.wpcf7-submit').off().on('click', function(e){
								e.preventDefault();
								wpcf7.submit(thisForm);
							});
						});
					}
					
					//prepare html for smaller screens - start //
					var verticalSplitSliderResponsive = $('<div class="eltd-vss-responsive"></div>'),
						leftSide = slider.find('.eltd-vss-ms-left > div'),
						rightSide = slider.find('.eltd-vss-ms-right > div');
					
					slider.after(verticalSplitSliderResponsive);
					
					for (var i = 0; i < leftSide.length; i++) {
						verticalSplitSliderResponsive.append($(leftSide[i]).clone(true));
						verticalSplitSliderResponsive.append($(rightSide[leftSide.length - 1 - i]).clone(true));
					}
					
					//prepare google maps clones
					var googleMapHolder = $('.eltd-vss-responsive .eltd-google-map');
					if (googleMapHolder.length) {
						googleMapHolder.each(function () {
							var map = $(this);
							map.empty();
							var num = Math.floor((Math.random() * 100000) + 1);
							map.attr('id', 'eltd-map-' + num);
							map.data('unique-id', num);
						});
					}
					
					if (typeof eltd.modules.animationHolder.eltdInitAnimationHolder === "function") {
						eltd.modules.animationHolder.eltdInitAnimationHolder();
					}
					
					if (typeof eltd.modules.button.eltdButton === "function") {
						eltd.modules.button.eltdButton().init();
					}
					
					if (typeof eltd.modules.elementsHolder.eltdInitElementsHolderResponsiveStyle === "function") {
						eltd.modules.elementsHolder.eltdInitElementsHolderResponsiveStyle();
					}
					
					if (typeof eltd.modules.googleMap.eltdShowGoogleMap === "function") {
						eltd.modules.googleMap.eltdShowGoogleMap();
					}
					
					if (typeof eltd.modules.icon.eltdIcon === "function") {
						eltd.modules.icon.eltdIcon().init();
					}
					
					if (typeof eltd.modules.progressBar.eltdInitProgressBars === "function") {
						eltd.modules.progressBar.eltdInitProgressBars();
					}
				},
				onLeave: function (index, nextIndex) {
					eltdIntiScrollAnimation(slider, nextIndex);
					eltdCheckVerticalSplitSectionsForHeaderStyle($($('.eltd-vss-ms-left .eltd-vss-ms-section')[$(".eltd-vss-ms-left .eltd-vss-ms-section").length - nextIndex]).data('header-style'), defaultHeaderStyle);
				}
			});
			
			if (eltd.windowWidth <= 1024) {
				$.fn.multiscroll.destroy();
			} else {
				$.fn.multiscroll.build();
			}
			
			$(window).resize(function () {
				if (eltd.windowWidth <= 1024) {
					$.fn.multiscroll.destroy();
				} else {
					$.fn.multiscroll.build();
				}
			});
		}
	}
	
	function eltdIntiScrollAnimation(slider, nextIndex) {
		
		if (slider.hasClass('eltd-vss-scrolling-animation')) {
			
			if (nextIndex > 1 && !slider.hasClass('eltd-vss-scrolled')) {
				slider.addClass('eltd-vss-scrolled');
			} else if (nextIndex === 1 && slider.hasClass('eltd-vss-scrolled')) {
				slider.removeClass('eltd-vss-scrolled');
			}
		}
	}
	
	/*
	 **	Check slides on load and slide change for header style changing
	 */
	function eltdCheckVerticalSplitSectionsForHeaderStyle(section_header_style, default_header_style) {
		if (section_header_style !== undefined && section_header_style !== '') {
			eltd.body.removeClass('eltd-light-header eltd-dark-header').addClass('eltd-' + section_header_style + '-header');
		} else if (default_header_style !== '') {
			eltd.body.removeClass('eltd-light-header eltd-dark-header').addClass('eltd-' + default_header_style + '-header');
		} else {
			eltd.body.removeClass('eltd-light-header eltd-dark-header');
		}
	}
	
})(jQuery);
(function($) {
    'use strict';

    var hspList = {};
    eltd.modules.borderedCarousel = hspList;

    hspList.eltdHspList = eltdHspList;
    hspList.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);

    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function eltdOnDocumentReady() {
        eltdHspList();
    }

    /**
     * Init bordered carousel shortcode
     */

    function eltdHspList() {
        var carouselHolder = $('.eltd-horizontally-scrolling-portfolio-list-holder .eltd-hspl-images-holder');

        if (carouselHolder.length) {

            carouselHolder.css('height',eltd.windowHeight);

            carouselHolder.each(function(){
                var carousel = $(this),
                    carouselMain = carousel.find('.swiper-container.eltd-swiper-main'),
                    carouselThumbs = carousel.find('.swiper-container.eltd-swiper-thumbs:first'),
                    transitionSpeed = 1000,
                    widgetArea = carousel.find('.eltd-hsplist-widget-area'); 

                var swiperSliderMain = new Swiper (carouselMain, {
                    loop: true,
                    speed: transitionSpeed,
                    mousewheel: true,
                    slidesPerView: 'auto',
                    slidesPerGroup: 1,
                    init: false
                });

                var swiperSliderThumbs = new Swiper (carouselThumbs, {
                    loop: true,
                    speed: transitionSpeed,
                    mousewheel: true,
                    slidesPerView: 'auto',
                    slidesPerGroup: 1,
                    init: false
                });

                var mouseTrigger = function(){
                    carousel.on('mousewheel', function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        if(e.deltaY<0){
                            swiperSliderMain.slidePrev(transitionSpeed);
                            swiperSliderThumbs.slidePrev(transitionSpeed+200);
                        } else {
                            swiperSliderMain.slideNext(transitionSpeed);
                            swiperSliderThumbs.slideNext(transitionSpeed+200);
                        }

                    });
                }

                $(window).load(function(){
                    swiperSliderMain.init();
                    swiperSliderThumbs.init();
                    mouseTrigger();
                });

                $(window).resize(function(){
                    setTimeout(function(){
                        carouselHolder.css('height',eltd.windowHeight);
                    }, 200);
                });
            });
        }
    }
})(jQuery);

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