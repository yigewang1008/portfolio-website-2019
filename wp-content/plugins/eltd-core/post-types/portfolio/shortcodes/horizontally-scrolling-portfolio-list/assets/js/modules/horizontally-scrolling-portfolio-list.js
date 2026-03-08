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
