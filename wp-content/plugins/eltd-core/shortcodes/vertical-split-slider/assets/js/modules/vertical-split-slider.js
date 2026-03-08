(function($) {
	'use strict';
	
	var verticalSplitSlider = {};
	eltd.modules.verticalSplitSlider = verticalSplitSlider;
	
	verticalSplitSlider.eltdInitVerticalSplitSlider = eltdInitVerticalSplitSlider;
	
	
	verticalSplitSlider.eltdOnDocumentReady = eltdOnDocumentReady;
	
	$(document).ready(eltdOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdInitVerticalSplitSlider();
	}
	
	/*
	 **	Vertical Split Slider
	 */
	function eltdInitVerticalSplitSlider() {
		var slider = $('.eltd-vertical-split-slider');
		
		if (slider.length) {
			if (eltd.body.hasClass('eltd-vss-initialized')) {
				eltd.body.removeClass('eltd-vss-initialized');
				$.fn.multiscroll.destroy();
			}
			
			slider.height(eltd.windowHeight).animate({opacity: 1}, 300);
			
			var defaultHeaderStyle = '';
			if (eltd.body.hasClass('eltd-light-header')) {
				defaultHeaderStyle = 'light';
			} else if (eltd.body.hasClass('eltd-dark-header')) {
				defaultHeaderStyle = 'dark';
			}
			
			slider.multiscroll({
				scrollingSpeed: 700,
				easing: 'easeInOutQuart',
				navigation: true,
				useAnchorsOnLoad: false,
				sectionSelector: '.eltd-vss-ms-section',
				leftSelector: '.eltd-vss-ms-left',
				rightSelector: '.eltd-vss-ms-right',
				afterRender: function () {
					eltdCheckVerticalSplitSectionsForHeaderStyle($('.eltd-vss-ms-left .eltd-vss-ms-section:first-child').data('header-style'), defaultHeaderStyle);
					eltd.body.addClass('eltd-vss-initialized');
					
					var contactForm7 = $('div.wpcf7 > form');
					if (contactForm7.length) {
						contactForm7.each(function(){
							var thisForm = $(this);
							
							thisForm.find('.wpcf7-submit').off().on('click', function(e){
								e.preventDefault();
								wpcf7.submit(thisForm);
							});
						});
					}
					
					//prepare html for smaller screens - start //
					var verticalSplitSliderResponsive = $('<div class="eltd-vss-responsive"></div>'),
						leftSide = slider.find('.eltd-vss-ms-left > div'),
						rightSide = slider.find('.eltd-vss-ms-right > div');
					
					slider.after(verticalSplitSliderResponsive);
					
					for (var i = 0; i < leftSide.length; i++) {
						verticalSplitSliderResponsive.append($(leftSide[i]).clone(true));
						verticalSplitSliderResponsive.append($(rightSide[leftSide.length - 1 - i]).clone(true));
					}
					
					//prepare google maps clones
					var googleMapHolder = $('.eltd-vss-responsive .eltd-google-map');
					if (googleMapHolder.length) {
						googleMapHolder.each(function () {
							var map = $(this);
							map.empty();
							var num = Math.floor((Math.random() * 100000) + 1);
							map.attr('id', 'eltd-map-' + num);
							map.data('unique-id', num);
						});
					}
					
					if (typeof eltd.modules.animationHolder.eltdInitAnimationHolder === "function") {
						eltd.modules.animationHolder.eltdInitAnimationHolder();
					}
					
					if (typeof eltd.modules.button.eltdButton === "function") {
						eltd.modules.button.eltdButton().init();
					}
					
					if (typeof eltd.modules.elementsHolder.eltdInitElementsHolderResponsiveStyle === "function") {
						eltd.modules.elementsHolder.eltdInitElementsHolderResponsiveStyle();
					}
					
					if (typeof eltd.modules.googleMap.eltdShowGoogleMap === "function") {
						eltd.modules.googleMap.eltdShowGoogleMap();
					}
					
					if (typeof eltd.modules.icon.eltdIcon === "function") {
						eltd.modules.icon.eltdIcon().init();
					}
					
					if (typeof eltd.modules.progressBar.eltdInitProgressBars === "function") {
						eltd.modules.progressBar.eltdInitProgressBars();
					}
				},
				onLeave: function (index, nextIndex) {
					eltdIntiScrollAnimation(slider, nextIndex);
					eltdCheckVerticalSplitSectionsForHeaderStyle($($('.eltd-vss-ms-left .eltd-vss-ms-section')[$(".eltd-vss-ms-left .eltd-vss-ms-section").length - nextIndex]).data('header-style'), defaultHeaderStyle);
				}
			});
			
			if (eltd.windowWidth <= 1024) {
				$.fn.multiscroll.destroy();
			} else {
				$.fn.multiscroll.build();
			}
			
			$(window).resize(function () {
				if (eltd.windowWidth <= 1024) {
					$.fn.multiscroll.destroy();
				} else {
					$.fn.multiscroll.build();
				}
			});
		}
	}
	
	function eltdIntiScrollAnimation(slider, nextIndex) {
		
		if (slider.hasClass('eltd-vss-scrolling-animation')) {
			
			if (nextIndex > 1 && !slider.hasClass('eltd-vss-scrolled')) {
				slider.addClass('eltd-vss-scrolled');
			} else if (nextIndex === 1 && slider.hasClass('eltd-vss-scrolled')) {
				slider.removeClass('eltd-vss-scrolled');
			}
		}
	}
	
	/*
	 **	Check slides on load and slide change for header style changing
	 */
	function eltdCheckVerticalSplitSectionsForHeaderStyle(section_header_style, default_header_style) {
		if (section_header_style !== undefined && section_header_style !== '') {
			eltd.body.removeClass('eltd-light-header eltd-dark-header').addClass('eltd-' + section_header_style + '-header');
		} else if (default_header_style !== '') {
			eltd.body.removeClass('eltd-light-header eltd-dark-header').addClass('eltd-' + default_header_style + '-header');
		} else {
			eltd.body.removeClass('eltd-light-header eltd-dark-header');
		}
	}
	
})(jQuery);