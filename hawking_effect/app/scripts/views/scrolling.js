/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'helpers',
    'instances/loading-view',
    'views/question',
    'instances/fss-instance',
], function($, _, Backbone, helpers, loadingView, QuestionView, fssInstance) {
    'use strict';

    var ScrollingView = Backbone.View.extend({

        events: {},

        initialize: function() {
            _.bindAll(this, 'remove');
            this.setElement('#white-scrolling-page');
            this.$container = this.$('.container');
            this.currentView = loadingView;
            loadingView.parent = this;
            loadingView.render();
            this.listenTo(helpers.viewport, 'showmap', this.close);
            fssInstance.initialise();
            fssInstance.play();
        },

        showQuestion: function(question) {
            this.el.style.display = 'block';
            fssInstance.play();
            this.currentView && this.closeCurrent();
            var newView = this.currentView = new QuestionView({
                model: question
            });
            var newEl = newView.render().el;

            this.$container.append(newEl);
            var $centered = newView.$('.centered');
            var height = $centered.height();
            var wHeight = $(window).height();
            var topmargin = helpers.viewport.isMobile ? 70 : 160;
            if (height < wHeight) {
                $centered.css('margin-top', Math.max(topmargin, (wHeight - height) / 2) + 'px');
            } else {
                $centered.css('margin-top', topmargin + 'px');
            }
            this.el.style.opacity = 1;
            this.el.style.height = Math.max(newEl.offsetHeight, wHeight) * 0.96 + 'px';
            newEl.style.opacity = 1;
            window.scrollTo(0, 0);
        },

        closeCurrent: function() {
            this.currentView.el.style.position = 'absolute';
            this.currentView.el.style.opacity = 0;
            window.setTimeout(this.currentView.remove, 500);
        },

        close: function() {
            var _this = this;
            this.el.style.opacity = 0;
            fssInstance.pause()
            this.closeCurrent();
            window.setTimeout(function() {
                _this.el.style.display = 'none';
            }, 500);
        }
    });

    return ScrollingView;
});