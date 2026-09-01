/*global define*/

//This is actually kind of a combo of both a model and view. 
//It contains much of the code for the node's view in the map.

define([
    'underscore',
    'backbone',
    'views/node-detail',
    'helpers'
], function(_, Backbone, NodeDetailView, helpers) {
    'use strict';

    var HOVER_RADIUS = 29;
    var ACTIVE_INNER_RADIUS = 38;
    var ACTIVE_HOVER_RADIUS = 53;

    var NodeModel = Backbone.Model.extend({

        defaults: {
            related_connections: null,
            children: null,
            shown: true
        },

        initialize: function() {
            this.set('parent', null);
            this.set('children', []);
            this.set('related_connections', []);
            this.set('links', []);
        },
    });

    return NodeModel;
});