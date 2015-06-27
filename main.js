
$(function() {

	/* method to compare arrays
	 * Usage:
	 * [1, "2,3"].equals([1, 2, 3]) === false;
	 * [1, 2, [3, 4]].equals([1, 2, [3, 4]]) === true;
	 */
	Array.prototype.equals = function(array) {
		if (!array) 
			return false;
		if (this.length != array.length)
			return false;
		var len = this.length;
		for (var i = 0; i < len; i++) {
			if (this[i] instanceof Array && array[i] instanceof Array) {
				if (!this[i].equals(array[i]))
					return false;
			}
			else if (this[i] != array[i]) {
				return false;
			}
		}
		return true;
	}

	// select box to add/remove number to
	$('.small_box').on('click', function() {
		var $box = $(this);
		$('.small_box').removeClass('selected');
		$box.toggleClass('selected');
	});

	// handles populating a box with a number, or removing a number
	$(document).on('keypress', function(e) {
		e.preventDefault();
		var $selected = $('.selected');
		if ( $selected.hasClass('default_val') ) {
			return;
		} else if ($('.small_box').hasClass('selected')) {
			var key = e.which || e.keyCode,
				key_values = {49: 1,50: 2,51: 3,52: 4,53: 5,54: 6,55: 7,56: 8,57: 9};
			if ((key >= 49) && (key <= 57)) {
				place_number( $selected, key_values[key]);
			} else if (key == 32) {
				$selected.text('');
				$selected.removeClass('occupied');
			} else {
				console.log('please enter 1-9');
			}
		} else {
			console.log('select box first');
		}
	});

	function place_number($small_box, num) {
		$small_box.text(num).addClass('occupied');
	}



	// -----------------------------------------------------
	// validation functionality

	// auto-population functionality

	// randomly generate 1-9 number val, randomly position on board IF
	// it's placement 'works'
	// difficulty - to correspond to the number of starting numbers on the board
	// ex: easy - 24, med - 16, hard - 8
	function autopopulate(difficulty) {

		for (var i = 0; i < difficulty.length; i++) {
			var vals = generate_val();
			var num = vals.rand_num, small_box = vals.rand_box;
			small_box = $('#small_box_' + small_box);

			if (valid_lcation(num, box)) {
				place_number(small_box, num);
			} else {
				// re-try
			}
		}
	}

	function generate_val() {
		// random number and location
		var num = Math.floor(Math.random() * (9 - 1)) + 1;
		var box = Math.floor(Math.random() * (81 - 1)) + 1;
		return {rand_num: num, rand_box: box};
	}


	// function - to determine if new number placement is valid
	// to be used by Auto-populate and by the User
	function valid_location(num, position) {
		// if there is already the same number within the same
		// box of 9

		// if there is already the same number within the same
		// row or column
	}


	// correct array for comparison
	var complete = ['1','2','3','4','5','6','7','8','9'];

	function check_box($boxes) {
		var vals = [];
		$boxes.children().each(function(i) {
			vals.push( $(this).text() );
		});
		if (vals.sort() != complete) {
			return false;
		} else {
			return true;
		}
	}	


	function find_col($small_box) {
		var box = $small_box.parent().attr('id');
		// get id of container box, take last character from id string,
		// will be the container box number
		var container_num = box[box.length];

	}

	function get_row_col($small_box) {
		var box_id = $small_box.parent().attr('id');
		var box_num = box_id[box_id.length-1];
		// find position of $small_box within its container box
		var position = box_position($small_box);

		// position.small_row;
		// position.small_col;
		// position.container_row;
		// position.container_col;


		// last option, hard code col/row val as data attribute for each html element
		// <div class='small_box' data-row='1' data-col='1'></div>
		// var row = $('.small_box').attr('data-row');
	}

	// pass .small_box element, get it's row/col within it's container box, and the rol/col
	// of its container box
	function box_position($box) {

		var row_col = function(position) {
			var row, col;
			if ((position >= 1) && (position <= 3)) {
				box_row = 1;
				box_col = position;
			} else if ((position >= 4)&&(position <= 6)) {
				box_row = 2;
				box_col = position - 3;
			} else if ((position >= 7)&&(position <= 9)) {
				box_row = 3;
				box_col = position - 6;
			} else {
				console.log('bad position');
			}
			return {row:box_row, col:box_col};
		}
		var position = ($box.parent().children().index($box)) + 1;		
		var container_position = ($box.closest('#sudoku').children().index( $box.parent() ) + 1);
		small = row_col(position);
		container = row_col(container_position);

		return {
			small_row: small.row,
			small_col: small.col,
			container_row: container.row,
			container_col: container.col
		}
	}

});



