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