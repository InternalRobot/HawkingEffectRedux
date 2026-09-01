/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/node-detail',
    'helpers'
], function($, _, Backbone, JST, NodeDetailView, helpers) {
    'use strict';

    var HOVER_RADIUS = 29;
    var ACTIVE_INNER_RADIUS = 38;
    var ACTIVE_HOVER_RADIUS = 53;

    var NodeView = Backbone.View.extend({
        template: JST['app/scripts/templates/node.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function() {
            _.bindAll(this, ['onmouseenter', 'onmouseleave']);
            if (this.model.get('type') === 'topic') {
                this.innerRadius = 8;
                this.outerRadius = 14;
                this.outerColor = '#a38e3a';
                this.fontSize = 15;
                this.textColor = '#808080';
                this.fixed = false;
            } else if (this.model.get('type') === 'category') {
                this.innerRadius = 11;
                this.outerRadius = 19;
                this.outerColor = '#c85152';
                this.fontSize = 20;
                this.textColor = '#c8c8c8';
                this.fixed = true;
            } else {
                this.innerRadius = 0;
                this.outerRadius = 0;
                this.outerColor = '#76a4af';
                this.fontSize = 0;
                this.textColor = '#c8c8c8';
                this.fixed = true;
            }
            this.wasFixed = this.fixed;
            this.listenTo(this.model, 'show', this.show)
            this.listenTo(this.model, 'hide', this.hide)
            this.model.mapNodeView = this;
            this.shown = true;
        },

        setEl: function(el) {
            this.el = el;
            this.d3el = d3.select(el)

            this.d3hitbox = this.d3el.append('circle')
                .attr('class', 'hitbox')
                .attr('r', 60)
                .attr('fill', '#000')
                .attr('opacity', 0)
                .attr('stroke', 'none');

            this.d3innerCircle = this.d3el.append('circle')
                .attr('class', 'inner-circle')
                .attr('r', this.innerRadius)
                .attr('fill', '#ffffff')
                // .attr('stroke', 'rgba(255, 255, 255, 0.5)')
                // .attr('stroke-width', '2');

            this.d3outerCircle = this.d3el.append('circle')
                .attr('class', 'outer-circle')
                .attr('r', this.outerRadius)
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr('stroke', this.outerColor);

            this.d3text = this.d3el.append('text')
                .attr('class', 'node-name')
                .attr('text-anchor', 'middle')
                .attr('letter-spacing', '0.1em')
                .attr('dy', '2.5em')
                .attr('fill', this.textColor)
                .attr('opacity', '1')
                .style('font-size', this.fontSize)
                .text(this.model.get('connection').toUpperCase());

            this.d3cross = this.d3el.append('path')
                .attr('class', 'cross')
                .attr('d', 'M-1,1L-1,11L1,11L1,1L11,1L11,-1L1,-1L1,-11L-1,-11L-1,-1L-11,-1L-11,1L-1,1')
                .attr('fill', '#000000')
                .attr('opacity', '0')

            this.trail = d3.select('.map-svg').append('path')
                .attr('d', 'M0,0')
                .attr('stroke', '#ffffff')
                .attr('stroke-width', '8')
                .attr('fill', 'none');

            this.points = [];
            this.points.length = 10
                // for (var i = 0, len = this.points.length; i < len; i++) {
                //     this.points[i] = [0,0]
                // }

            this.d3el.on('mouseenter', this.onmouseenter);
            this.d3el.on('mouseleave', this.onmouseleave);
        },

        drawTrail: function() {
            this.points.push([this.x | 0, this.y | 0]);
            this.points.shift();
            var d = 'M' + this.x + ',' + this.y;
            for (var i = 60; i > 0; i--) {
                if (this.points[i]) {
                    d += 'L' + this.points[i][0] + ',' + this.points[i][1]
                }
            }
            this.trail.attr('d', d);
        },

        onmouseenter: function(d) {
            var duration = 500;
            if (this.active) {
                this.d3innerCircle.transition()
                    .duration(duration)
                    .attr('r', ACTIVE_HOVER_RADIUS);

                this.d3cross.transition()
                    .duration(duration)
                    .attr('opacity', '1')
                    .attr('transform', 'rotate(45)')
                    .attr('fill', '#000000');;
            } else {
                this.d3innerCircle.transition()
                    .duration(duration)
                    .attr('r', '29');

                this.d3outerCircle.transition()
                    .duration(duration)
                    .attr('r', '29');

                this.d3cross.transition()
                    .duration(duration)
                    .attr('opacity', '1')
                    .attr('fill', '#000000');

                this.d3text.transition()
                    .duration(duration)
                    .attr('dy', '2.6em')
                    .attr('opacity', '1')
                    .style('font-size', this.fontSize * 1.5 + 'px');
            }
        },

        onmouseleave: function(d) {
            var duration = 200;
            if (this.active) {
                this.d3innerCircle.transition()
                    .duration(duration)
                    .attr('r', ACTIVE_INNER_RADIUS);

                this.d3cross.transition()
                    .duration(duration)
                    .attr('opacity', '1')
                    .attr('transform', 'rotate(45)')
                    .attr('fill', '#76a4af');;
            } else {
                this.d3innerCircle.transition()
                    .duration(duration)
                    .attr('r', this.innerRadius);

                this.d3outerCircle.transition()
                    .duration(duration)
                    .attr('stroke', this.outerColor)
                    .attr('r', this.outerRadius)

                this.d3cross.transition()
                    .duration(duration)
                    .attr('opacity', '0')
                    .attr('transform', 'rotate(0)')
                    .attr('fill', '#000000');;

                this.d3text.transition()
                    .duration(duration)
                    .attr('dy', '2.5em')
                    .attr('opacity', '1')
                    .style('font-size', this.fontSize + 'px')
            }
        },

        activate: function(d, i, a) {
            var duration = 1000;
            this.fixed = true;
            this.active = true;

            if (!this.shown) {
                helpers.viewport.trigger('removefilter');
            }
            this.d3innerCircle.transition()
                .duration(duration)
                .attr('r', '38');

            this.d3outerCircle.transition()
                .duration(duration)
                .attr('stroke', '#76a4af')
                .attr('r', ACTIVE_HOVER_RADIUS);

            this.d3cross.transition()
                .duration(duration)
                .attr('opacity', '1')
                .attr('transform', 'rotate(45)')
                .attr('fill', '#76a4af');

            this.d3text.transition()
                .duration(duration)
                .attr('opacity', '0')
                .attr('dy', '3.5em');

            if (!helpers.viewport.isMobile) {
                this.d3line = this.d3el.append('rect')
                    .attr('class', 'line')
                    .attr('x', HOVER_RADIUS)
                    .attr('y', '-1')
                    .attr('width', '0')
                    .attr('height', '2')
                    .attr('fill', this.outerColor);

                this.d3line.transition()
                    .duration(duration)
                    .attr('width', '70')
                    .attr('x', ACTIVE_HOVER_RADIUS)
                    .attr('fill', '#76a4af');
            }

            this.detailView = new NodeDetailView({
                model: this.model
            });

            Backbone.history.navigate('connection/' + this.model.get('slug'));
        },

        deactivate: function(d, i, a) {
            var duration = 1000;
            var _this = this;
            this.fixed = this.wasFixed;
            this.active = false;
            this.d3innerCircle.transition()
                .duration(duration)
                .attr('r', this.innerRadius);

            this.d3outerCircle.transition()
                .duration(duration)
                .attr('stroke', this.outerColor)
                .attr('r', this.outerRadius);

            this.d3cross.transition()
                .duration(duration)
                .attr('opacity', '0')
                .attr('transform', 'rotate(0)')
                .attr('fill', '#000000');

            this.d3text.transition()
                .duration(duration)
                .attr('opacity', '1')
                .attr('dy', '2.5em')
                .style('font-size', this.fontSize + 'px');

            if (!helpers.viewport.isMobile) {
                this.d3line.transition()
                    .duration(duration)
                    .attr('width', '0')
                    .attr('x', this.outerRadius)
                    .attr('fill', this.outerColor)
                    .each('end', function() {
                        _this.d3line.remove();
                    });
            }

            this.detailView.destroy();
        },

        show: function() {
            this.shown = true;
            this.d3el.transition()
                .duration(500)
                .attr('opacity', 1)
        },

        hide: function() {
            this.shown = false;
            this.d3el.transition()
                .duration(500)
                .attr('opacity', 0.1)
        },
    });

    return NodeView;
});