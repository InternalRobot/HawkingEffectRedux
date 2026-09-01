/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'instances/nodes',
    'instances/map-view',
    'helpers',
], function($, _, Backbone, JST, nodes, mapView, helpers) {
    'use strict';

    var green = '#4e7f88';
    var white = '#ffffff';

    var MenuView = Backbone.View.extend({
        template: JST['app/scripts/templates/menu.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {
            'click .handle-triangle': 'clickHandle',
            'mouseenter .handle-triangle': 'enterHandle',
            'mouseleave .handle-triangle': 'leaveHandle',
            'click .filter': 'clickFilter',
            'mouseenter .filter': 'enterFilter',
            'mouseleave .filter': 'leaveFilter',
        },

        initialize: function() {
            var _this = this;
            this.setElement('#left');
            this.els = {};
            this.state = {
                isOpen: false,
                isHovered: false,
                currentFilter: 'ALL'
            };
            this.model = nodes;
            this.listenTo(helpers.viewport, 'openright', this.close);
            this.listenTo(helpers.viewport, 'removefilter', this.clearFilters);
            $('.find-my-connection').on('click', function() {
                var slug = (_this.state.currentFilter.toUpperCase() !== 'ALL' ? nodes.lookupTable[_this.state.currentFilter] : nodes.at(0)).get('slug')
                Backbone.history.navigate('questions/' + slug, {
                    trigger: true
                });
            });
        },

        render: function() {
            this.$el.html(this.template(this.model));
            var svg = this.els.handle = d3.select('#left').append('svg')
                .attr('class', 'menu-handle')
                .attr('width', 72)
                .attr('height', 216);

            this.els.shadow = svg.append('path')
                .attr('d', 'M0,-2L65,88Q80,108,65,128L0,218Z')
                .attr('fill', '#000000')
                .attr('fill-opacity', 0.2);

            this.els.triangle = svg.append('path')
                .attr('class', 'handle-triangle')
                .attr('d', 'M0,0L65,90Q78,108,65,126L0,216Z')
                .attr('fill', white);

            this.els.lines = [];
            for (var i = 0; i < 3; i++) {
                this.els.lines.push(svg.append('rect')
                    .attr('class', 'patties')
                    .attr('x', 26)
                    .attr('y', i * 8 + 101)
                    .attr('width', 22)
                    .attr('height', 2)
                    .attr('fill', green)
                );
            };

            this.els.x = svg.append('path')
                .attr('class', 'cross')
                .attr('d', 'M-1,1L-1,11L1,11L1,1L11,1L11,-1L1,-1L1,-11L-1,-11L-1,-1L-11,-1L-11,1L-1,1')
                .attr('fill', '#ffffff')
                .attr('transform', 'rotate(45,30,108) translate(30,108)')

            var $filters = this.$('.filters');
            var filtersHeight = $filters.outerHeight();
            var windowHeight = $(window).height();
            var scale = (windowHeight * 0.9 - 100) / filtersHeight
            if (scale < 1) {
                $filters.css(window.transformProp, 'translateY(-50%) scale(' + scale + ')');
            }
        },

        clickHandle: function() {
            if (this.state.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        open: function() {
            this.state.isOpen = true;
            this.$el.removeClass('closed');
            this.$el.addClass('open');
            helpers.viewport.trigger('openleft');
        },

        close: function() {
            this.state.isOpen = false;
            this.$el.addClass('closed');
            this.$el.removeClass('open');
        },

        enterHandle: function() {
            this.state.isHovered = true;
            this.$el.addClass('hovered');
        },

        leaveHandle: function() {
            this.state.isHovered = false;
            this.$el.removeClass('hovered');
        },

        clickFilter: function(e) {
            this.$('.filter').removeClass('active')
            $(e.currentTarget).addClass('active');
            this.state.currentFilter = $(e.currentTarget).data('category');
            if (this.state.currentFilter === 'all') {
                nodes.forEach(function(node) {
                    node.trigger('show');
                });
            } else {
                var category = nodes.lookupTable[this.state.currentFilter];
                nodes.forEach(function(node) {
                    if (node.category === category || node === category) {
                        node.trigger('show');
                    } else {
                        node.trigger('hide');
                    }
                });
                mapView.trigger('showCategory', category.mapNodeView);
            }
        },

        enterFilter: function(e) {
            $(e.currentTarget).addClass('active');
        },

        leaveFilter: function(e) {
            if ($(e.currentTarget).data('category') !== this.state.currentFilter) {
                $(e.currentTarget).removeClass('active');
            }
        },

        clearFilters: function() {
            this.$('.filter-all').trigger('click');
        }
    });

    return MenuView;
});