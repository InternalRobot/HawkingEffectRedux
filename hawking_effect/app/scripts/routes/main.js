/*global define*/

define([
	'jquery',
	'backbone',
	'instances/map-view',
	'instances/loading-view',
	'instances/scrolling-view',
	'instances/nodes',
	'helpers'
], function($, Backbone, mapView, loadingView, scrollingView, nodes, helpers) {
	'use strict';

	var MainRouter = Backbone.Router.extend({
		routes: {
			'connection/:slug': 'connection',
			'questions/:slug': 'question',
			'*default': 'defaultRoute'
		},

		defaultRoute: function() {
			mapView.deactivateNode();
		},

		connection: function(slug) {
			var node = nodes.findBySlug(slug);
			if (node) {
				scrollingView.close();
				mapView.activateNode(node.mapNodeView);
				helpers.viewport.trigger('showmap');
			} else {
				Backbone.history.navigate('/', {
					trigger: true
				});
			}
		},

		question: function(slug) {
			scrollingView.showQuestion(nodes.findBySlug(slug));
		}

	});

	return MainRouter;
});