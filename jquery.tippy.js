/*
 * jQuery Tippy
 * Version 1.2.5
 * By Chris Roberts, chris@dailycross.net
 * http://croberts.me/
 *
 */

/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 Chris Roberts
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function($) {
	$.fn.tippy = function(options) {
		// Track data for each of our tooltips
		var tippy_state = {};

		// Hold global position data
		var tippy_positions = {};

		// Store id of last displayed tooltip
		var tippy_showing = false;

		var opts = $.extend({}, $.fn.tippy.defaults, options);

		// How many tooltips are out there?
		var countTips = 0;

		// Arbitrary counter for bringing tooltips to the front when clicked
		var topTipIndex = 100;
		
		// Loop through tooltips and set them up
		return this.each(function() {
			countTips++;
			var tipId = 'tippy_' + countTips;
			
			// Initialize the storage object for this tooltip and load all default or global options
			tippy_state[tipId] = {};

			// Grab data values
			tippy_state[tipId].options = $.extend({}, opts, $(this).data());

			// Make sure the data container is hidden
			$(this).hide();

			// Set the id to our data container
			$(this).attr('id', tipId);
			
			// Create the link that will trigger the tooltip.
			var tippyLink;

			// See if we are attaching the tooltip to an already-existing anchor or if we're creating a new link
			if (typeof tippy_state[tipId].options.anchor != 'undefined') {
				tippyLink = $(tippy_state[tipId].options.anchor);
			} else {
				tippyLink = $('<a></a>');
			}
			
			tippyLink.addClass('tippy_link')
				.attr('id', tipId + '_link');

			// Using [''] for class variable since .class breaks in ie8
			if (typeof tippy_state[tipId].options['class'] != 'undefined') {
				tippyLink.addClass(tippy_state[tipId].options['class'])
			}
			
			if (typeof tippy_state[tipId].options.name != 'undefined') {
				tippyLink.attr('name', tippy_state[tipId].options.name)
			}

			if (tippy_state[tipId].options.showtitle) {
				tippyLink.attr('title', tippy_state[tipId].options.title);
			}

			if (typeof tippy_state[tipId].options.img != 'undefined') {
				var tippyImg = $('<img />');
				tippyImg.attr('src', tippy_state[tipId].options.img);

				if (tippy_state[tipId].options.showtitle) {
					tippyImg.attr('alt', tippy_state[tipId].options.title);
				}

				tippyLink.append(tippyImg);
				tippy_state[tipId].img = tippyImg;

				// See if we have a swap image, go ahead and load it
				if (typeof tippy_state[tipId].options.swapimg != 'undefined') {
					var tippySwapImg = $('<img />')
						.attr('src', tippy_state[tipId].options.swapimg)
						.addClass('tippy_swap')
						.css('display', 'none');

					if (tippy_state[tipId].options.showtitle) {
						tippySwapImg.attr('alt', tippy_state[tipId].options.title);
					}

					tippyLink.append(tippySwapImg);
					tippy_state[tipId].swapimg = tippySwapImg;
				}
			} else if (typeof tippy_state[tipId].options.title != 'undefined') {
				tippyLink.html(tippy_state[tipId].options.title);
			}

			if (typeof tippy_state[tipId].options.title == 'undefined' && typeof tippy_state[tipId].options.headertitle == 'undefined') {
				tippy_state[tipId].options.showheader = false;
			}

			// Check for a link
			if (typeof tippy_state[tipId].options.href != 'undefined') {
				tippyLink.attr('href', tippy_state[tipId].options.href);

				if (typeof tippy_state[tipId].options.target != 'undefined') {
					tippyLink.attr('target', tippy_state[tipId].options.target);
				}
			}

			if (tippy_state[tipId].options.hoverpopup) {
				tippyLink.mouseover(function(event) { showTooltip(tipId, event); });
			} else {
				tippyLink.click(function(event) { showTooltip(tipId, event); });
			}

			if (tippy_state[tipId].options.autoclose) {
				tippyLink.mouseout(function() {
					hideTooltip(tipId);
				});
			}		 

			if (typeof tippy_state[tipId].options.anchor == 'undefined') {
				$(this).before(tippyLink);
			}

			tippy_state[tipId].link = tippyLink;

			// See if we are autoshowing. If so, create the tip and show it.
			if (tippy_state[tipId].options.autoshow) {
				createTooltip(tipId);
				positionTip(tipId);
				doShowTooltip(tipId, true);
			}
		});

		function createTooltip(tipId)
		{
			// Initialize container variables
			var tipBox, tipHeader, tipClose, tipBody;

			// Create our tooltip box for this tip. Store it so we can reuse it.
			tipBox = $('<div></div>')
				.hide()
				.css('height', 'auto')
				.css('display', 'none')
				.addClass('tippy_tip')
				.addClass('domTip_Tip')
				.attr('id', tipId + '_box')
				.mouseover(function() { freezeTooltip(tipId); })
				.click(function() { $(this).css('z-index', topTipIndex); topTipIndex++; console.log(topTipIndex); });
			
			tippy_state[tipId].tipBox = tipBox;

			if (!tippy_state[tipId].options.container) {
				$('#' + tipId).before(tippy_state[tipId].tipBox);
			} else {
				$(tippy_state[tipId].options.container).append(tipBox);
			}

			// Using [''] for class variable since .class breaks in ie8
			if (typeof tippy_state[tipId].options['class'] != 'undefined') {
				tipBox.addClass(tippy_state[tipId].options['class'] + '_tip')
			}

			switch (tippy_state[tipId].options.position) {
				case 'link':
				case 'mouse':
					tipBox.css('position', 'absolute');
					break;

				default:
					tipBox.css('position', tippy_state[tipId].options.position);
			}

			// Start the close timer when mouse away, if specified
			if (tippy_state[tipId].options.autoclose) {
				tipBox.mouseout(function() { hideTooltip(tipId); });
			}

			// Set up the header, if used
			if (tippy_state[tipId].options.showheader) {
				tipHeader = $('<div></div>')
					.css('height', 'auto')
					.addClass('tippy_header')
					.addClass('domTip_tipHeader');
				
				var headerTitle;
				if (typeof tippy_state[tipId].options.headertitle != 'undefined') {
					headerTitle = tippy_state[tipId].options.headertitle;
				} else {
					headerTitle = tippy_state[tipId].options.title;
				}

				if (typeof tippy_state[tipId].options.headerhref != 'undefined') {
					var headerLink = $('<a></a>')
						.attr('href', tippy_state[tipId].options.headerhref)
						.attr('title', headerTitle)
						.html(headerTitle);

					if (typeof tippy_state[tipId].options.target != 'undefined') {
						headerLink.attr('target', tippy_state[tipId].options.target);
					}

					tipHeader.append(headerLink);
				} else {
					tipHeader.html(headerTitle);
				}

				tipHeader.appendTo(tipBox);
			}
			
			// Set up the tooltip body
			tipBody = $('<div></div>')
				.css('height', 'auto')
				.addClass('tippy_body')
				.addClass('domTip_tipBody')
				.appendTo(tipBox);
			
			// Move body content
			$('#' + tipId).appendTo(tipBody).show();

			if (tippy_state[tipId].options.height != false) {
				tipBody.css("height", tippy_state[tipId].options.height + "px");
				tipBody.css("min-height", tippy_state[tipId].options.height + "px");
				tipBody.css("max-height", tippy_state[tipId].options.height + "px");
			}
			
			// Set up the close link, if used. Position depends on whether or not the header is displayed
			if (tippy_state[tipId].options.showclose) {
				tipClose = $('<div></div>')
					.addClass('tippy_closelink')
					.click(function() { doHideTooltip(tipId); })
					.html(tippy_state[tipId].options.closetext);

				if (tippy_state[tipId].options.showheader) {
					tipHeader.append(tipClose);
				} else {
					tipBody.prepend(tipClose);
				}
			}

			if (tippy_state[tipId].options.width != false) {
				// Get difference
				if (tippy_state[tipId].options.showheader) {
					headerDiff = tipBox.width() - tipHeader.width();
					tipHeader.css('width', (tippy_state[tipId].options.width - headerDiff) + 'px');
				}

				bodyDiff = tipBox.width() - tipBody.width();

				tipBox.css('width', tippy_state[tipId].options.width + 'px');
				tipBody.css('width', (tippy_state[tipId].options.width - bodyDiff) + 'px');
			}

			if (typeof tippy_state[tipId].options.bodystyle != 'undefined') {
				tipBody.attr('style', tipBody.attr('style') + ' ' + tippy_state[tipId].options.bodystyle);
			}

			if (tippy_state[tipId].options.draggable) {
				if (tippy_state[tipId].options.dragheader && tippy_state[tipId].options.showheader) {
					tipBox.draggable({ handle: '.tippy_header' });
					tipHeader.addClass('tippy_draggable');
				} else {
					tipBox.draggable();
					tipBox.addClass('tippy_draggable');
				}
			}
		}

		// Initialize all position data
		function getPositions(tipId, event)
		{
			if (!event) {
				event = window.event;
			}
			
			tippy_positions.scrollPageX = $(window).scrollLeft();
			tippy_positions.scrollPageY = $(window).scrollTop();
			
			tippy_positions.viewScreenX = $(window).width();
			tippy_positions.viewScreenY = $(window).height();
			
			tippy_positions.curPageX = event.clientX + tippy_positions.scrollPageX;
			tippy_positions.curPageY = event.clientY + tippy_positions.scrollPageY;
		
			tippy_positions.viewPageX = event.clientX;
			tippy_positions.viewPageY = event.clientY;

			tippy_positions.tipLinkHeight = $('#' + tipId + '_link').height();
			
			// document: calculate the position relative to the document.
			// parent: calculate the position relative to the parent.
			// Most situations will want parent, but more advanced positioning techniques may want document.
			if (tippy_state[tipId].options.calcpos == 'document') {
				tippy_positions.tipLinkX = $('#' + tipId + '_link').offset().left;
				tippy_positions.tipLinkY = $('#' + tipId + '_link').offset().top;
			} else {
				tippy_positions.tipLinkX = $('#' + tipId + '_link').position().left;
				tippy_positions.tipLinkY = $('#' + tipId + '_link').position().top;
			}
		};

		function positionTip(tipId, event)
		{
			// Grab the box with a shortcut name
			tipBox = tippy_state[tipId].tipBox;

			// Grab position settings
			getPositions(tipId, event);

			// Get the height and width of the tooltip container. Will use this when
			// calculating tooltip position.
			var tipHeight = tipBox.height();
			var tipWidth = tipBox.width();
			
			// Calculate where the tooltip should be located
			
			var tipHorSide = "left", tipVertSide = "top";
			var tipXloc, tipYloc = 0;

			// tipXloc and tipYloc specify where the tooltip should appear.
			// By default, it is just below and to the right of the mouse pointer.
			
			if (tippy_state[tipId].options.position == 'link') {
				// Position below the link
				tipXloc = tippy_positions.tipLinkX;
				tipYloc = tippy_positions.tipLinkY + tippy_positions.tipLinkHeight;
			} else if (tippy_state[tipId].options.position == 'mouse') {
				// Position below the mouse cursor
				tipXloc = tippy_positions.curPageX;
				tipYloc = tippy_positions.curPageY;
			} else {
				// Check our top/bottom and left/right values; use 0 as a default if something is missing from each pair.
				if (typeof tippy_state[tipId].options.top == 'undefined' && typeof tippy_state[tipId].options.bottom == 'undefined') {
					tipYloc = 0;
				} else if (typeof tippy_state[tipId].options.top != 'undefined') {
					tipYloc = tippy_state[tipId].options.top;
				} else {
					tipVertSide = "bottom"
					tipYloc = tippy_state[tipId].options.bottom;
				}

				if (typeof tippy_state[tipId].options.left == 'undefined' && typeof tippy_state[tipId].options.right == 'undefined') {
					tipXloc = 0;
				} else if (typeof tippy_state[tipId].options.left != 'undefined') {
					tipXloc = tippy_state[tipId].options.left;
				} else {
					tipHorSide = "right"
					tipXloc = tippy_state[tipId].options.right;
				}
			}

			// Check offsets if position is link or mouse
			if (tippy_state[tipId].options.position == 'link' || tippy_state[tipId].options.position == 'mouse') {
				tipXloc += tippy_state[tipId].options.offsetx;
				tipYloc += tippy_state[tipId].options.offsety;
			}
			
			// Adjust position of tooltip to place it within window boundaries
			
			// If the tooltip extends off the right side, pull it over
			if ((tipXloc - tippy_positions.scrollPageX) + 5 + tipWidth > tippy_positions.viewScreenX) {
				pageXDiff = ((tipXloc - tippy_positions.scrollPageX) + 5 + tipWidth) - tippy_positions.viewScreenX;
				tipXloc -= pageXDiff;
			}
			
			// If the tooltip will extend off the bottom of the screen, pull it back up.
			if ((tipYloc - tippy_positions.scrollPageY) + 5 + tipHeight > tippy_positions.viewScreenY) {
				pageYDiff = ((tipYloc - tippy_positions.scrollPageY) + 5 + tipHeight - tippy_positions.viewScreenY);
				tipYloc -= pageYDiff;
			}
		
			// If the tooltip extends off the bottom and the top, line up the top of
			// the tooltip with the top of the page
			if (tipHeight > tippy_positions.viewScreenY) {
				tipYloc = tippy_positions.scrollPageY + 5;
			}
			
			// Set the position in pixels.
			tipBox.css(tipHorSide, tipXloc + "px");
			tipBox.css(tipVertSide, tipYloc + "px");
		}

		function showTooltip(tipId, event)
		{
			// See if state exists
			if (typeof tippy_state[tipId].tipBox == 'undefined') {
				createTooltip(tipId);
			}

			// Are we already showing the tooltip? Freeze it.
			if (tippy_state[tipId].state == 'showing' || tippy_state[tipId].state == 'displaying') {
				// Nothing to freeze if we're not autoclosing
				if (tippy_state[tipId].options.autoclose) {
					freezeTooltip(tipId);
				}
			} else {
				tippy_state[tipId].state = 'displaying';
				positionTip(tipId, event);

				tippy_state[tipId].timer = setTimeout(function() {
					doShowTooltip(tipId, false);
				}, tippy_state[tipId].options.showdelay);
			}
		}

		function doShowTooltip(tipId, instashow)
		{
			tippy_state[tipId].state = 'showing';

			// Check on a swapimg/swaptitle to use if img/title is set
			if (typeof tippy_state[tipId].options.swapimg != 'undefined' && typeof tippy_state[tipId].options.img != 'undefined') {
				
				// If we have a swapimg, just fade it in.
				tippy_state[tipId].swapimg.fadeIn();
			} else if (typeof tippy_state[tipId].options.swaptitle != 'undefined' && typeof tippy_state[tipId].options.title != 'undefined') {
				tippy_state[tipId].link.html(tippy_state[tipId].options.swaptitle);
			}

			if (!tippy_state[tipId].options.multitip && tippy_showing) {
				doHideTooltip(tippy_showing);
			}

			if (instashow) {
				tippy_state[tipId].tipBox.show();
			} else {
				tippy_state[tipId].tipBox.fadeIn(tippy_state[tipId].options.showspeed);
			}

			tippy_showing = tipId;
		}

		// When the visitor mouses away from the link or the tooltip, start a timer that
		// will hide the tooltip after a set period of time.
		function hideTooltip(tipId)
		{
			if (tippy_state[tipId].state == 'displaying') {
				tippy_state[tipId].state = 'hidden';
				clearTimeout(tippy_state[tipId].timer);
			} else {
				tippy_state[tipId].timer = setTimeout(function() {
					doHideTooltip(tipId);
				}, tippy_state[tipId].options.hidedelay);
			}
		}

		function doHideTooltip(tipId)
		{
			tippy_showing = false;
			tippy_state[tipId].state = 'hidden';
			clearTimeout(tippy_state[tipId].timer);

			// Check on a swaptitle to use if title is set
			if (typeof tippy_state[tipId].options.swapimg != 'undefined' && typeof tippy_state[tipId].options.img != 'undefined') {
				// If we have a swapimg, just fade it out.
				tippy_state[tipId].swapimg.fadeOut();
			} else if (typeof tippy_state[tipId].options.swaptitle != 'undefined' && typeof tippy_state[tipId].options.title != 'undefined') {
				tippy_state[tipId].link.html(tippy_state[tipId].options.title);
			}

			tippy_state[tipId].tipBox.fadeOut(tippy_state[tipId].options.hidespeed);
		}

		// If the user mouses over the tooltip, make sure we don't hide it. The tooltip
		// should freeze when the mouse is over it.
		function freezeTooltip(tipId)
		{
			clearTimeout(tippy_state[tipId].timer);
			tippy_state[tipId].tipBox.stop();
			tippy_state[tipId].tipBox.css("opacity", 100);
		}
	};

	$.fn.tippy.defaults = {
		showtitle: false, // Should the browser's title attribute be used? Good for accessibility, bad for tooltip visibility.
		offsetx: 10, // When position is set to mouse or link, how far should the tooltip be offset left or right? Positive for right, negative for left.
		offsety: 10, // When position is set to mouse or link, how far should the tooltip be offset up or down? Positive for down, negative for up.
		hoverpopup: true, // Should the tooltip display on hover? If set to false, tooltip shows on click.
		multitip: false, // Should it be possible to have multiple tooltips onscreen at once?
		showdelay: 100, // When showing on hover, how long in ms should it delay before showing the tooltip?
		showspeed: 200, // How long in ms should it take the tooltip to fade in?
		hidedelay: 1000, // When auto hiding, how long in ms should the tooltip be visible before it starts to fade out?
		hidespeed: 200, // How long in ms should it take the tooltip to fade out?
		showheader: true, // Should the tooltip have a header?
		showclose: true, // Should the tooltip have a close link? Usefor for mobile devices or when autoClose is false.
		closetext: 'close', // When using a close link, what should it say?
		autoclose: true, // Should the tooltip auto close after a delay?
		container: false, // What should be the tooltip's parent element? Useful if you want to move it into another element.
		position: 'link', // fixed, absolute, relative, mouse, link
		height: false, // Specify a height for the tooltip
		width: false, // Specify a width for the tooltip
		draggable: false, // Should visitors be able to drag the tooltip around? (requires jQuery UI)
		dragheader: true, // If dragging is enabled should the visitor only be able to drag from the header? If false, user can move the tooltip from any part.
		autoshow: false, // Should tooltips automatically be displayed when the page is loaded?
		calcpos: 'parent' // Should the tooltip position be calculated relative to the parent or to the document?
	}
}(jQuery));