/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'instances/map-view',
    'helpers'
], function($, _, Backbone, JST, mapView, helpers) {
    'use strict';

    var AnswerView = Backbone.View.extend({
        template: JST['app/scripts/templates/answer.ejs'],

        tagName: 'div',

        id: '',

        className: 'answer',

        events: {
            'click': 'click'
        },

        initialize: function(opts) {
            this.render();
            this.questionView = opts.questionView;
        },

        render: function() {
            // d3.select(this.el).append('svg');
            this.$el.append(this.template(this.model.toJSON()));
        },

        click: function() {
            if (this.model.get('question')) {
                Backbone.history.navigate('/questions/' + this.model.get('slug'), {
                    trigger: true
                });
            } else {
                helpers.viewport.trigger('showmap');
                mapView.activateNode(this.model.mapNodeView);
            }
        }
    });

    return AnswerView;
});