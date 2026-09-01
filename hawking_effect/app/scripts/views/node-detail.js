/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'helpers',
    'views/video',

    //non-AMD
    'hammer'
], function($, _, Backbone, JST, helpers, VideoView) {
    'use strict';

    var NodeDetailView = Backbone.View.extend({
        template: JST['app/scripts/templates/node-detail.ejs'],

        tagName: 'div',

        className: 'node-detail',

        events: {
            'click .detail-close': 'close',
            // 'click [data-shareable="true"]': 'share',
            'click .watch-video': 'clickVideo',
            'click .continue-exploring': 'close',
            'mouseenter .detail-share': 'openShare',
            'mouseleave .detail-share': 'closeShare',
            'click .detail-share': 'openShare',
            'click .icon-close': 'clickCloseShare'
        },

        initialize: function() {
            _.bindAll(this, 'remove');
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        render: function() {
            var _this = this;
            this.$el.html(this.template(this.model.toJSON()));
            $('#right').append(this.el);
            this.$('.detail-content').css('height', this.$el.height() - this.$('.detail-bottom').height() + 'px');
            this.$el.animate({
                'opacity': 1
            }, 100);
            if (this.model.get('url_type') === 'youtube') {
                window.setTimeout(function() {
                    _this.$('iframe').attr('src', _this.model.get('url'));
                }, 1000);
            }
            this.shareImage = this.$('.share-image').get(0);
        },

        destroy: function() {
            this.el.style.opacity = 0;
            window.setTimeout(this.remove, 1000);
        },

        close: function() {
            $('#right').removeClass('open');
            this.destroy();
            Backbone.history.navigate('/', {
                trigger: true
            });
        },

        clickVideo: function() {
            new VideoView({
                model: this.model
            });
        },

        openShare: function() {
            var loading = true;
            var radius = 10;

            this.$('.detail-share').addClass('open');

            if (!this.shareImage.src) {
                $('.share-image-container').append(helpers.getHex({
                    radius: radius,
                    strokeWidth: 4,
                    flatTop: false,
                    className: 'spinner',
                    roundness: 0.3
                }).svg);

                var img = new Image();
                var _this = this;
                img.onload = function() {
                    loading = false;
                    _this.shareImage.src = img.src;
                    _this.shareImage.style.opacity = 1;
                };
                img.src = 'http://images.stephenhawkingeffect.com/hawking_effect/social/' + this.model.get('slug') + '.jpg';
            }
        },

        closeShare: function() {
            this.$('.detail-share').removeClass('open');
        },

        clickCloseShare: function(e) {
            e.stopImmediatePropagation();
            this.closeShare();
        }
    });

    return NodeDetailView;
});