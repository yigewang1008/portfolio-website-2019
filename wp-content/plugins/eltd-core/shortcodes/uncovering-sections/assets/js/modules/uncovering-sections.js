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