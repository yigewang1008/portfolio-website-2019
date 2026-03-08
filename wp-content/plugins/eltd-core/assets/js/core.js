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