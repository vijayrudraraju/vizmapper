//libmapper info

//Device
//	name
//  host
//	port
//	user_data

//Signal
//	is_output (is_source)
// 	type
//  length
//	name
//  device_name
//	unit
//	minimum
//	maximum
//	extra
//	user_data

//Mapping
//	src_name
//	dest_name
//	src_type
//	dest_type
//	src_length
//	dest_length
//	CLIP_MAX
//		none
//		mute
//		clamp
//		fold
//		wrap
//	CLIP_MIN
//	RANGE
// 		src_min
//		src_max
//		dest_min
//		dest_max
//		known
//	expression
//	MODE
//		undefined
//		bypass
//		linear
//		expression
//		calibrate
//	muted

//Link
//	src_name
//	dest_name

function testAlgo() {
}

var numberOfItemsPerPage = 1;
var signalPagePointer = 0;
var mappingPagePointer = 0;

// outputs,inputs
var nodeGlyphMap = [[],[]]; 
// outputs,inputs
var hoverGlyphMap = [[],[]];
// output labels, input labels
var listGlyphMap = [[],[]];
var traversalGlyphMap = [[],[]];
var mappingVizMap = [[],[]]; // outputs, inputs

var selectedOutput = "";
var selectedInput = "";

var selectedRemoveOutput = "";
var selectedRemoveInput = "";

var xs = [];
var ys = [];

var screenWidth = 1280;
var screenHeight = 800;
var mouseX = globalP.mouseX;
var mouseY = globalP.mouseY;
var drawCounter = 0;

var outputVizTrace = [];
var inputVizTrace = [];
var outputLabelTrace = ["output signals"];
var inputLabelTrace = ["input signals"];

function globalP(p) {
	p.mouseMoved = function() {
		mouseX = p.mouseX;
		mouseY = p.mouseY;

        /*
		// hover detection of connections
		if ($('#graphTab').hasClass('active')) {
			// check mouse position against where points are on the bezier equation
			// B(t) = ((1-t)^3)*(P0) + (3*(1-t)^2)*(t)*(P1) + (3*(1-t)*t^2)*(P2) + (t^3)*(P3)
			for (var i=0;i<mappingVizMap[0].length;i++) {
				xs = [mappingVizMap[0][i][1],mappingVizMap[0][i][3],
					mappingVizMap[1][i][3],mappingVizMap[1][i][1]];
				ys = [mappingVizMap[0][i][2],mappingVizMap[0][i][4],
					mappingVizMap[1][i][4],mappingVizMap[1][i][2]];
				xs.sort(function(a,b){return a-b;});
				ys.sort(function(a,b){return a-b;});

				if (mouseX<xs[3] && mouseX>xs[0] &&
					mouseY<ys[3] && mouseY>ys[0]) {

					var xLength = Math.abs(Math.round(mappingVizMap[0][i][1]-mappingVizMap[1][i][1]));
					for (var j=0;j<xLength;j++) {
						var t = j/xLength;
						var microX = (Math.pow(1-t,3)*mappingVizMap[0][i][1]) +
							(3*Math.pow(1-t,2)*t*mappingVizMap[0][i][3]) +
							(3*(1-t)*Math.pow(t,2)*mappingVizMap[1][i][3]) +
							(Math.pow(t,3)*mappingVizMap[1][i][1]);
						var microY = (Math.pow(1-t,3)*mappingVizMap[0][i][2]) +
							(3*Math.pow(1-t,2)*t*mappingVizMap[0][i][4]) +
							(3*(1-t)*Math.pow(t,2)*mappingVizMap[1][i][4]) +
							(Math.pow(t,3)*mappingVizMap[1][i][2]);

						if (mouseX<microX+3 && mouseX>microX-3 &&
								mouseY<microY+3 && mouseY>microY-3) {
							hoverGlyphMap[2][i] = true;
							break;
						}
						if (j == xLength-1) {
							hoverGlyphMap[2][i] = false;
						}
					}

				} else {
					hoverGlyphMap[2][i] = false;
				}
				if (hoverGlyphMap[2][i]) {
					for (var j=i+1;j<mappingVizMap[0].length;j++) {
						hoverGlyphMap[2][j] = false;
					}
					break;
				}
			}
		}
        */
	};

	p.mouseClicked = function() {
		if ($('#graphTab').hasClass('active')) {
            detectNodeClick();
            detectTraversalClick();
		}
        /*
        if ($('#graphTab').hasClass('active')) {
            // connection selection for removal
            for (var i=0;i<hoverGlyphMap[2].length;i++) {
                if (hoverGlyphMap[2][i]) {
                    selectedRemoveOutput = tables[1][i].output[2];
                    selectedRemoveInput = tables[1][i].input[2];
                    $('#removeConnectionForm').toggle(true);
                }
            }

			// output and input selection for mappings
			var clearSelection = true;
			var thisString = "";
			for (var i=0;i<hoverGlyphMap[0][0].length;i++) {
				thisString = "";
				if (hoverGlyphMap[0][0][i]) {
					for (var j=nodeGlyphMap[0][0][i][1].length-1;j>=0;j--) {
						thisString += "/"+nodeGlyphMap[0][0][i][1][j];
					}
					selectedOutput = thisString;
					clearSelection = false;
					break;
				}
			}

			selectedInput = "";
			for (var i=0;i<hoverGlyphMap[1][0].length;i++) {
				thisString = "";
				if (hoverGlyphMap[1][0][i]) {
					for (var j=nodeGlyphMap[1][0][i][1].length-1;j>=0;j--) {
						thisString += "/"+nodeGlyphMap[1][0][i][1][j];
					}
					selectedInput = thisString;
					clearSelection = false;
					break;
				}
			}

			if (clearSelection) {
				selectedOutput = "";
				selectedInput = "";
			}
		} else if ($('#listTab').hasClass('active')) {
			if (mouseX<220 && mouseX>20 && mouseY<780 && mouseY>750) {
				if (signalPagePointer+numberOfItemsPerPage < tables[0].length) {
					signalPagePointer += numberOfItemsPerPage;					
				}
			} else if (mouseX<220 && mouseX>20 && mouseY<100 && mouseY>70) {
				if (signalPagePointer-numberOfItemsPerPage >= 0) {
					signalPagePointer -= numberOfItemsPerPage;					
				}
			}
        }
        */
	};

	p.setup = function() {
		//p.println(p.PFont.list());

		p.size(screenWidth,screenHeight);
		var font = p.loadFont("monospace");
		p.textFont(font);
	};

	p.draw = function() {

		if (!drawCounter) {
			$.getJSON('/data/live.json', function(data) {
					indexLiveData(data);
					updateActiveFilter();
                    updateSignalMatches();
                    updateLevelStructure();
                    updateHoverGlyphMap();
					});
		}

		if ($('#graphTab').hasClass('active')) {
			$('html').toggleClass('graphColor',true);
			$('html').toggleClass('listColor',false);
			$('html').toggleClass('rawColor',false);
            $('#signalsFile').toggle(false);
            $('#mappingsFile').toggle(false);
			p.background(207);
            drawBackground();
            drawTraversalGlyphs();
            drawGraph();
            drawListGlyphs();
            updateHoverState();
            //drawConnectionProcess();
            //drawMouseFeedback();
		} else if ($('#listTab').hasClass('active')) {
			$('html').toggleClass('graphColor',false);
			$('html').toggleClass('listColor',true);
			$('html').toggleClass('rawColor',false);
			p.background(80);
            drawList();
		} else {
			$('html').toggleClass('graphColor',false);
			$('html').toggleClass('listColor',false);
			$('html').toggleClass('rawColor',true);
			p.background(220);
			drawRaw();
		}

		if (debugMode) {
		}

		drawCounter++;
		drawCounter = drawCounter % 240;

	};
}


function updateHoverState() {
    // hover detection of outputs and inputs
    // this is the dumb way of doing this
    if ($('#graphTab').hasClass('active')) {
        var thisX = 0; // input,level,container,drawingNumbers,thisX
        var thisY = 0;
        var thisRadius = 0;

        for (var i=0;i<nodeGlyphMap[0].length;i++) {
            thisX = nodeGlyphMap[0][i][0][0];
            thisY = nodeGlyphMap[0][i][0][1];
            thisRadius = nodeGlyphMap[0][i][0][2]/2;
            if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
                    mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
                hoverGlyphMap[0][i] = true;
            } else {
                hoverGlyphMap[0][i] = false;
            }
        }
        for (var i=0;i<nodeGlyphMap[1].length;i++) {
            thisX = nodeGlyphMap[1][i][0][0];
            thisY = nodeGlyphMap[1][i][0][1];
            thisRadius = nodeGlyphMap[1][i][0][2]/2;
            if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
                    mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
                hoverGlyphMap[1][i] = true;
            } else {
                hoverGlyphMap[1][i] = false;
            }
        }
    }
}


function addConnection() {
    // add
    var alreadyThere = false;
    if (selectedOutput!="" && selectedInput!="") {
        for (var j=0;j<masterMappingIndex.length;j++) {
            if (selectedOutput==masterMappingIndex[j].output[2] &&
                    selectedInput==masterMappingIndex[j].input[2]) {
                masterMappingIndex[j].expression = 
                    "input=output*("+$('#mappingFactorInput').val()+")+("+$('#mappingOffsetInput').val()+")";	
                alreadyThere = true;
                break;
            }
        }
        if (!alreadyThere) {
            masterMappingIndex.push(
                    {"expression":"input=output*("+$('#mappingFactorInput').val()+")+("+$('#mappingOffsetInput').val()+")",
                    "output":["","",selectedOutput],
                    "input":["","",selectedInput]}
                    );
        }
    }

    updateActiveFilter();
}
function removeConnection() {
    for (var j=0;j<masterMappingIndex.length;j++) {
        if (selectedRemoveOutput==masterMappingIndex[j].output[2] &&
                selectedRemoveInput==masterMappingIndex[j].input[2]) {
            masterMappingIndex.splice(j,1);	
        }
    }

    updateActiveFilter();
}



function drawMouseFeedback() {
    // mouse over connection glyph feedback
    var thisX = 0;
    var thisY = 0;
    var thisWidth = 500;
    var thisHeight = 75;
    thisX = mouseX+20;
    thisY = mouseY+20;
    if (thisX+thisWidth>screenWidth) {
        thisX = mouseX-20-thisWidth;
    }
    if (thisY+thisHeight>screenHeight) {
        thisY = mouseY-20-thisHeight;
    }

/*
    for (var i=0;i<hoverGlyphMap[2].length;i++) {
        if (hoverGlyphMap[2][i]) {
            globalP.noStroke();
            globalP.fill(255);
            globalP.rect(thisX,thisY,thisWidth,thisHeight);
            globalP.fill(0);
            globalP.textSize(16);
            globalP.textAlign(globalP.LEFT);

            globalP.text("output = "+tables[1][i].output[2],thisX+10,thisY+20);
            globalP.text("input = "+tables[1][i].input[2],thisX+10,thisY+40);
            globalP.text(tables[1][i].expression,thisX+10,thisY+60);
        }
    }
    */

    // mouse over signal glyph feedback
    var thisString = "";
    globalP.fill(0);
    globalP.textSize(16);
    thisString = "active output";
    globalP.textAlign(globalP.LEFT);
    //globalP.text(thisString,10,80);
    thisString = "active input";
    globalP.textAlign(globalP.RIGHT);
    //globalP.text(thisString,1270,80);

    thisHeight = 60;
    var textX = mouseX+40;
    var textY = mouseY+20;
    thisX = mouseX+20+(thisWidth/2);
    thisY = mouseY+20+(thisHeight/2);
    if (thisX+thisWidth>screenWidth) {
        thisX = mouseX-20-thisWidth+(thisWidth/2);
        textX = mouseX-10-thisWidth;
    }
    if (thisY+thisHeight>screenHeight) {
        thisY = mouseY-20-thisHeight+(thisHeight/2);
        textY = mouseY-20-thisHeight;
    }

    // output selection feedback
    for (var i=0;i<hoverGlyphMap[0].length;i++) {
        thisString = nodeGlyphMap[0][i][1];

        if (hoverGlyphMap[0][i]) {
            globalP.noStroke();
            globalP.fill(0);
            globalP.ellipse(thisX,thisY,thisWidth,thisHeight);
            globalP.fill(255);
            globalP.textSize(16);
            globalP.textAlign(globalP.LEFT);

            globalP.text(thisString,textX+20,textY+34);
        }
        if (thisString == selectedOutput) {
            globalP.fill(255,0,0);
            globalP.ellipse(nodeGlyphMap[0][i][0][0],
                    nodeGlyphMap[0][i][0][1],
                    nodeGlyphMap[0][i][0][2],
                    nodeGlyphMap[0][i][0][2]
                    );
        }
    }

    // input selection feedback
    for (var i=0;i<hoverGlyphMap[1].length;i++) {
        thisString = nodeGlyphMap[1][i][1];

        if (hoverGlyphMap[1][i]) {
            globalP.noStroke();
            globalP.fill(0);
            globalP.ellipse(thisX,thisY,thisWidth,thisHeight);
            globalP.fill(255);
            globalP.textSize(16);
            globalP.textAlign(globalP.LEFT);

            globalP.text(thisString,textX+20,textY+34);
        }
        if (thisString == selectedInput) {
            globalP.fill(255,0,0);
            globalP.ellipse(nodeGlyphMap[1][i][0][0],
                    nodeGlyphMap[1][i][0][1],
                    nodeGlyphMap[1][i][0][2],
                    nodeGlyphMap[1][i][0][2]
                    );
        }
    }
}

function drawConnectionProcess() {
    var thisString = "";
    var thisX = 0;
    var thisY = 0;

    var cp1x = 450;
    var cp1y = 45+(760/2);
    var cp2x = screenWidth-450;
    var cp2y = 45+(760/2);


    if (selectedInput != "" && selectedOutput != "") {
        $('#mappingFactorInput').val(1.0);
        $('#mappingOffsetInput').val(0.0);
        $('#selectedOutput').text("output = "+selectedOutput);
        $('#selectedInput').text("input = "+selectedInput);
        $('#addMappingForm').toggle(true);
    } else {
        $('#addMappingForm').toggle(false);
        if (selectedOutput != "") {
            for (var i=0;i<hoverGlyphMap[0].length;i++) {
                thisString = "";
                for (var j=nodeGlyphMap[0][0][i][1].length-1;j>=0;j--) {
                    thisString += "/"+nodeGlyphMap[0][0][i][1][j];
                }
                if (thisString == selectedOutput) {
                    thisX = nodeGlyphMap[0][0][i][0][0];
                    thisY = nodeGlyphMap[0][0][i][0][1];
                    break;
                }
            }
            for (var i=0;i<hoverGlyphMap[1].length;i++) {
                if (hoverGlyphMap[1][i]) {
                    globalP.stroke(255,0,0);
                    globalP.strokeWeight(5);
                    globalP.noFill();
                    globalP.bezier(thisX,
                            thisY,
                            cp1x,cp1y,
                            cp2x,cp2y,
                            nodeGlyphMap[1][0][i][0][0],
                            nodeGlyphMap[1][0][i][0][1]);
                    globalP.noStroke();
                }
            }

        }
    }
}

function detectNodeClick() {
    var thisX = 0;
    var thisY = 0;
    var thisRadius = 0;

    for (var i=0;i<nodeGlyphMap[0].length;i++) {
        thisX = nodeGlyphMap[0][i][0][0];
        thisY = nodeGlyphMap[0][i][0][1];
        thisRadius = nodeGlyphMap[0][i][0][2]/2;
        if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
                mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
            descendOutputTree(i);
            updateHoverGlyphMap();
        }
    }
    for (var i=0;i<nodeGlyphMap[1].length;i++) {
        thisX = nodeGlyphMap[1][i][0][0];
        thisY = nodeGlyphMap[1][i][0][1];
        thisRadius = nodeGlyphMap[1][i][0][2]/2;
        if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
                mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
            descendInputTree(i);
            updateHoverGlyphMap();
        }
    }
}

function detectTraversalClick() {
    var thisX = 0;
    var thisY = 0;
    var thisWidth = 0;
    var thisHeight = 0;

    for (var i=0;i<traversalGlyphMap[0].length;i++) {
        thisX = traversalGlyphMap[0][i][0][0];
        thisY = traversalGlyphMap[0][i][0][1];
        thisWidth = traversalGlyphMap[0][i][0][2];
        thisHeight = traversalGlyphMap[0][i][0][3];
        if (mouseX<thisX+thisWidth && mouseX>thisX &&
                mouseY<thisY+thisHeight && mouseY>thisY) {
            climbOutputTree(i);
            updateHoverGlyphMap();
        }
    }
    for (var i=0;i<traversalGlyphMap[1].length;i++) {
        thisX = traversalGlyphMap[1][i][0][0];
        thisY = traversalGlyphMap[1][i][0][1];
        thisWidth = traversalGlyphMap[1][i][0][2];
        thisHeight = traversalGlyphMap[1][i][0][3];
        if (mouseX<thisX+thisWidth && mouseX>thisX &&
                mouseY<thisY+thisHeight && mouseY>thisY) {
            climbInputTree(i);
            updateHoverGlyphMap();
        }
    }
}

function isOutputLeafNode(index) {
    var outputPointer = levels[0][1];   
    for (var i=0;i<outputVizTrace.length;i++) {
        outputPointer = outputPointer[outputVizTrace[i]][1];
    }
    if (outputPointer[index] == 0) {
        return true;
    } else {
        return false;
    }
}
function getCurrentOutputLevelSet() {
    var outputSet = levels[0][0];
    var outputPointer = levels[0][1];
    for (var i=0;i<outputVizTrace.length;i++) {
        outputSet = outputPointer[outputVizTrace[i]][0]; 
        outputPointer = outputPointer[outputVizTrace[i]][1];
    }
    return outputSet;
}
function descendOutputTree(index) {
    var outputPointer = levels[0][1];
    for (var i=0;i<outputVizTrace.length;i++) {
        outputPointer = outputPointer[outputVizTrace[i]][1];
    }

    if (outputPointer[index] == 0) {
        return;
    } else {
        outputVizTrace.push(index); 
        outputLabelTrace.push(nodeGlyphMap[0][index][1]);
    }
}
function climbOutputTree(level) {
    if (level == 0) {
        outputVizTrace = [];
        outputLabelTrace = ["output signals"];
    } else {
        outputVizTrace = outputVizTrace.slice(0,level);   
        outputLabelTrace = outputLabelTrace.slice(0,level+1);
    }
}
function isInputLeafNode(index) {
    var inputPointer = levels[1][1];   
    for (var i=0;i<inputVizTrace.length;i++) {
        inputPointer = inputPointer[inputVizTrace[i]][1];
    }
    if (inputPointer[index] == 0) {
        return true;
    } else {
        return false;
    }
}
function getCurrentInputLevelSet() {
    var inputSet = levels[1][0];
    var inputPointer = levels[1][1];
    for (var i=0;i<inputVizTrace.length;i++) {
        inputSet = inputPointer[inputVizTrace[i]][0]; 
        inputPointer = inputPointer[inputVizTrace[i]][1];
    }
    return inputSet;
}
function descendInputTree(index) {
    var inputPointer = levels[1][1];
    for (var i=0;i<inputVizTrace.length;i++) {
        inputPointer = inputPointer[inputVizTrace[i]][1];
    }

    if (inputPointer[index] == 0) {
        return;
    } else {
        inputVizTrace.push(index); 
        inputLabelTrace.push(nodeGlyphMap[1][index][1]);
    }
}
function climbInputTree(level) {
    if (level == 0) {
        inputVizTrace = [];
        inputLabelTrace = ["input signals"];
    } else {
        inputVizTrace = inputVizTrace.slice(0,level);   
        inputLabelTrace = inputLabelTrace.slice(0,level+1);
    }
}

function drawBackground() {
    var xCenter = 450;
    var yCenter = 45+(760/2);
    var layoutRadius = 280;

    globalP.noStroke();
    globalP.fill(200,255);
    globalP.ellipse(xCenter,yCenter,2*layoutRadius,2*layoutRadius);
    globalP.fill(0);

    xCenter = screenWidth-450;

    globalP.noStroke();
    globalP.fill(200,255);
    globalP.ellipse(xCenter,yCenter,2*layoutRadius,2*layoutRadius);
    globalP.fill(0);
}

function drawListGlyphs() {
    var outputSet = getCurrentOutputLevelSet();
    var inputSet = getCurrentInputLevelSet();

    globalP.textAlign(globalP.LEFT);
    globalP.textSize(12);
    for (var i=0;i<outputSet.length;i++) {
        globalP.fill(0,0,255,128);
        if (hoverGlyphMap[0][i]) {
            globalP.rect(0,150+(i*32),200,28);
        }
        globalP.fill(0);
        globalP.text(outputSet[i],10,170+(i*32));
    }
    for (var i=0;i<inputSet.length;i++) {
        globalP.fill(0,0,255,128);
        if (hoverGlyphMap[1][i]) {
            globalP.rect(screenWidth-200,150+(i*32),200,28);
        }
        globalP.fill(0);
        globalP.text(inputSet[i],screenWidth+10-200,170+(i*32));
    }
}

function drawTraversalGlyphs() {
    traversalGlyphMap = [[],[]];

    var xCenter = 550;
    var yCenter = 45+(760/2);

    globalP.textAlign(globalP.LEFT);
    globalP.textSize(16);
    for (var i=0;i<outputLabelTrace.length;i++) {
        globalP.fill(255,0,0,128);
        globalP.rect(xCenter+80-200,yCenter-120+(i*32),200,28);
        globalP.fill(0);
        globalP.text(outputLabelTrace[i],xCenter+90-200,yCenter-100+(i*32));
        traversalGlyphMap[0].push([[xCenter+80-200,yCenter-120+(i*32),200,28],
            outputLabelTrace[i]]);
    }

    xCenter = screenWidth-550;

    for (var i=0;i<inputLabelTrace.length;i++) {
        globalP.fill(255,0,0,128);
        globalP.rect(xCenter-80,yCenter-120+(i*32),200,28);
        globalP.fill(0);
        globalP.text(inputLabelTrace[i],xCenter-70,yCenter-100+(i*32));
        traversalGlyphMap[1].push([[xCenter-80,yCenter-120+(i*32),200,28],
            inputLabelTrace[i]]);
    }
}

function drawGraph() {
    nodeGlyphMap = [[],[]];

    var outputSet = getCurrentOutputLevelSet();
    var inputSet = getCurrentInputLevelSet();

    // outputs
    var separationAngle;
    var symbolWidth;
    var xCenter = 550;
    var yCenter = 45+(760/2);
    var layoutRadius = 280;
    var count = outputSet.length;
    if (count > 1) {
        separationAngle = Math.PI/(count-1);
    } else {
        separationAngle = Math.PI/(count);
    }
    if (count < 6) {
        var symbolWidth = (300*3.1)/6;
    } else {
        var symbolWidth = (300*3.1)/count;
    }

    for (var i=0;i<count;i++) {
        //layoutAngle = i*separationAngle + (Math.PI/2);
        layoutAngle = (3*Math.PI/2) - i*separationAngle;
        if (separationAngle == 2*Math.PI) {
            var layoutX = xCenter;
            var layoutY = yCenter;
        } else {
            var layoutX = xCenter + (layoutRadius*Math.cos(layoutAngle));
            var layoutY = yCenter + (layoutRadius*Math.sin(layoutAngle));
        }

        globalP.noStroke();
        /*
        if (hoverGlyphMap[0][i]) {
            globalP.fill((2*16)+10,(8*16)+14,(2*16)+10);
        } else {
            */
            if (isOutputLeafNode(i)) {
                globalP.fill(0);
            } else {
                globalP.fill(0,255,0);
            }
        //}
        if (vizDepth > 2) {
            globalP.ellipse(layoutX,layoutY,symbolWidth,symbolWidth);
        }
        nodeGlyphMap[0].push([[layoutX,layoutY,symbolWidth],
                outputSet[i]]);
    }

    // inputs
    xCenter = screenWidth-550;
    count = inputSet.length;
    if (count > 1) {
        separationAngle = Math.PI/(count-1);
    } else {
        separationAngle = Math.PI/(count);
    }
    if (count < 6) {
        var symbolWidth = (300*3.1)/6;
    } else {
        var symbolWidth = (300*3.1)/count;
    }

    for (var i=0;i<count;i++) {
        layoutAngle = i*separationAngle + (3*Math.PI/2);
        if (separationAngle == 2*Math.PI) {
            var layoutX = xCenter;
            var layoutY = yCenter;
        } else {
            var layoutX = xCenter + (layoutRadius*Math.cos(layoutAngle));
            var layoutY = yCenter + (layoutRadius*Math.sin(layoutAngle));
        }

        globalP.noStroke();
        /*
        if (hoverGlyphMap[1][i]) {
            globalP.fill((2*16)+10,(8*16)+14,(2*16)+10);
        } else {
            */
            if (isInputLeafNode(i)) {
                globalP.fill(0);
            } else {
                globalP.fill(255,255,0);
            }
        //}
        if (vizDepth > 2) {
            globalP.ellipse(layoutX,layoutY,symbolWidth,symbolWidth);
        }
        nodeGlyphMap[1].push([[layoutX,layoutY,symbolWidth],
                inputSet[i]]);
    }

}

function drawList() {
    var horizontalOffset = 20;
    var lineSpacing = 26;
    var bigColumnSpacing = 360;
    var littleColumnSpacing = 70;
    var leftBound = 20;
    var topBound = 150;
    var textSize = 16;

    globalP.noStroke();

    if ($('#signalsTab').hasClass('active')) {
        globalP.fill(0);
        globalP.textSize(textSize);
        globalP.textAlign(globalP.LEFT);
        globalP.text("signal name",leftBound,126);
        globalP.text("type",leftBound+bigColumnSpacing,126);
        globalP.text("units",leftBound+bigColumnSpacing+littleColumnSpacing,126);
        globalP.text("min",leftBound+bigColumnSpacing+(2*littleColumnSpacing),126);
        globalP.text("max",leftBound+bigColumnSpacing+(3*littleColumnSpacing),126);
        globalP.text("tags",leftBound+bigColumnSpacing+(4*littleColumnSpacing),126);

        globalP.fill(255,0,0,255);
        globalP.textSize(18);

        if (tables[0].length > numberOfItemsPerPage) {
            globalP.textSize(textSize);
            globalP.fill(200);
            if (signalPagePointer != 0) {
                globalP.triangle(0+horizontalOffset,100,
                        300+horizontalOffset,100,
                        150+horizontalOffset,70);
            }
            if (signalPagePointer+numberOfItemsPerPage < tables[0].length) {
                globalP.triangle(0+horizontalOffset,750,
                        300+horizontalOffset,750,
                        150+horizontalOffset,780);

                globalP.fill(10);
                globalP.text(
                        "showing "+(signalPagePointer+1)+"-"+(signalPagePointer+numberOfItemsPerPage)+" of "+tables[0].length+" signals",
                        450, 85);
            } else {
                globalP.fill(10);
                globalP.text(
                        "showing "+(signalPagePointer+1)+"-"+tables[0].length+" of "+tables[0].length+" signals",
                        450, 85);
            }
        } else {
            globalP.textSize(textSize);
            globalP.fill(10);
            globalP.text(
                    "showing "+1+"-"+tables[0].length+" of "+tables[0].length+" signals",
                    450, 85);

        }

        var xPos = leftBound;
        var yPos = topBound;

        numberOfItemsPerPage = Math.ceil((screenHeight-80-topBound)/lineSpacing) + 1;

        globalP.fill(200);
        if (tables != null) {
            for (var i=signalPagePointer;i<tables[0].length;i++) {
                globalP.text(tables[0][i][0],
                        xPos,
                        yPos);
                globalP.text(tables[0][i][1],
                        xPos+bigColumnSpacing,
                        yPos);
                globalP.text(tables[0][i][2],
                        xPos+bigColumnSpacing+littleColumnSpacing,
                        yPos);
                globalP.text(tables[0][i][3],
                        xPos+bigColumnSpacing+(2*littleColumnSpacing),
                        yPos);
                globalP.text(tables[0][i][4],
                        xPos+bigColumnSpacing+(3*littleColumnSpacing),
                        yPos);
                globalP.text(tables[0][i][5].toString(),
                        xPos+bigColumnSpacing+(4*littleColumnSpacing),
                        yPos);
                if (yPos+80 > screenHeight) {
                    break;
                } else {
                    yPos += lineSpacing;
                }
            }
        }
    } else {
        globalP.fill(0);
        globalP.textSize(textSize);
        globalP.textAlign(globalP.LEFT);
        globalP.text("expression",leftBound,126);
        globalP.text("output",leftBound+bigColumnSpacing,126);
        globalP.text("input",leftBound+bigColumnSpacing+bigColumnSpacing,126);
        globalP.fill(0);
        //globalP.text("range",leftBound+bigColumnSpacing+(2*bigColumnSpacing),126);
        //globalP.text("max",leftBound+bigColumnSpacing+(3*littleColumnSpacing),126);

        if (tables[1].length > numberOfItemsPerPage) {
            globalP.textSize(textSize);
            globalP.fill(200);
            if (mappingPagePointer != 0) {
                globalP.triangle(0+horizontalOffset,100,
                        300+horizontalOffset,100,
                        150+horizontalOffset,70);
            }
            if (mappingPagePointer+numberOfItemsPerPage < tables[1].length) {
                globalP.triangle(0+horizontalOffset,750,
                        300+horizontalOffset,750,
                        150+horizontalOffset,780);

                globalP.fill(10);
                globalP.text(
                        "showing "+(mappingPagePointer+1)+"-"+(mappingPagePointer+numberOfItemsPerPage)+" of "+tables[1].length+" mappings",
                        450, 85);
            } else {
                globalP.fill(10);
                globalP.text(
                        "showing "+(mappingPagePointer+1)+"-"+tables[1].length+" of "+tables[1].length+" mappings",
                        450, 85);
            }
        } else {
            globalP.textSize(textSize);
            globalP.fill(10);
            globalP.text(
                    "showing "+1+"-"+tables[1].length+" of "+tables[1].length+" mappings",
                    450, 85);

        }

        xPos = leftBound;
        yPos = topBound;

        globalP.fill(180);
        if (tables != null) {
            for (var i=mappingPagePointer;i<tables[1].length;i++) {
                globalP.text(tables[1][i].expression,
                        xPos,
                        yPos);
                globalP.text(tables[1][i].output[2],
                        xPos+bigColumnSpacing,
                        yPos);
                globalP.text(tables[1][i].input[2],
                        xPos+bigColumnSpacing+bigColumnSpacing,
                        yPos);
                //globalP.text("["+tables[1][i].range[0]+","+tables[1][i].range[1]+"]"+"-"+"["+tables[1][i].range[2]+","+tables[1][i].range[3]+"]",
                //		xPos+(3*bigColumnSpacing),
                //		yPos);
                if (yPos+80 > screenHeight) {
                    break;
                } else {
                    yPos += lineSpacing;
                }
            }
        }
        globalP.fill(255,0,0);
        globalP.text(selectedOutput,
                xPos+bigColumnSpacing,
                yPos);
        globalP.text(selectedInput,
                xPos+bigColumnSpacing+bigColumnSpacing,
                yPos);
    }
}

function drawRaw() {
    if ($('#signalsTab').hasClass('active')) {
        $('#rawText').text(JSON.stringify(liveJSONBase,null,'\t'));
        $('#signalsFile').toggle(true);
        $('#mappingsFile').toggle(false);
    } else {
        $('#rawText').text(JSON.stringify(liveJSONBase,null,'\t'));
        $('#signalsFile').toggle(false);
        $('#mappingsFile').toggle(true);
    }
}

function activateSignalsMode() {
	$('#signalsTab').toggleClass('active',true);
	$('#signalsTab').toggleClass('inactive',false);
	$('#mappingsTab').toggleClass('active',false);
	$('#mappingsTab').toggleClass('inactive',true);
}
function activateMappingsMode() {
	$('#signalsTab').toggleClass('active',false);
	$('#signalsTab').toggleClass('inactive',true);
	$('#mappingsTab').toggleClass('active',true);
	$('#mappingsTab').toggleClass('inactive',false);
}

function activateGraphMode() {
	$('#globalCanvas').toggle(true);
    $('#signalsFile').toggle(false);
    $('#mappingsFile').toggle(false);
	$('#rawText').toggle(false);

	$('#graphTab').toggleClass('active',true);
	$('#graphTab').toggleClass('inactive',false);
	$('#listTab').toggleClass('active',false);
	$('#listTab').toggleClass('inactive',true);
	$('#rawTab').toggleClass('active',false);
	$('#rawTab').toggleClass('inactive',true);

	//$('#filterInput').toggle(true);
	//$('#filterText').toggle(true);
	//$('#executeInput').toggle(false);
	//$('#executeText').toggle(false);
	//$('#executeButton').toggle(false);
	$('#signalsTab').toggle(false);
	$('#mappingsTab').toggle(false);
}
function activateListMode() {
	$('#globalCanvas').toggle(true);
    $('#signalsFile').toggle(false);
    $('#mappingsFile').toggle(false);
	$('#rawText').toggle(false);

	$('#graphTab').toggleClass('active',false);
	$('#graphTab').toggleClass('inactive',true);
	$('#listTab').toggleClass('active',true);
	$('#listTab').toggleClass('inactive',false);
	$('#rawTab').toggleClass('active',false);
	$('#rawTab').toggleClass('inactive',true);

	//$('#filterInput').toggle(false);
	//$('#filterText').toggle(false);
	//$('#executeInput').toggle(true);
	//$('#executeText').toggle(true);
	//$('#executeButton').toggle(true);
	$('#signalsTab').toggle(true);
	$('#mappingsTab').toggle(true);
}
function activateRawMode() {
	$('#globalCanvas').toggle(false);
	$('#rawText').toggle(true);

	$('#graphTab').toggleClass('active',false);
	$('#graphTab').toggleClass('inactive',true);
	$('#listTab').toggleClass('active',false);
	$('#listTab').toggleClass('inactive',true);
	$('#rawTab').toggleClass('active',true);
	$('#rawTab').toggleClass('inactive',false);

	//$('#filterInput').toggle(false);
	//$('#filterText').toggle(false);
	//$('#executeInput').toggle(true);
	//$('#executeText').toggle(true);
	//$('#executeButton').toggle(true);
	$('#signalsTab').toggle(true);
	$('#mappingsTab').toggle(true);
}

function activateAboutMode() {
	$('#aboutSwitch').toggleClass('aboutClosed',false);
	$('#aboutSwitch').toggleClass('aboutOpen',true);
	$('#aboutAlterText').toggle(false);
	$('#aboutText').toggle(true);

	$('#helpSwitch').toggle(false);
}
function deactivateAboutMode() {
	$('#aboutSwitch').toggleClass('aboutClosed',true);
	$('#aboutSwitch').toggleClass('aboutOpen',false);
	$('#aboutAlterText').toggle(true);
	$('#aboutText').toggle(false);

	$('#helpSwitch').toggle(true);
}
function activateHelpMode() {
	$('#helpSwitch').toggleClass('helpClosed',false);
	$('#helpSwitch').toggleClass('helpOpen',true);
	$('#helpAlterText').toggle(false);
	$('#helpText').toggle(true);

	$('#aboutSwitch').toggle(false);
}
function deactivateHelpMode() {
	$('#helpSwitch').toggleClass('helpClosed',true);
	$('#helpSwitch').toggleClass('helpOpen',false);
	$('#helpAlterText').toggle(true);
	$('#helpText').toggle(false);

	$('#aboutSwitch').toggle(true);
}


var globalP;
var isAbouting = false;
var isHelping = false;
$(document).ready(function() {
		globalP = new Processing($('#globalCanvas')[0],globalP);

/*
		$.getJSON('/data/testerNetwork.json', function(data) {
			indexNetworkData(data);
			updateActiveFilter();
            updateLevelStructure();
			//activateListMode();
		});
		$.getJSON('/data/testerMapping.json', function(data) {
			indexMappingData(data);
			updateActiveFilter();
            updateLevelStructure();
		});
        */

		$('span').hover(function(){
			$(this).toggleClass('normalHelp',false);
			$(this).toggleClass('hoverHelp',true);
		}, function() {
			$(this).toggleClass('normalHelp',true);
			$(this).toggleClass('hoverHelp',false);
		});
        $('#viewHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#viewHelp').toggle(true);
        });
        $('#signalHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#signalHelp').toggle(true);
        });
        $('#mappingHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#mappingHelp').toggle(true);
        });
        $('#filteringHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#filteringHelp').toggle(true);
        });
        $('#taggingHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#taggingHelp').toggle(true);
        });

        $('#viewHelp').click(function() {
            $('#viewHelp').toggle(false);
        });
        $('#signalHelp').click(function() {
            $('#signalHelp').toggle(false);
        });
        $('#mappingHelp').click(function() {
            $('#mappingHelp').toggle(false);
        });
        $('#filteringHelp').click(function() {
            $('#filteringHelp').toggle(false);
        });
        $('#taggingHelp').click(function() {
            $('#taggingHelp').toggle(false);
        });

		$('#aboutSwitch').click(function() {
			isAbouting = !isAbouting;
			if (isAbouting) {
				activateAboutMode();
			} else {
				deactivateAboutMode();
			}
		});
		$('#helpSwitch').click(function() {
			isHelping = !isHelping;
			if (isHelping) {
				activateHelpMode();
			} else {
				deactivateHelpMode();
			}
		});

        $('#okMapping').click(function() {
            addConnection();
            selectedInput = "";
            selectedOutput = "";
        });
        $('#cancelMapping').click(function() {
            selectedInput = "";
            selectedOutput = "";
        });

        $('#okRemoveConnection').click(function() {
            removeConnection();
            $('#removeConnectionForm').toggle(false);
        });
        $('#cancelRemoveConnection').click(function() {
            $('#removeConnectionForm').toggle(false);
        });

		$('#graphTab').click(function() {
			activateGraphMode();
		});
		$('#listTab').click(function() {
			activateListMode();
		});
		$('#rawTab').click(function() {
			activateRawMode();
		});
		$('#signalsTab').click(function() {
			activateSignalsMode();
		});
		$('#mappingsTab').click(function() {
			activateMappingsMode();
		});
		$('#executeButton').click(function() {
			executeSymbols();
		});

/*
		$('#filterInput').keydown(function(event) {
			if (event.which == '9') {
				event.preventDefault();
				activateListMode();
			}
		});
		*/
		$('#filterInput').keyup(function(event) {
			event.preventDefault();
			updateActiveFilter();
            //updateLevelStructure();
		});
		/*
		$('#executeInput').keydown(function(event) {
			if (event.which == '9') {
				event.preventDefault();
				activateGraphMode();
			}
		});
		$('#executeInput').keyup(function(event) {
			event.preventDefault();
			if (event.which == '13') {
				executeSymbols();
			} else {
				updateActiveExecution();
			}
		});
		*/

        //updateActiveFilter();
		main();
});

/* The main program. */
function main()
{
    command.register("all_devices", function(cmd, args) {
        for (d in args)
            devices.add(args[d].name, args[d]);
    });
    command.register("new_device", function(cmd, args) {
        devices.add(args.name, args);
    });
    command.register("del_device", function(cmd, args) {
        devices.remove(args.name);
    });

    command.register("all_signals", function(cmd, args) {
        for (d in args)
            signals.add(args[d].name, args[d]);
    });
    command.register("new_signal", function(cmd, args) {
        signals.add(args.name, args);
    });
    command.register("del_signal", function(cmd, args) {
        signals.remove(args.name);
    });

	command.start();

    // Delay starting polling, because it results in a spinning wait
    // cursor in the browser.
    setTimeout(
        function(){
            command.send('all_devices');
            command.send('all_signals');
			},
        100);
}



var debugMode = 0;

var activeFilter = "";
var highlightedFilter = "";

var tables = [[],[]]; // signals,mappings
var tagOperation = [[],[]]; //add,remove
var mappingOperation = [];

var namespaceQuery = [];
var filterMatches = [[],[],[]]; // outputs,inputs,mappings
var vizQuery = [];
var vizMatches = [];
var vizDepth = 3;
var vizType = "circle";
var mappingQuery = [];

var compoundQuery = [];
var compoundOperation = [];

function updateActiveFilter() {
	signalPagePointer = 0;
	mappingPagePointer = 0;

	activeFilter = $('#filterInput').val();
	activeFilter = activeFilter+'';
	activeFilter = activeFilter.replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
	highlightedFilter = activeFilter;



	/*
		debug matching
	 */
	if (activeFilter.match(new RegExp("!\\w+(!\\w+|)*","ig")) == null) {
		debugQuery = [""];
	} else {
		debugQuery = activeFilter.match(new RegExp("!\\w+(!\\w+|)*","ig"));

		for (var i=0;i<debugQuery.length;i++) {
			highlightedFilter = highlightedFilter.replace(
					debugQuery[i],
					"<span class=\"red\">"+debugQuery[i]+"</span>");

			debugQuery[i] = debugQuery[i].match(new RegExp("\\w+","ig"));
		}
	}
	debugMode = 0;
	for (var i=0;i<debugQuery.length;i++) {
		if (debugQuery[i] == "debug") {
			debugMode = 1;	
		} else if (debugQuery[i] == "nodebug") {
			debugMode = 0;
		}
	}



	/*
		tag and namespace matching
	*/
	var matchingExp = new RegExp("(#|/|\\w|\\.)+","ig");
	compoundQuery[0] = activeFilter.match(matchingExp);
	if (compoundQuery[0] != null) {
		compoundQuery[1] = [];
		compoundQuery[2] = [];
		for (var i=0;i<compoundQuery[0].length;i++) {
			matchingExp = new RegExp("#\\w+","ig");
			compoundQuery[1].push(compoundQuery[0][i].match(matchingExp));	
			matchingExp = new RegExp("/\\w+\\.?\\w+","ig");
			compoundQuery[2].push(compoundQuery[0][i].match(matchingExp));	
		}
		for (var i=0;i<compoundQuery[1].length;i++) {
			if (compoundQuery[1][i] == null) {
				compoundQuery[1][i] = ["#"];
			}
		}
		for (var i=0;i<compoundQuery[2].length;i++) {
			if (compoundQuery[2][i] == null) {
				compoundQuery[2][i] = ["/"];
			}
		}
	} else {
		compoundQuery[0] = [""];
		compoundQuery[1] = [["#"]];
		compoundQuery[2] = [["/"]];
	}

/*
	// gather mappings that pertain to filtered signals
	filterMatches[2] = [];
	for (var i=0;i<filterMatches[0].length;i++) {
		p: for (var j=0;j<masterMappingIndex.length;j++) {
			if (masterMappingIndex[j].output[2].match(new RegExp(filterMatches[0][i],"ig")) == null) {
				continue p;
			}
			filterMatches[2].push(masterMappingIndex[j]);	
		}
	}
	for (var i=0;i<filterMatches[2].length;i++) {
		var isMatch = false;
		for (var j=0;j<filterMatches[1].length;j++) {
			if (filterMatches[2][i].input[2].match(new RegExp(filterMatches[1][j],"ig")) != null) {
				isMatch = true;
			}
		}
		if (!isMatch) {
			filterMatches[2][i] = 0;
		}
	}
	for (var i=0;i<filterMatches[2].length;i++) {
		if (filterMatches[2][i]) {
			tables[1].push(filterMatches[2][i]);
			hoverGlyphMap[2].push(false);
		}
	}
    */

	/*
		command highlighting
	 */
	//$('#filterText').html(highlightedFilter);
}

function updateHoverGlyphMap() {

    hoverGlyphMap = [[],[]]; // outputs,inputs

    if (outputVizTrace.length == 0) {
        for (var i=0;i<levels[0][0].length;i++) {
            hoverGlyphMap[0].push(false);
        }
    } else if (outputVizTrace.length == 1) {
        for (var i=0;i<levels[0][1][outputVizTrace[0]][0].length;i++) {
            hoverGlyphMap[0].push(false);
        }
    }

    if (inputVizTrace.length == 0) {
        for (var i=0;i<levels[1][0].length;i++) {
            hoverGlyphMap[1].push(false);
        }
    } else if (inputVizTrace.length == 1) {
        for (var i=0;i<levels[1][1][inputVizTrace[0]][0].length;i++) {
            hoverGlyphMap[1].push(false);
        }
    }

}

function updateSignalMatches() {
	filterMatches = [[],[],[]];
	tables = [[],[]];

	for (var i=0;i<masterNetworkIndex.length;i++) {
		o: for (var j=0;j<compoundQuery[0].length;j++) {
			//namespace
			for (var k=0;k<compoundQuery[2][j].length;k++) { 
				if (masterNetworkIndex[i][0].match(new RegExp(compoundQuery[2][j][k].slice(1),"ig")) == null) {
					continue o;
				}
			}

			if (masterNetworkIndex[i][5][1] == "output") {	
                filterMatches[0].push([masterNetworkIndex[i][5][0],masterNetworkIndex[i][0]]);
            } else if (masterNetworkIndex[i][5][1] == "input") {	
                filterMatches[1].push([masterNetworkIndex[i][5][0],masterNetworkIndex[i][0]]);
            }
			tables[0].push(masterNetworkIndex[i]);
		}
	}
}

var preLevels = [[],[]];
var filterMatches = [[],[],[]];
var preLevels = [[],[]];
var levels = [[[]],[[]]];
function updateLevelStructure() {
    levels = [[[]],[[]]];

	//inputs
	filterMatches[0].sort();
	for (var i=0;i<filterMatches[0].length;i++) {
        levels[0].push([filterMatches[0][i][0]]);  

		var splitArray = filterMatches[0][i][1].split("/");
		for (var j=1;j<splitArray.length;j++) {
            levels[0][levels[0].length-1].push(splitArray[j]);
		}
	}
	preLevels[0] = levels[0];
    levels[0] = levels[0].cluster(0);


	//outputs
	filterMatches[1].sort();
	for (var i=0;i<filterMatches[1].length;i++) {
        levels[1].push([filterMatches[1][i][0]]);

		var splitArray = filterMatches[1][i][1].split("/");
		for (var j=1;j<splitArray.length;j++) {
            levels[1][levels[1].length-1].push(splitArray[j]);
		}
	}
    levels[1] = levels[1];
    levels[1] = levels[1].cluster(0);
}

Array.prototype.cluster = function(depth) {
	var labels_1 = new Array();
    var clusters_1 = new Array();

    o: for (var i=0,n=this.length;i<n;i++) {
		for (var j=0,y=labels_1.length;j<y;j++) {
			if (labels_1[j]==this[i][depth]) {
                clusters_1[j].push(this[i]);
				continue o;
			}
        }

        if (this[i].length > depth) {
            labels_1[labels_1.length] = this[i][depth];
            clusters_1[clusters_1.length] = [this[i]];
        }
    }

    for (var i=0;i<clusters_1.length;i++) {
        clusters_1[i] = clusters_1[i].cluster(depth+1); 
        if (clusters_1[i][0].length==0) {
            clusters_1[i] = 0; 
        }
    }

    return [labels_1,clusters_1];
}

var liveJSONBase;
var masterLiveIndex = [];
var masterNetworkIndex = [];
var masterMappingIndex = [];
function indexLiveData(data) {
    if (data == null) {
        return;
    }

	liveJSONBase = data;
	masterLiveIndex = [];

	for (var i=0;i<data.length;i++) {
		if (data[i].direction == 0) {
			masterLiveIndex.push([
					data[i].name,
					data[i].type,
					"na",
					data[i].min,
					data[i].max,
					[data[i].device_name.toLowerCase(),"input"]
					]);
		} else {
			if (data[i].device_name == undefined) {
				globalP.println(data[i].name);
			}
			masterLiveIndex.push([
					data[i].name,
					data[i].type,
					"na",
					data[i].min,
					data[i].max,
					[data[i].device_name.toLowerCase(),"output"]
					]);
		}
	}

	masterNetworkIndex = masterLiveIndex;
}

/*
var jsonNetworkBase;
var masterNetworkIndex = [];
function indexNetworkData(data) {
	jsonNetworkBase = data;
	masterNetworkIndex = [];

	for (var i=0;i<data.length;i++) {
		for (var j=0;j<data[i].device.outputs.length;j++) {
			if (data[i].device.outputs[j].units == null) {
				data[i].device.outputs[j].units = "na";
			}
			masterNetworkIndex.push([
					data[i].device.outputs[j].name,
					data[i].device.outputs[j].type,
					data[i].device.outputs[j].units,
					data[i].device.outputs[j].minimum,
					data[i].device.outputs[j].maximum,
					[data[i].device.name.toLowerCase(),"output"]
					]);
		}
		for (var j=0;j<data[i].device.inputs.length;j++) {
			if (data[i].device.inputs[j].units == null) {
				data[i].device.inputs[j].units = "na";
			}
			masterNetworkIndex.push([
					data[i].device.inputs[j].name,
					data[i].device.inputs[j].type,
					data[i].device.inputs[j].units,
					data[i].device.inputs[j].minimum,
					data[i].device.inputs[j].maximum,
					[data[i].device.name.toLowerCase(),"input"]
					]);
		}
	}
}
var jsonMappingBase;
var masterMappingIndex = [];
var mappingProcessingIndex = [[],[],[]]; // outputs,inputs,connections
function indexMappingData(data) {
	jsonMappingBase = data;

	for (var i=0;i<data.mapping.sources.length;i++) {
		mappingProcessingIndex[0].push(data.mapping.sources[i]);
	}
	for (var i=0;i<data.mapping.destinations.length;i++) {
		mappingProcessingIndex[1].push(data.mapping.destinations[i]);
	}
	for (var i=0;i<data.mapping.connections.length;i++) {
		mappingProcessingIndex[2].push(data.mapping.connections[i]);
	}

	for (var i=0;i<mappingProcessingIndex[2].length;i++) {
		for (var j=0;j<mappingProcessingIndex[0].length;j++) {
			if (mappingProcessingIndex[2][i].expression.
					match(mappingProcessingIndex[0][j].id) != null) {
				mappingProcessingIndex[2][i].expression = 
					mappingProcessingIndex[2][i].expression.replace(mappingProcessingIndex[0][j].id,"output");
				mappingProcessingIndex[2][i].output = 
					[mappingProcessingIndex[0][j].id, 
					mappingProcessingIndex[0][j].device, 
					mappingProcessingIndex[0][j].signal];
				break;
			}
		}

		for (var j=0;j<mappingProcessingIndex[1].length;j++) {
			if (mappingProcessingIndex[2][i].expression.
					match(mappingProcessingIndex[1][j].id) != null) {
				mappingProcessingIndex[2][i].expression =
					mappingProcessingIndex[2][i].expression.replace(mappingProcessingIndex[1][j].id,"input");
				mappingProcessingIndex[2][i].input = 
					[mappingProcessingIndex[1][j].id, 
					mappingProcessingIndex[1][j].device, 
					mappingProcessingIndex[1][j].signal];
				break;
			}
		}
	}

	masterMappingIndex = mappingProcessingIndex[2];
}
*/



