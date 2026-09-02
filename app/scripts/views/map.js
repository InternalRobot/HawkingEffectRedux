/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'instances/nodes',
    'data',
    'helpers',
    'views/node',

    //non-AMD
    'GSAP_CSS'
], function($, _, Backbone, JST, nodes, data, helpers, NodeView) {
    'use strict';

    var vp = helpers.viewport;

    var zeroEvent = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    };
    var mapState = {
        activeNode: null,
        events: [zeroEvent, zeroEvent],
        width: vp.width,
        height: vp.height,
        zoom: 1,
        dragPromptVisible: true,
        trails: {
            on: true,
            timeout: null
        }
    };

    var getDistance = function(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    var getSpeed = function(d) {
        return getDistance(d, {
            x: d.px,
            y: d.py
        });
    }

    var els = {
        trailsCanvas: document.querySelector('#trails')
    }

    var MapView = Backbone.View.extend({
        template: JST['app/scripts/templates/map.ejs'],

        tagName: 'div',

        id: 'map',

        className: 'map',

        events: {
            'click .zoom': 'clickZoom'
        },

        initialize: function() {
            // this.listenTo(this.model, 'change', this.render);
            _.bindAll(this, 'activateNode', 'moveMap', 'clickNode');
            this.setElement('#fixed');
            this.on('showCategory', this.showCategory);
            this.listenTo(helpers.viewport, 'openleft', this.deactivateNode);
            this.nodeViews = nodes.models.map(function(node) {
                return new NodeView({
                    model: node
                });
            });
            this.zoomLevel = 1;
        },

        updateEvents: function(event) {
            mapState.events.push(event);
            mapState.events.shift();
        },

        render: function() {
            // this.$el.html(this.template(this.model.toJSON()));
            var _this = this;
            var edgeLength = Math.sqrt(this.nodeViews.length);
            var width = vp.width;
            var height = vp.height;
            // var center = [width / 2, height / 2];
            var center = [0, 0];
            var gSize = this.nodeViews.length * 30;
            var transformProp = Modernizr.prefixed('transform');
            var events = mapState.events;
            var updateEvents = this.updateEvents;

            if (!Modernizr.testProp('pointerEvents')) {
                $('.blue-glow').remove();
            }

            var drag = d3.behavior.drag()
                .origin(function() {
                    //this runs once every mousedown on the g container element
                    var transform = g.node().getCTM();
                    return {
                        x: transform.e - vp.width / 2,
                        y: transform.f - vp.height / 2
                    };
                })
                // uncomment the following to enable drag without zoom
                .on('dragstart', dragstart)
                .on('drag', dragged)
                .on('dragend', dragended);

            var bg = document.querySelector('.bg-img');
            var grid = document.querySelector('.grid-bg');

            var svg = d3.select('.map-svg')
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', width / -2 + ',' + height / -2 + ',' + width + ',' + height)

            vp.on('resize', function() {
                svg.attr('width', vp.width)
                    .attr('height', vp.height)
                    .attr('viewBox', vp.width / -2 + ',' + vp.height / -2 + ',' + vp.width + ',' + vp.height)
            })

            var g = this.g = svg.append('g')
                .attr('transform', 'translate(0,0)')
                // uncomment the following to enable drag without zoom
                .call(drag);

            //this is to capture all dragging mouse events
            g.append('rect')
                .attr('class', 'overlay')
                .attr('width', gSize)
                .attr('height', gSize)
                .attr('x', gSize / -2)
                .attr('y', gSize / -2)
                // .attr('fill', '#00ff00')

            var t;
            var zooming = false;
            var dragging = false;

            function dragstart(e) {
                dragging = true;
                _this.hideDragPrompt();
                if (d3.event.sourceEvent.target.nodeName !== 'circle') {
                    Backbone.history.navigate('', {
                        replace: mapState.activeNode ? false : true
                    });
                    _this.deactivateNode();
                }
            }

            function dragged(event) {
                // if (d3.event.sourceEvent.srcElement.nodeName === 'circle') {
                //     return;
                // }
                if (!mapState.activeNode) {
                    move(event);
                }
            }

            function dragended() {
                dragging = false;
                decelerateDrag();
            }

            function move(event) {
                event = event || d3.event
                updateEvents(event);
                requestAnimationFrame(function() {
                    g.attr('transform', 'translate(' + event.x + ',' + event.y + ') scale(' + mapState.zoom + ')');
                    grid.setAttribute('style', transformProp + ': translate3d(' + event.x * 0.1 + 'px, ' + event.y * 0.1 + 'px,0)');
                    bg.setAttribute('style', transformProp + ': translate3d(' + event.x * 0.01 + 'px, ' + event.y * 0.01 + 'px,0)');
                });
            }

            this.moveMap = move;

            function decelerateDrag() {
                var e0 = events[0];
                var e1 = events[1];
                if (!e1.x || !e1.y) {
                    return;
                }
                var dx = e1.dx;
                var dy = e1.dy;
                var speed = Math.sqrt((dx * dx) + (dy * dy));
                if (!dragging && speed > 0.5) {
                    var outX = Math.abs(e1.x) + width / 2 - (gSize * mapState.zoom / 2);
                    var outY = Math.abs(e1.y) + height / 2 - (gSize * mapState.zoom / 2);
                    dx = dx * 0.9;
                    dy = dy * 0.9;
                    if (outX > 0) {
                        dx += -Math.sign(e1.x) * outX / 200
                    }
                    if (outY > 0) {
                        dy += -Math.sign(e1.y) * outY / 200
                    }
                    var destination = {
                        x: e1.x + dx,
                        y: e1.y + dy,
                        dx: dx,
                        dy: dy
                    };
                    requestAnimationFrame(function() {
                        move(destination);
                        decelerateDrag();
                    });
                }
            }

            var links = data.strong_links.concat(data.weak_links).map(function(link) {
                return {
                    source: _this.nodeViews[link.source],
                    target: _this.nodeViews[link.target]
                };
            });

            var force = this.force = window.force = d3.layout.force()
                .nodes(this.nodeViews)
                .links(links)
                .size([1, 1])
                .linkStrength(0.1)
                .friction(0.9)
                .distance(20)
                .charge(function(d) {
                    return d.model.get('type') === 'root' ? -3000 : -3000;
                })
                .gravity(0.1)
                // .theta(0.8)
                .alpha(0.1)

            var $links = g.selectAll('line')
                .data(links)
                .enter()
                .append('line')
                .attr('stroke', '#41354f')
                .attr('stroke-width', '1');

            var categoryRadius = vp.isMobile ? 285 : 285;
            var $nodes = g.selectAll('.node')
                .data(this.nodeViews)
                .enter().append('g')
                .attr('class', 'node');

            $nodes.each(function(d, i, a) {
                var angle;
                var $this = d3.select(this);
                d.mapView = _this;
                d.setEl(this);
                if (d.model.get('type') === 'root') {
                    $this.attr('class', 'root');
                    d.x = center[0];
                    d.y = center[1];
                } else if (d.model.get('type') === 'category') {
                    $this.attr('class', 'category');
                    d.x = center[0] + (categoryRadius * Math.cos(d.model.angle));
                    d.y = center[1] + (categoryRadius * Math.sin(d.model.angle));
                } else {
                    $this.attr('class', 'topic');
                    angle = d.model.category ? d.model.category.angle : 0;
                    angle += (Math.random() - 0.5) * Math.PI * 2 / nodes.categoryCount;
                    d.x = center[0] + 800 * Math.cos(angle);
                    d.y = center[1] + 800 * Math.sin(angle);
                }
                $this.attr('transform', 'translate(' + d.x + ',' + d.y + ')');
            }).on('click', _this.clickNode);

            var imgW = vp.isMobile ? 180 : 294;
            var imgH = vp.isMobile ? 200 : 327;

            g.append('image')
                .attr('xlink:href', 'images/center.svg')
                .attr('width', imgW)
                .attr('height', imgH)
                .attr('x', center[0] - (imgW / 2))
                .attr('y', center[1] - (imgH / 2))

            this.promptOverlay = svg.append('rect')
                .attr('class', 'prompt-overlay')
                .attr('width', gSize)
                .attr('height', gSize)
                .attr('x', gSize / -2)
                .attr('y', gSize / -2)
                .attr('fill', '#000000')
                .attr('opacity', 0.7)
                .style('pointer-events', 'none');

            this.dragText = svg.append('text')
                .attr('y', '200')
                .attr('text-anchor', 'middle')
                .attr('letter-spacing', '0.1em')
                .attr('fill', '#e3f0f2')
                .attr('opacity', '0.8')
                .style('font-size', '16')
                .style('font-weight', '300')
                .style('pointer-events', 'none')
                .text('Drag to Explore the Connections');

            this.clickText = svg.append('text')
                .attr('y', '230')
                .attr('text-anchor', 'middle')
                .attr('letter-spacing', '0.1em')
                .attr('fill', '#7eacb5')
                .attr('opacity', '0.8')
                .style('font-size', '13')
                .style('font-weight', '300')
                .style('pointer-events', 'none')
                .text('CLICK ANYWHERE TO BEGIN');

            els.trailsCanvas.width = width;
            els.trailsCanvas.height = height;
            els.trailsCanvas.style.opacity = 0;

            var ctx = els.trailsCanvas.getContext('2d');
            var segments = 10;
            var n, trailLength, p0, p1;

            function drawTrails() {
                ctx.clearRect(0, 0, vp.width, vp.height);
                for (var j = 0, len = nodes.models.length; j < len; j++) {
                    n = nodes.models[j].mapNodeView;
                    n.points.push([n.x * mapState.zoom + events[1].x + width / 2 | 0, n.y * mapState.zoom + events[1].y + height / 2 | 0, mapState.zoom]);
                    n.points.shift();
                    if (mapState.trails.on && n.shown) {
                        for (var i = segments; i >= 0; i--) {
                            p0 = n.points[i - 1]
                            p1 = n.points[i];
                            if (p0 && p1) {
                                ctx.beginPath();
                                // ctx.lineWidth = 4 * p1[2];
                                ctx.lineWidth = 4;
                                ctx.strokeStyle = 'rgba(255,255,255,' + (i / segments / 2) + ')';
                                ctx.moveTo(p1[0], p1[1]);
                                ctx.lineTo(p0[0], p0[1]);
                                ctx.stroke();
                            }
                        }
                    }
                }
                window.requestAnimationFrame(drawTrails);
            }
            drawTrails();

            force.on('tick', function() {

                $nodes.attr('transform', function(d, i) {
                    // if (i) {
                    //     var distance = getDistance(d, {
                    //         x: 0,
                    //         y: 0
                    //     });
                    //     var speed = getSpeed(d);
                    //     if (distance < 180) {
                    //         if (speed > 100) {
                    //             // accelerate through the center
                    //             console.log('accelerated');
                    //             d.px = (d.x + d.px) * 0.85;
                    //             d.py = (d.y + d.py) * 0.85;
                    //         } else {
                    //             //stop at edge of force field
                    //             console.log(d.model.get('slug') + ' stopped');
                    //             d.x = d.px;
                    //             d.y = d.py;
                    //         }
                    //     }
                    // }
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

                $links
                    .attr('x1', function(d) {
                        return d.source.x;
                    })
                    .attr('y1', function(d) {
                        return d.source.y;
                    })
                    .attr('x2', function(d) {
                        return d.target.x;
                    })
                    .attr('y2', function(d) {
                        return d.target.y;
                    });

            });
            this.clickZoom();
            force.start();
        },

        //this is reassigned during render function to take advantage of render's closure variables
        moveMap: function() {},

        transitionMap: function(x, y, zoom) {
            var _this = this;

            if (zoom !== mapState.zoom) {
                TweenLite.to(els.trailsCanvas, 0.2, {
                    opacity: 1
                });
            }

            if (zoom < 1) {

                document.querySelector('.icon-plus').style.opacity = 1;
                document.querySelector('.icon-minus').style.opacity = 0;
            } else {
                document.querySelector('.icon-plus').style.opacity = 0;
                document.querySelector('.icon-minus').style.opacity = 1;
            }

            d3.transition()
                .duration(1000)
                .ease('exp-in-out')
                .tween('drag', function() {
                    var i = d3.interpolateObject(mapState.events[1], {
                        x: x,
                        y: y,
                        dx: 0,
                        dy: 0
                    });
                    var iZoom = d3.interpolate(mapState.zoom, zoom);
                    return function(t) {
                        mapState.zoom = iZoom(t);
                        _this.moveMap(i(t));
                    };
                })
                .each('end', function() {
                    TweenLite.to(els.trailsCanvas, 0.2, {
                        opacity: 0
                    });
                });
        },

        clickNode: function(d, i, a) {
            this.activateNode(d, i, a)
        },

        activateNode: function(d, i, a) {
            var _this = this;
            if (mapState.activeNode && mapState.activeNode === d) {
                d.deactivate();
                mapState.activeNode = null;
                $('#right').removeClass('open');
                Backbone.history.navigate('/');
            } else {
                if (mapState.activeNode) {
                    mapState.activeNode.deactivate();
                    mapState.activeNode = null;
                } else {
                    $('#right').addClass('open');
                    helpers.viewport.trigger('openright');
                }
                d.activate();
                mapState.activeNode = d;
                this.transitionMap(-d.x + (vp.width / 2) - (vp.isMobile ? vp.width / 2 : 508), -d.y, 1);
            }

            if (!vp.isMobile) {
                this.force.resume();
            }
        },

        deactivateNode: function() {
            if (mapState.activeNode) {
                mapState.activeNode.deactivate();
                mapState.activeNode = null;
                $('#right').removeClass('open');
            }
        },

        showCategory: function(d) {
            this.hideDragPrompt()
            this.transitionMap(-d.x + (vp.width / 2) - vp.width / 2, -d.y, 1);
        },

        hideDragPrompt: function() {
            var _this = this;
            if (!mapState.dragPromptVisible) {
                return;
            }
            mapState.dragPromptVisible = false;
            this.dragText.transition()
                .duration(500)
                .attr('opacity', '0');

            this.clickText.transition()
                .duration(500)
                .attr('opacity', '0');

            this.promptOverlay.transition()
                .duration(500)
                .attr('opacity', '0')
                .each('end', function() {
                    _this.promptOverlay.remove();
                    _this.dragText.remove();
                    _this.clickText.remove();
                    if (!mapState.activeNode) {
                        _this.clickZoom();
                    }
                });
        },

        clickZoom: function(x, y, scale) {
            this.transitionMap(0, 0, mapState.zoom === 1 ? 0.3 : 1);
        }
    });

    return MapView;
});