/*global define*/

define([
	'jquery',
	'backbone',
	'views/loading'
], function($, Backbone, LoadingView) {
	'use strict';

	var loadingView = new LoadingView();

	return loadingView;
});