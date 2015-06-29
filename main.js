
$(function() {
	// **** Major bug ****
	// randomly generating values to pre-populate board
	// may create games which cannot be won.



	$('#difficulty_drop_down').on('change', function(e) {
		var difficulty = $(this).val();
		$('#difficulty').hide();
		$('#sudoku, #hints_container, #restart_button').fadeIn('slow');
		$('#hints_container').css('display', 'inline-block');
		switch (difficulty) {
			case 'Easy':
				difficulty_num = 24;
				hints = 5;
				break;
			case 'Medium':
				difficulty_num = 20;
				hints = 3;
				break;
			case 'Hard':
				difficulty_num = 16;
				hints = 1;
				break;
			default:
				difficulty_num = 16;
				hints = 1;
				break;
		}
		$('#hints_num').text(hints);
		populate_board(difficulty_num);
	});


	$('#hint_button').on('click', function() {
		console.log('use hint');
		var $num = $('#hints_num').text();
		if ($num >= 1) {
			$num -= 1;
			$('#hints_num').text( $num );
			add_num_to_dom();
			console.log($num);
			if ($num === 0) {
				$(this).addClass('greyed_out');
				$(this).unbind('click');
			}
		} else {

		}
	});
	$('#restart_button').on('click', function() {
		$('#sudoku, #hints_container, #restart_button').hide();
		$('.small_box').text('');
		$('#difficulty').fadeIn('slow');
		$('select').val('-');
		$('#hint_button').removeClass('greyed_out').bind('click');

	});

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
	};

	// turn row/col pair into 1-9 box val: box_model[row-1][col-1];
	var box_model = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9]
	];


	// array of unavailable numbers for a given position on the board
	// considering row/col and numbers within the selected box
	var unavailable_nums = [];
	function get_unavailable_nums($box) {
		var rows_and_cols = get_row_col($box);
		var box_vals = get_box_vals($box);
		return (rows_and_cols.rows).concat(rows_and_cols.cols, box_vals);
	}


	// select box to add/remove number to
	$('.small_box').on('click', function() {
		unavailable_nums = [];
		var $box = $(this);
		$('.small_box').removeClass('selected');
		$box.toggleClass('selected');

		var rows_and_cols = get_row_col($box);
		var box_vals = get_box_vals($box);
		unavailable_nums = (rows_and_cols.rows).concat(rows_and_cols.cols, box_vals);

	});

	// map keyCode values to numeric values
	var key_values = { 49:1, 50:2, 51:3, 52:4, 53:5, 54:6, 55:7, 56:8, 57:9 };

	// handles populating a box with a number, or removing a number
	$(document).on('keypress', function(e) {
		e.preventDefault();
		if ( $('.selected').hasClass('default_val') ) {
			return;
		}
		else if ($('.small_box').hasClass('selected')) {

			var key = e.which || e.keyCode;
			var key_val = key_values[key];
			if ((key_val >= 1) && (key_val <= 9)) {
				if ( unavailable_nums.indexOf(key_val.toString()) >= 0 )
					return;
				else
					$('.selected').text(key_val).removeClass('available').addClass('occupied');
					did_i_win();
			} 
			else if (key == 32) {
				$('.selected').text('');
				$('.selected').removeClass('occupied').addClass('available');
			} 
			else {
				console.log('please enter 1-9');
			}
		} 
		else {
			console.log('select box first');
		}
	});


	// TO BE RE-IMPLEMENTED
	function did_i_win() {
		if ($('.small_box.unavailable').length == 81) {
			alert('you won.');
		}
	}


	// -----------------------------------------------------
	// validation functionality

	// auto-population functionality

	// randomly generate 1-9 number val, randomly position on board IF
	// it's placement 'works'
	// difficulty - to correspond to the number of starting numbers on the board
	// ex: easy - 24, med - 16, hard - 8

	var difficulty_num;
	function populate_board(difficulty_num) {
		for (var i = 0; i < difficulty_num; i++) {
			add_num_to_dom()
		}
	}
	function add_num_to_dom() {
		var rand_val = generate_vals();
		var val = rand_val.value,
			$box = $('#small_box_' + rand_val.box);
		if ($box.text()) {
			add_num_to_dom();
		} else {
			var unavailable = get_unavailable_nums($box);
			if ( unavailable.indexOf(val.toString()) >= 0 ) {
				add_num_to_dom();
			} else {
				//console.log('Value: ' + val + ' has not been found in unavailable values: ' + unavailable);
				$box.text(val).removeClass('available').addClass('occupied').addClass('default_val');
			}
		}
	}


	function generate_vals() {
		// random number and location
		var num = Math.floor(Math.random() * (9 - 1)) + 1;
		var box = Math.floor(Math.random() * (81 - 1)) + 1;
		return {value: num, box: box};
	}


	// checks if row/col arrays are in check
	function validate($box, new_val) {

		var row_col_obj = get_row_col($box);
		var row_array = row_col_obj.rows,
			col_array = row_col_obj.cols;
		// check for duplicates in arrays
		if ( !check_for_duplicates(row_array) && !check_for_duplicates(col_array) ) {
			return true;
		} else {
			console.log('no good');
			return false;
		}
	}

	// to be used with arrays from get_row_col()
	function check_for_duplicates(array) {
		var counts = [];
		for (var i = 0; i < array.length; i++) {
			if ( counts[ array[i] ] === undefined )
				counts[array[i]] = 1;
			else
				return true;
		}
		return false; // no duplicates
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

	// get all number values within parent container box
	function get_box_vals($small_box) {
		var vals = [];
		$small_box.siblings().each(function(i) {
			var val = $(this).text();
			if (val) {
				vals.push($(this).text());
			}
		});
		return vals;
	}

	// given a .small_box $element, return an array of the
	// all row/col values relevant to that small box value for validation
	// usage: 
	// var results = get_row_col($el);
	// rows = results.rows;
	// cols = results.cols;
	function get_row_col($small_box) {
		var position = box_position($small_box);
		var box_row = position.small_row,
			box_col = position.small_col,
			container_row = position.container_row,
			container_col = position.container_col,
			row_vals = {1:[1, 2, 3],2:[4, 5, 6],3:[7, 8, 9]},
			col_vals = {1:[1, 4, 7],2:[2, 5, 8],3:[3, 6, 9]};

		// relevant row/col position values as arrays for container and small boxes
		var box_rows = row_vals[box_row],
			box_cols = col_vals[box_col],
			container_rows = row_vals[container_row],
			container_cols = col_vals[container_col];

		var all_row_vals = [], all_col_vals = [];
		for (var i = 0; i < container_rows.length; i++) {
			for (var j = 0; j < box_rows.length; j++) {
				var val_r = $('#box_' + (container_rows[i])).children().eq(box_rows[j]-1).text();
				if (val_r) all_row_vals.push(val_r);
			}
		}
		for (var n = 0; n < container_cols.length; n++) {
			for (var m = 0; m < box_cols.length; m++) {
				var val_c = $('#box_' + (container_cols[n])).children().eq(box_cols[m]-1).text();
				if (val_c) all_col_vals.push(val_c);
			}
		}
		return {
			rows: all_row_vals,
			cols: all_col_vals
		};
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
		};
		var position = ($box.parent().children().index($box)) + 1;
		var container_position = ($box.closest('#sudoku').children().index( $box.parent() ) + 1);
		small = row_col(position);
		container = row_col(container_position);
		return {
			small_row: small.row,
			small_col: small.col,
			container_row: container.row,
			container_col: container.col
		};
	}
});
