/*global define*/

define([
	'underscore',
	'backbone',
	'models/node'
], function(_, Backbone, NodeModel) {
	'use strict';

	var NodesCollection = Backbone.Collection.extend({

		model: NodeModel,

		url: 'data.json',

		findBySlug: function(slug) {
			return _.findWhere(this.models, function(node) {
				return node.get('slug') === slug;
			});
		}
	});

	return NodesCollection;
});