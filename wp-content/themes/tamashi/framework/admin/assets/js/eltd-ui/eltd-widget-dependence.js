(function($) {
	$(window).load(function() {
		eltdButtonWidgetFieldDependency();
		eltdIconWidgetFieldDependency();
		eltdImageGalleryWidgetFieldDependency()
		eltdSocialIconWidgetFieldDependency();
	});
	
	/**
	 * Render field dependency for button widget
	 */
	function eltdButtonWidgetFieldDependency() {
		var buttons = {
			'solid': ['size', 'background_color', 'border_color'],
			'outline': ['size', 'background_color', 'border_color']
		};
		
		eltdUpdateWidgetSelection('eltd_button_widget', 'type', buttons);
	}
	
	/**
	 * Render field dependency for icon widget
	 */
	function eltdIconWidgetFieldDependency() {
		var iconPacks = {
			'font_awesome': 'fa_icon',
			'font_elegant': 'fe_icon',
			'ion_icons': 'ion_icon',
			'linea_icons': 'linea_icon',
			'linear_icons': 'linear_icon',
			'simple_line_icons': 'simple_line_icon',
            'dripicons': 'dripicon'
		};
		
		eltdUpdateWidgetSelection('eltd_icon_widget', 'icon_pack', iconPacks);
	}
	
	/**
	 * Render field dependency for image gallery widget
	 */
	function eltdImageGalleryWidgetFieldDependency() {
		var imageBehavior = {
			'custom-link': ['custom_links', 'custom_link_target']
		};
		
		eltdUpdateWidgetSelection('eltd_image_gallery_widget', 'image_behavior', imageBehavior);
		
		var imageType = {
			'grid': ['number_of_columns', 'space_between_columns'],
			'slider': ['slider_navigation', 'slider_pagination']
		};
		
		eltdUpdateWidgetSelection('eltd_image_gallery_widget', 'type', imageType);
	}
	
	/**
	 * Render field dependency for socialIcon widget
	 */
	function eltdSocialIconWidgetFieldDependency() {
		var iconPacks = {
			'font_awesome': 'fa_icon',
			'font_elegant': 'fe_icon',
			'ion_icons': 'ion_icon',
			'simple_line_icons': 'simple_line_icon'
		};
		
		eltdUpdateWidgetSelection('eltd_social_icon_widget', 'icon_pack', iconPacks);
	}

    /**
     * Function that shows/hides fields based on selection
     *
     * @param string widgetId is unique id of widget
     * @param string optionName is widget option name which trigger dependency
     * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
     */
    function eltdUpdateWidgetSelection(widgetId, optionName, optionDependencyArray) {
	    eltdWidgetFields(widgetId, optionName, optionDependencyArray);

	    $('body').on('change', 'select[name*="'+widgetId+'"]', function() {
	    	if( $(this).attr('name').search(optionName) !== -1 ) {
			    var thisWidget    = $(this).closest('.widget'),
				    selectedValue = $(this).find('option:selected').val();

			    eltdHideFields(thisWidget, optionDependencyArray);
			    eltdShowFields(thisWidget, optionDependencyArray, selectedValue);
		    }
        });
    }

	/**
	 * Core function which initialy loops for dependancy fields and hide non-selected ones
	 *
	 * @param string widgetId is unique id of widget
	 * @param string optionName is widget option name which trigger dependency
	 * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
	 */
	function eltdWidgetFields(widgetId, optionName, optionDependencyArray) {
		$('div[id*="'+widgetId+'"]').each(function(){
			var selectedValue = $(this).find('select[id*="'+optionName+'"]').val(),
				saveButton = $(this).find('.widget-control-save');

			saveButton.on('click', {widget: $(this), optionDependencyArray: optionDependencyArray, optionName: optionName}, eltdTrackAjaxChange);

			eltdHideFields($(this), optionDependencyArray);
			eltdShowFields($(this), optionDependencyArray, selectedValue);
		});
	}

	/**
	 * Core function which hides non selected fields and shows selected one
	 *
	 * @param object thisWidget is current widget
	 * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
	 */
	function eltdHideFields(thisWidget, optionDependencyArray) {
		$.each(optionDependencyArray, function(key, value) {
			if( typeof value === 'string' ) {
				thisWidget.find('[id*="' + value + '"]').parent().hide();
			} else if (typeof value === 'object') {
				$.each(value, function(arrayKey, arrayValue){
					thisWidget.find('[id*="'+arrayValue+'"]').parent().hide();
				});
			}
		});
	}

	/**
	 * Core function which shows non selected fields and shows selected one
	 *
	 * @param object thisWidget is current widget
	 * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
	 * @param string/object selectedValue is selected value of optionName
	 */
	function eltdShowFields(thisWidget, optionDependencyArray, selectedValue) {
		if( typeof optionDependencyArray[selectedValue] === 'string' ) {
			thisWidget.find('[id*="'+optionDependencyArray[selectedValue]+'"]').parent().show();
		} else {
			$.each(optionDependencyArray[selectedValue], function(key, value){
				thisWidget.find('[id*="'+value+'"]').parent().show();
			});
		}
	}

	/**
	 * Core function which checks for spinner once a save button is clicked
	 */
	function eltdTrackAjaxChange(event) {
    	var widget = event.data.widget,
		    optionDependencyArray = event.data.optionDependencyArray,
		    optionName = event.data.optionName,
		    spinner = widget.find('.spinner');

	    var timer = setInterval(function(){
		    if( spinner.hasClass('is-active') ) {
			    clearInterval(timer);
			    eltdAfterAjaxReset(widget, optionName, spinner, optionDependencyArray);
		    }
	    }, 20);
	}

	/**
	 * Core function which runs after ajax save is reloaded
	 *
	 * @param object thisWidget is current widget
	 * @param string optionName is widget option name which trigger dependency
	 * @param object spinner is native widget spinner when you click to save widget
	 * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
	 */
	function eltdAfterAjaxReset(thisWidget, optionName, spinner, optionDependencyArray) {
		var timer = setInterval(function(){
			if( ! spinner.hasClass('is-active') ) {
				var selectedValue = thisWidget.find('select[id*="'+optionName+'"]').val();

				clearInterval(timer);
				eltdHideFields(thisWidget, optionDependencyArray);
				eltdShowFields(thisWidget, optionDependencyArray, selectedValue);
			}
		}, 20);
	}

})(jQuery);