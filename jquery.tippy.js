(function($) {
	$.fn.tippy = function(options) {
		// Track data for each of our tooltips
		var tippy_state = {};

		// Hold global position data
		var tippy_positions = {};

		// Store id of last displayed tooltip
		var tippy_showing = false;

		// Pull options together
		var opts = $.extend({}, $.fn.tippy.defaults, options);

		// How many tooltips are out there?
		var countTips = 0;

		return this.each(function() {
			var thisTitle = $(this).data('title');
			countTips++;
			var tipId = 'tippy_' + countTips;
			tippy_state[tipId] = {};
			tippy_state[tipId].dataBox = $(this);

			$(this).attr('id', tipId);
			
			// Create the link that will trigger the tooltip.
			var tippyLink = $('<a></a>')
							 .addClass('tippy_link')
							 .attr('id', tipId + '_link')
							 .attr('title', thisTitle)
							 .html(thisTitle);

			if (opts.hoverPopup) {
				tippyLink.mouseover(function() { showTooltip(tipId, event); });
			} else {
				tippyLink.click(function() { showTooltip(tipId, event); });
			}

			if (opts.autoClose) {
				tippyLink.mouseout(function() {
					hideTooltip(tipId);
				});
			}		 

			$(this).before(tippyLink);
		});

		function createTooltip(tipId)
		{
			// Initialize container variables
			var tipBox, tipHeader, tipClose, tipBody;

			// Create our tooltip box for this tip. Store it so we can reuse it.
			tipBox = $('<div></div>')
				.hide()
				.css('display', 'none')
				.css('height', 'auto')
				.addClass('tippy_tip')
				.attr('id', tipId + '_box')
				.mouseover(function() { freezeTooltip(tipId); });

			switch (opts.position) {
				case 'link':
				case 'mouse':
					tipBox.css('position', 'absolute');
					break;

				default:
					tipBox.css('position', opts.position);
			}

			// Start the close timer when mouse away, if specified
			if (opts.autoClose) {
				tipBox.mouseout(function() { hideTooltip(tipId); });
			}

			// Set up the header, if used
			if (opts.showHeader) {
				tipHeader = $('<div></div>')
					.css('height', 'auto')
					.addClass('tippy_header')
					.html(tippy_state[tipId].dataBox.data('title'))
					.appendTo(tipBox);
			}
			
			// Set up the tooltip body
			tipBody = $('<div></div>')
				.css('height', 'auto')
				.addClass('tippy_body')
				.html(tippy_state[tipId].dataBox.html())
				.appendTo(tipBox);

			if (opts.height !== false) {
				tipBody.css("height", opts.height + "px");
				tipBody.css("min-height", opts.height + "px");
				tipBody.css("max-height", opts.height + "px");
			}

			if (opts.width !== false) {
				tipBox.css("width", opts.width + "px");
				tipHeader.css("width", opts.width - tipElementDifferenceHeader + "px");
				tipBody.css("width", opts.width - tipElementDifferenceBody + "px");
			}

			// Set up the close link, if used. Position depends on whether or not the header is displayed
			if (opts.showClose) {
				tipClose = $('<div></div>')
					.addClass('tippy_closelink')
					.click(function() { doHideTooltip(tipId); })
					.html(opts.closeText);

				if (opts.showHeader) {
					tipHeader.append(tipClose);
				} else {
					tipBody.prepend(tipClose);
				}
			}

			tippy_state[tipId].tipBox = tipBox;

			if (!opts.container) {
				tippy_state[tipId].dataBox.before(tippy_state[tipId].tipBox);
			} else {
				$(opts.container).append(tipBox);
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
			tippy_positions.tipLinkX = $('#' + tipId + '_link').position().left;
			tippy_positions.tipLinkY = $('#' + tipId + '_link').position().top;
		};

		function positionTip(tipId)
		{
			// Grab the box with a shortcut name
			tipBox = tippy_state[tipId].tipBox;

			// If pos

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
			
			if (opts.position == 'link') {
				// Position below the link
				tipXloc = tippy_positions.tipLinkX;
				tipYloc = tippy_positions.tipLinkY + tippy_positions.tipLinkHeight;
			} else if (opts.position == 'mouse') {
				// Position below the mouse cursor
				tipXloc = tippy_positions.curPageX;
				tipYloc = tippy_positions.curPageY;
			} else {
				tipXloc = opts.posX;
				tipYloc = opts.posY;
			}

			// Check offsets if position is link or mouse
			if (opts.position == 'link' || opts.position == 'mouse') {
				tipXloc += opts.offsetX;
				tipYloc += opts.offsetY;
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
			if (tippy_state[tipId].state == 'showing') {
				freezeTooltip(tipId);
			} else {
				tippy_state[tipId].state = 'showing';
				positionTip(tipId, event);

				tippy_state[tipId].timer = setTimeout(function() {
					if (!opts.multiTip && tippy_showing) {
						doHideTooltip(tippy_showing);
					}

					tippy_state[tipId].tipBox.fadeIn(opts.showSpeed);
					tippy_showing = tipId;
				}, opts.showDelay);
			}
		}

		// When the visitor mouses away from the link or the tooltip, start a timer that
		// will hide the tooltip after a set period of time.
		function hideTooltip(tipId)
		{
			tippy_state[tipId].timer = setTimeout(function() {
				doHideTooltip(tipId);
			}, opts.hideDelay);
		}

		function doHideTooltip(tipId)
		{
			tippy_showing = false;
			tippy_state[tipId].state = 'hidden';
			clearTimeout(tippy_state[tipId].timer);
			tippy_state[tipId].tipBox.fadeOut(opts.hideSpeed);
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
		offsetX: 10, // When position is set to mouse or link, how far should the tooltip be offset left or right? Positive for right, negative for left.
		offsetY: 10, // When position is set to mouse or link, how far should the tooltip be offset up or down? Positive for down, negative for up.
		hoverPopup: true, // Should the tooltip display on hover? If set to false, tooltip shows on click.
		multiTip: false, // Should it be possible to have multiple tooltips onscreen at once?
		showDelay: 50, // When showing on hover, how long in ms should it delay before showing the tooltip?
		showSpeed: 200, // How long in ms should it take the tooltip to fade in?
		hideDelay: 1000, // When auto hiding, how long in ms should the tooltip be visible before it starts to fade out?
		hideSpeed: 200, // How long in ms should it take the tooltip to fade out?
		showHeader: true, // Should the tooltip have a header?
		showClose: true, // Should the tooltip have a close link? Usefor for mobile devices or when autoClose is false.
		closeText: 'close', // When using a close link, what should it say?
		autoClose: true, // Should the tooltip auto close after a delay?
		container: false, // What should be the tooltip's parent element? Useful if you want to move it into another element.
		position: 'link', // fixed, absolute, relative, mouse, link
		posX: 0, // When position is not mouse or link, what should the x position be? Positive gets assigned to right, negative to left.
		posY: 0, // When position is not mouse or link, what should the y position be? Positive gets assigned to bottom, negative to top.
		height: false, // Specify a height for the tooltip
		width: false // Specify a width for the tooltip
	}
}(jQuery));