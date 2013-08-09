(function($) {
	var tippy_state = {};

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

	showTooltip = function(tipId) {
		var tipData = $('#' + tipId);
		var tipBox = $('<div></div>');
		var tipHeader = $('<div></div>');
		var tipBody = $('<div></div>');

		tipBox.attr('id', tipId + '_box')
			  .css('display', 'none')
			  .css('position', 'absolute')
			  .css('height', 'auto')
			  .addClass('tippy_tip');

		tipHeader.css('height', 'auto')
				 .addClass('domTip_tipHeader tippy_header')
				 .attr('id', 'this.tipHeader')
				 .html(tipData.data('title'))
				 .appendTo(tipBox);
		
		tipBody.css('height', 'auto')
			   .addClass('domTip_tipBody tippy_body')
			   .attr('id', 'this.tipBody')
			   .html(tipData.html())
			   .appendTo(tipBox);

		tippy_state[tipId] = { };

		tippy_state[tipId] = { box: tipBox };

		tipData.before(tipBox);
		tipBox.tippy.fadeTipIn(tipId);
	};

	hideTooltip = function(tipId) {
		clearTimeout(tippy_state[tipId].timer);
		tippy_state[tipId].action = 'inithiding';
		tippy_state[tipId].timer = setTimeout("beginFadeout('" + tipId + "');", 2000);
	};

	$.fn.tippy.fadeTipIn = function(tipId) {
		tippy_state[tipId].action = 'initfadein';
		tippy_state[tipId].timer = setTimeout("finishFadein('" + tipId + "');", 50);
	};

	finishFadein = function(tipId) {
		tippy_state[tipId].action = '';
		tippy_state[tipId].box.fadeIn();
	};
	
	beginFadeout = function(tipId) {
		tippy_state[tipId].box.fadeOut(400, 'swing');
	};
}(jQuery));