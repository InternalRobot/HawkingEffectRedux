/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'helpers',
    'd3',
    'GSAP_CSS'
], function($, _, Backbone, JST, helpers) {
    'use strict';

    var LoadingView = Backbone.View.extend({
        template: JST['app/scripts/templates/loading.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {
            'click .questionnaire': 'clickQuestionnaire',
            'click .explore': 'clickExplore'
        },

        initialize: function() {
            var _this = this;
            var radius = 10;
            _.bindAll(this, 'showButtons', 'remove');
            this.setElement('#loading');
            this.assetsLoaded = false;

            window.scrollTo(0, 0);
            var bgImg = document.getElementById('bg-img');
            var $progress = this.$('.progress');
            var previousLoaded = 0;
            bgImg.onprogress = function(e) {
                if (e.loaded !== previousLoaded) {
                    $progress.css({
                        width: e.loaded / e.total * 50 + '%'
                    });
                }
            };
            bgImg.onload = this.showButtons;
            bgImg.load('images/bg-veryhigh.jpg');
            this.$('.loader-graphic').css('opacity', 1);
            $('.loader-graphic').append(helpers.getHex({
                radius: radius,
                strokeWidth: 2,
                flatTop: false,
                className: 'spinner',
                roundness: 0.3
            }).svg);

            // var points = helpers.getHex({
            //     radius: radius,
            //     strokeWidth: 2,
            //     flatTop: false,
            //     className: 'progress-hex'
            // }).points;

            // function roundHex() {
            //     hex.setAttributeNS(null, 'd', helpers.quadraticCorners(points, Math.sin(t)));
            //     t += Math.PI / 10;
            //     if (!_this.assetsLoaded) {
            //         window.requestAnimationFrame(roundHex);
            //     }
            // }
            // roundHex();
        },

        render: function() {

        },

        showButtons: function() {
            this.$('.loader-graphic').css('opacity', 0)
            this.$('.loader-buttons').css('opacity', 1)
            this.assetsLoaded = true;
        },

        clickQuestionnaire: function() {
            this.parent.showQuestion();
        },

        clickExplore: function() {
            var _this = this;
            this.$('.loading-text').hide();
            this.$('.loader-graphic').hide();
            this.$('.loader-buttons').hide();
            // this.$('.centered').css({
            //     'margin-top': helpers.viewport.height / 2 - 330 / 2 + 'px'
            // }, 500);
            window.setTimeout(function() {
                _this.parent.close();
            }, 500)
        },

    });

    return LoadingView;
});