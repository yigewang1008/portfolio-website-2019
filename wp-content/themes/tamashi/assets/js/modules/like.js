(function($) {
    'use strict';

    var like = {};
    
    like.eltdOnDocumentReady = eltdOnDocumentReady;

    $(document).ready(eltdOnDocumentReady);
    
    /**
    *  All functions to be called on $(document).ready() should be in this function
    **/
    function eltdOnDocumentReady() {
        eltdLikes();
    }

    function eltdLikes() {
        $(document).on('click','.eltd-like', function() {
            var likeLink = $(this),
                id = likeLink.attr('id'),
                type;

            if ( likeLink.hasClass('liked') ) {
                return false;
            }

            if (typeof likeLink.data('type') !== 'undefined') {
                type = likeLink.data('type');
            }

            var dataToPass = {
                action: 'tamashi_elated_like',
                likes_id: id,
                type: type
            };

            var like = $.post(eltdGlobalVars.vars.eltdAjaxUrl, dataToPass, function( data ) {
                likeLink.html(data).addClass('liked').attr('title', 'You already like this!');
            });

            return false;
        });
    }
    
})(jQuery);