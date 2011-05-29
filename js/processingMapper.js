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

var connectionGlyphMap = [];
var nodeGlyphMap = {outputs:new Assoc(),inputs:new Assoc()};

// output labels, input labels
var listGlyphMap = [[],[]];
var traversalGlyphMap = [[],[]];

var selectedOutput = "";
var selectedInput = "";

var selectedRemoveOutput = "";
var selectedRemoveInput = "";

var xs = [];
var ys = [];

var screenWidth = 1280;
var screenHeight = 800;

var centerX1 = 550;
var centerY1 = 45+(760/2);
var centerX2 = screenWidth-550;
var centerY2 = 45+(760/2);

var mouseX = globalP.mouseX;
var mouseY = globalP.mouseY;

var drawCounter = 0;

var outputBranchTrace = [];
var inputBranchTrace = [];
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
            //console.log("click");
            detectNodeClick();
            detectTraversalClick();
            //console.log("click done");
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

		//if (!drawCounter) {
            updateActiveFilter();
            updateSignalMatches();
            updateLevelStructure();
            //updateHoverGlyphMap();
            /*
			$.getJSON('/data/live.json', function(data) {
					indexLiveData(data);
					updateActiveFilter();
                    updateSignalMatches();
                    updateLevelStructure();
                    updateHoverGlyphMap();
					});
            */
		//}

		if ($('#graphTab').hasClass('active')) {
			$('html').toggleClass('graphColor',true);
			$('html').toggleClass('listColor',false);
			$('html').toggleClass('rawColor',false);
            $('#signalsFile').toggle(false);
            $('#mappingsFile').toggle(false);
           
            //console.log("draw");
                
			p.background(207);
            drawBackground();
            //console.log("draw background done");
            updateNodeGlyphMap();
            updateHoverState();

            drawNodes();
            drawEdges();
            //console.log("draw edges done");
            //console.log("update hover state done");
            drawListGlyphs();
            //console.log("update list glyphs done");
            drawTraversalGlyphs();
            //drawConnectionProcess();
            //drawMouseFeedback();

            //console.log("draw done");
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

function updateNodeGlyphMap() {
    nodeGlyphMap = {outputs:new Assoc(), inputs:new Assoc()};

    var outputSet = getCurrentOutputLevelSet();
    var inputSet = getCurrentInputLevelSet();

    var outputChildSet = getNumberOfChildNodesForOutputLevel();
    var inputChildSet = getNumberOfChildNodesForInputLevel();

    // outputs
    var centerX = 550;
    var centerY = 45+(760/2);

    var count = outputSet.length;

    var separationAngle;
    if (count > 1) {
        separationAngle = Math.PI/(count-1);
    } else {
        separationAngle = Math.PI/(count);
    }

    var layoutAngle;

    var layoutX;
    var layoutY;
    var symbolWidth;
    if (count <= 6) {
        symbolWidth = 700/6;
    } else {
        symbolWidth = (700*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count-1))) + (Math.PI/2) ));
    }
    var layoutRadius = (700/2)-(symbolWidth/2);

    for (var i=0;i<count;i++) {
        layoutAngle = (3*Math.PI/2) - i*separationAngle;

        layoutX = centerX + (layoutRadius*Math.cos(layoutAngle));
        layoutY = centerY + (layoutRadius*Math.sin(layoutAngle));

        //var count2 = outputChildSet[i].numGroups+outputChildSet[i].numSignals;
        var count2 = outputChildSet[i].length;

        var separationAngle2;
        if (count2 > 1) {
            separationAngle2 = Math.PI/(count2-1);
        } else {
            separationAngle2 = Math.PI/(count2);
        }

        var layoutAngle2;

        var layoutX2;
        var layoutY2;
        var symbolWidth2;
        if (count2 < 6) {
            symbolWidth2 = symbolWidth/6;
        } else {
            symbolWidth2 = (symbolWidth*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count2-1))) + (Math.PI/2) ));
        }
        var layoutRadius2 = (symbolWidth/2)-(symbolWidth2/2);

        //var subNodes = [];
        var subNodes = new Assoc();
        for (var j=0;j<count2;j++) {
            layoutAngle2 = (3*Math.PI/2) - j*separationAngle2;
            layoutX2 = layoutX + (layoutRadius2*Math.cos(layoutAngle2));
            layoutY2 = layoutY + (layoutRadius2*Math.sin(layoutAngle2));
            //subNodes.push({layoutX:layoutX2,layoutY:layoutY2,symbolWidth:symbolWidth2,isSignal:outputChildSet[i][j]});
            subNodes.add(outputChildSet[i][j].name,{layoutX:layoutX2,layoutY:layoutY2,symbolWidth:symbolWidth2,isSignal:outputChildSet[i][j].isSignal});
        }

        nodeGlyphMap.outputs.add(outputSet[i], {layoutX:layoutX,layoutY:layoutY,symbolWidth:symbolWidth,mouseOver:false,numSignals:outputChildSet[i].numSignals,numGroups:outputChildSet[i].numGroups,subNodes:subNodes});
    }

    // inputs
    centerX = screenWidth-550;

    count = inputSet.length;

    if (count > 1) {
        separationAngle = Math.PI/(count-1);
    } else {
        separationAngle = Math.PI/(count);
    }

    if (count <= 6) {
        symbolWidth = 700/6;
    } else {
        symbolWidth = (700*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count-1))) + (Math.PI/2) ));
    }
    layoutRadius = (700/2)-(symbolWidth/2);

    for (var i=0;i<count;i++) {
        layoutAngle = i*separationAngle + (3*Math.PI/2);

        layoutX = centerX + (layoutRadius*Math.cos(layoutAngle));
        layoutY = centerY + (layoutRadius*Math.sin(layoutAngle));

        //var count2 = inputChildSet[i].numGroups+inputChildSet[i].numSignals;
        var count2 = inputChildSet[i].length;

        var separationAngle2;
        if (count2 > 1) {
            separationAngle2 = Math.PI/(count2-1);
        } else {
            separationAngle2 = Math.PI/(count2);
        }

        var layoutAngle2;

        var layoutX2;
        var layoutY2;
        var symbolWidth2;
        if (count2 <= 6) {
            symbolWidth2 = symbolWidth/6;
        } else {
            symbolWidth2 = (symbolWidth*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count2-1))) + (Math.PI/2) ));
        }
        var layoutRadius2 = (symbolWidth/2)-(symbolWidth2/2);

        //var subNodes = [];
        var subNodes = new Assoc();
        for (var j=0;j<count2;j++) {
            layoutAngle2 = j*separationAngle2 + (3*Math.PI/2);
            layoutX2 = layoutX + (layoutRadius2*Math.cos(layoutAngle2));
            layoutY2 = layoutY + (layoutRadius2*Math.sin(layoutAngle2));
            //subNodes.push({layoutX:layoutX2,layoutY:layoutY2,symbolWidth:symbolWidth2,isSignal:inputChildSet[i][j]});
            subNodes.add(inputChildSet[i][j].name,{layoutX:layoutX2,layoutY:layoutY2,symbolWidth:symbolWidth2,isSignal:inputChildSet[i][j].isSignal});
        }

        nodeGlyphMap.inputs.add(inputSet[i], {layoutX:layoutX,layoutY:layoutY,symbolWidth:symbolWidth,mouseOver:false,numSignals:inputChildSet[i].numSignals,numGroups:inputChildSet[i].numGroups,subNodes:subNodes});
    }

}

function updateHoverState() {
    // hover detection of source nodes and destination nodes 
    if ($('#graphTab').hasClass('active')) {
        var thisX = 0; // input,level,container,drawingNumbers,thisX
        var thisY = 0;
        var thisRadius = 0;

        var keys = nodeGlyphMap.outputs.keys();
        for (var i=0;i<keys.length;i++) {
            thisX = nodeGlyphMap.outputs.get(keys[i]).layoutX;
            thisY = nodeGlyphMap.outputs.get(keys[i]).layoutY;
            thisRadius = nodeGlyphMap.outputs.get(keys[i]).symbolWidth/2;

            // is the mouse within the bounds of the node glyph?
            if (Math.pow(mouseX-thisX,2)+Math.pow(mouseY-thisY,2) < Math.pow(thisRadius,2)) {
                nodeGlyphMap.outputs.get(keys[i]).mouseOver = true;
            } else {
                nodeGlyphMap.outputs.get(keys[i]).mouseOver = false;
            }
        }
        keys = nodeGlyphMap.inputs.keys();
        for (var i=0;i<keys.length;i++) {
            thisX = nodeGlyphMap.inputs.get(keys[i]).layoutX;
            thisY = nodeGlyphMap.inputs.get(keys[i]).layoutY;
            thisRadius = nodeGlyphMap.inputs.get(keys[i]).symbolWidth/2;

            // is the mouse within the bounds of the node glyph?
            if (Math.pow(mouseX-thisX,2)+Math.pow(mouseY-thisY,2) < Math.pow(thisRadius,2)) {
                nodeGlyphMap.inputs.get(keys[i]).mouseOver = true;
            } else {
                nodeGlyphMap.inputs.get(keys[i]).mouseOver = false;
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

    // output mouseover feedback
    var keys = nodeGlyphMap.outputs.keys();
    for (var i=0;i<keys.length;i++) {
        thisString = keys[i];

        if (nodeGlyphMap.outputs.get(thisString).mouseOver) {
            globalP.noStroke();
            globalP.fill(0);
            globalP.ellipse(thisX,thisY,thisWidth,thisHeight);
            globalP.fill(255);
            globalP.textSize(16);
            globalP.textAlign(globalP.LEFT);

            globalP.text(thisString,textX+20,textY+34);
        }
    }

    // input mouseover feedback
    var keys = nodeGlyphMap.inputs.keys();
    for (var i=0;i<keys.length;i++) {
        thisString = keys[i];

        if (nodeGlyphMap.inputs.get(thisString).mouseOver) {
            globalP.noStroke();
            globalP.fill(0);
            globalP.ellipse(thisX,thisY,thisWidth,thisHeight);
            globalP.fill(255);
            globalP.textSize(16);
            globalP.textAlign(globalP.LEFT);

            globalP.text(thisString,textX+20,textY+34);
        }
    }

}

/*
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
*/

function detectNodeClick() {
    var thisX = 0;
    var thisY = 0;
    var thisRadius = 0;

    var keys = nodeGlyphMap.outputs.keys();
    for (var i=0;i<keys.length;i++) {
        thisX = nodeGlyphMap.outputs.get(keys[i]).layoutX;
        thisY = nodeGlyphMap.outputs.get(keys[i]).layoutY;
        thisRadius = nodeGlyphMap.outputs.get(keys[i]).symbolWidth/2;
        if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
                mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
            descendOutputTree(keys[i]);
        }
    }

    var keys = nodeGlyphMap.inputs.keys();
    for (var i=0;i<keys.length;i++) {
        thisX = nodeGlyphMap.inputs.get(keys[i]).layoutX;
        thisY = nodeGlyphMap.inputs.get(keys[i]).layoutY;
        thisRadius = nodeGlyphMap.inputs.get(keys[i]).symbolWidth/2;
        if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
                mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
            descendInputTree(keys[i]);
        }
    }
    /*
    for (var i=0;i<nodeGlyphMap[1].length;i++) {
        thisX = nodeGlyphMap[1][i][0][0];
        thisY = nodeGlyphMap[1][i][0][1];
        thisRadius = nodeGlyphMap[1][i][0][2]/2;
        if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
                mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
            descendInputTree(i);
            //updateHoverGlyphMap();
        }
    }
    */
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
            //updateHoverGlyphMap();
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
            //updateHoverGlyphMap();
        }
    }
}

function isOutputLeafNode(index) {
    var outputPointer = levels[0][1];   
    for (var i=0;i<outputBranchTrace.length;i++) {
        outputPointer = outputPointer[outputBranchTrace[i]][1];
    }
    if (outputPointer[index] == 0) {
        return true;
    } else {
        return false;
    }
}
function getNumberOfChildNodesForOutputLevel() {
    var numbers = [];
    var outputPointer = levels[0][1];
    var outputPaths = getCurrentOutputPaths();

    for (var i=0;i<outputBranchTrace.length;i++) {
        if (outputPointer.length == 0) {
            outputPointer = [];
            break;
        }
        outputPointer = outputPointer[outputBranchTrace[i]][1];
    }
    var isSignal = [];
    for (var i=0;i<outputPointer.length;i++) {
        if (outputPointer[i] != 0) {
            for (var j=0;j<outputPointer[i][1].length;j++) {
                if (outputPointer[i][1][j] == 0) {
                    isSignal.push({name:outputPaths[i]+"/"+outputPointer[i][0][j],isSignal:1});
                    //isSignal.push(1);
                } else {
                    isSignal.push({name:outputPaths[i]+"/"+outputPointer[i][0][j],isSignal:0});
                    //isSignal.push(0);
                }
            }
        }
        numbers.push(isSignal.slice());
        isSignal = [];
    }
    return numbers;
}
function getCurrentOutputLevelSet() {
    var outputSet = levels[0][0];
    var outputPointer = levels[0][1];

    for (var i=0;i<outputBranchTrace.length;i++) {
        if (outputPointer.length == 0) {
            outputSet = [];
            break;
        }
        outputSet = outputPointer[outputBranchTrace[i]][0]; 
        outputPointer = outputPointer[outputBranchTrace[i]][1];
    }

    outputSet = outputSet.slice();

    return outputSet;
}
function getCurrentOutputPaths() {
    var outputSet = getCurrentOutputLevelSet();
    var prefixString = "";

    for (var i=1;i<outputLabelTrace.length;i++) {
        if (outputLabelTrace[i][0] == "/") {
            prefixString = outputLabelTrace[i];
        } else {
            prefixString += "/"+outputLabelTrace[i];
        }
    }

    for (var i=0;i<outputSet.length;i++) {
        if (outputSet[i][0] != "/") {
            outputSet[i] = prefixString+"/"+outputSet[i];
        }
    }

    return outputSet;
}
function descendOutputTree(key) {
    var keyPointer = levels[0][0];
    var outputPointer = levels[0][1];
    for (var i=0;i<outputBranchTrace.length;i++) {
        keyPointer = outputPointer[outputBranchTrace[i]][0];
        outputPointer = outputPointer[outputBranchTrace[i]][1];
    }

    var index = 0; 
    for (var i=0;i<keyPointer.length;i++) {
        if (key == keyPointer[i]) {
            index = i;
        }
    }
    if (outputPointer[index] == 0) {
        return;
    } else {
        outputBranchTrace.push(index); 
        //outputLabelTrace.push(nodeGlyphMap[0][index][1]);
        outputLabelTrace.push(key);
    }
}
function climbOutputTree(level) {
    if (level == 0) {
        outputBranchTrace = [];
        outputLabelTrace = ["output signals"];
    } else {
        outputBranchTrace = outputBranchTrace.slice(0,level);   
        outputLabelTrace = outputLabelTrace.slice(0,level+1);
    }
}
function isInputLeafNode(index) {
    var inputPointer = levels[1][1];   
    for (var i=0;i<inputBranchTrace.length;i++) {
        inputPointer = inputPointer[inputBranchTrace[i]][1];
    }
    if (inputPointer[index] == 0) {
        return true;
    } else {
        return false;
    }
}
function getNumberOfChildNodesForInputLevel() {
    var numbers = [];
    var inputPointer = levels[1][1];
    var inputPaths = getCurrentInputPaths();

    for (var i=0;i<inputBranchTrace.length;i++) {
        if (inputPointer.length == 0) {
            inputPointer = [];
            break;
        }
        inputPointer = inputPointer[inputBranchTrace[i]][1];
    }
    var isSignal = [];
    for (var i=0;i<inputPointer.length;i++) {
        if (inputPointer[i] != 0) {
            for (var j=0;j<inputPointer[i][1].length;j++) {
                if (inputPointer[i][1][j] == 0) {
                    isSignal.push({name:inputPaths[i]+"/"+inputPointer[i][0][j],isSignal:1});
                    //isSignal.push(1);
                } else {
                    isSignal.push({name:inputPaths[i]+"/"+inputPointer[i][0][j],isSignal:0});
                    //isSignal.push(0);
                }
            }
        }
        numbers.push(isSignal.slice());
        isSignal = [];
    }
    return numbers;
}
function getCurrentInputLevelSet() {
    var inputSet = levels[1][0];
    var inputPointer = levels[1][1];
    for (var i=0;i<inputBranchTrace.length;i++) {
        if (inputPointer.length == 0) {
            inputSet = [];
            break;
        }
        inputSet = inputPointer[inputBranchTrace[i]][0]; 
        inputPointer = inputPointer[inputBranchTrace[i]][1];
    }
    inputSet = inputSet.slice();
    return inputSet;
}
function getCurrentInputPaths() {
    var inputSet = getCurrentInputLevelSet();
    var prefixString = "";

    for (var i=1;i<inputLabelTrace.length;i++) {
        if (inputLabelTrace[i][0] == "/") {
            prefixString = inputLabelTrace[i];
        } else {
            prefixString += "/"+inputLabelTrace[i];
        }
    }

    for (var i=0;i<inputSet.length;i++) {
        if (inputSet[i][0] != "/") {
            inputSet[i] = prefixString+"/"+inputSet[i];
        }
    }

    return inputSet;
}
function descendInputTree(key) {
    var keyPointer = levels[1][0];
    var inputPointer = levels[1][1];
    for (var i=0;i<inputBranchTrace.length;i++) {
        keyPointer = inputPointer[inputBranchTrace[i]][0];
        inputPointer = inputPointer[inputBranchTrace[i]][1];
    }

    var index = 0;
    for (var i=0;i<keyPointer.length;i++) {
        if (key == keyPointer[i]) {
            index = i;
        }
    }
    if (inputPointer[index] == 0) {
        return;
    } else {
        inputBranchTrace.push(index); 
        inputLabelTrace.push(key);
    }
}
function climbInputTree(level) {
    if (level == 0) {
        inputBranchTrace = [];
        inputLabelTrace = ["input signals"];
    } else {
        inputBranchTrace = inputBranchTrace.slice(0,level);   
        inputLabelTrace = inputLabelTrace.slice(0,level+1);
    }
}

function drawBackground() {
    var backgroundWidth = 700;

    globalP.strokeWeight(1);
    globalP.stroke(0,255,0);
    globalP.noFill();
    globalP.arc(centerX1,centerY1,backgroundWidth,backgroundWidth,Math.PI/2,3*Math.PI/2);

    globalP.strokeWeight(1);
    globalP.stroke(255,255,0);
    globalP.noFill();
    globalP.arc(centerX2,centerY2,backgroundWidth,backgroundWidth,0,Math.PI/2);
    globalP.arc(centerX2,centerY2,backgroundWidth,backgroundWidth,3*Math.PI/2,2*Math.PI);
}

function drawListGlyphs() {
    var outputSet = getCurrentOutputLevelSet();
    var inputSet = getCurrentInputLevelSet();

    globalP.textAlign(globalP.LEFT);
    globalP.textSize(12);
    globalP.noStroke();
    for (var i=0;i<outputSet.length;i++) {
        globalP.fill(0,200,130,230);
        /*
        if (hoverGlyphMap[0][i]) {
            globalP.rect(0,150+(i*32),200,28);
        }
        */
        if (nodeGlyphMap.outputs.get(outputSet[i]).mouseOver) {
            globalP.rect(0,150+(i*32),200,28);
        }
        globalP.fill(0);
        globalP.text(outputSet[i],10,170+(i*32));
    }
    for (var i=0;i<inputSet.length;i++) {
        globalP.fill(180,180,100,230);
        /*
        if (hoverGlyphMap[1][i]) {
            globalP.rect(screenWidth-200,150+(i*32),200,28);
        }
        */
        if (nodeGlyphMap.inputs.get(inputSet[i]).mouseOver) {
            globalP.rect(screenWidth-200,150+(i*32),200,28);
        }
        globalP.fill(0);
        globalP.text(inputSet[i],screenWidth+10-200,170+(i*32));
    }
}

function drawTraversalGlyphs() {
    traversalGlyphMap = [[],[]];

    globalP.textAlign(globalP.LEFT);
    globalP.textSize(16);
    globalP.noStroke();
    for (var i=0;i<outputLabelTrace.length;i++) {
        globalP.fill(0,230,0,210);
        globalP.rect(centerX1+80-200,centerY1-120+(i*32),200,28);
        globalP.fill(0);
        globalP.text(outputLabelTrace[i],centerX1+90-200,centerY1-100+(i*32));
        traversalGlyphMap[0].push([[centerX1+80-200,centerY1-120+(i*32),200,28],
            outputLabelTrace[i]]);
    }

    for (var i=0;i<inputLabelTrace.length;i++) {
        globalP.fill(230,230,0,210);
        globalP.rect(centerX2-80,centerY2-120+(i*32),200,28);
        globalP.fill(0);
        globalP.text(inputLabelTrace[i],centerX2-70,centerY2-100+(i*32));
        traversalGlyphMap[1].push([[centerX2-80,centerY2-120+(i*32),200,28],
            inputLabelTrace[i]]);
    }
}

function drawNodes() {
    var keys = nodeGlyphMap.outputs.keys();
    var thisX;
    var thisY;
    var thisWidth;
    var numSignals;
    var numGroups;
    var subNodes;
    for (var i=0;i<nodeGlyphMap.outputs.length();i++) {
        thisX = nodeGlyphMap.outputs.get(keys[i]).layoutX; 
        thisY = nodeGlyphMap.outputs.get(keys[i]).layoutY; 
        thisWidth = nodeGlyphMap.outputs.get(keys[i]).symbolWidth; 

        if (isOutputLeafNode(i)) {
            globalP.noStroke();
            globalP.fill(0,200,0);
        } else {
            globalP.strokeWeight(5);
            globalP.stroke(0,200,0);
            globalP.noFill();
        }
        if (nodeGlyphMap.outputs.get(keys[i]).mouseOver) {
            globalP.fill(0,200,130,230);
        }
        globalP.ellipse(thisX,thisY,thisWidth,thisWidth);

        subNodes = nodeGlyphMap.outputs.get(keys[i]).subNodes.keys();
        for (var j=0;j<subNodes.length;j++) {
            if (nodeGlyphMap.outputs.get(keys[i]).subNodes.get(subNodes[j]).isSignal) {
                globalP.noStroke();
                globalP.fill(0,150,0);
            } else {
                globalP.strokeWeight(3);
                globalP.stroke(0,150,0);
                globalP.noFill();
            }
            globalP.ellipse(nodeGlyphMap.outputs.get(keys[i]).subNodes.get(subNodes[j]).layoutX,
                    nodeGlyphMap.outputs.get(keys[i]).subNodes.get(subNodes[j]).layoutY,
                    nodeGlyphMap.outputs.get(keys[i]).subNodes.get(subNodes[j]).symbolWidth,
                    nodeGlyphMap.outputs.get(keys[i]).subNodes.get(subNodes[j]).symbolWidth);
        }
    }
    keys = nodeGlyphMap.inputs.keys();
    for (var i=0;i<nodeGlyphMap.inputs.length();i++) {
        thisX = nodeGlyphMap.inputs.get(keys[i]).layoutX; 
        thisY = nodeGlyphMap.inputs.get(keys[i]).layoutY; 
        thisWidth = nodeGlyphMap.inputs.get(keys[i]).symbolWidth; 

        if (isInputLeafNode(i)) {
            globalP.noStroke();
            globalP.fill(200,200,0);
        } else {
            globalP.strokeWeight(5);
            globalP.stroke(200,200,0);
            globalP.noFill();
        }
        if (nodeGlyphMap.inputs.get(keys[i]).mouseOver) {
            globalP.fill(180,180,100,230);
        }
        globalP.ellipse(thisX,thisY,thisWidth,thisWidth);

        subNodes = nodeGlyphMap.inputs.get(keys[i]).subNodes.keys();
        for (var j=0;j<subNodes.length;j++) {
            if (subNodes[j].isSignal) {
                globalP.noStroke();
                globalP.fill(150,150,0);
            } else {
                globalP.strokeWeight(3);
                globalP.stroke(150,150,0);
                globalP.noFill();
            }
            globalP.ellipse(nodeGlyphMap.inputs.get(keys[i]).subNodes.get(subNodes[j]).layoutX,
                    nodeGlyphMap.inputs.get(keys[i]).subNodes.get(subNodes[j]).layoutY,
                    nodeGlyphMap.inputs.get(keys[i]).subNodes.get(subNodes[j]).symbolWidth,
                    nodeGlyphMap.inputs.get(keys[i]).subNodes.get(subNodes[j]).symbolWidth);
            //globalP.ellipse(subNodes[j].layoutX,subNodes[j].layoutY,subNodes[j].symbolWidth,subNodes[j].symbolWidth);
        }
    }
    /*
    nodeGlyphMap = {outputs:new Assoc(), inputs:new Assoc()};

    var outputSet = getCurrentOutputLevelSet();
    var inputSet = getCurrentInputLevelSet();

    var outputChildSet = getNumberOfChildNodesForOutputLevel();
    var inputChildSet = getNumberOfChildNodesForInputLevel();

    // outputs
    var layoutAngle;
    var layoutX;
    var layoutY;
    var separationAngle;
    var symbolWidth;
    var centerX = 550;
    var centerY = 45+(760/2);

    var count = outputSet.length;
    if (count > 1) {
        separationAngle = Math.PI/(count-1);
    } else {
        separationAngle = Math.PI/(count);
    }
    if (count <= 6) {
        //symbolWidth = (300*3.1)/6;
        symbolWidth = 700/6;
    } else {
        //symbolWidth = (300*3.1)/count;
        symbolWidth = (700*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count-1))) + (Math.PI/2) ));
    }
    var layoutRadius = (700/2)-(symbolWidth/2);

    for (var i=0;i<count;i++) {
        layoutAngle = (3*Math.PI/2) - i*separationAngle;
        layoutX = centerX + (layoutRadius*Math.cos(layoutAngle));
        layoutY = centerY + (layoutRadius*Math.sin(layoutAngle));

        globalP.noStroke();
        if (isOutputLeafNode(i)) {
            globalP.fill(0);
            globalP.ellipse(layoutX,layoutY,symbolWidth-40,symbolWidth-40);
        } else {
            globalP.fill(0,255,0);
            globalP.ellipse(layoutX,layoutY,symbolWidth,symbolWidth);
        }

        var layoutAngle2;
        var layoutX2;
        var layoutY2;
        var separationAngle2;
        var symbolWidth2;
        var count2 = outputChildSet[i].numGroups+outputChildSet[i].numSignals;
        if (count2 > 1) {
            separationAngle2 = Math.PI/(count2-1);
        } else {
            separationAngle2 = Math.PI/(count2);
        }

        if (count2 <= 6) {
            //var symbolWidth2 = ((symbolWidth/2-30)*3.1)/count2;
            symbolWidth2 = symbolWidth/6;
        } else {
            //var symbolWidth2 = ((symbolWidth/2-20)*3.1)/count2;
            symbolWidth2 = (symbolWidth*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count2-1))) + (Math.PI/2) ));
        }

        var layoutRadius2 = (symbolWidth/2)-(symbolWidth2/2);
        globalP.fill(0);

        for (var j=0;j<count2;j++) {
            layoutAngle2 = (3*Math.PI/2) - j*separationAngle2;
            layoutX2 = layoutX + (layoutRadius2*Math.cos(layoutAngle2));
            layoutY2 = layoutY + (layoutRadius2*Math.sin(layoutAngle2));

            globalP.ellipse(layoutX2,layoutY2,symbolWidth2,symbolWidth2);
        }

        nodeGlyphMap.outputs.add(outputSet[i], {layoutX:layoutX,layoutY:layoutY,symbolWidth:symbolWidth,mouseOver:false});
    }

    // inputs
    centerX = screenWidth-550;
    count = inputSet.length;
    if (count > 1) {
        separationAngle = Math.PI/(count-1);
    } else {
        separationAngle = Math.PI/(count);
    }
    if (count <= 6) {
        //var symbolWidth = ((700/2)*2.7)/count;
        symbolWidth = 700/6;
    } else {
        //var symbolWidth = ((700/2)*2.7)/count;
        symbolWidth = (700*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count-1))) + (Math.PI/2) ));
    }
    layoutRadius = (700/2)-(symbolWidth/2);

    for (var i=0;i<count;i++) {
        layoutAngle = i*separationAngle + (3*Math.PI/2);
        layoutX = centerX + (layoutRadius*Math.cos(layoutAngle));
        layoutY = centerY + (layoutRadius*Math.sin(layoutAngle));

        globalP.noStroke();
        if (isInputLeafNode(i)) {
            globalP.fill(0);
        } else {
            globalP.fill(255,255,0);
        }
        globalP.ellipse(layoutX,layoutY,symbolWidth,symbolWidth);

        var layoutAngle2;
        var layoutX2;
        var layoutY2;
        var separationAngle2;
        var symbolWidth2;
        var count2 = inputChildSet[i].numGroups+inputChildSet[i].numSignals;
        if (count2 > 1) {
            separationAngle2 = Math.PI/(count2-1);
        } else {
            separationAngle2 = Math.PI/(count2);
        }
        if (count2 <= 6) {
            symbolWidth2 = symbolWidth/6;
            //symbolWidth2 = (symbolWidth*Math.PI)/(2 * (count2-1+(Math.PI/2))) - 20;
        } else {
            //symbolWidth2 = (symbolWidth*Math.PI)/(2 * (count2-1+(Math.PI/2))) - 6;
            symbolWidth2 = (symbolWidth*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count2-1))) + (Math.PI/2) ));
        }
        var layoutRadius2 = (symbolWidth/2)-(symbolWidth2/2);
        globalP.fill(0);

        for (var j=0;j<count2;j++) {
            layoutAngle2 = j*separationAngle2 + (3*Math.PI/2);
            layoutX2 = layoutX + (layoutRadius2*Math.cos(layoutAngle2));
            layoutY2 = layoutY + (layoutRadius2*Math.sin(layoutAngle2));

            globalP.ellipse(layoutX2,layoutY2,symbolWidth2,symbolWidth2);
        }

        nodeGlyphMap.inputs.add(inputSet[i], {layoutX:layoutX,layoutY:layoutY,symbolWidth:symbolWidth,mouseOver:false});
    }
    */

}

function drawEdges() {

    connectionGlyphMap = [];

    var outputSet = getCurrentOutputPaths();
    var inputSet = getCurrentInputPaths();

    var outputChildren = getNumberOfChildNodesForOutputLevel();
    var inputChildren = getNumberOfChildNodesForInputLevel();
    var outputLevel = getCurrentOutputLevelSet();
    var inputLevel = getCurrentInputLevelSet();

    var connectionOutputMatches = [];
    var connectionInputMatches = [];
    var connectionKeys = connections.keys();

    var keyPairs = new Assoc();

    for (var i=0;i<connectionKeys.length;i++) {
        for (var j=0;j<outputSet.length;j++) {
            var exp1 = new RegExp(outputSet[j]+">");
            var exp2 = new RegExp(outputSet[j]+".*>");
            if (connectionKeys[i].match(exp1)) {
                connectionOutputMatches.push(connectionKeys[i]); 
                keyPairs.add(connectionKeys[i], {output:outputLevel[j],isOutputSubnode:false});
            } else if (connectionKeys[i].match(exp2)) {
                connectionOutputMatches.push(connectionKeys[i]); 
                for (var k=0;k<outputChildren[j].length;k++) {
                    var exp3 = new RegExp(outputChildren[j][k].name+".*>");
                    if (connectionKeys[i].match(exp3)) {
                        keyPairs.add(connectionKeys[i], {output:outputLevel[j],outputChild:outputChildren[j][k].name,isOutputSubnode:true});
                    }
                }
            }
        }
    }
    for (var i=0;i<connectionOutputMatches.length;i++) {
        for (var j=0;j<inputSet.length;j++) {
            var exp1 = new RegExp(">"+inputSet[j]+".+");
            var exp2 = new RegExp(">"+inputSet[j]+".*");
            if (connectionOutputMatches[i].match(exp1)) {
                connectionInputMatches.push(connectionKeys[i]); 
                for (var k=0;k<inputChildren[j].length;k++) {
                    var exp3 = new RegExp(">"+inputChildren[j][k].name+".*");
                    if (connectionOutputMatches[i].match(exp3)) {
                        keyPairs.get(connectionOutputMatches[i]).input = inputLevel[j];
                        keyPairs.get(connectionOutputMatches[i]).inputChild = inputChildren[j][k].name;
                        keyPairs.get(connectionOutputMatches[i]).isInputSubnode = true;
                    }
                }
            } else if (connectionOutputMatches[i].match(exp2)) {
                connectionInputMatches.push(connectionOutputMatches[i]); 
                keyPairs.get(connectionOutputMatches[i]).input = inputLevel[j];
                keyPairs.get(connectionOutputMatches[i]).isInputSubnode = false;
            }
        }
    }

    var keys = keyPairs.keys();
    var x1, y1, x2, y2;
    var cx1, cy1, cx2, cy2;
    globalP.strokeWeight(3);
    globalP.stroke(0);
    globalP.noFill();
    for (var i=0;i<keys.length;i++) {
        if (keyPairs.get(keys[i]).input != undefined) {
            if (keyPairs.get(keys[i]).isOutputSubnode) {
                x1 = nodeGlyphMap.outputs.get(keyPairs.get(keys[i]).output).subNodes.get(keyPairs.get(keys[i]).outputChild).layoutX;
                y1 = nodeGlyphMap.outputs.get(keyPairs.get(keys[i]).output).subNodes.get(keyPairs.get(keys[i]).outputChild).layoutY;
            } else {
                x1 = nodeGlyphMap.outputs.get(keyPairs.get(keys[i]).output).layoutX;
                y1 = nodeGlyphMap.outputs.get(keyPairs.get(keys[i]).output).layoutY;
            }
            if (keyPairs.get(keys[i]).isInputSubnode) {
                x2 = nodeGlyphMap.inputs.get(keyPairs.get(keys[i]).input).subNodes.get(keyPairs.get(keys[i]).inputChild).layoutX;
                y2 = nodeGlyphMap.inputs.get(keyPairs.get(keys[i]).input).subNodes.get(keyPairs.get(keys[i]).inputChild).layoutY;
            } else {
                x2 = nodeGlyphMap.inputs.get(keyPairs.get(keys[i]).input).layoutX;
                y2 = nodeGlyphMap.inputs.get(keyPairs.get(keys[i]).input).layoutY;
            }

            if (y1 < centerY1) {
                if (y2 < centerY2) {
                    cx1 = x1+50;
                    cy1 = y1+80;
                    cx2 = x2-50;
                    cy2 = y2+80;
                } else {
                    cx1 = x1+50;
                    cy1 = y1-80;
                    cx2 = x2-50;
                    cy2 = y2+80;
                }
            } else {
                if (y2 < centerY2) {
                    cx1 = x1+50;
                    cy1 = y1+80;
                    cx2 = x2-50;
                    cy2 = y2-80;
                } else {
                    cx1 = x1+50;
                    cy1 = y1-80;
                    cx2 = x2-50;
                    cy2 = y2-80;
                }
            }
            globalP.bezier(x1,y1,cx1,cy1,cx2,cy2,x2,y2);
        }
    }

/*
    var keys = keyPairs.keys();
    globalP.stroke(0); 
    globalP.strokeWeight(4); 
    for (var i=0;i<keys.length;i++) {
        if (keyPairs.get(keys[i]).input != undefined) {
            globalP.line(nodeGlyphMap.outputs.get(keyPairs.get(keys[i]).output).layoutX,
                    nodeGlyphMap.outputs.get(keyPairs.get(keys[i]).output).layoutY,
                    nodeGlyphMap.inputs.get(keyPairs.get(keys[i]).input).layoutX,
                    nodeGlyphMap.inputs.get(keyPairs.get(keys[i]).input).layoutY);
        }
    }
    */

    return [connectionOutputMatches, connectionInputMatches, keyPairs];

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

devices = new Assoc();
signals = new Assoc();
links = new Assoc();
connections = new Assoc();

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
            signals.add(args[d].device_name+args[d].name, args[d]);
    });
    command.register("new_signal", function(cmd, args) {
        signals.add(args.device_name+args.name, args);
    });
    command.register("del_signal", function(cmd, args) {
        signals.remove(args.device_name+args.name);
    });

    command.register("all_links", function(cmd, args) {
        for (l in args)
            links.add(args[l].src_name+'>'+args[l].dest_name,
                      args[l]);
    });
    command.register("new_link", function(cmd, args) {
        links.add(args.src_name+'>'+args.dest_name, args);
    });
    command.register("del_link", function(cmd, args) {
        links.remove(args.src_name+'>'+args.dest_name);
    });

    command.register("all_connections", function(cmd, args) {
        for (d in args)
            connections.add(args[d].src_name+'>'+args[d].dest_name,
                            args[d]);
        //update_display();
        /*
        for (d in args)
            update_connection_properties_for(args[d],
                                             get_selected(connections));
            */
    });
    command.register("new_connection", function(cmd, args) {
        connections.add(args.src_name+'>'+args.dest_name, args);
        //update_connection_properties_for(args, get_selected(connections));
    });
    command.register("mod_connection", function(cmd, args) {
        connections.add(args.src_name+'>'+args.dest_name, args);
        //update_connection_properties_for(args, get_selected(connections));
    });
    command.register("del_connection", function(cmd, args) {
        //var conns = get_selected(connections);
        connections.remove(args.src_name+'>'+args.dest_name);
        //update_connection_properties_for(args, conns);
    });

	command.start();

    // Delay starting polling, because it results in a spinning wait
    // cursor in the browser.
    setTimeout(
        function(){
            command.send('all_devices');
            command.send('all_signals');
            command.send('all_links');
            command.send('all_connections');
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
     /*
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
    */



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
		for (varkkkki=0;i<compoundQuery[2].length;i++) {
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
		command highlighting
	 */
	//$('#filterText').html(highlightedFilter);
}

function updateSignalMatches() {
	filterMatches = [[],[],[]];
	tables = [[],[]];

    var keys = signals.keys();
    for (var i=0;i<keys.length;i++) {
		o: for (var j=0;j<compoundQuery[0].length;j++) {
               //namespace matching
               if (keys[i].match(new RegExp(compoundQuery[0][j].slice(1),"ig")) == null) {
                   continue o;
               }

               if (signals.get(keys[i]).direction  == 1) {	
                   filterMatches[0].push([signals.get(keys[i]).device_name,signals.get(keys[i]).name]);
               } else if (signals.get(keys[i]).direction == 0) {	
                   filterMatches[1].push([signals.get(keys[i]).device_name,signals.get(keys[i]).name]);
               }
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
    levels[0] = clusterSignals(levels[0], 0);


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
    levels[1] = clusterSignals(levels[1], 0);
}

function clusterSignals(list,depth) {
	var labels = new Array();
    var clusters = new Array();

    o: for (var i=0,n=list.length;i<n;i++) {
		for (var j=0,y=labels.length;j<y;j++) {
			if (labels[j]==list[i][depth]) {
                clusters[j].push(list[i]);
				continue o;
			}
        }

        if (list[i].length > depth) {
            labels[labels.length] = list[i][depth];
            clusters[clusters.length] = [list[i]];
        }
    }

    for (var i=0;i<clusters.length;i++) {
        clusters[i] = clusterSignals(clusters[i],depth+1); 
        if (clusters[i][0].length==0) {
            clusters[i] = 0; 
        }
    }

    return [labels,clusters];
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
