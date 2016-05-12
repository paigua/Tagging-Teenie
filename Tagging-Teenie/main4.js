// wait for our page to load
$(document).ready(function () {

	// initialize our canvas
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');

	var log = document.getElementById('log');
	var textarea = document.getElementById('output')

	// get the size of our canvas
	var canvas_width = canvas.width,
		canvas_height = canvas.height;

	var canvas_center_x = canvas_width / 2;
	var canvas_center_y = canvas_height / 2;

	var canvasPos = {"deltaX": 0, "deltaY": 0};

  var canvasinitialwidth = 800 ;
	var initialImageWidth = 800; //this variable changes every time we zoom in and out
	var newImageHeight = 0;

	var image_height, image_width;

	var imageXPos, imageYPos;

  var scale = 1 ;
  var num_cells = 20 ;

	var json ;

	// load our large image
	var img;
	img = new Image();
	img.onload = function() {

		/*
		# image is done loading, now we can paint it to the canvas
		1) 0, 0 represents the x,y of the upper left corner where we place the image
		2) canvas_width, canvas_height represents how large we want to display the image
		3) The image might have a different scaling than the canvas so we might see
		   the image stretch or shrink.
		4) let's calculate how to correctly display the image using the aspect ratio to fit
		   a pre-defined width (500px);
		*/

		image_height = img.height;
		image_width = img.width;
		newImageHeight = image_height / image_width * initialImageWidth;

		calculate_center();

		canvasPos.deltaX = imageXPos;
		canvasPos.deltaY = imageYPos;

		ctx.drawImage(img, imageXPos, imageYPos, initialImageWidth, newImageHeight);


		$.getJSON("tsne_grid2.json", function(myjson) {
				json = myjson ;
				console.log(json); // this will show the info it in firebug console
				console.log(json[0].filename) ;
				console.log(json[0].grid_pos.x) ;
				console.log(json.length) ;
		});

}

	img.src = "test2.png";


	// our event object that handled clicking (mousedown), mousemove (dragging), mouseup (enddragging)
	var events = {

		dragging: false,
		mouseX: 0,
		mouseY: 0,



		mouseDown: function(e)
		{

			// get the current mouse position (DRAGSTART)
			var r = canvas.getBoundingClientRect();
			events.mouseX = (e.clientX - r.left) - canvasPos.deltaX;
			events.mouseY = (e.clientY - r.top) - canvasPos.deltaY;

			// log.innerHTML += 'User clicked at: ' + events.mouseX + ", " + events.mouseY + '! <br/>';
      console.log('User clicked: ' + events.mouseX + ", " + events.mouseY ) ;

      var row = find_row(events.mouseY) ;
      var column = find_column(events.mouseX) ;

      console.log("ROW: " + row + " COLUMN: " + column) ;

			log.scrollTop = log.scrollHeight;
			events.dragging = true;

		},

		dblclick: function(e)
		{

			var image_id = ["3832.png", "4243.png", "6385.png", "30351.png", "32015.png", "32096.png", "34128.png", "36275.png", "36523.png",
			"36657.png", "40274.png", "40732.png", "41613.png", "42393.png", "42556.png", "42630.png", "42685.png", "42942.png", "43881.png",
			"53489.png", "54003.png", "54916.png", "62493.png", "62497.png", "63586.png", "63589.png", "63894.png", "64275.png", "72188.png",
			"72243.png", "686.png", "755.png", "520.png", "760.png", "803.png", "804.png", "806.png", "886.png", "887.png", "888.png", "889.png",];
			// var image_id = ["yes","no"];
			var r = Math.floor(Math.random() * (image_id.length));
			image_id.toString();
			textarea.innerHTML += image_id[r] + " ; ";
			log.scrollTop = log.scrollHeight;
			dragging = true;
		},

		mouseMove: function(e)
		{
			if (events.dragging)
			{
				// get the current mouse position (updates every time the mouse is moved durring dragging)
				var r = canvas.getBoundingClientRect();
		        var x = e.clientX - r.left;
		        var y = e.clientY - r.top;

		        // calculate how far we moved
		    canvasPos.deltaX = (x - events.mouseX); // total distance in x
				canvasPos.deltaY = (y - events.mouseY); // total distance in y

				// we need to clear the canvas, otherwise we'll have a bunch of overlapping images
				ctx.clearRect(0,0, canvas_width, canvas_height);

				// these will be our new x,y position to move the image.
				ctx.drawImage(img, canvasPos.deltaX, canvasPos.deltaY, initialImageWidth, newImageHeight);

				// log.innerHTML += 'User is dragging to: ' + x + ", " + y + ' <br/>';
				// log.scrollTop = log.scrollHeight;
			}
		},

		mouseUp: function (e) {
			// log.innerHTML += 'User let go and moved a total of: ' + canvasPos.deltaX + ", " + canvasPos.deltaY + ' <br/>';

			events.dragging = false;
			// log.scrollTop = log.scrollHeight;

		}
	}

	// ctx.addEventListener('dblclick', function(e)
	// { var mouse = img.getMouse(e);
	// 	img.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
	// }, true);


	$("#zoomIn").click(function () {

		// for simplicity we use a x2 scaling and calculate new sizes (like above)
		initialImageWidth = initialImageWidth * 2;
		newImageHeight = image_height / image_width * initialImageWidth;

		calculate_center();

		ctx.clearRect(0,0, canvas_width, canvas_height);
		ctx.drawImage(img, imageXPos, imageYPos, initialImageWidth, newImageHeight);

		// since we dynamically moved the image to the center of the image,
		// we need to set our deltas so panning uses this new point
		canvasPos.deltaX = imageXPos;
		canvasPos.deltaY = imageYPos;

    scale = scale * 2 ;
    console.log("Zoom in: " + scale) ;

	});

	$("#zoomOut").click(function () {

		// for simplicity we use a x2 scaling and calculate new sizes (like above)
		initialImageWidth = initialImageWidth / 2;
		newImageHeight = image_height / image_width * initialImageWidth;

		calculate_center();

		ctx.clearRect(0,0, canvas_width, canvas_height);
		ctx.drawImage(img, imageXPos, imageYPos, initialImageWidth, newImageHeight);

		// since we dynamically moved the image to the center of the image,
		// we need to set our deltas so panning uses this new point
		canvasPos.deltaX = imageXPos;
		canvasPos.deltaY = imageYPos;

    scale = scale  / 2 ;
    console.log("Zoom out: " + scale) ;

	});

	var clear = document.getElementById("clear");
	var eraseText = {
		dragging: false,
		mouseDown: function(){
			document.getElementById("output").innerHTML = "";
			document.getElementById("right-panel").style = "display: none";
			document.getElementById("right-panel2").style = "display: block";
		}
	}


	canvas.addEventListener('mousedown', events.mouseDown, false);
	canvas.addEventListener('mousemove', events.mouseMove, false);
	canvas.addEventListener('mouseup', events.mouseUp, false);
	canvas.addEventListener('dblclick', events.dblclick, false);
  clear.addEventListener('mousedown', eraseText.mouseDown, false);

	var calculate_center = function() {

		// center of the image currently
		var image_center_x = initialImageWidth / 2;
		var image_center_y = newImageHeight / 2;

		// subtract the cavas size by the image center, that's how far we need to move it.
		imageXPos = canvas_center_x - image_center_x;
		imageYPos = canvas_center_y - image_center_y;

	}

  var find_column = function(click_x) {
      var new_width = canvasinitialwidth * scale ;

      //Jotted down in notebook -- base level math work for scale 1
      var cell_width = new_width / num_cells ;
      var column = Math.floor(click_x / cell_width) ;

      return column ;
  }

  var find_row = function(click_y) {

    var new_height = canvasinitialwidth * scale ;

    //Jotted down in notebook -- base level math work for scale 1
      var cell_height = new_height / num_cells ;
      var row = Math.floor(click_y / cell_height) ;

      return row ;
  }


});
