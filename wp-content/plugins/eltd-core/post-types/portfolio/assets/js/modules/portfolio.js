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