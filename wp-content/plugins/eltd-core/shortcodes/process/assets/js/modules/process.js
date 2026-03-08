(function($) {
	'use strict';
	
	var process = {};
	eltd.modules.process = process;
	
	process.eltdInitProcess = eltdInitProcess;
	
	
	process.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitProcess()
	}
	
	/**
	 * Inti process shortcode on appear
	 */
	function eltdInitProcess() {
		var holder = $('.eltd-process-holder');
		
		if(holder.length) {
			holder.each(function(){
				var thisHolder = $(this);
				
				thisHolder.appear(function(){
					thisHolder.addClass('eltd-process-appeared');
				},{accX: 0, accY: eltdGlobalVars.vars.eltdElementAppearAmount});
			});
		}
	}
	
})(jQuery);