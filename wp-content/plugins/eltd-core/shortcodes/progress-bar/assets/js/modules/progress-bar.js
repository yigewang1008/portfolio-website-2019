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