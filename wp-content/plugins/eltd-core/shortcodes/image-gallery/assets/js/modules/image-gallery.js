(function($) {
    'use strict';
	
	var imageGallery = {};
	eltd.modules.imageGallery = imageGallery;
	
	imageGallery.eltdInitImageGalleryMasonry = eltdInitImageGalleryMasonry;
	
	
	imageGallery.eltdOnWindowLoad = eltdOnWindowLoad;
	
	$(window).load(eltdOnWindowLoad);
	
	/*
	 ** All functions to be called on $(window).load() should be in this function
	 */
	function eltdOnWindowLoad() {
		eltdInitImageGalleryMasonry();
	}
	
	/*
	 ** Init Image Gallery shortcode - Masonry layout
	 */
	function eltdInitImageGalleryMasonry(){
		var holder = $('.eltd-image-gallery.eltd-ig-masonry-type');
		
		if(holder.length){
			holder.each(function(){
				var thisHolder = $(this),
					masonry = thisHolder.find('.eltd-ig-masonry');
				
				masonry.waitForImages(function() {
					masonry.isotope({
						layoutMode: 'packery',
						itemSelector: '.eltd-ig-image',
						percentPosition: true,
						packery: {
							gutter: '.eltd-ig-grid-gutter',
							columnWidth: '.eltd-ig-grid-sizer'
						}
					});
					
					setTimeout(function() {
						masonry.isotope('layout');
						eltd.modules.common.eltdInitParallax();
					}, 1500);
					
					masonry.css('opacity', '1');
				});
			});
		}
	}

})(jQuery);