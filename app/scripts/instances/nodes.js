/*global define*/

define([
    'jquery',
    'backbone',
    'collections/nodes',
    'data'
], function($, Backbone, Nodes, data) {
    'use strict';

    var nodes = window.appNodes = new Nodes();
    var categoryIndex = 0;

    window.appData = data;

    //run this to print positions of each node to avoid running force layout.
    window.getPositions = function() {
        $('body').append('<textarea style="position: absolute; top: 0; left: 0; width: 600px; height: 600px; z-index: 10000; background-color: #ffffff">' + JSON.stringify(nodes.models.map(function(n) {
            return {
                x: n.x | 0,
                y: n.y | 0
            }
        })) + '</textarea>')
    }
    nodes.lookupTable = {};
    nodes.set(data.nodes);
    nodes.categories = {};
    _.forEach(nodes.models, function(d, i) {
        if (!d.get('slug')) {
            console.error('"' + d.get('connection') + '" has no slug"');
            return null;
        }
        nodes.lookupTable[d.get('slug')] = d;
    });
    _.forEach(nodes.models, function(d, i) {

        var strong_parents = d.get('strong_parents'); //csv string
        var weak_parents = d.get('weak_parents') //csv string
        var links = []; //empty array
        var parent = null; //always null

        if (strong_parents) {
            //if it's not the root node
            strong_parents = strong_parents.split(',')[0];
            if (nodes.lookupTable[strong_parents]) {
                parent = nodes.lookupTable[strong_parents]
                parent.get('children').push(d)
                d.set('parent', parent);
            } else {
                console.error('"' + strong_parents + '" is not a valid strong_parent for "' + d.get('slug') + '"');
                return null;
            }
        }

        if (weak_parents) {
            //if it has  other visual links besides children and parent
            weak_parents = weak_parents.split(',');
            links = weak_parents.map(function(link, i) {
                var wp;
                if (nodes.lookupTable[link]) {
                    wp = nodes.lookupTable[link]
                } else {
                    console.error('"' + link + '" is not a valid weak_parent for "' + d.get('slug') + '"');
                    return null;
                }
                return wp;
            });
            d.get('links').concat(links)
        }

        if (d.get('type') === 'category') {
            d.catIndex = categoryIndex;
            categoryIndex++;
            nodes.categories[d.get('slug')] = d;
        }

        if (d.get('url')) {
            d.set('related_connections', parent.get('children'));
        } else {
            d.set('related_connections', d.get('children'));
        }

        if (d.get('image_filename').indexOf('svg') > -1) {
            d.set('image_type', 'icon');
        } else {
            d.set('image_type', 'photo');
        }
    })

    nodes.categoryCount = categoryIndex;

    _.forEach(nodes.categories, function(cat) {
        cat.angle = (cat.catIndex * Math.PI * 2 / nodes.categoryCount) - Math.PI / 2;
    });

    _.forEach(nodes.models, function(d, i) {
        var i = 0;
        var category;

        d.set('related_connections', _.without(d.get('related_connections'), d));

        function getCategory(node) {
            var parent = node.get('parent');

            i++;

            if (parent.get('type') === 'category') {
                d.category = parent;
            } else if (i < 4) {
                getCategory(parent)
            } else {
                d.category = null;
                console.error('could not find category for ' + d.get('slug') + ' node after ' + i + ' links');
            }
        }

        if (d.get('parent') && d.get('type') !== 'category') {
            getCategory(d)
        }
    })
    return nodes;
});