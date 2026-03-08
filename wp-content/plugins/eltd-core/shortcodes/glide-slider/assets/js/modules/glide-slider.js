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