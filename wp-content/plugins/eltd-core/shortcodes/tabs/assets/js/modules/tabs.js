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