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