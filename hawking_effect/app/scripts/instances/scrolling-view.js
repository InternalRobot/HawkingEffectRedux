/*global define*/

define([
	'jquery',
	'backbone',
	'views/scrolling'
], function($, Backbone, ScrollingView) {
	'use strict';

	var scrollingView = new ScrollingView();

	return scrollingView;
});