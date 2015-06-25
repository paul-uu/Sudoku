$(function() {

	$('.small_box').on('click', function() {
		var $box = $(this);
		$('.small_box').removeClass('selected');
		$box.toggleClass('selected');
	});

	$(document).on('keypress', function(e) {
		e.preventDefault();
		if ( $('.small') )
		if ($('.small_box').hasClass('selected')) {
			var key = e.which || e.keyCode,
				key_values = {49: 1,50: 2,51: 3,52: 4,53: 5,54: 6,55: 7,56: 8,57: 9};
			if ((key >= 49) && (key <= 57)) {
				place_number( $('.selected'), key_values[key]);
			} else if (key == 32) {
				$('.selected').text('');
			} else {
				console.log('please enter 1-9')
			}
		} else {
			console.log('select box first');
		}
	});

	function place_number($box, num) {
		console.log('box: ' + $box + ' :: num: ' + num);
		$box.text(num).addClass('occupied');
	}

	// validation functionality


	// auto-population functionality

});
