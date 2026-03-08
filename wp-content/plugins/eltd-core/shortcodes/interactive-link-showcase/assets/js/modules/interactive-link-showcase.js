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