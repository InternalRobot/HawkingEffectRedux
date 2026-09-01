/*global define*/

define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	//to not break IE9
	window.console = window.console || {
		log: function() {},
		error: function() {}
	};

	//get sign of number
	Math.sign = Math.sign || function(x) {
		x = +x // convert to a number
		if (x === 0 || isNaN(x))
			return x
		return x > 0 ? 1 : -1
	}

	//for setting and animating css transform properties with jquery, etc
	window.transformProp = Modernizr.prefixed('transform');

	//use new Image.load('url') to recieve progress updates on image loading. used for giant bg image
	HTMLImageElement.prototype.load = function(url, callback) {
		var thisImg = this,
			xmlHTTP = new XMLHttpRequest();

		thisImg.completedPercentage = 0;

		xmlHTTP.open('GET', url, true);
		xmlHTTP.responseType = 'arraybuffer';

		xmlHTTP.onload = function(e) {
			var h = xmlHTTP.getAllResponseHeaders(),
				m = h.match(/^Content-Type\:\s*(.*?)$/mi),
				mimeType = m[1] || 'image/png';

			thisImg.onload && thisImg.onload(e);
			var blob = new Blob([this.response], {
				type: mimeType
			});
			thisImg.src = window.URL.createObjectURL(blob);
			if (callback) callback(this);
		};

		xmlHTTP.onprogress = function(e) {
			if (e.lengthComputable) {
				thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
				thisImg.onprogress && thisImg.onprogress(e);
			}
			// Update your progress bar here. Make sure to check if the progress value
			// has changed to avoid spamming the DOM.
			// Something like: 
			// if ( prevValue != thisImage completedPercentage ) display_progress();
		};

		xmlHTTP.onloadstart = function() {
			// Display your progress bar here, starting at 0
			thisImg.completedPercentage = 0;
		};

		xmlHTTP.onloadend = function() {
			// You can also remove your progress bar here, if you like.
			thisImg.completedPercentage = 100;
		}

		xmlHTTP.send();
	};

	//RAF shim
	(function() {
		var lastTime = 0;
		var vendors = ['webkit', 'moz'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame =
				window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() {
						callback(currTime + timeToCall);
					},
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}
	}());

	function getHex(opts) {
		var points = [];
		var radius = opts.radius || 10;
		var strokeWidth = opts.strokeWidth || 2;
		var offsetAngle = opts.flatTop ? 0 : Math.PI / 6;
		var sixtyDeg = Math.PI / 3;
		for (var i = 0; i < 6; i++) {
			points.push([
				Math.cos(i * sixtyDeg + offsetAngle) * radius + radius + strokeWidth / 2,
				Math.sin(i * sixtyDeg + offsetAngle) * radius + radius + strokeWidth / 2
			]);
		}

		var svg = d3.select('body').append('svg')
			.attr('class', opts.className)
			.attr('width', (radius + strokeWidth / 2) * 2)
			.attr('height', (radius + strokeWidth / 2) * 2);

		var el;
		if (opts.roundness) {
			el = svg.append('path')
				.attr('d', quadraticCorners(points, opts.roundness));
		} else {
			el = svg.append('polygon')
				.attr('points', points.join(' '));
		}
		el.attr('stroke', '#4e7f88')
			.attr('fill', '#ffffff')
			.attr('stroke-width', 2)

		return {
			svg: svg.node(),
			el: el.node(),
			points: points
		};
	}

	var quadraticCorners = (function() {

		function lerp(p0, p1, t) {
			return [
				p0[0] + t * (p1[0] - p0[0]),
				p0[1] + t * (p1[1] - p0[1])
			].join(',');
		}

		var dCache = {};

		return function(points, t) {

			var dName = 'd' + (points.join() + ((t * 100) | 0)).replace(/,|\./g, '');

			if (dCache[dName]) {
				return dCache[dName];
			}

			//start on the beginning of the curve around the first point
			var firstPoint = lerp(points[points.length - 1], points[0], 1 - t / 2);
			var d = 'M' + firstPoint;
			var nextPoint;
			for (var i = 0; i < points.length; i++) {
				if (i === points.length - 1) {
					nextPoint = points[0]
				} else {
					nextPoint = points[i + 1]
				}
				d += 'Q' + points[i].join(',') + ' ' + lerp(points[i], nextPoint, t / 2);
				d += 'L' + lerp(points[i], nextPoint, 1 - t / 2);
			}
			d += 'Z';
			dCache[dName] = d;
			return d;
		}
	})();

	function viewport() {
		var vp = {
			isMobile: false,
			scale: 1
		}

		vp = _.extend(vp, Backbone.Events);

		function calculateLayout() {
			vp.width = $(window).width();
			vp.height = $(window).height();
			if (vp.width < 750) {
				vp.isMobile = true;
			} else {
				vp.isMobile = false;
			}
			if (vp.width < 640) {
				vp.scale = vp.width / 750
			}
			vp.trigger('resize');
		}

		var lazyLayout = _.debounce(calculateLayout, 300);
		$(window).resize(lazyLayout);

		calculateLayout();

		return vp;
	}

	return {
		getHex: getHex,
		quadraticCorners: quadraticCorners,
		viewport: viewport()
	};
});