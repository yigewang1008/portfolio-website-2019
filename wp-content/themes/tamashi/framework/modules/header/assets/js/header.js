(function($) {
	"use strict";
	
	var header = {};
	eltd.modules.header = header;
	
	header.eltdSetDropDownMenuPosition     = eltdSetDropDownMenuPosition;
	header.eltdSetDropDownWideMenuPosition = eltdSetDropDownWideMenuPosition;
	
	header.eltdOnDocumentReady = eltdOnDocumentReady;
	header.eltdOnWindowLoad = eltdOnWindowLoad;
	
	$(document).ready(eltdOnDocumentReady);
	$(window).load(eltdOnWindowLoad);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function eltdOnDocumentReady() {
		eltdSetDropDownMenuPosition();
		eltdDropDownMenu();
	}
	
	/*
	 All functions to be called on $(window).load() should be in this function
	 */
	function eltdOnWindowLoad() {
		eltdSetDropDownWideMenuPosition();
	}
	
	/**
	 * Set dropdown position
	 */
	function eltdSetDropDownMenuPosition() {
		var menuItems = $('.eltd-drop-down > ul > li.narrow.menu-item-has-children');
		
		if (menuItems.length) {
			menuItems.each(function (i) {
				var thisItem = $(this),
					menuItemPosition = thisItem.offset().left,
					dropdownHolder = thisItem.find('.second'),
					dropdownMenuItem = dropdownHolder.find('.inner ul'),
					dropdownMenuWidth = dropdownMenuItem.outerWidth(),
					menuItemFromLeft = eltd.windowWidth - menuItemPosition;
				
				if (eltd.body.hasClass('eltd-boxed')) {
					menuItemFromLeft = eltd.boxedLayoutWidth - (menuItemPosition - (eltd.windowWidth - eltd.boxedLayoutWidth ) / 2);
				}
				
				var dropDownMenuFromLeft; //has to stay undefined beacuse 'dropDownMenuFromLeft < dropdownMenuWidth' condition will be true
				
				if (thisItem.find('li.sub').length > 0) {
					dropDownMenuFromLeft = menuItemFromLeft - dropdownMenuWidth;
				}
				
				dropdownHolder.removeClass('right');
				dropdownMenuItem.removeClass('right');
				if (menuItemFromLeft < dropdownMenuWidth || dropDownMenuFromLeft < dropdownMenuWidth) {
					dropdownHolder.addClass('right');
					dropdownMenuItem.addClass('right');
				}
			});
		}
	}
	
	/**
	 * Set dropdown wide position
	 */
	function eltdSetDropDownWideMenuPosition(){
		var menuItems = $(".eltd-drop-down > ul > li.wide");
		
		if(menuItems.length) {
			menuItems.each( function(i) {
				var menuItemSubMenu = $(menuItems[i]).find('.second');
				
				if(menuItemSubMenu.length && !menuItemSubMenu.hasClass('left_position') && !menuItemSubMenu.hasClass('right_position')) {
					menuItemSubMenu.css('left', 0);
					
					var left_position = menuItemSubMenu.offset().left;
					
					if(eltd.body.hasClass('eltd-boxed')) {
						var boxedWidth = $('.eltd-boxed .eltd-wrapper .eltd-wrapper-inner').outerWidth();
						left_position = left_position - (eltd.windowWidth - boxedWidth) / 2;
						
						menuItemSubMenu.css('left', -left_position);
						menuItemSubMenu.css('width', boxedWidth);
					} else {
						menuItemSubMenu.css('left', -left_position);
						menuItemSubMenu.css('width', eltd.windowWidth);
					}
				}
			});
		}
	}
	
	function eltdDropDownMenu() {
		var menu_items = $('.eltd-drop-down > ul > li');
		
		menu_items.each(function(i) {
			if($(menu_items[i]).find('.second').length > 0) {
				var thisItem = $(menu_items[i]),
					dropDownSecondDiv = thisItem.find('.second');
				
				if(thisItem.hasClass('wide')) {
					//set columns to be same height - start
					var tallest = 0,
						dropDownSecondItem = $(this).find('.second > .inner > ul > li');
					
					dropDownSecondItem.each(function() {
						var thisHeight = $(this).height();
						if(thisHeight > tallest) {
							tallest = thisHeight;
						}
					});
					
					dropDownSecondItem.css('height', ''); // delete old inline css - via resize
					dropDownSecondItem.height(tallest);
					//set columns to be same height - end
				}
				
				if(!eltd.menuDropdownHeightSet) {
					thisItem.data('original_height', dropDownSecondDiv.height() + 'px');
					dropDownSecondDiv.height(0);
				}
				
				if(navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
					thisItem.on("touchstart mouseenter", function() {
						dropDownSecondDiv.css({
							'height': thisItem.data('original_height'),
							'overflow': 'visible',
							'visibility': 'visible',
							'opacity': '1'
						});
					}).on("mouseleave", function() {
						dropDownSecondDiv.css({
							'height': '0px',
							'overflow': 'hidden',
							'visibility': 'hidden',
							'opacity': '0'
						});
					});
				} else {
					if(eltd.body.hasClass('eltd-dropdown-animate-height')) {
						thisItem.mouseenter(function() {
							dropDownSecondDiv.css({
								'visibility': 'visible',
								'height': '0px',
								'opacity': '0'
							});
							dropDownSecondDiv.stop().animate({
								'height': thisItem.data('original_height'),
								opacity: 1
							}, 300, function() {
								dropDownSecondDiv.css('overflow', 'visible');
							});
						}).mouseleave(function() {
							dropDownSecondDiv.stop().animate({
								'height': '0px'
							}, 150, function() {
								dropDownSecondDiv.css({
									'overflow': 'hidden',
									'visibility': 'hidden'
								});
							});
						});
					} else {
						var config = {
							interval: 0,
							over: function() {
								setTimeout(function() {
									dropDownSecondDiv.addClass('eltd-drop-down-start');
									dropDownSecondDiv.stop().css({'height': thisItem.data('original_height')});
								}, 150);
							},
							timeout: 150,
							out: function() {
								dropDownSecondDiv.stop().css({'height': '0px'});
								dropDownSecondDiv.removeClass('eltd-drop-down-start');
							}
						};
						thisItem.hoverIntent(config);
					}
				}
			}
		});
		
		$('.eltd-drop-down ul li.wide ul li a').on('click', function(e) {
			if (e.which == 1){
				var $this = $(this);
				setTimeout(function() {
					$this.mouseleave();
				}, 500);
			}
		});
		
		eltd.menuDropdownHeightSet = true;
	}
	
})(jQuery);