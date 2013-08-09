(function($) {
	$.fn.tippy = function() {
		// Track data for each of our tooltips
		var tippy_state = {};

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
							 .attr('title', thisTitle)
							 .html(thisTitle)
							 .mouseover(function() {
							 	showTooltip(tipId);
							 })
							 .mouseout(function() {
							 	hideTooltip(tipId);
							 })

			$(this).before(tippyLink);
		});

		function createTooltip(tipId)
		{
			// Create our tooltip box for this tip. Store it so we can reuse it.
			var tipBox = $('<div></div>')
				.hide()
				.css('display', 'none')
				.css('height', 'auto')
				.css('position', 'absolute')
				.addClass('tippy_tip')
				.attr('id', tipId + '_box')
				.mouseover(function() { freezeTooltip(tipId); })

			$('<div></div>')
				.css('height', 'auto')
				.addClass('tippy_header')
				.html(tippy_state[tipId].dataBox.data('title'))
				.appendTo(tipBox);
			
			$('<div></div>')
				.css('height', 'auto')
				.addClass('tippy_body')
				.html(tippy_state[tipId].dataBox.html())
				.appendTo(tipBox);

			tippy_state[tipId].tipBox = tipBox;

			tippy_state[tipId].dataBox.before(tippy_state[tipId].tipBox);
		}

		function showTooltip(tipId)
		{
			// See if state exists
			if (typeof tippy_state[tipId].tipBox == 'undefined') {
				createTooltip(tipId);
			}

			tippy_state[tipId].tipBox.show();
		}

		function hideTooltip(tipId)
		{

		}

		function freezeTooltip(tipId)
		{

		}
	};
}(jQuery));