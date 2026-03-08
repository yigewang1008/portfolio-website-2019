(function($){
	$(document).ready(function() {
		//plugins init goes here
		eltdInitSelectChange();
		eltdInitSwitch();
        eltdInitSaveCheckBoxesValue();
        eltdCheckBoxMultiSelectInitState();
        eltdInitCheckBoxMultiSelectChange();
		eltdInitTooltips();
		eltdInitColorpicker();
		eltdInitRangeSlider();
		eltdInitMediaUploader();
		eltdInitGalleryUploader();
		if ($('.eltd-page-form').length > 0) {
			eltdInitAjaxForm();
			eltdAnchorSelectOnLoad();
			eltdScrollToAnchorSelect();
			initTopAnchorHolderSize();
			eltdCheckVisibilityOfAnchorButtons();
			eltdCheckVisibilityOfAnchorOptions();
			eltdCheckAnchorsOnDependencyChange();
			eltdCheckOptionAnchorsOnDependencyChange();
			eltdChangedInput();
			eltdFixHeaderAndTitle();
			totop_button();
			backButtonShowHide();
			backToTop();
            eltdInitSelectPicker();
		}
		eltdInitPortfolioImagesVideosBox();
		eltdInitPortfolioMediaAcc();
		eltdInitPortfolioItemsBox();
		eltdInitPortfolioItemAcc();
        eltdInitSlideElementItemAcc();
        eltdInitSlideElementItemsBox();
		eltdInitDatePicker();
		eltdShowHidePostFormats();
		eltdPageTemplatesMetaBoxDependency();
        eltdRepeater();
        eltdInitSortable();
		eltdImportOptions();
		eltdImportCustomSidebars();
		eltdImportWidgets();
		eltdInitImportContent();
		eltdSelect2();
        eltdInitGeocomplete();
    });

	function eltdFixHeaderAndTitle () {
		var pageHeader 				= $('.eltd-page-header');
		var pageHeaderHeight		= pageHeader.height();
		var adminBarHeight			= $('#wpadminbar').height();
		var pageHeaderTopPosition 	= pageHeader.offset().top - parseInt(adminBarHeight);
		var pageTitle				= $('.eltd-page-title');
		var pageTitleTopPosition	= pageHeaderHeight + adminBarHeight - parseInt(pageTitle.css('marginTop'));
		var tabsNavWrapper			= $('.eltd-tabs-navigation-wrapper');
		var tabsNavWrapperTop		= pageHeaderHeight;
		var tabsContentWrapper	    = $('.eltd-tab-content');
		var tabsContentWrapperTop	= pageHeaderHeight + pageTitle.outerHeight();

		$(window).on('scroll load', function() {
			if($(window).scrollTop() >= pageHeaderTopPosition) {
				pageHeader.addClass('eltd-header-fixed').css('top', parseInt(adminBarHeight));
				pageTitle.addClass('eltd-page-title-fixed').css('top', pageTitleTopPosition);
				tabsNavWrapper.css('marginTop', tabsNavWrapperTop);
				tabsContentWrapper.css('marginTop', tabsContentWrapperTop);
			} else {
				pageHeader.removeClass('eltd-header-fixed').css('top', 0);
				pageTitle.removeClass('eltd-page-title-fixed').css('top', 0);
				tabsNavWrapper.css('marginTop', 0);
				tabsContentWrapper.css('marginTop', 0);
			}
		});
	}

	function initTopAnchorHolderSize() {
		function initTopSize() {
			var optionsPageHolder = $('.eltd-options-page');
			var anchorAndSaveHolder = $('.eltd-top-section-holder');
			var pageTitle = $('.eltd-page-title');
			var tabsContentWrapper = $('.eltd-tabs-content');

			anchorAndSaveHolder.css('width', optionsPageHolder.width() - parseInt(anchorAndSaveHolder.css('margin-left')));
			pageTitle.css('width', tabsContentWrapper.outerWidth());
		}

		initTopSize();

		$(window).on('resize', function() {
			initTopSize();
		});
	}

	function eltdScrollToAnchorSelect() {
		var selectAnchor = $('#eltd-select-anchor');
		selectAnchor.on('change', function() {
			var selectAnchor = $('option:selected', selectAnchor);

			if(typeof selectAnchor.data('anchor') !== 'undefined') {
				eltdScrollToPanel(selectAnchor.data('anchor'));
			}
		});
	}

	function eltdAnchorSelectOnLoad() {
		var currentPanel = window.location.hash;
		if(currentPanel) {
			var selectAnchor = $('#eltd-select-anchor');
			var currentOption = selectAnchor.find('option[data-anchor="'+currentPanel+'"]').first();

			if(currentOption) {
				currentOption.attr('selected', 'selected');
			}
		}
	}

	function eltdScrollToPanel(panel) {
		var pageHeader 				= $('.eltd-page-header');
		var pageHeaderHeight		= pageHeader.height();
		var adminBarHeight			= $('#wpadminbar').height();
		var pageTitle				= $('.eltd-page-title');
		var pageTitleHeight			= pageTitle.outerHeight();

		var panelTopPosition = $(panel).offset().top - adminBarHeight - pageHeaderHeight - pageTitleHeight;

		$('html, body').animate({
			scrollTop: panelTopPosition
		}, 1000);

		return false;
	}

	function totop_button(a) {
		"use strict";

		var b = $("#back_to_top");
		b.removeClass("off on");
		if (a === "on") { b.addClass("on"); } else { b.addClass("off"); }
	}

	function backButtonShowHide(){
		"use strict";

		$(window).scroll(function () {
			var b = $(this).scrollTop();
			var c = $(this).height();
			var d;
			if (b > 0) { d = b + c / 2; } else { d = 1; }
			if (d < 1e3) { totop_button("off"); } else { totop_button("on"); }
		});
	}

	function backToTop(){
		"use strict";

		$(document).on('click','#back_to_top',function(){
			$('html, body').animate({
				scrollTop: $('html').offset().top}, 1000);
			return false;
		});
	}

	function eltdChangedInput () {
		$('.eltd-tabs-content').on('change keyup keydown', 'input:not([type="submit"]), textarea, select', function (e) {
			$('.eltd-input-change').addClass('yes');
		});
		$('.field.switch label:not(.selected)').click( function() {
			$('.eltd-input-change').addClass('yes');
		});
		$(window).on('beforeunload', function () {
			if ($('.eltd-input-change.yes').length) {
				return 'You haven\'t saved your changes.';
			}
		});
		$('#anchornav input').click(function() {
			if ($('.eltd-input-change.yes').length) {
				$('.eltd-input-change.yes').removeClass('yes');
			}
			$('.eltd-changes-saved').addClass('yes');
			setTimeout(function(){$('.eltd-changes-saved').removeClass('yes');}, 3000);
		});
	}

	function eltdCheckVisibilityOfAnchorButtons () {

		$('.eltd-page-form > div:hidden').each( function() {
			var $panelID =  $(this).attr('id');
			$('#anchornav a').each ( function() {
				if ($(this).attr('href') == '#'+$panelID) {
					$(this).parent().hide();//hide <li>s
				}
			});
		})
	}

	function eltdCheckVisibilityOfAnchorOptions() {
		$('.eltd-page-form > div:hidden').each( function() {
			var $panelID =  $(this).attr('id');
			$('#eltd-select-anchor option').each ( function() {
				if ($(this).data('anchor') == '#'+$panelID) {
					$(this).hide();//hide <li>s
				}
			});
		})
	}

	function eltdGetArrayOfHiddenElements(changedElement) {
		var hidden_elements_string = changedElement.data('hide');
		hidden_elements_array = [];
		if(typeof hidden_elements_string !== 'undefined' && hidden_elements_string.indexOf(",") >= 0) {
			var hidden_elements_array = hidden_elements_string.split(',');
		} else {
			var hidden_elements_array = new Array(hidden_elements_string);
		}

		return hidden_elements_array;
	}

	function eltdGetArrayOfShownElements(changedElement) {
		//check for links to show
		var shown_elements_string = changedElement.data('show');
		shown_elements_array = [];
		if(typeof shown_elements_string !== 'undefined' && shown_elements_string.indexOf(",") >= 0) {
			var shown_elements_array = shown_elements_string.split(',');
		} else {
			var shown_elements_array = new Array(shown_elements_string);
		}

		return shown_elements_array;
	}
	
	function eltdGetArrayOfHiddenElementsSelectBox(changedElement,changedElementValue) {
        var hidden_elements_string = changedElement.data('hide-'+changedElementValue);
        hidden_elements_array = [];
        if(typeof hidden_elements_string !== 'undefined' && hidden_elements_string.indexOf(",") >= 0) {
            var hidden_elements_array = hidden_elements_string.split(',');
        } else {
            var hidden_elements_array = new Array(hidden_elements_string);
        }

        return hidden_elements_array;
    }

    function eltdGetArrayOfShownElementsSelectBox(changedElement,changedElementValue) {
        //check for links to show
        var shown_elements_string = changedElement.data('show-'+changedElementValue);
        shown_elements_array = [];
        if(typeof shown_elements_string !== 'undefined' && shown_elements_string.indexOf(",") >= 0) {
            var shown_elements_array = shown_elements_string.split(',');
        } else {
            var shown_elements_array = new Array(shown_elements_string);
        }

        return shown_elements_array;
    }

	function eltdCheckAnchorsOnDependencyChange(){
		$(document).on('click','.cb-enable.dependence, .cb-disable.dependence',function(){
			var hidden_elements_array = eltdGetArrayOfHiddenElements($(this));
			var shown_elements_array  = eltdGetArrayOfShownElements($(this));

			//show all buttons, but hide unnecessary ones
			$.each(hidden_elements_array, function(index, value){
				$('#anchornav a').each ( function() {

					if ($(this).attr('href') == value) {
						$(this).parent().hide();//hide <li>s
					}
				});
			});
			$.each(shown_elements_array, function(index, value){
				$('#anchornav a').each ( function() {
					if ($(this).attr('href') == value) {
						$(this).parent().show();//show <li>s
					}
				});
			});
		});
		
		$(document).on('change','.eltd-form-element.dependence',function(){
            hidden_elements_array = eltdGetArrayOfHiddenElementsSelectBox($(this),$(this).val());
            shown_elements_array  = eltdGetArrayOfShownElementsSelectBox($(this),$(this).val());

            //show all buttons, but hide unnecessary ones
            $.each(hidden_elements_array, function(index, value){
                $('#anchornav a').each ( function() {

                    if ($(this).attr('href') == value) {
                        $(this).parent().hide();//hide <li>s
                    }
                });
            });
            $.each(shown_elements_array, function(index, value){
                $('#anchornav a').each ( function() {
                    if ($(this).attr('href') == value) {
                        $(this).parent().show();//show <li>s
                    }
                });
            });
        });
	}

	function eltdCheckOptionAnchorsOnDependencyChange() {
		$(document).on('click','.cb-enable.dependence, .cb-disable.dependence',function(){
			var hidden_elements_array = eltdGetArrayOfHiddenElements($(this));
			var shown_elements_array  = eltdGetArrayOfShownElements($(this));

			//show all buttons, but hide unnecessary ones
			$.each(hidden_elements_array, function(index, value){
				$('#eltd-select-anchor option').each ( function() {

					if ($(this).data('anchor') == value) {
						$(this).hide();//hide option
					}
				});
			});
			$.each(shown_elements_array, function(index, value){
				$('#eltd-select-anchor option').each ( function() {
					if ($(this).data('anchor') == value) {
						$(this).show();//show option
					}
				});
			});

			$('#eltd-select-anchor').selectpicker('refresh');
		});
		
		$(document).on('change','.eltd-form-element.dependence',function(){
            hidden_elements_array = eltdGetArrayOfHiddenElementsSelectBox($(this),$(this).val());
            shown_elements_array  = eltdGetArrayOfShownElementsSelectBox($(this),$(this).val());

            //show all buttons, but hide unnecessary ones
            $.each(hidden_elements_array, function(index, value){
                $('#eltd-select-anchor option').each ( function() {

                    if ($(this).data('anchor') == value) {
                        $(this).hide();//hide option
                    }
                });
            });
            $.each(shown_elements_array, function(index, value){
                $('#eltd-select-anchor option').each ( function() {
                    if ($(this).data('anchor') == value) {
                        $(this).show();//show option
                    }
                });
            });

            $('#eltd-select-anchor').selectpicker('refresh');
        });
	}

    function eltdInitSelectChange() {
        var selectBox = $('select.dependence');
        selectBox.each(function() {
            initialHide($(this), this);
        });
        selectBox.on('change', function (e) {
            initialHide($(this), this);
        });

        function initialHide(selectField, selectObject) {
            var valueSelected = selectObject.value.replace(/ /g, '');
            $(selectField.data('hide-'+valueSelected)).fadeOut();
            $(selectField.data('show-'+valueSelected)).fadeIn();
        }

        var switchers = $('select.eltd-switcher');
        switchers.each(function() {
            changeActions($(this), $(this).val(), true);
        });

        switchers.on('change', function (e) {
            var valueSelected = this.value.replace(/ /g, '');
            changeActions($(this), valueSelected, false);
        });

        function changeActions(selectField, valueSelected, initialCall) {
            var switchType = selectField.data('switch-type');
            var switchProperty = selectField.data('switch-property');
            var switchEnabled = selectField.data('switch-enabled');

            if (switchType === 'single_yesno') {
                var switchers = $('.switch-' + switchProperty);
                if (switchEnabled === valueSelected) {
                    switchers.addClass('eltd-switch-single-mode');
                    switchers.attr('data-switch-selector', switchProperty);
                } else {
                    switchers.removeClass('eltd-switch-single-mode');
                    switchers.removeAttr('data-switch-selector');
                }

                //On property change leave only one switcher enabled
                if(!initialCall) {
                    var oneSwitcherEnabled = false;
                    switchers.removeClass('switcher-auto-enabled');
                    switchers.each(function () {
                        var switcher = $(this);
                        var enabled = $(this).find('.cb-enable');
                        if (!oneSwitcherEnabled && enabled.hasClass('selected')) {
                            oneSwitcherEnabled = true;
                            $(this).addClass('switcher-auto-enabled');
                        }
                        if (!switcher.hasClass('switcher-auto-enabled')) {
                            switcher.find('.cb-disable').addClass('selected');
                            switcher.find('.cb-enable').removeClass('selected');
                            switcher.find('.checkbox').attr('checked', false);
                            switcher.find('.checkboxhidden_yesno').val("no");
                        }
                    });
                }
            }
        }

    }

    function eltdInitSwitch() {
        //Logic for setting element initial to be no
        var yesNoElements = $(".switch");
        yesNoElements.each(function () {
            var element = $(this);
            if (element.parents('.eltd-repeater-field') && !element.find('input[type="hidden"]').val()) {
                element.find('.cb-enable').removeClass('selected');
                element.find('.cb-disable').addClass('selected');
            }
        });
        $(".cb-enable").click(function(){
            var parent = $(this).parents('.switch');
            //This condition is if only one element can be active, developed for repeater purposes
            //First disable all yes/no elements...
            if(parent.hasClass('eltd-switch-single-mode')) {
                var selector = '.switch-'+ parent.data('switch-selector');
                var switchers = $(selector);
                switchers.each(function() {
                    var switcher = $(this);
                    switcher.find('.cb-disable').addClass('selected');
                    switcher.find('.cb-enable').removeClass('selected');
                    switcher.find('.checkbox').attr('checked', false);
                    switcher.find('.checkboxhidden_yesno').val("no");
                });
                //Then enable the one that is clicked
                $('.cb-disable', parent).removeClass('selected');
                $(this).addClass('selected');
                $('.checkbox',parent).attr('checked', true);
                $('.checkboxhidden_yesno',parent).val("yes");
            } else {
                $('.cb-disable', parent).removeClass('selected');
                $(this).addClass('selected');
                $('.checkbox', parent).attr('checked', true);
                $('.checkboxhidden_yesno', parent).val("yes");
                $('.checkboxhidden_onoff', parent).val("on");
                $('.checkboxhidden_portfoliofollow', parent).val("portfolio_single_follow");
                $('.checkboxhidden_zeroone', parent).val("1");
                $('.checkboxhidden_imagevideo', parent).val("image");
                $('.checkboxhidden_yesempty', parent).val("yes");
                $('.checkboxhidden_flagpost', parent).val("post");
                $('.checkboxhidden_flagpage', parent).val("page");
                $('.checkboxhidden_flagmedia', parent).val("attachment");
                $('.checkboxhidden_flagportfolio', parent).val("portfolio_page");
                $('.checkboxhidden_flagproduct', parent).val("product");
            }
        });
        $(".cb-disable").click(function(){
            var parent = $(this).parents('.switch');
            //If only one element can be active, than no value shouldn't be clickable
            if(!parent.hasClass('eltd-switch-single-mode')) {
                $('.cb-enable', parent).removeClass('selected');
                $(this).addClass('selected');
                $('.checkbox', parent).attr('checked', false);
                $('.checkboxhidden_yesno', parent).val("no");
                $('.checkboxhidden_onoff', parent).val("off");
                $('.checkboxhidden_portfoliofollow', parent).val("portfolio_single_no_follow");
                $('.checkboxhidden_zeroone', parent).val("0");
                $('.checkboxhidden_imagevideo', parent).val("video");
                $('.checkboxhidden_yesempty', parent).val("");
                $('.checkboxhidden_flagpost', parent).val("");
                $('.checkboxhidden_flagpage', parent).val("");
                $('.checkboxhidden_flagmedia', parent).val("");
                $('.checkboxhidden_flagportfolio', parent).val("");
                $('.checkboxhidden_flagproduct', parent).val("");
            }
        });
        $(".cb-enable.dependence").click(function(){
            $($(this).data('hide')).fadeOut();
            $($(this).data('show')).fadeIn();
        });
        $(".cb-disable.dependence").click(function(){
            $($(this).data('hide')).fadeOut();
            $($(this).data('show')).fadeIn();
        });
    }

    function eltdInitSaveCheckBoxesValue(){
        var checkboxes = $('.eltd-single-checkbox-field');
        checkboxes.change(function(){
            eltdDisableHidden($(this));
        });
        checkboxes.each(function(){
            eltdDisableHidden($(this));
        });
        function eltdDisableHidden(thisBox){
            if(thisBox.is(':checked')){
                thisBox.siblings('.eltd-checkbox-single-hidden').prop('disabled', true);
            }else{
                thisBox.siblings('.eltd-checkbox-single-hidden').prop('disabled', false);
            }
        }
    }

    function eltdCheckBoxMultiSelectInitState(){
        var element = $('input[type="checkbox"].dependence.multiselect');
        if(element.length){
            element.each(function() {
                var thisItem = $(this);
                eltdInitCheckBox(thisItem);
            });
        }
    }

    function eltdInitCheckBoxMultiSelectChange() {
        var element = $('input[type="checkbox"].dependence.multiselect');
        element.on('change', function(){
            var thisItem = $(this);
            eltdInitCheckBox(thisItem);
        });
    }

    function eltdInitCheckBox(checkBox){

        var thisItem = checkBox;
        var checked = thisItem.attr('checked');
        var dataShow = thisItem.data('show');

        if(checked === 'checked'){
            if(typeof(dataShow)!== 'undefined' && dataShow !== '') {
                var elementsToShow = dataShow.split(',');

                $.each(elementsToShow, function(index, value) {
                    $(value).fadeIn();
                });
            }
        }
        else{
            if(typeof(dataShow)!== 'undefined' && dataShow !== '') {
                var elementsToShow = dataShow.split(',');

                $.each(elementsToShow, function(index, value) {
                    $(value).fadeOut();
                });
            }
        }

    }

	function eltdInitTooltips() {
		$('.eltd-tooltip').tooltip();
	}

	function eltdInitColorpicker() {
		$('.eltd-page .my-color-field').wpColorPicker({
			change:    function( event, ui ) {
				$('.eltd-input-change').addClass('yes');
			}
		});
	}

	/**
	 * Function that initializes
	 */
	function eltdInitRangeSlider() {
		if($('.eltd-slider-range').length) {

			$('.eltd-slider-range').each(function() {
				var Link = $.noUiSlider.Link;

				var start       = 0;            //starting position of slider
				var min         = 0;            //minimal value
				var max         = 100;          //maximal value of slider
				var step        = 1;            //number of steps to snap to
				var orientation = 'horizontal';   //orientation. Could be vertical or horizontal
				var prefix      = '';           //prefix to the serialized value that is written field
				var postfix     = '';           //postfix to the serialized value that is written to field
				var thousand    = '';           //separator for thousand
				var decimals    = 2;            //number of decimals
				var mark        = '.';          //decimal separator

				//is data-start attribute set for current instance?
				if($(this).data('start') != null && $(this).data('start') !== "" && $(this).data('start') != "0.00") {
					start = $(this).data('start');
					if (start == "1.00") start = 1;
					if(parseInt(start) == start){
						start = parseInt(start);
					}
				}

				//is data-min attribute set for current instance?
				if($(this).data('min') != null && $(this).data('min') !== "") {
					min = $(this).data('min');
				}

				//is data-max attribute set for current instance?
				if($(this).data('max') != null && $(this).data('max') !== "") {
					max = $(this).data('max');
				}

				//is data-step attribute set for current instance?
				if($(this).data('step') != null && $(this).data('step') !== "") {
					step = $(this).data('step');
				}

				//is data-orientation attribute set for current instance?
				if($(this).data('orientation') != null && $(this).data('orientation') !== "") {
					//define available orientations
					var availableOrientations = ['horizontal', 'vertical'];

					//is data-orientation value in array of available orientations?
					if(availableOrientations.indexOf($(this).data('orientation'))) {
						orientation = $(this).data('orientation');
					}
				}

				//is data-prefix attribute set for current instance?
				if($(this).data('prefix') != null && $(this).data('prefix') !== "") {
					prefix = $(this).data('prefix');
				}

				//is data-postfix attribute set for current instance?
				if($(this).data('postfix') != null && $(this).data('postfix') !== "") {
					postfix = $(this).data('postfix');
				}

				//is data-thousand attribute set for current instance?
				if($(this).data('thousand') != null && $(this).data('thousand') !== "") {
					thousand = $(this).data('thousand');
				}

				//is data-decimals attribute set for current instance?
				if($(this).data('decimals') != null && $(this).data('decimals') !== "") {
					decimals = $(this).data('decimals');
				}

				//is data-mark attribute set for current instance?
				if($(this).data('mark') != null && $(this).data('mark') !== "") {
					mark = $(this).data('mark');
				}

				$(this).noUiSlider({
					start: start,
					step: step,
					orientation: orientation,
					range: {
						'min': min,
						'max': max
					},
					serialization: {
						lower: [
							new Link({
								target: $(this).prev('.eltd-slider-range-value')
							})
						],
						format: {
							// Set formatting
							thousand: thousand,
							postfix: postfix,
							prefix: prefix,
							decimals: decimals,
							mark: mark
						}
					}
				}).on({
					change: function(){
						$('.eltd-input-change').addClass('yes');
					}
				});
			});
		}
	}

	function eltdInitMediaUploader() {
		if($('.eltd-media-uploader').length) {
			$('.eltd-media-uploader').each(function() {
				var fileFrame;
				var uploadUrl;
				var uploadHeight;
				var uploadWidth;
				var uploadImageHolder;
				var attachment;
				var removeButton;

				//set variables values
				uploadUrl           = $(this).find('.eltd-media-upload-url');
				uploadHeight        = $(this).find('.eltd-media-upload-height');
				uploadWidth        = $(this).find('.eltd-media-upload-width');
				uploadImageHolder   = $(this).find('.eltd-media-image-holder');
				removeButton        = $(this).find('.eltd-media-remove-btn');

				if (uploadImageHolder.find('img').attr('src') != "") {
					removeButton.show();
					eltdInitMediaRemoveBtn(removeButton);
				}

				$(this).on('click', '.eltd-media-upload-btn', function() {
					//if the media frame already exists, reopen it.
					if (fileFrame) {
						fileFrame.open();
						return;
					}

					//create the media frame
					fileFrame = wp.media.frames.fileFrame = wp.media({
						title: $(this).data('frame-title'),
						button: {
							text: $(this).data('frame-button-text')
						},
						multiple: false
					});

					//when an image is selected, run a callback
					fileFrame.on( 'select', function() {
						attachment = fileFrame.state().get('selection').first().toJSON();
						removeButton.show();
						eltdInitMediaRemoveBtn(removeButton);
						//write to url field and img tag
						if(attachment.hasOwnProperty('url') && attachment.hasOwnProperty('sizes')) {
							uploadUrl.val(attachment.url);
							if (attachment.sizes.thumbnail)
								uploadImageHolder.find('img').attr('src', attachment.sizes.thumbnail.url);
							else
								uploadImageHolder.find('img').attr('src', attachment.url);
							uploadImageHolder.show();
						} else if (attachment.hasOwnProperty('url')) {
							uploadUrl.val(attachment.url);
							uploadImageHolder.find('img').attr('src', attachment.url);
							uploadImageHolder.show();
						}

						//write to hidden meta fields
						if(attachment.hasOwnProperty('height')) {
							uploadHeight.val(attachment.height);
						}

						if(attachment.hasOwnProperty('width')) {
							uploadWidth.val(attachment.width);
						}
						$('.eltd-input-change').addClass('yes');
					});

					//open media frame
					fileFrame.open();
				});
			});
		}

		function eltdInitMediaRemoveBtn(btn) {
			btn.on('click', function() {
				//remove image src and hide it's holder
				btn.siblings('.eltd-media-image-holder').hide();
				btn.siblings('.eltd-media-image-holder').find('img').attr('src', '');

				//reset meta fields
				btn.siblings('.eltd-media-meta-fields').find('input[type="hidden"]').each(function(e) {
					$(this).val('');
				});

				btn.hide();
			});
		}
	}

	function eltdInitGalleryUploader() {

		var $eltd_upload_button = jQuery('.eltd-gallery-upload-btn');

		var $eltd_clear_button = jQuery('.eltd-gallery-clear-btn');

		wp.media.customlibEditGallery1 = {

			frame: function() {

				if ( this._frame )
					return this._frame;

				var selection = this.select();

				this._frame = wp.media({
					id: 'eltd-portfolio-image-gallery',
					frame: 'post',
					state: 'gallery-edit',
					title: wp.media.view.l10n.editGalleryTitle,
					editing: true,
					multiple: true,
					selection: selection
				});

				this._frame.on('update', function() {

					var controller = wp.media.customlibEditGallery1._frame.states.get('gallery-edit');
					var library = controller.get('library');
					// Need to get all the attachment ids for gallery
					var ids = library.pluck('id');

					$input_gallery_items.val(ids);

					jQuery.ajax({
						type: "post",
						url: ajaxurl,
						data: "action=tamashi_elated_gallery_upload_get_images&ids=" + ids,
						success: function(data) {
							$thumbs_wrap.empty().html(data);
						}
					});
				});
				return this._frame;
			},

			init: function() {

				$eltd_upload_button.click(function(event) {

					$thumbs_wrap = $(this).parent().prev().prev();
					$input_gallery_items = $thumbs_wrap.next();

					event.preventDefault();
					wp.media.customlibEditGallery1.frame().open();
				});

				$eltd_clear_button.click(function(event) {
					$thumbs_wrap = $eltd_upload_button.parent().prev().prev();
					$input_gallery_items = $thumbs_wrap.next();

					event.preventDefault();
					$thumbs_wrap.empty();
					$input_gallery_items.val("");
				});
			},

			// Gets initial gallery-edit images. Function modified from wp.media.gallery.edit
			// in wp-includes/js/media-editor.js.source.html
			select: function() {

				var shortcode = wp.shortcode.next('gallery', '[gallery ids="' + $input_gallery_items.val() + '"]'),
					defaultPostId = wp.media.gallery.defaults.id,
					attachments, selection;

				// Bail if we didn't match the shortcode or all of the content.
				if (!shortcode)
					return;

				// Ignore the rest of the match object.
				shortcode = shortcode.shortcode;

				if (_.isUndefined(shortcode.get('id')) && !_.isUndefined(defaultPostId))
					shortcode.set('id', defaultPostId);

				attachments = wp.media.gallery.attachments(shortcode);
				selection = new wp.media.model.Selection(attachments.models, {
					props: attachments.props.toJSON(),
					multiple: true
				});

				selection.gallery = attachments.gallery;

				// Fetch the query's attachments, and then break ties from the
				// query to allow for sorting.
				selection.more().done(function() {
					// Break ties with the query.
					selection.props.set({
						query: false
					});
					selection.unmirror();
					selection.props.unset('orderby');
				});

				return selection;
			}
		};
		$(wp.media.customlibEditGallery1.init);
	}

	function eltdInitPortfolioItemAcc() {
		//remove portfolio item
		$(document).on('click', '.remove-portfolio-item', function(event) {
			event.preventDefault();
			var $toggleHolder = $(this).parent().parent().parent();
			$toggleHolder.fadeOut(300,function() {
				$(this).remove();

				//after removing portfolio image, set new rel numbers and set new ids/names
				$('.eltd-portfolio-additional-item').each(function(i){
					$(this).attr('rel',i+1);
					$(this).find('.number').text($(this).attr('rel'));
					eltdSetIdOnRemoveItem($(this),i+1);
				});
				//hide expand all button if all items are removed
				noPortfolioItemShown();
			});
			return false;
		});

		//hide expand all button if there is no items
		noPortfolioItemShown();
		function noPortfolioItemShown()  {
			if($('.eltd-portfolio-additional-item').length == 0){
				$('.eltd-toggle-all-item').hide();
			}
		}

		//expand all additional sidebar items on click on 'expand all' button
		$(document).on('click', '.eltd-toggle-all-item', function(event) {
			event.preventDefault();
			$('.eltd-portfolio-additional-item').each(function(i){

				var $toggleContent = $(this).find('.eltd-portfolio-toggle-content');
				var $this = $(this).find('.toggle-portfolio-item');
				if ($toggleContent.is(':visible')) {
				}
				else {
					$toggleContent.slideToggle();
					$this.html('<i class="fa fa-caret-down"></i>')
				}
			});
			return false;
		});
		//toggle for portfolio additional sidebar items
		$(document).on('click', '.eltd-portfolio-additional-item .eltd-portfolio-toggle-holder', function(event) {
			event.preventDefault();

			var $this = $(this);
			var $caret_holder = $this.find('.toggle-portfolio-item');
			$caret_holder.html('<i class="fa fa-caret-up"></i>');
			var $toggleContent = $this.next();
			$toggleContent.slideToggle(function() {
				if ($toggleContent.is(':visible')) {
					$caret_holder.html('<i class="fa fa-caret-up"></i>')
				}
				else {
					$caret_holder.html('<i class="fa fa-caret-down"></i>')
				}
				//hide expand all button function in case of all boxes revealed
				checkExpandAllBtn();
			});
			return false;
		});
		//hide expand all button when it's clicked
		$(document).on('click','.eltd-toggle-all-item', function(event) {
			event.preventDefault();
			$(this).hide();
		})

		function checkExpandAllBtn() {
			if($('.eltd-portfolio-additional-item .eltd-portfolio-toggle-content:hidden').length == 0){
				$('.eltd-toggle-all-item').hide();
			}else{
				$('.eltd-toggle-all-item').show();
			}
		}

	}

    function eltdInitPortfolioItemsBox() {
        var eltd_portfolio_additional_item = $('.eltd-portfolio-additional-item-holder').clone().html();
        $portfolio_item = '<div class="eltd-portfolio-additional-item" rel="">'+ eltd_portfolio_additional_item +'</div>';

        $('.eltd-portfolio-add a.eltd-add-item').click(function (event) {
            event.preventDefault();
            $(this).parent().before($($portfolio_item).hide().fadeIn(500));
            var portfolio_num = $(this).parent().siblings('.eltd-portfolio-additional-item').length;
            $(this).parent().siblings('.eltd-portfolio-additional-item:last').attr('rel',portfolio_num);
            eltdSetIdOnAddItem($(this).parent(),portfolio_num);
            $(this).parent().prev().find('.number').text(portfolio_num);
        });
    }

	function eltdSetIdOnAddItem(addButton,portfolio_num){

		addButton.siblings('.eltd-portfolio-additional-item:last').find('input[type="text"], input[type="hidden"], select, textarea').each(function(){
			var name = $(this).attr('name');
			var new_name= name.replace("_x", "[]");
			var new_id = name.replace("_x", "_"+portfolio_num);
			$(this).attr('name',new_name);
			$(this).attr('id',new_id);
		});
	}

	function eltdSetIdOnRemoveItem(portfolio,portfolio_num){

		if(portfolio_num == undefined){
			var portfolio_num = portfolio.attr('rel');
		}else{
			var portfolio_num = portfolio_num;
		}

		portfolio.find('input[type="text"], input[type="hidden"], select, textarea').each(function(){
			var name = $(this).attr('name').split('[')[0];
			var new_name = name+"[]";
			var new_id = name+"_"+portfolio_num;
			$(this).attr('name',new_name);
			$(this).attr('id',new_id);
		});
	}

	function eltdInitPortfolioMediaAcc() {
		//remove portfolio media
		$(document).on('click', '.remove-portfolio-media', function(event) {
			event.preventDefault();
			var $toggleHolder = $(this).parent().parent().parent();
			$toggleHolder.fadeOut(300,function() {
				$(this).remove();

				//after removing portfolio image, set new rel numbers and set new ids/names
				$('.eltd-portfolio-media').each(function(i){
					$(this).attr('rel',i+1);
					$(this).find('.number').text($(this).attr('rel'));
					eltdSetIdOnRemoveMedia($(this),i+1);
				});
				//hide expand all button if all medias are removed
				noPortfolioMedia()
			});  return false;
		});

		//hide 'expand all' button if there is no media
		noPortfolioMedia();
		function noPortfolioMedia() {
			if($('.eltd-portfolio-media').length == 0){
				$('.eltd-toggle-all-media').hide();
			}
		}

		//expand all portfolio medias (video and images) onClick on 'expand all' button
		$(document).on('click','.eltd-toggle-all-media', function(event) {
			event.preventDefault();
			$('.eltd-portfolio-media').each(function(i){

				var $toggleContent = $(this).find('.eltd-portfolio-toggle-content');
				var $this = $(this).find('.toggle-portfolio-media');
				if ($toggleContent.is(':visible')) {
				}
				else {
					$toggleContent.slideToggle();
					$this.html('<i class="fa fa-caret-down"></i>')
				}

			});        return false;
		});
		//toggle for portfolio media (images or videos)
		$(document).on('click', '.eltd-portfolio-media .eltd-portfolio-toggle-holder', function(event) {
			event.preventDefault();
			var $this = $(this);
			var $caret_holder = $this.find('.toggle-portfolio-media');
			$caret_holder.html('<i class="fa fa-caret-up"></i>');
			var $toggleContent = $(this).next();
			$toggleContent.slideToggle(function() {
				if ($toggleContent.is(':visible')) {
					$caret_holder.html('<i class="fa fa-caret-up"></i>')
				}
				else {
					$caret_holder.html('<i class="fa fa-caret-down"></i>')
				}
				//hide expand all button function in case of all boxes revealed
				checkExpandAllMediaBtn();
			});
			return false;
		});
		//hide expand all button when it's clicked
		$(document).on('click','.eltd-toggle-all-media', function(event) {
			event.preventDefault();
			$(this).hide();
		});
		function checkExpandAllMediaBtn() {
			if($('.eltd-portfolio-media .eltd-portfolio-toggle-content:hidden').length == 0){
				$('.eltd-toggle-all-media').hide();
			}else{
				$('.eltd-toggle-all-media').show();
			}
		}
	}

	function eltdInitPortfolioImagesVideosBox() {
		var eltd_portfolio_images = $('.eltd-hidden-portfolio-images').clone().html();
		$portfolio_image = '<div class="eltd-portfolio-images eltd-portfolio-media" rel="">'+ eltd_portfolio_images +'</div>';
		var eltd_portfolio_videos = $('.eltd-hidden-portfolio-videos').clone().html();

		$portfolio_videos = '<div class="eltd-portfolio-videos eltd-portfolio-media" rel="">'+ eltd_portfolio_videos +'</div>';
		$('a.eltd-add-image').click(function (e) {
			e.preventDefault();
			$(this).parent().before($($portfolio_image).hide().fadeIn(500));
			var portfolio_num = $(this).parent().siblings('.eltd-portfolio-media').length;
			$(this).parent().siblings('.eltd-portfolio-media:last').attr('rel',portfolio_num);
			eltdInitMediaUploaderAdded($(this).parent());
			eltdSetIdOnAddMedia($(this).parent(),portfolio_num);
			$(this).parent().prev().find('.number').text(portfolio_num);
		});

		$('a.eltd-add-video').click(function (e) {
			e.preventDefault();
			$(this).parent().before($($portfolio_videos).hide().fadeIn(500));
			var portfolio_num = $(this).parent().siblings('.eltd-portfolio-media').length;
			$(this).parent().siblings('.eltd-portfolio-media:last').attr('rel',portfolio_num);
			eltdInitMediaUploaderAdded($(this).parent());
			eltdSetIdOnAddMedia($(this).parent(),portfolio_num);
			$(this).parent().prev().find('.number').text(portfolio_num);
		});

		$(document).on('click', '.eltd-remove-last-row-media', function(event) {
			event.preventDefault();
			$(this).parent().prev().fadeOut(300,function() {
				$(this).remove();

				//after removing portfolio image, set new rel numbers and set new ids/names
				$('.eltd-portfolio-media').each(function(i){
					$(this).attr('rel',i+1);
					eltdSetIdOnRemoveMedia($(this),i+1);
				});
			});

		});
		eltdShowHidePorfolioImageVideoType();
		$(document).on('change', 'select.eltd-portfoliovideotype', function(e) {
			eltdShowHidePorfolioImageVideoType();
		});
	}

	function eltdSetIdOnAddMedia(addButton,portfolio_num){
		addButton.siblings('.eltd-portfolio-media:last').find('input[type="text"], input[type="hidden"], select, textarea').each(function(){
			var name = $(this).attr('name');
			var new_name= name.replace("_x", "[]");
			var new_id = name.replace("_x", "_"+portfolio_num);
			$(this).attr('name',new_name);
			$(this).attr('id',new_id);

		});

		eltdShowHidePorfolioImageVideoType();
	}

	function eltdSetIdOnRemoveMedia(portfolio,portfolio_num){

		if(portfolio_num == undefined){
			var portfolio_num = portfolio.attr('rel');
		}else{
			var portfolio_num = portfolio_num;
		}

		portfolio.find('input[type="text"], input[type="hidden"], select, textarea').each(function(){
			var name = $(this).attr('name').split('[')[0];
			var new_name = name+"[]";
			var new_id = name+"_"+portfolio_num;
			$(this).attr('name',new_name);
			$(this).attr('id',new_id);
		});
	}

	function eltdShowHidePorfolioImageVideoType(){

		$('.eltd-portfoliovideotype').each(function(i){
			var $selected = $(this).val();

			if($selected == "self"){
				$(this).parent().parent().parent().find('.eltd-video-id-holder').hide();
				$(this).parent().parent().parent().parent().find('.eltd-media-uploader').show();
				$(this).parent().parent().parent().find('.eltd-video-self-hosted-path-holder').show();
			}else{
				$(this).parent().parent().parent().find('.eltd-video-id-holder').show();
				$(this).parent().parent().parent().parent().find('.eltd-media-uploader').hide();
				$(this).parent().parent().parent().find('.eltd-video-self-hosted-path-holder').hide();
			}
		});
	}

	function eltdInitMediaUploaderAdded(addButton) {

		addButton.siblings('.eltd-portfolio-media:last, .eltd-slide-element-additional-item:last').find('.eltd-media-uploader').each(function(){
			var fileFrame;
			var uploadUrl;
			var uploadHeight;
			var uploadWidth;
			var uploadImageHolder;
			var attachment;
			var removeButton;

			//set variables values
			uploadUrl           = $(this).find('.eltd-media-upload-url');
			uploadHeight        = $(this).find('.eltd-media-upload-height');
			uploadWidth        = $(this).find('.eltd-media-upload-width');
			uploadImageHolder   = $(this).find('.eltd-media-image-holder');
			removeButton        = $(this).find('.eltd-media-remove-btn');

			if (uploadImageHolder.find('img').attr('src') != "") {
				removeButton.show();
				eltdInitMediaRemoveBtn(removeButton);
			}

			$(this).on('click', '.eltd-media-upload-btn', function() {
				//if the media frame already exists, reopen it.
				if (fileFrame) {
					fileFrame.open();
					return;
				}

				//create the media frame
				fileFrame = wp.media.frames.fileFrame = wp.media({
					title: $(this).data('frame-title'),
					button: {
						text: $(this).data('frame-button-text')
					},
					multiple: false
				});

				//when an image is selected, run a callback
				fileFrame.on( 'select', function() {
					attachment = fileFrame.state().get('selection').first().toJSON();
					removeButton.show();
					eltdInitMediaRemoveBtn(removeButton);
					//write to url field and img tag
					if(attachment.hasOwnProperty('url') && attachment.hasOwnProperty('sizes')) {
						uploadUrl.val(attachment.url);
						if (attachment.sizes.thumbnail)
							uploadImageHolder.find('img').attr('src', attachment.sizes.thumbnail.url);
						else
							uploadImageHolder.find('img').attr('src', attachment.url);
						uploadImageHolder.show();
					} else if (attachment.hasOwnProperty('url')) {
						uploadUrl.val(attachment.url);
						uploadImageHolder.find('img').attr('src', attachment.url);
						uploadImageHolder.show();
					}

					//write to hidden meta fields
					if(attachment.hasOwnProperty('height')) {
						uploadHeight.val(attachment.height);
					}

					if(attachment.hasOwnProperty('width')) {
						uploadWidth.val(attachment.width);
					}
					$('.eltd-input-change').addClass('yes');
				});

				//open media frame
				fileFrame.open();
			});
		});

		function eltdInitMediaRemoveBtn(btn) {
			btn.on('click', function() {
				//remove image src and hide it's holder
				btn.siblings('.eltd-media-image-holder').hide();
				btn.siblings('.eltd-media-image-holder').find('img').attr('src', '');

				//reset meta fields
				btn.siblings('.eltd-media-meta-fields').find('input[type="hidden"]').each(function(e) {
					$(this).val('');
				});

				btn.hide();
			});
		}
	}

    /**
        Slide elements script - start
    */
    function eltdInitSlideElementItemAcc() {
        //remove slide-element item
        $(document).on('click', '.remove-slide-element-item', function(event) {
            event.preventDefault();
            var $toggleHolder = $(this).parent().parent().parent();
            $toggleHolder.fadeOut(300,function() {
                $(this).remove();

                //after removing slide-element image, set new rel numbers and set new ids/names
                $('.eltd-slide-element-additional-item').each(function(i){
                    $(this).attr('rel',i+1);
                    $(this).find('.number').text($(this).attr('rel'));
                    eltdSetIdOnRemoveElement($(this),i+1);
                });
                //hide expand all button if all items are removed
                noSlideElementItemShown();
            });
            return false;
        });

        //hide expand all button if there is no items
        noSlideElementItemShown();
        function noSlideElementItemShown()  {
            if($('.eltd-slide-element-additional-item').length == 0){
                $('.eltd-toggle-all-item').hide();
            }
        }

        //expand all additional items on click on 'expand all' button
        $(document).on('click', '.eltd-toggle-all-item', function(event) {
            event.preventDefault();
            $('.eltd-slide-element-additional-item').each(function(i){

                var $toggleContent = $(this).find('.eltd-slide-element-toggle-content');
                var $this = $(this).find('.toggle-slide-element-item');
                if ($toggleContent.is(':visible')) {
                }
                else {
                    $toggleContent.slideToggle();
                    $this.html('<i class="fa fa-caret-down"></i>')
                }
            });
            return false;
        });
        //toggle for slide-element item
        $(document).on('click', '.eltd-slide-element-additional-item .eltd-slide-element-toggle-holder', function(event) {
            event.preventDefault();

            var $this = $(this);
            var $caret_holder = $this.find('.toggle-slide-element-item');
            $caret_holder.html('<i class="fa fa-caret-up"></i>');
            var $toggleContent = $this.next();
            $toggleContent.slideToggle(function() {
                if ($toggleContent.is(':visible')) {
                    $caret_holder.html('<i class="fa fa-caret-up"></i>')
                }
                else {
                    $caret_holder.html('<i class="fa fa-caret-down"></i>')
                }
                //hide expand all button function in case of all boxes revealed
                checkExpandAllBtn();
            });
            return false;
        });
        //hide expand all button when it's clicked
        $(document).on('click','.eltd-toggle-all-item', function(event) {
            event.preventDefault();
            $(this).hide();
        });

        //reveal only the fields for custom positioning of elements
        $(document).on('change', '#eltd_eltd_slide_holder_elements_alignment select', function(event) {
            var meta_box = $(this).parents('#eltd-meta-box-eltd_slides_elements');
            if ($(this).find('option:selected').attr('value') == 'custom') {
                meta_box.find('.eltd-slide-element-custom-only').slideDown(300);
                meta_box.find('.eltd-slide-element-all-but-custom').slideUp(300);
            }
            else {
                meta_box.find('.eltd-slide-element-all-but-custom').slideDown(300);
                meta_box.find('.eltd-slide-element-custom-only').slideUp(300);
            }
        });

        //reveal only the fields for certain type of the element
        $(document).on('change', '.eltd-slide-element-type-selector', function(event) {
            var type_fields_holders = $(this).parents('.eltd-slide-element-additional-item').find('.eltd-slide-element-type-fields');
            type_fields_holders.not('.eltd-setf-'+$(this).find('option:selected').attr('value')).slideUp(300);
            type_fields_holders.filter('.eltd-setf-'+$(this).find('option:selected').attr('value')).slideDown(300);
        });

        // reveal advanced text options
        $(document).on('change', '.eltd-slide-element-options-selector-text', function(event) {
            if ($(this).find('option:selected').attr('value') == 'advanced') {
                $(this).parents('.eltd-slide-element-additional-item').find('.eltd-slide-elements-advanced-text-options').slideDown(300);
                $(this).parents('.eltd-slide-element-additional-item').find('.eltd-slide-elements-simple-text-options').slideUp(300);
            }
            else {
                $(this).parents('.eltd-slide-element-additional-item').find('.eltd-slide-elements-advanced-text-options').slideUp(300);
                $(this).parents('.eltd-slide-element-additional-item').find('.eltd-slide-elements-simple-text-options').slideDown(300);
            }
        });

        // reveal responsive text options
        $(document).on('change', '.eltd-slide-element-responsive-selector', function(event) {
            if ($(this).find('option:selected').attr('value') == 'yes') {
                $(this).parents('.eltd-slide-element-type-fields').find('.eltd-slide-element-scale-factors').slideDown(300);
            }
            else {
                $(this).parents('.eltd-slide-element-type-fields').find('.eltd-slide-element-scale-factors').slideUp(300);
            }
        });

        // reveal responsive element options
        $(document).on('change', '.eltd-slide-element-responsiveness-selector', function(event) {
            if ($(this).find('option:selected').attr('value') == 'stages') {
                $(this).closest('.row').siblings('.eltd-slide-responsive-scale-factors').slideDown(300);
            }
            else {
                $(this).closest('.row').siblings('.eltd-slide-responsive-scale-factors').slideUp(300);
            }
        });

        //update the default screen width in elements
        $(document).on('change keyup', "input[name='eltd_slide_elements_default_width']", function(event) {
            $(this).parents('#eltd-meta-box-eltd_slides_elements').find('.eltd-slide-dynamic-def-width').html($(this).attr('value'));
        });

        // reveal proper icon picker
        $(document).on('change', '.eltd-slide-element-button-icon-pack', function(event) {
            var icon_pack = $(this).find('option:selected').attr('value');
            if (icon_pack == 'no_icon') {
                $(this).parents('.eltd-slide-element-additional-item').find('.eltd-slide-element-button-icon-collection').slideUp(300);
            }
            else {
                $(this)
                .parents('.eltd-slide-element-additional-item')
                .find('.eltd-slide-element-button-icon-collection.'+icon_pack).slideDown(300)
                .siblings('.eltd-slide-element-button-icon-collection').slideUp(300);
            }
        });

        function checkExpandAllBtn() {
            if($('.eltd-slide-element-additional-item .eltd-slide-element-toggle-content:hidden').length == 0){
                $('.eltd-toggle-all-item').hide();
            }else{
                $('.eltd-toggle-all-item').show();
            }
        }
    }

    function eltdInitSlideElementItemsBox() {

        $('.eltd-slide-element-add a.eltd-add-item').click(function (event) {
            var eltd_slide_element = $('.eltd-slide-element-additional-item-holder').clone().html();
            $slide_element = '<div class="eltd-slide-element-additional-item" rel="">'+ eltd_slide_element +'</div>';
            event.preventDefault();
            $(this).parent().before($($slide_element).hide().fadeIn(500));
            eltdInitMediaUploaderAdded($(this).parent());
            var elem_num = $(this).parent().siblings('.eltd-slide-element-additional-item').length;
            var item = $(this).parent().siblings('.eltd-slide-element-additional-item:last');
            item.attr('rel',elem_num);
            item.find('.wp-picker-container').each(function() {
                var picker = $(this);
                var input = picker.find('input[type="text"]');
                picker.before('<input type="text" id="'+ input.attr('id') +'" name="'+ input.attr('name') +'" value="" class="my-color-field"/>').remove();
            });
            item.find('.my-color-field').wpColorPicker();
            eltdSetIdOnAddElement($(this).parent(),elem_num);
            $(this).parent().prev().find('.number').text(elem_num);
        });
    }

    function eltdSetIdOnAddElement(addButton,elem_num){
        addButton.siblings('.eltd-slide-element-additional-item:last').find('input[type="text"], input[type="hidden"], select, textarea').each(function(){
            var name = $(this).attr('name');
            var new_name= name.replace("_x", "[]");
            var new_id = name.replace("_x", "_"+elem_num);
            $(this).attr('name',new_name);
            $(this).attr('id',new_id);
        });
    }

    function eltdSetIdOnRemoveElement(element,elem_num){

        if(elem_num == undefined){
            var elem_num = element.attr('rel');
        }else{
            var elem_num = elem_num;
        }

        element.find('input[type="text"], input[type="hidden"], select, textarea').each(function(){
            var name = $(this).attr('name').split('[')[0];
            var new_name = name+"[]";
            var new_id = name+"_"+elem_num;
            $(this).attr('name',new_name);
            $(this).attr('id',new_id);
        });
    }

    /**
        Slide elements script - end
    */
	function eltdInitAjaxForm() {
		$('#eltd_top_save_button').click( function() {
			$('.eltd_ajax_form').submit();
			if ($('.eltd-input-change.yes').length) {
				$('.eltd-input-change.yes').removeClass('yes');
			}
			$('.eltd-changes-saved').addClass('yes');
			setTimeout(function(){$('.eltd-changes-saved').removeClass('yes');}, 3000);
			return false;
		});
		$(document).delegate(".eltd_ajax_form", "submit", function (a) {
			var b = $(this);
			var c = {
				action: "tamashi_elated_save_options"
			};
			jQuery.ajax({
				url: ajaxurl,
				cache: !1,
				type: "POST",
				data: jQuery.param(c, !0) + "&" + b.serialize()
			}), a.preventDefault(), a.stopPropagation()
		})
	}

	function eltdInitDatePicker() {
		$( ".eltd-input.datepicker" ).datepicker( { dateFormat: "MM dd, yy" });
	}
	
    function eltdInitSelectPicker() {
        $(".eltd-selectpicker").selectpicker({
            style: 'btn-info',
            size: 10
        });
    }

	function eltdShowHidePostFormats(){
		$('input[name="post_format"]').each(function(){
			var id = $(this).attr('id');
			if(id !== '' && id !== undefined) {
				var	metaboxName = id.replace(/-/g, '_');
				$('#eltd-meta-box-'+ metaboxName +'_meta').hide();
			}
		});
		
		var selectedId = $("input[name='post_format']:checked").attr("id");
		if(selectedId !== '' && selectedId !== undefined) {
			var selected = selectedId.replace(/-/g, '_');
			$('#eltd-meta-box-' + selected + '_meta').fadeIn();
		}

		$("input[name='post_format']").change(function() {
			eltdShowHidePostFormats();
		});
	}

	function eltdPageTemplatesMetaBoxDependency(){
		if($('#page_template').length) {
			var selected = $('#page_template').val();
			var template_name_parts = selected.split("-");

			if (template_name_parts[0] !== 'blog') {
				$('#eltd-meta-box-blog-meta').hide();
			} else {
				$('#eltd-meta-box-blog-meta').show();
			}
			$('select[name="page_template"]').change(function () {
				eltdPageTemplatesMetaBoxDependency();
			});
		}
	}

    function eltdRepeater(){
        var wrapper = $('.eltd-repeater-wrapper');

        if(wrapper.length) {
            wrapper.each(function() {
                var thisWrapper = $(this);
                initCoreRepeater(thisWrapper);
            });
        }

        function initCoreRepeater(wrapper) {
            initRemoveRow(wrapper);
            initEmptyRow(wrapper);

            //Init add new button
            var addNew = wrapper.find('> .eltd-repeater-add .eltd-clone'); // add new button
            addNew.on('click', function (e) {
                e.preventDefault();
                var thisAddNew = $(this);
                initCloneRow(wrapper, thisAddNew);
            });
        }

        function initRemoveRow(wrapper){
            var removeBtn = wrapper.find('.eltd-clone-remove');
            removeBtn.on('click', function (e) {
                e.preventDefault();
                var thisRemoveBtn = $(this);
                var parentRow = thisRemoveBtn.closest('.eltd-repeater-fields-row');
                var fieldsHolder = thisRemoveBtn.closest('.eltd-repeater-fields-holder');
                var parentChildRepeater = !!fieldsHolder.hasClass('eltd-enable-pc');
                var thisHolderRows;

                if(fieldsHolder.hasClass('eltd-table-layout')) {
                    thisHolderRows = fieldsHolder.find('tbody tr.eltd-repeater-fields-row');
                } else {
                    if(parentChildRepeater) {
                        var name = thisRemoveBtn.data("name");
                        thisHolderRows = fieldsHolder.find('> .eltd-repeater-fields-row[data-name=' + name + ']');
                    } else {
                        thisHolderRows = fieldsHolder.find('> .eltd-repeater-fields-row');
                    }
                }

                if (thisHolderRows.length == 1) {
                    parentRow.find(':input').val('').removeAttr('checked').removeAttr('selected');
                    parentRow.hide();
                } else {
                    parentRow.remove();
                }
            });
        }

        function initEmptyRow(wrapper) {
            var fieldsHolder = wrapper.find('> .eltd-repeater-fields-holder');
            var thisHolderRows;
            if(fieldsHolder.hasClass('eltd-table-layout')) {
                thisHolderRows = fieldsHolder.find('tbody tr.eltd-repeater-fields-row');
            } else {
                thisHolderRows = fieldsHolder.find('> .eltd-repeater-fields-row');
            }

            thisHolderRows.each(function() {
                var row = $(this);
                if (row.hasClass('eltd-initially-hidden')) {
                    row.hide();
                }
            });
        }

        function initCloneRow(wrapper, button) {
            var fieldsHolder = wrapper.find('> .eltd-repeater-fields-holder');
            var parentChildRepeater = !!fieldsHolder.hasClass('eltd-enable-pc');
            var rows;
            if(fieldsHolder.hasClass('eltd-table-layout')) {
                rows = fieldsHolder.find('tbody tr.eltd-repeater-fields-row');
            } else {
                if(parentChildRepeater) {
                    var name = button.data("name");
                    rows = fieldsHolder.find('> .eltd-repeater-fields-row[data-name=' + name + ']');
                } else {
                    rows = fieldsHolder.find('> .eltd-repeater-fields-row');
                }
            }
            var append = true; // flag for showing or appending new row
            if (rows.length == 1 && rows.css('display') == 'none') {
                rows.show();
                append = false;
            }
            if (append) {
                var child = rows.eq(0);
                //FIND FIRST ELEMENT AND DESTROY INITIALIZED SCRIPTS
                child.find('.eltd-repeater-field').each(function () {
                    var thisField = $(this);
                    thisField.find('select').each(function () {
                        var thisInput = $(this);
                        if(thisInput.hasClass('eltd-select2')) {
                            $(this).select2("destroy");
                        }
                    });
                    thisField.find('input').each(function () {
                        var thisInput = $(this);
                        if(thisInput.hasClass('datepicker')) {
                            $(this).datepicker("destroy");
                        }
                    });
                });

                var rowIndex = button.data('count'); // number of rows for changing id stored as data of add new button
                var firstChild = rows.eq(0).clone(); // clone first row
                var colorPicker = false; // flag for initializing color picker - calling wpColorPicker
                var mediaUploader = false; // flag for initializing media uploader - calling mediaUploader
                var yesNoSwitcher = false; // flag for initializing yes no switcher - calling initSwitch
                var select2 = false; // flag for initializing select2 - calling select2
                var innerRepeater = false; // flag for initializing select2 - calling select2
                var datepicker = false; // flag for initializing datepicker - calling datepicker

                firstChild.find('.eltd-repeater-field').each(function () {
                        var thisField = $(this);
                        var id = thisField.attr('id');
                        if (typeof id !== 'undefined') {
                            thisField.attr('id', id.slice(0, -1) + rowIndex); // change id - first row will have 0 as the last char
                        }
                        thisField.find(':input, textarea').each(function () {
                            var thisInput = $(this);
                            if (thisInput.hasClass('my-color-field')) { // if input type is color picker
                                thisInput.parents('.wp-picker-container').html(thisInput); // overwrite added html with field html- wpColorPicker adds it on initialization
                                colorPicker = true;
                            }
                            else if (thisInput.hasClass('eltd-media-upload-url')) {// if input type is media uploader
                                mediaUploader = true;
                                var btn = thisInput.parent().siblings('.eltd-media-remove-btn');
                                eltdInitMediaRemoveBtn(btn); // get and init new remove btn
                                btn.trigger('click'); // trigger click to reset values
                            }
                            else if (thisInput.hasClass('wp-editor-area')) {

                                if (typeof id !== 'undefined') {
                                	//old row variables
                                	var oldID = thisInput.attr('id'),
                                		oldContainer = $('#' + oldID).parents('.wp-editor-wrap'),
                                		oldIframeHeight = oldContainer.find('iframe').height(),
                                		oldSwitcherButtons = oldContainer.find('button.wp-switch-editor');

                                    thisInput.attr('id', thisInput.attr('id').slice(0, -1) + rowIndex); // change id - first row will have 0 as the last char

                                    //new row variables
                                    var textareaID = thisInput.attr('id'),
                                        textareaClasses = thisInput.attr('class'),
                                        textareaName = thisInput.attr('name'),
                                        textareaHolder = thisInput.parents('.eltd-repeater-field').first(),
                                        idForTinyMC = id.substring('eltd_'.length,id.length+1),
                                        children = textareaHolder.find('[id*=textarea_0]'),
                                        thisEditorContainer = thisInput.parents(".wp-editor-container"),
                                        editorTools;

                                    //trigger click on tinymc button so cloned row can catch properties
                                    if (oldContainer.hasClass('html-active')) {
                                    	htmlActive = true;
	                                    oldSwitcherButtons.first().trigger('click');
	                                }

	                                //change all children indexes for clone row
                                    children.each(function (e){
                                    	var thisChild = $(this),
                                    		thisButtons = thisChild.find('button');

                                    	thisChild.attr('id', thisChild.attr('id').replace(0,rowIndex)); // change id - first row will have 0 as the last char
                                    });

                                    //empty container to enable new tinymc code to add
                                    thisEditorContainer.empty();

                                    //add new textarea
                                    $('<textarea/>', {
                                        id: textareaID,
                                        class: textareaClasses,
                                        name: textareaName
                                    }).appendTo(thisEditorContainer);

                                    setTimeout(function () {
                                    	//add tinymce
                                        tinymce.execCommand( 'mceAddEditor', true, textareaID );

                                        thisEditorContainer.find('iframe').css('height',oldIframeHeight);
     
     									//change attributes for editor tools (add media and switcher)
	                                    editorTools = thisEditorContainer.siblings('.wp-editor-tools');

	                                    if (editorTools.length){
	                                    	var mediaButton = editorTools.find('button.insert-media'),
	                                    		switchButton = editorTools.find('button.wp-switch-editor');

	                                    	mediaButton.attr('data-editor',mediaButton.data('editor').replace(0,rowIndex)); //change html attribute
	                                    	mediaButton.data('editor',mediaButton.data('editor').replace(0,rowIndex)); //this works for media but not for switch buttons

	                                    	switchButton.each(function () {
	                                    		var thisSwitch = $(this);
	                                    		
	                                			thisSwitch.attr('data-wp-editor-id',thisSwitch.data('wp-editor-id').replace(0,rowIndex));
	                                    	});
	                                    }

	                                    //add QuickTags
								        tinyMCEPreInit.qtInit[textareaID] =JSON.parse(JSON.stringify(tinyMCEPreInit.qtInit[oldID]));
								        tinyMCEPreInit.qtInit[textareaID].id = textareaID;

								        // make the editor area visible
								        thisInput.addClass('wp-editor-area').show();

								        // initialize quicktags
								        new QTags(textareaID);
								        QTags._buttonsInit();

								        // force the editor to start at its defined mode.
								        switchEditors.go(textareaID, tinyMCEPreInit.mceInit[oldID].mode);
                                    }, 300);
                                }
                            }
                            else if(thisInput.hasClass('datepicker')) {
                                thisInput.attr('id', thisInput.attr('id').replace(0,rowIndex)); // change id - first row will have 0 as the last char
                            }
                            else if(thisInput.hasClass('checkbox')) {
                                yesNoSwitcher = true;
                            }
                            thisInput.val('').removeAttr('checked').removeAttr('selected'); //empty fields values
                            if(thisInput.is(':radio')){
                                thisInput.val(fieldsHolder.find(':radio').length);
                            }
                        });
                        thisField.find('select').each(function () {
                            var thisInput = $(this);
                            if(thisInput.hasClass('eltd-select2')) {
                                select2 = true;
                            }
                        });
                        thisField.find('input').each(function () {
                            var thisInput = $(this);
                            if(thisInput.hasClass('datepicker')) {
                                datepicker = true;
                            }
                        });
                    }
                );
                rows.each(function () {
                    if($(this).find('.eltd-repeater-wrapper').length) {
                        innerRepeater = true;
                    }
                });
                button.data('count', rowIndex + 1); //increase number of rows
                firstChild.appendTo(fieldsHolder); // append html
                initCoreRepeater(firstChild.find('.eltd-repeater-wrapper'));
                initRemoveRow(firstChild);
                if (colorPicker) { // reinit colorpickers
                    $('.eltd-page .my-color-field').wpColorPicker();
                }
                if (mediaUploader) {
                    // deregister click on all media buttons (multiple frames will be opened otherwise)
                    $('.eltd-media-uploader').off('click', '.eltd-media-upload-btn');
                    eltdInitMediaUploader();
                }
                if (yesNoSwitcher) {
                    eltdInitSwitch(); //init yes no switchers
                }
                if (select2) {
                    eltdSelect2(); //init select2 script
                }
                if (datepicker) {
                    eltdInitDatePicker(); //init select2 script
                }
            }
        }

        function eltdInitMediaRemoveBtn(btn) {
            btn.on('click', function() {
                //remove image src and hide it's holder
                btn.siblings('.eltd-media-image-holder').hide();
                btn.siblings('.eltd-media-image-holder').find('img').attr('src', '');

                //reset meta fields
                btn.siblings('.eltd-media-meta-fields').find('input[type="hidden"]').each(function(e) {
                    $(this).val('');
                });

                btn.hide();
            });
        }
    }

    function eltdInitSortable() {
        var sortingHolder = $('.eltd-sortable-holder');
        var enableParentChild = sortingHolder.hasClass('eltd-enable-pc');
        sortingHolder.sortable({
            handle: '.eltd-repeater-sort',
            cursor: 'move',
            placeholder: "placeholder",
            start: function(event, ui) {
                ui.placeholder.height(ui.item.height());
                if(enableParentChild) {
                    if (ui.helper.hasClass('second-level')) {
                        ui.placeholder.removeClass('placeholder');
                        ui.placeholder.addClass('placeholder-sub');
                    }
                    else {
                        ui.placeholder.removeClass('placeholder-sub');
                        ui.placeholder.addClass('placeholder');
                    }
                }
            },
            sort: function(event, ui) {
                if(enableParentChild) {
                    var pos;
                    if (ui.helper.hasClass('second-level')) {
                        pos = ui.position.left + 50;
                    }
                    else {
                        pos = ui.position.left;
                    }
                    if (pos >= 75 && !ui.helper.hasClass('second-level') && !ui.helper.hasClass('eltd-sort-parent')) {
                        ui.placeholder.removeClass('placeholder');
                        ui.placeholder.addClass('placeholder-sub');
                        ui.helper.addClass('second-level');
                    }
                    else if (pos < 30 && ui.helper.hasClass('second-level') && !ui.helper.hasClass('eltd-sort-child')) {
                        ui.placeholder.removeClass('placeholder-sub');
                        ui.placeholder.addClass('placeholder');
                        ui.helper.removeClass('second-level');
                    }
                }
            }
        });
    }
	
	function eltdImportOptions(){
		if($('.eltd-backup-options-page-holder').length) {
			var eltdImportBtn = $('#eltd-import-theme-options-btn');
			eltdImportBtn.on('click', function(e) {
				e.preventDefault();
				if (confirm('Are you sure, you want to import Options now?')) {
					eltdImportBtn.blur();
					eltdImportBtn.text('Please wait');
					var importValue = $('#import_theme_options').val();
					var importNonce = $('#eltd_import_theme_options_secret').val();
					var data = {
						action: 'eltd_core_import_theme_options',
						content: importValue,
						nonce: importNonce
					};
					$.ajax({
						type: "POST",
						url: ajaxurl,
						data: data,
						success: function (data) {
							var response = JSON.parse(data);
							if (response.status == 'error') {
								alert(response.message);
							} else {
								eltdImportBtn.text('Import');
								$('.eltd-bckp-message').text(response.message);
							}
						}
					});
				}
			});
		}
	}
	
	function eltdImportCustomSidebars(){
		if($('.eltd-backup-options-page-holder').length) {
			var eltdImportBtn = $('#eltd-import-custom-sidebars-btn');
			eltdImportBtn.on('click', function(e) {
				e.preventDefault();
				if (confirm('Are you sure, you want to import Custom Sidebars now?')) {
					eltdImportBtn.blur();
					eltdImportBtn.text('Please wait');
					var importValue = $('#import_custom_sidebars').val();
					var importNonce = $('#eltd_import_custom_sidebars_secret').val();
					var data = {
						action: 'eltd_core_import_custom_sidebars',
						content: importValue,
						nonce: importNonce
					};
					$.ajax({
						type: "POST",
						url: ajaxurl,
						data: data,
						success: function (data) {
							var response = JSON.parse(data);
							if (response.status == 'error') {
								alert(response.message);
							} else {
								eltdImportBtn.text('Import');
								$('.eltd-bckp-message').text(response.message);
							}
						}
					});
				}
			});
		}
	}
	
	function eltdImportWidgets(){
		if($('.eltd-backup-options-page-holder').length) {
			var eltdImportBtn = $('#eltd-import-widgets-btn');
			eltdImportBtn.on('click', function(e) {
				e.preventDefault();
				if (confirm('Are you sure, you want to import Widgets now?')) {
					eltdImportBtn.blur();
					eltdImportBtn.text('Please wait');
					var importValue = $('#import_widgets').val();
					var importNonce = $('#eltd_import_widgets_secret').val();
					var data = {
						action: 'eltd_core_import_widgets',
						content: importValue,
						nonce: importNonce
					};
					$.ajax({
						type: "POST",
						url: ajaxurl,
						data: data,
						success: function (data) {
							var response = JSON.parse(data);
							if (response.status == 'error') {
								alert(response.message);
							} else {
								eltdImportBtn.text('Import');
								$('.eltd-bckp-message').text(response.message);
							}
						}
					});
				}
			});
		}
	}

	function eltdInitImportContent(){
		var eltdImportHolder   = $('.eltd-import-page-holder');
		
		if(eltdImportHolder.length) {
			var eltdImportBtn      = $('#eltd-import-demo-data');
			var confirmMessage = eltdImportHolder.data('confirm-message');
			eltdImportBtn.on('click', function(e) {
				e.preventDefault();

				if (confirm(confirmMessage)) {
					$('.eltd-import-load').css('display','block');
					var progressbar     = $('#progressbar');
					var import_opt      = $('#import_option').val();
					var import_expl     = $('#import_example').val();
					var p = 0;

					if(import_opt == 'content'){
						for( var i=1; i < 10; i++ ){
							var str;
							if (i < 10) str = 'tamashi_content_0'+i+'.xml';
							else str = 'tamashi_content_'+i+'.xml';
							jQuery.ajax({
								type: 'POST',
								url: ajaxurl,
								data: {
									action: 'eltd_core_data_import',
									xml: str,
									example: import_expl,
									import_attachments: ($("#import_attachments").is(':checked') ? 1 : 0)
								},
								success: function(data, textStatus, XMLHttpRequest){
									p+= 10;
									$('.progress-value').html((p) + '%');
									progressbar.val(p);
									if (p == 90) {
										str = 'tamashi_content_10.xml';
										jQuery.ajax({
											type: 'POST',
											url: ajaxurl,
											data: {
												action: 'eltd_core_data_import',
												xml: str,
												example: import_expl,
												import_attachments: ($("#import_attachments").is(':checked') ? 1 : 0)
											},
											success: function(data, textStatus, XMLHttpRequest){
												p+= 10;
												$('.progress-value').html((p) + '%');
												progressbar.val(p);
												$('.progress-bar-message').html('<div class="alert alert-success"><strong>Import is completed</strong></div>');
											}
										});
									}
								}
							});
						}
					} else if(import_opt == 'widgets') {
						$.ajax({
							type: 'POST',
							url: ajaxurl,
							data: {
								action: 'eltd_core_widgets_import',
								example: import_expl
							},
							success: function(data, textStatus, XMLHttpRequest){
								$('.progress-value').html((100) + '%');
								progressbar.val(100);
							}
						});
						$('.progress-bar-message').html('<div class="alert alert-success"><strong>Import is completed</strong></div>');
					} else if(import_opt == 'options'){
						jQuery.ajax({
							type: 'POST',
							url: ajaxurl,
							data: {
								action: 'eltd_core_options_import',
								example: import_expl
							},
							success: function(data, textStatus, XMLHttpRequest){
								$('.progress-value').html((100) + '%');
								progressbar.val(100);
							}
						});
						$('.progress-bar-message').html('<div class="alert alert-success"><strong>Import is completed</strong></div>');
					}else if(import_opt == 'complete_content'){
						for(var i=1;i<10;i++){
							var str;
							if (i < 10) str = 'tamashi_content_0'+i+'.xml';
							else str = 'tamashi_content_'+i+'.xml';
							jQuery.ajax({
								type: 'POST',
								url: ajaxurl,
								data: {
									action: 'eltd_core_data_import',
									xml: str,
									example: import_expl,
									import_attachments: ($("#import_attachments").is(':checked') ? 1 : 0)
								},
								success: function(data, textStatus, XMLHttpRequest){
									p+= 10;
									$('.progress-value').html((p) + '%');
									progressbar.val(p);
									if (p == 90) {
										str = 'tamashi_content_10.xml';
										jQuery.ajax({
											type: 'POST',
											url: ajaxurl,
											data: {
												action: 'eltd_core_data_import',
												xml: str,
												example: import_expl,
												import_attachments: ($("#import_attachments").is(':checked') ? 1 : 0)
											},
											success: function(data, textStatus, XMLHttpRequest){
												jQuery.ajax({
													type: 'POST',
													url: ajaxurl,
													data: {
														action: 'eltd_core_other_import',
														example: import_expl
													},
													success: function(data, textStatus, XMLHttpRequest){
														//alert(data);
														$('.progress-value').html((100) + '%');
														progressbar.val(100);
														$('.progress-bar-message').html('<div class="alert alert-success">Import is completed.</div>');
													}
												});
											}
										});
									}
								}
							});
						}
					}
				}
				return false;
			});
		}
	}

	function eltdSelect2() {
        if ($('select.eltd-select2').length) {
            $('select.eltd-select2').select2({
                allowClear: true
            });
        }
	}

    function eltdInitGeocomplete() {
        var geo_inputs = $(".eltd-address-field");
        if(geo_inputs.length && !$('body').hasClass('eltd-empty-google-api')) {
            geo_inputs.each(function () {
                var geo_input = $(this),
                    reset = geo_input.find("#reset"),
                    inputField = geo_input.find('input'),
                    mapField = geo_input.find('.map_canvas'),
                    countryLimit = geo_input.data('country'),
                    latFieldName = geo_input.data('lat-field'),
                    latField = $("input[name=" + latFieldName + "]"),
                    longFieldName = geo_input.data('long-field'),
                    longField =  $("input[name=" + longFieldName + "]"),
                    initialAddress = inputField.val(),
                    initialLat = latField.val(),
                    initialLong = longField.val();
                inputField.geocomplete({
                    map: mapField,
                    details: ".eltd-address-elements",
                    detailsAttribute: "data-geo",
                    types: ["geocode", "establishment"],
                    country: countryLimit,
                    markerOptions: {
                        draggable: true
                    }
                });

                inputField.bind("geocode:dragged", function (event, latLng) {
                    latField.val(latLng.lat());
                    longField.val(latLng.lng());
                    $("#reset").show();

                    var map = inputField.geocomplete("map");
                    map.panTo(latLng);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latLng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                var road = results[0].address_components[1].short_name;
                                var town = results[0].address_components[2].short_name;
                                var county = results[0].address_components[3].short_name;
                                var country = results[0].address_components[4].short_name;
                                inputField.val(road + ' ' + town + ' ' + county + ' ' + country);
                            }
                        }
                    });
                });

                inputField.on('focus',function(){
                    var map = inputField.geocomplete("map");
                    google.maps.event.trigger(map, 'resize')
                });
                reset.on("click",function () {
                    inputField.geocomplete("resetMarker");
                    inputField.val(initialAddress);
                    latField.val(initialLat);
                    longField.val(initialLong);
                    $("#reset").hide();
                    return false;
                });

                $(window).on("load",function () {
                    inputField.trigger("geocode");
                })
            });
        }
    }
	
})(jQuery);