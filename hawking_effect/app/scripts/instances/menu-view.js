/*global define*/

define([
	'jquery',
	'backbone',
	'views/menu'
], function($, Backbone, MenuView) {
	'use strict';

	var menuView = new MenuView();

	return menuView;
});