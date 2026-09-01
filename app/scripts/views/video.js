/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'helpers'
], function($, _, Backbone, JST, helpers) {
    'use strict';

    var VideoView = Backbone.View.extend({
        template: JST['app/scripts/templates/video.ejs'],

        tagName: 'div',

        id: '',

        className: 'video-overlay',

        events: {
            'click .hitbox': 'destroy'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            var video_id = this.model.get('url').split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if (ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
            this.model.set('video_id', video_id);
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            var width = Math.round(helpers.viewport.width * 0.6);
            var height = Math.round(width * 0.5625);
            this.$('.video-frame').attr({
                width: width,
                height: height,
                src: '//www.youtube.com/embed/' + this.model.get('video_id')
            });
            this.el.style.opacity = 0;
            $('body').append(this.el);
            this.el.style.opacity = 1;
        },

        destroy: function() {
            this.el.style.opacity = 0;
            setTimeout(this.remove.bind(this), 500);
        }
    });

    return VideoView;
});