/*global require*/
'use strict';

require.config({
    shim: {
        'GSAP_CSS': {
            deps: ['TweenLite']
        }
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash',
        d3: '../bower_components/d3/d3',
        hammer: '../bower_components/hammer.js/hammer',
        fastclick: '../bower_components/fastclick/lib/fastclick',
        fss: '../bower_components/flat-surface-shader/deploy/fss',
        TweenLite: '../bower_components/gsap/src/uncompressed/TweenLite',
        GSAP_CSS: '../bower_components/gsap/src/uncompressed/plugins/CSSPlugin'
    },
    waitSeconds: 0
});

require([
    'backbone',
    'instances/nodes',
    'instances/menu-view',
    'instances/map-view',
    'instances/scrolling-view',
    'views/share',
    'routes/main',
    'helpers',
    // 'GSAP_CSS',
    //non-AMD
    // 'facebook',
    // 'twitter',
    'd3',
    'fastclick'
], function(
    Backbone,
    nodes,
    menuView,
    mapView,
    scrollingView,
    ShareView,
    MainRouter,
     helpers,
    d3,
     FastClick
) {
    FastClick.attach(document.body);
    new ShareView();
    menuView.render();
    mapView.render();
    new MainRouter();

    var slug = document.referrer.match(/connection=([^&]*)/);
    if (slug) {
        window.location.hash = 'connection/' + slug[1];
    }

    Backbone.history.start();
});