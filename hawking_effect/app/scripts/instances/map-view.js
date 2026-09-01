/*global define*/

define([
    'jquery',
    'backbone',
    'views/map'
], function($, Backbone, MapView) {
    'use strict';

    var mapView = new MapView();

    return mapView;
});