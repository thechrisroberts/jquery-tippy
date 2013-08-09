(function($) {
	$.fn.tippy = function() {
		var countTips = 0;

		return this.each(function() {
			var thisTitle = $(this).data('title');
			countTips++;
			var tipId = 'tippy_' + countTips;

			$(this).attr('id', tipId);
			
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
	};
}(jQuery));