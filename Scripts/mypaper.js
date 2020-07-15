/*--------------------------.
| mypaper.js                |
|                           |
| Description:              |
| Mypaper.js controls the 	|	
| animation for the Turtle  |
| implementation	        |   
| created by Andre Kind.    |
|                           |
'--------------------------*/




//Set up Commands
var commands = document.getElementById("commands-text");
//commands.value = "right(45)\nforward(30)\nright(45)\nforward(30)\nright(45)\nforward(30)\nright(45)\nforward(30)\nright(45)\nforward(30)\nright(45)\nforward(30)\nright(45)\nforward(30)\nright(45)\nforward(30)\nright(19)\nforward(41)\nright(110)\nforward(35)";
commands.value = "right(90);\nforward(120);";

// get the canvas to draw onto
var d = document.getElementById('canvas1');
paper.setup(d);

//Resize Canvas
var w = window,
doc = document,
e = doc.documentElement,
g = doc.getElementsByTagName('body')[0],
x = w.innerWidth || e.clientWidth || g.clientWidth,
y = w.innerHeight || e.clientHeight || g.clientHeight;


var paperX = x * 0.47;
var paperY = y * 0.5;
paper.view.viewSize.width = paperX;
paper.view.viewSize.height = paperY;

// home coordinates of the turtle
var xhome = (paperX / 2);
var yhome = ((paperY / 2) + 25);

//setup turtle
var turtle = {
    homex: xhome,
    homey: yhome,
    starty: yhome,
    startx: xhome,
    turtleAngle: 90,
    turtleSpeed: 5,
    checkPac: 0,
    penDrawing: 1,
    penSize: 1,
    penColor: 'black'
};


d.style = "border:1px solid #000000;";
// raster used for turtle image
var raster = new paper.Raster('media/turtle-new.png');

//raster used for the pause image	
var pauseRaster = new paper.Raster('media/pause.png');
pauseRaster.scale(.5);
pauseRaster.position.x = turtle.homex;
pauseRaster.position.y = turtle.homey;
// set pause raster to invisible
pauseRaster.opacity = 0;
// current turtle coordinates (start at home)
var xcoord = turtle.homex;
var ycoord = turtle.homey;
// pen status for penup and pendown command. 1 means were are drawing (pendown)
var penStatus = turtle.penDrawing;
// thickness of pen (between 1-10)
var penSize = turtle.penSize;
// set default color
var penColor = turtle.penColor;
// image position
raster.position.x = xcoord;
raster.position.y = ycoord;
// scale the image by 50%
raster.scale(0.25);
//speed of line movement
var speed = turtle.turtleSpeed;
// create path object for turtle
var turtlePath = new paper.Path();
// set color of stroke
turtlePath.strokeColor = turtle.penColor;
// set thickness of pen
turtlePath.strokeWidth = turtle.penSize;
turtlePath.add(new paper.Point(xcoord, ycoord));
// turtle starts at 90 degrees (looking up) to x-axis
var turtleAngle = turtle.turtleAngle; // current angle of the turtle
var newAngle = 0; // calculated end angle of the turtle when rotated
var getAngle = true; // boolean to check if we should calculate newAngle for each rotate
var getGoToAngle = true; // the command, goto, also needs a check to calculate newAngle
var oldAngle = turtleAngle; // during a goto rotate, we temporarily change turtleAngle, this stores turtleAngle
var rasterAngle = turtleAngle; // current angle of the turtle image
// myEvents will hold all the words passed held in turtleCommands
// we use this to determine the events/commands in eventList
//var myEvents = IPython.turtleCommands;

//var myEvents = IPython.turtleCommands;
var myEvents = [];
//myEvents = myEvents.split(" ");
// list of events/commands
var eventList = [];

//var eve = "rotate";
//var eve2 = 76;
//myEvents.push(eve);
//myEvents.push(eve2);


$("#run-button").click("on", function () {
   // $('#clear-button').prop('disabled', true);
    $('#run-button').prop('disabled', true);

    var commandsText = commands.value;
    //var array = commandsText.split("\n");
    myEvents = [];
    eval(commandsText);
    setup();
})

function right(value) {
    myEvents.push("rotate");
    myEvents.push(value.toString());
    turtle.turtleAngle = turtle.turtleAngle + value
}

function left(value) {
    myEvents.push("rotate");
    value = -value;
    myEvents.push(value.toString());
    turtle.turtleAngle = turtle.turtleAngle + value
}


function forward(value) {
    var distance = Number(value);
    turtle.turtleAngle = -turtle.turtleAngle;
    var radians = toRadians(turtle.turtleAngle);

    var endx = Math.cos(radians);
    var endy = Math.sin(radians);
    endx = distance * endx;
    endy = distance * endy;
    endx = turtle.startx - endx;
    endy = turtle.starty + endy;

    turtle.startx = endx;
    turtle.starty = endy;
    turtle.turtleAngle = -turtle.turtleAngle;

    myEvents.push("line");
    myEvents.push(endx.toString());
    myEvents.push(endy.toString());
}

function backward(value) {
    var distance = Number(value);
    turtle.turtleAngle = -turtle.turtleAngle;
    var radians = toRadians(turtle.turtleAngle);

    var endx = Math.cos(radians);
    var endy = Math.sin(radians);
    endx = -distance * endx;
    endy = -distance * endy;
    endx = turtle.startx - endx;
    endy = turtle.starty + endy;

    turtle.startx = endx;
    turtle.starty = endy;
    turtle.turtleAngle = -turtle.turtleAngle;

    myEvents.push("backward");
    myEvents.push(endx.toString());
    myEvents.push(endy.toString());
}

function penUp() {

    myEvents.push("penStatus");
    myEvents.push("0");
    penStatus = "0";
}
function penDown() {

    myEvents.push("penStatus");
    myEvents.push("1");
    penStatus = "1";
}
function size(value) {
    myEvents.push("penSize");
    myEvents.push(value.toString());
    penSize = value;
    turtle.penSize = value;
}

function penSpeed(value) {
    myEvents.push("speed");
    myEvents.push(value.toString());
    speed = value;
    turtle.turtleSpeed = value;
}

function color(value) {

    myEvents.push("penColor");
    myEvents.push(value.toString());
    turtle.penColor = value.toString();

}

function goTo(x, y) {
    //myEvents.push("goTo");
    //myEvents.push(x.toString());
    //myEvents.push(y.toString());
    //
    var difx = self.startx - x
    var dify = self.starty - y

    if (difx == 0) {
        if (dify < 0) {
            myAngle = -90;
        }
        else {
            myAngle = 90;
        }
    }
    else if (dify == 0) {
        if (difx < 0) {
            myAngle = 0;
        }
        else {
            myAngle = 180;
        }
    }
    else {


        difx = Math.abs(difx);
        dify = Math.abs(dify);
        myAngle = toDegrees(Math.atan2(dify, difx));

        // check the four quadrants
        if (((self.starty - y) > 0 && (self.startx - x) < 0)) {
            myAngle = 180 - myAngle;

        }
        else if (((self.starty - y) < 0 && (self.startx - x) < 0)) {
            myAngle = 180 + myAngle

        }
        else if (((self.starty - y) < 0 && (self.startx - x) > 0)) {

            myAngle = 360 - myAngle

        }
        else {
            myAngle = myAngle

        }
    }
    self.startx = x;
    self.starty = y;
    myEvents.push("goTo");
    myEvents.push(x.toString());
    myEvents.push(y.toString());
    myEvents.push(myAngle.toString());

    /*
    	#dif of x
		difx = self.startx - x
		#dif of y
		dify = self.starty - y
		
		if difx == 0:
			if (dify < 0):
				myAngle = -90
			else:
				myAngle = 90
		elif dify == 0:
			if (difx > 0):
				myAngle = 0
			else:
				myAngle = 180
		else:
			difx = abs(difx)
			dify = abs(dify)
			myAngle = math.degrees(math.atan2(dify,difx))
			# check the four quadrants
			if ((self.starty - y) > 0 and (self.startx - x) < 0):
				myAngle = 180 - myAngle
			elif ((self.starty - y) < 0 and (self.startx - x) < 0):
				myAngle = 180 + myAngle
			elif ((self.starty - y) < 0 and (self.startx - x) > 0):
				myAngle = 360 - myAngle
			else:
				myAngle = myAngle
		self.startx = x
		self.starty = y
		strx = str(x)
		stry = str(y)
		strangle = str(myAngle)
		command = " goTo " + strx + " " + stry + " " + strangle
    */
}

function circle(radius) {
    var previousSpeed = speed;
    penSpeed(20);
    for (var x = 0; x < 362; x++) {
        forward(2 * Math.PI * radius / 360.0)
        right(1);
    }
    penSpeed(previousSpeed);
}


function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function addHexColor(c1, c2) {
    var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
    while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
    return hexStr;
}

// index of the eventList
function setup() {
    eventList = [];
    //loop through array of command words and create events
    for (var index = 0; index < myEvents.length; ++index) {
        var event = [];
        // adding a rotate command to the eventList
        // rotate has a variable rotate, it holds the angle (in degrees) to rotate by
        if (myEvents[index].indexOf('rotate') >= 0) {
            event.command = myEvents[index].toString();
            ++index;
            event.rotate = 0;
            event.rotate = Number(myEvents[index]);
            eventList.push(event);
            //console.log(event);
        }
        // adding a penColor command to the eventList
        // penColor has a variable color we want to change the line too
        if (myEvents[index].indexOf('penColor') >= 0) {
            event.command = myEvents[index];
            ++index;
            event.penColor = myEvents[index];
            eventList.push(event);
        }
        // adding a line command to the eventList
        // line has two variables, xend and yend, which are the end coordinates of the line
        if (myEvents[index].indexOf('line') >= 0) {
            var event = [];
            event.command = "line";
            ++index;
            event.x = 0;
            event.xend = myEvents[index];
            ++index;
            event.yend = 0;
            event.yend = myEvents[index];
            eventList.push(event);
        }
        // adding a speed command to the eventList 
        // speed has one variable, speed, which holds the speed the user wants
        if (myEvents[index].indexOf('speed') >= 0) {
            var event = [];
            event.command = "speed";
            ++index;
            event.speed = Number(myEvents[index]);
            eventList.push(event);
        }
        // adding penStatus to the eventList
        // penStatus has one int variable, indicating whether pen is down(1) or not
        if (myEvents[index].indexOf('penStatus') >= 0) {
            var event = [];
            console.log("got penstatus change cmd");
            event.command = "penStatus";
            ++index;
            event.toggle = myEvents[index];
            eventList.push(event);
        }
        // adding penSize to the eventList
        // penStatus has one int passed in, indicating whether pen is down(1) or not
        if (myEvents[index].indexOf('penSize') >= 0) {
            var event = [];
            console.log("pensize cmd");
            event.command = "penSize";
            ++index;
            event.penSize = myEvents[index];
            eventList.push(event);
        }
        // adding backward to the eventList
        // backward has two variables, endx and endy indicating the end coordinates of the line
        if (myEvents[index].indexOf('backward') >= 0) {
            var event = [];
            console.log("goto cmd made");
            event.command = "backward";
            ++index;
            event.xend = myEvents[index];
            ++index;
            event.yend = myEvents[index];

            eventList.push(event);
        }
        // adding goTo to the eventList
        // goTo has three variables, endx and endy indicating the end coordinates of the line
        //	as well as the angle it needs to rotate to reach the end coordinates
        if (myEvents[index].indexOf('goTo') >= 0) {
            var event = [];
            console.log("goto cmd made");
            event.command = "goTo";
            ++index;
            event.xend = myEvents[index];
            ++index;
            event.yend = myEvents[index];
            ++index;
            event.angle = myEvents[index];
            eventList.push(event);
        }
    }
    $("html, body").animate({ scrollTop: 0 }, "fast");

    run();

}

var running = false;
function run() {
    if (running == true) {
        return;
    }
    running = true;
    console.log(eventList);
    var x = 0; // event index

    console.log("starting run");
    // every frame execute current command at index x in eventList
    // increment x if done current command
    console.log("events: " + myEvents.length);

    paper.view.onFrame = function (event) {
        var always = 1;

        if (always == 1) {
            pauseRaster.opacity = 0;
            // check if we are at end of eventList
            if (x < eventList.length) {

                // line will incrementally draw a line towards the endx and endy coordinates
                if (eventList[x].command == "line") {
                    // calculate distancex and distancey if not calculated yet
                    if (!eventList[x].hasOwnProperty("distancex")) {
                        if (eventList[x].xend > xcoord) eventList[x].distancex = eventList[x].xend - xcoord;
                        else eventList[x].distancex = xcoord - eventList[x].xend;
                        if (eventList[x].yend > ycoord) eventList[x].distancey = eventList[x].yend - ycoord;
                        else eventList[x].distancey = ycoord - eventList[x].yend;

                        // set the direction of distancex and distancey
                        if (eventList[x].xend < xcoord) {
                            eventList[x].distancex = -eventList[x].distancex;
                        }
                        if (eventList[x].yend > ycoord) {
                            eventList[x].distancey = -eventList[x].distancey;
                        }
                    }
                    //calculate hypotenuse to get distance (if not calculated yet)
                    if (!eventList[x].hasOwnProperty("distanceh")) {
                        eventList[x].distanceh = Math.sqrt((eventList[x].distancex * eventList[x].distancex) + (eventList[x].distancey * eventList[x].distancey))
                    }
                    //difx and dify hold the current distance between current x and y to endx and endy
                    var difx;
                    difx = xcoord - eventList[x].xend;
                    difx = Math.abs(difx);
                    var dify;
                    dify = ycoord - eventList[x].yend;
                    dify = Math.abs(dify);

                    // check if done (if distance to end coordinates is less than 1
                    if ((Math.floor(difx) < 1) && (Math.floor(dify) < 1)) {
                        x++; // move to next event in eventList
                    } else if (difx < speed && dify < speed) {
                        //if speed is greater than distance to end location
                        //we will just jump straight to end location
                        var newx = Number(eventList[x].xend);
                        var newy = Number(eventList[x].yend);
                        turtlePath.add(new paper.Point(Number(newx), Number(newy)));
                        //move turtle to new point
                        raster.position.x = eventList[x].xend;
                        raster.position.y = eventList[x].yend;
                        //update current xcoord and ycoord
                        ycoord = eventList[x].yend;
                        xcoord = eventList[x].xend;
                        ++x; // move to next event in eventList
                    } else {
                        // here is where we incrementally draw towards endx and endy
                        //reverse angle temporarily
                        turtleAngle = -turtleAngle;
                        //convert to radians
                        var angleRadians = turtleAngle * (Math.PI / 180);
                        //calculate coordinate of destination
                        var yDest = Math.sin(angleRadians);
                        yDest = -yDest; //y coord increase in down direction 
                        var xDest = Math.cos(angleRadians);
                        if (speed <= eventList[x].distanceh) {
                            // xDest and yDest depend on speed
                            xDest = xDest * speed;
                            yDest = yDest * speed;
                            //updsate distanceh
                            eventList[x].distanceh = Math.sqrt(((eventList[x].xend - xcoord) * (eventList[x].xend - xcoord)) + ((eventList[x].yend - ycoord) * (eventList[x].yend - ycoord)));
                            // create a short path to the new point
                            turtlePath.add(new paper.Point(Number(xcoord - xDest), Number(ycoord - yDest)));
                            //move turtle image the to new point
                            raster.position.x = xcoord - xDest;
                            raster.position.y = ycoord - yDest;
                            // update xcoord and ycoord (what keeps track of current position)
                            xcoord = xcoord - xDest;
                            ycoord = ycoord - yDest;
                        } else {
                            // go straight to end location, as speed would jump us past it
                            turtlePath.add(new paper.Point(Number(xcoord), Number(ycoord)));
                            // move turtle to new point
                            raster.position.x = xcoord;
                            raster.position.y = ycoord;
                            // update xcoord and ycoord
                            ycoord = eventList[x].yend;
                            xcoord = eventList[x].xend;
                            ++x;
                        }
                        // set angle back
                        turtleAngle = -turtleAngle;
                    }
                }
                // turtleAngle is the current angle
                // rotate is the amount we want to move
                // speed controls how fast
                if (x < eventList.length) {
                    if (eventList[x].command == "rotate") {
                        // if we need to calculate the newAngle for the current rotate command
                        // we will rotate a little each frame until we reach newAngle
                        if (getAngle) {
                            // set the newAngle, we calculate newAngle once at start of rotate
                            // newAngle is the finalAngle we want the turtle to be facing
                            newAngle = turtleAngle + eventList[x].rotate;
                            getAngle = false; //got newAngle
                        }
                        // rotate clockwise
                        if (parseFloat(eventList[x].rotate) > 0) {
                            raster.rotate(speed); //rotate turtle image clockwise by speed
                            rasterAngle += speed; //rasterAngle is pointing where raster is
                            turtleAngle = turtleAngle + speed; //update the actual angle
                            eventList[x].rotate = eventList[x].rotate - speed; //decrease angle by the amount weve rotated
                            if (eventList[x].rotate < 0) {
                                // overshot desired endAngle, adjust correctly
                                turtleAngle = newAngle; //this automatically set turtleAngle to newAngle
                                raster.rotate(-rasterAngle); //rotate back to 0
                                raster.rotate(newAngle);
                                rasterAngle = newAngle;
                                eventList[x].rotate = 0; //k one sec
                            }
                        }
                            // rotate counter clockwise
                        else if (parseFloat(eventList[x].rotate) < 0) {
                            raster.rotate(-speed); //rotate turtle image counter clockwise by speed
                            rasterAngle -= speed;
                            //shouldnt newAngle be updated here?
                            turtleAngle = turtleAngle - speed; //update the actual angle
                            eventList[x].rotate = eventList[x].rotate + speed; //decrease angle by the amount weve rotated
                            if (eventList[x].rotate > 0) {
                                // overshot the desired endAngle, adjust correctly
                                turtleAngle = newAngle;      //this automatically sets turtleAngle to newAngle
                                raster.rotate(-rasterAngle); // reset raster to 0
                                raster.rotate(turtleAngle);  // rotate image to the correct angle
                                rasterAngle = newAngle; 	 // keep track of the turtle image's angles
                                eventList[x].rotate = 0;	//set rotate to 0, as it is done
                            }
                        } else {
                            // done rotating 
                            rasterAngle = newAngle; //make sure rasterAngle is correct
                            getAngle = true; // need to get a new Angle next time it rotates
                            x++; // increment to next event in eventList
                        }
                    }
                }

                //speed will change the speed of the drawing
                if (x < eventList.length) {
                    if (eventList[x].command == "speed") {
                        // change speed
                        speed = eventList[x].speed;
                        x++;

                    }
                }
                // penSize will change the size of the pen
                if (x < eventList.length) {
                    if (eventList[x].command == "penSize") {
                        // make new path for thickness change
                        turtlePath = new paper.Path();
                        // set color of stroke

                        //back to hex
                        if (isNaN(penColor)) {
                            turtlePath.strokeColor = penColor;

                        }
                        else {

                            var hex = Number(penColor).toString(16);
                            alert("hex.tostring: " + hex);

                            turtlePath.strokeColor = hex;

                        }
                        // add a path with the new pen size
                        turtlePath.add(new paper.Point(Number(xcoord), Number(ycoord)));
                        // set thickness
                        penSize = eventList[x].penSize;
                        if (penStatus == 1) {
                            turtlePath.strokeWidth = penSize;
                        } else {
                            turtlePath.strokeWidth = 0;
                        }
                        x++;
                    }
                }

                // command penColor will change the color
                if (x < eventList.length) {
                    if (eventList[x].command == "penColor") {
                        // make new path for color change
                        turtlePath = new paper.Path();
                        // set color of stroke
                        penColor = eventList[x].penColor;
                        turtlePath.strokeColor = penColor;
                        // add point to path with change
                        turtlePath.add(new paper.Point(Number(xcoord), Number(ycoord)));

                        // if pen is up or down we will draw or not draw
                        if (penStatus == 1) {
                            turtlePath.strokeWidth = penSize;
                        } else {

                            turtlePath.strokeWidth = 0;
                        }
                        x++;
                    }
                }
                // change pen status (penup, 0, or pendown, 1)
                if (x < eventList.length) {
                    if (eventList[x].command == "penStatus") {
                        // if pen should be drawing
                        if (eventList[x].toggle == 1) {
                            penStatus = 1;
                            // create a new path for pendown
                            turtlePath = new paper.Path();
                            turtlePath.add(new paper.Point(Number(xcoord), Number(ycoord)));
                            // set width of the stroke
                            turtlePath.strokeWidth = penSize;
                            // set color of stroke
                            turtlePath.strokeColor = penColor;
                            x++;
                        }
                            // if pen should not be drawing
                        else {
                            penStatus = 0;
                            // make new path
                            turtlePath = new paper.Path();
                            turtlePath.add(new paper.Point(Number(xcoord), Number(ycoord)));
                            //set size
                            turtlePath.strokeWidth = 0;
                            //set color of stroke
                            turtlePath.strokeColor = penColor;
                            x++
                        }
                    }
                }
                // backward draws a line to the end coordinates
                // different from forward, as turtleAngle and the raster are the opposite direction of the path
                if (x < eventList.length) {
                    if (eventList[x].command == "backward") {
                        //calculate distancex and distancey if not calculated yet
                        if (!eventList[x].hasOwnProperty("distancex")) {
                            // set xdistance
                            if (eventList[x].xend > xcoord) eventList[x].distancex = eventList[x].xend - xcoord;
                            else eventList[x].distancex = xcoord - eventList[x].xend;
                            // set ydistance
                            if (eventList[x].yend > ycoord) eventList[x].distancey = eventList[x].yend - ycoord;
                            else eventList[x].distancey = ycoord - eventList[x].yend;
                            //check which direction to go in
                            if (eventList[x].xend < xcoord) {
                                eventList[x].distancex = -eventList[x].distancex;
                            }
                            if (eventList[x].yend > ycoord) {
                                eventList[x].distancey = -eventList[x].distancey;
                            }
                        }
                        //calculate hypotenuse to get distance required if not calculated yet
                        if (!eventList[x].hasOwnProperty("distanceh")) {
                            eventList[x].distanceh = Math.sqrt((eventList[x].distancex * eventList[x].distancex) + (eventList[x].distancey * eventList[x].distancey))
                        }
                        var difx;
                        difx = xcoord - eventList[x].xend;
                        difx = Math.abs(difx);
                        var dify;
                        dify = ycoord - eventList[x].yend;
                        dify = Math.abs(dify);
                        //check if done
                        if ((Math.floor(difx) == 0) && (Math.floor(dify) == 0)) {
                            x++;

                        } else if (difx < speed && dify < speed) {
                            //go to end location
                            var newx = Math.floor(eventList[x].xend);
                            var newy = Math.floor(eventList[x].yend);
                            turtlePath.add(new paper.Point(Number(newx), Number(newy)));
                            //move turtle to new point
                            raster.position.x = eventList[x].xend;
                            raster.position.y = eventList[x].yend;
                            ycoord = eventList[x].yend;
                            xcoord = eventList[x].xend;
                            ++x;
                        } else {
                            //reverse angle temporarily
                            turtleAngle = -turtleAngle;
                            //convert to radians
                            var angleRadians = turtleAngle * (Math.PI / 180);
                            //calculate coordinate 
                            yDest = Math.sin(angleRadians);
                            yDest = yDest; //y coord increase in down direction 
                            xDest = -Math.cos(angleRadians);
                            if (speed <= eventList[x].distanceh) {
                                xDest = xDest * speed;
                                yDest = yDest * speed;
                                // update distanceh
                                eventList[x].distanceh = Math.sqrt(((eventList[x].xend - xcoord) * (eventList[x].xend - xcoord)) + ((eventList[x].yend - ycoord) * (eventList[x].yend - ycoord)));
                                // increase path
                                turtlePath.add(new paper.Point(xcoord - xDest, ycoord - yDest));
                                // move turtle to new point
                                raster.position.x = xcoord - xDest;
                                raster.position.y = ycoord - yDest;
                                // update for new turtle position
                                xcoord = xcoord - xDest;
                                ycoord = ycoord - yDest;
                            } else {
                                //go to end location
                                turtlePath.add(new paper.Point(xcoord, ycoord));
                                //move turtle to new point
                                raster.position.x = xcoord;
                                raster.position.y = ycoord;
                                ycoord = eventList[x].yend;
                                xcoord = eventList[x].xend;
                                ++x;
                            }
                            //set angle back
                            turtleAngle = -turtleAngle;
                        }

                    }
                }

                if (x < eventList.length) {
                    if (eventList[x].command == "goTo") {
                        // go directly to the x and y coordinates given
                        // temporarily rotate the turtle to angle given (direction of end point)
                        if (getGoToAngle) {
                            oldAngle = turtleAngle; //save turtle's real angle
                            turtleAngle = eventList[x].angle; //temporarily point turtleAngle to new endPoint
                            getGoToAngle = false;
                        }
                        //regular line stuff until the x++, then we set turtleAngle back
                        if (!eventList[x].hasOwnProperty("distancex")) {
                            if (eventList[x].xend > xcoord) eventList[x].distancex = eventList[x].xend - xcoord;
                            else eventList[x].distancex = xcoord - eventList[x].xend;
                            if (eventList[x].yend > ycoord) eventList[x].distancey = eventList[x].yend - ycoord;
                            else eventList[x].distancey = ycoord - eventList[x].yend;
                            if (eventList[x].xend < xcoord) {
                                eventList[x].distancex = -eventList[x].distancex;
                            }
                            if (eventList[x].yend > ycoord) {
                                eventList[x].distancey = -eventList[x].distancey;
                            }
                        }

                        //calculate hypotenuse to get distance required if not calculated yet
                        if (!eventList[x].hasOwnProperty("distanceh")) {
                            eventList[x].distanceh = Math.sqrt((eventList[x].distancex * eventList[x].distancex) + (eventList[x].distancey * eventList[x].distancey))
                        }
                        var difx;
                        difx = xcoord - eventList[x].xend;
                        difx = Math.abs(difx);
                        var dify;
                        dify = ycoord - eventList[x].yend;
                        dify = Math.abs(dify);

                        //check if done
                        if ((Math.floor(difx) < 1) && (Math.floor(dify) < 1)) {
                            turtleAngle = oldAngle;
                            getGoToAngle = true;
                            x++;
                        } else if (difx < speed && dify < speed) {
                            // if speed is greater than distance to end location
                            // jump straight to end location
                            var newx = Number(eventList[x].xend);
                            var newy = Number(eventList[x].yend);
                            turtlePath.add(new paper.Point(Number(newx), Number(newy)));
                            //move turtle to new point
                            raster.position.x = eventList[x].xend;
                            raster.position.y = eventList[x].yend;
                            //update current xcoord and ycoord
                            ycoord = eventList[x].yend;
                            xcoord = eventList[x].xend;
                            turtleAngle = oldAngle;
                            getGoToAngle = true;
                            ++x;
                        } else {
                            //reverse angle temporarily
                            turtleAngle = -turtleAngle;
                            //convert to radians
                            var angleRadians = turtleAngle * (Math.PI / 180);
                            //calculate coordinate 
                            yDest = Math.sin(angleRadians);
                            yDest = -yDest; //y coord increase in down direction 
                            xDest = Math.cos(angleRadians);
                            if (speed <= eventList[x].distanceh) {
                                xDest = xDest * speed;
                                yDest = yDest * speed;
                                //updsate distanceh
                                eventList[x].distanceh = Math.sqrt(((eventList[x].xend - xcoord) * (eventList[x].xend - xcoord)) + ((eventList[x].yend - ycoord) * (eventList[x].yend - ycoord)));
                                // increase path
                                turtlePath.add(new paper.Point(Number(xcoord - xDest), Number(ycoord - yDest)));
                                //move turtle to new point
                                raster.position.x = xcoord - xDest;
                                raster.position.y = ycoord - yDest;
                                //update new coordinate for turtle position
                                xcoord = xcoord - xDest;
                                ycoord = ycoord - yDest;
                            } else {
                                //go to end location
                                turtlePath.add(new paper.Point(Number(xcoord), Number(ycoord)));
                                //move turtle to new point
                                raster.position.x = xcoord;
                                raster.position.y = ycoord;
                                ycoord = eventList[x].yend;
                                xcoord = eventList[x].xend;
                                turtleAngle = oldAngle;
                                getGoToAngle = true;
                                ++x;
                            }
                            //set angle back
                            turtleAngle = -turtleAngle;
                        }
                    }
                }
                if (x >= eventList.length) {
                    $('#clear-button').prop('disabled', false);
                    $('#run-button').prop('disabled', false);
                    running = false;
                }
            }
        } else {
            //paused, show pause raster
            pauseRaster.opacity = 1;
        }
    }

}