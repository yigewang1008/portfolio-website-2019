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