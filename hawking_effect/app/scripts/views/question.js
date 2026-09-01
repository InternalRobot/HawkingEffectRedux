/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'helpers',
    'views/answer',
    'instances/nodes'
], function($, _, Backbone, JST, helpers, AnswerView, nodes) {
    'use strict';

    var QuestionView = Backbone.View.extend({
        template: JST['app/scripts/templates/question.ejs'],

        tagName: 'div',

        id: '',

        className: 'question-page',

        events: {
            'click .skip': 'skip'
        },

        initialize: function() {
            _.bindAll(this, 'remove');
            this.model = this.model || nodes.at(0);
            Backbone.history.navigate('/questions/' + this.model.get('slug'));
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));

            _.forEach(this.model.get('children'), function(child) {
                if (child.get('answer')) {
                    var answerView = new AnswerView({
                        model: child,
                        questionView: this
                    });
                    this.$('.answers').append(answerView.el);
                }
            }, this);

            this.$('.divider').append(helpers.getHex({
                radius: 10,
                strokeWidth: 2,
                flatTop: false,
                className: 'progress-svg',
                roundness: 0.3
            }).svg);

            var maxDepthAfter = 0;
            var depthBefore = 0;
            var depth = 0;

            function checkDepthAfter(model) {
                if (model.get('answer') || model.get('type') === 'root') {
                    depth++;
                    if (model.get('question')) {
                        _.each(model.get('children'), checkDepthAfter)
                    } else {
                        maxDepthAfter = Math.max(maxDepthAfter, depth);
                    }
                    depth--;
                }
            }

            function checkDepthBefore(model) {
                if (model.get('parent')) {
                    depthBefore++;
                    checkDepthBefore(model.get('parent'));
                }
            }

            checkDepthAfter(this.model);
            checkDepthBefore(this.model);

            var totalQuestions = depthBefore + maxDepthAfter - 1;
            for (var i = 0; i < totalQuestions; i++) {
                var dot = $('<div>');
                if (i === depthBefore) {
                    dot.addClass('filled');
                }
                this.$('.progress').append(dot);
            };

            return this;
            $('#white-scrolling-page .container').html(this.el);
        },

        skip: function() {
            helpers.viewport.trigger('showmap');
            Backbone.history.navigate('/');
        }
    });

    return QuestionView;
});