/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'helpers',
    'instances/nodes'
], function($, _, Backbone, helpers, nodes) {
    'use strict';

    function openWindow(url, title, w, h) {
        var left = (helpers.viewport.width / 2) - (w / 2);
        var top = (helpers.viewport.height / 2) - (h / 2);
        return window.open(
            url,
            title,
            'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no' +
            ', width=' + w +
            ', height=' + h +
            ', top=' + top +
            ', left=' + left
        ).focus();
    }

    function getUrl(e) {
        return 'http://explore.stephenhawkingeffect.com/share/' + $(e.target).data('slug')
    }

    function getImage(e) {
        return nodes.lookupTable[$(e.target).data('slug')].get('image_filename');
    }

    function getShareableImageForPlatform(e, platform) {
        return 'http://images.stephenhawkingeffect.com/hawking_effect/social/' + $(e.target).data('slug') + "_" + platform + '.jpg'
    }

    function getDescription(e) {
        return nodes.lookupTable[$(e.target).data('slug')].get('description');
    }

    function getGenericShareText() {
        return "Stephen Hawking believes we are all connected infinitely. Test his theory. #TheTheoryofEverything"
    }

    function getTwitterNodeShareText(e) {
        var slug = $(e.target).data('slug')
        var node = nodes.lookupTable[slug];
        
        if ((slug === 'stephen_hawking') || (!node)) {
            return getGenericShareText();
        }

        var base =  "Can you believe that " + node.get('share_subject') + " connected to Stephen Hawking?!";
        var extended = " Here's How: ";
        var url = getUrl(e);
        var hashtag = " #thetheoryofeverything";

        if ((base.length + hashtag.length + extended.length + 23) <= 140) {
            return base + extended + url + hashtag;
        } else {
            return base + url + hashtag;
        };
    }

    function getPinterestNodeShareText(e) {
        var slug = $(e.target).data('slug')
        var node = nodes.lookupTable[slug];
        
        if ((slug === 'stephen_hawking') || (!node)) {
            return getGenericShareText();
        }

        var base =  "Can you believe that " + node.get('share_subject') + " connected to Stephen Hawking?!";
        var extended = " Here's How: ";
        var url = getUrl(e);
        var hashtag = " #thetheoryofeverything";

        return base + extended + url + hashtag ;
    }

    var ShareView = Backbone.View.extend({

        events: {
            'click .icon-facebook': 'shareFb',
            'click .icon-twitter': 'shareTw',
            'click .icon-pinterest': 'sharePn'
        },

        initialize: function() {
            var _this = this;
            this.setElement('body');
        },

        shareFb: function(e) {
            openWindow(
                'https://www.facebook.com/sharer/sharer.php?s=100' +
                '&p[url]=' + encodeURIComponent(getUrl(e)) +
                '', '_blank', 590, 368
            );

            // FB.ui({
            //     method: "share",
            //     href: getUrl(e)
            // })
        },

        shareTw: function(e) {
            openWindow(
                'https://twitter.com/intent/tweet?' +
                'text=' + encodeURIComponent(getTwitterNodeShareText(e)) + 
                '', '_blank', 575, 240
            );
        },

        sharePn: function(e) {
            openWindow(
                'http://pinterest.com/pin/create/button/' +
                '?url=' + encodeURIComponent(getUrl(e)) +
                '&media=' + getShareableImageForPlatform(e, 'pinterest') +
                '&description=' + encodeURIComponent(getPinterestNodeShareText(e)) +
                '', '_blank', 575, 240
            );
        }

    });

    return ShareView;
});