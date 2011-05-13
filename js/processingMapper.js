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

var executionFeedbackString = "";
var vizGlyphBoundaryMap = [[[],[],[]],[[],[],[]]]; // outputs(outer category,middle,inner),inputs(outer,middle,inner),connections
var activeGlyphMap = [[[],[],[]],[[],[],[]],[]]; // outputs(outer,middle,inner),inputs(outer,middle,inner),connections
var mappingVizMap = [[],[]]; // outputs, inputs

var selectedOutput = "";
var selectedInput = "";

var selectedRemoveOutput = "";
var selectedRemoveInput = "";

var xs = [];
var ys = [];

var screenSizeX = 1280;
var screenSizeY = 800;
var mouseX = globalP.mouseX;
var mouseY = globalP.mouseY;
var drawCounter = 0;

function globalP(p) {
	p.mouseMoved = function() {
		mouseX = p.mouseX;
		mouseY = p.mouseY;

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
							activeGlyphMap[2][i] = true;
							break;
						}
						if (j == xLength-1) {
							activeGlyphMap[2][i] = false;
						}
					}

				} else {
					activeGlyphMap[2][i] = false;
				}
				if (activeGlyphMap[2][i]) {
					for (var j=i+1;j<mappingVizMap[0].length;j++) {
						activeGlyphMap[2][j] = false;
					}
					break;
				}
			}
		}

		// hover detection of outputs and inputs
		// this is the dumb way of doing this
		if ($('#graphTab').hasClass('active')) {
			var thisX = 0; // input,level,container,drawingNumbers,thisX
			var thisY = 0;
			var thisRadius = 0;

			for (var i=0;i<vizGlyphBoundaryMap[0][0].length;i++) {
				thisX = vizGlyphBoundaryMap[0][0][i][0][0];
				thisY = vizGlyphBoundaryMap[0][0][i][0][1];
				thisRadius = vizGlyphBoundaryMap[0][0][i][0][2]/2;
				if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
						mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
					activeGlyphMap[0][0][i] = true;
				} else {
					activeGlyphMap[0][0][i] = false;
				}
			}
			for (var i=0;i<vizGlyphBoundaryMap[1][0].length;i++) {
				thisX = vizGlyphBoundaryMap[1][0][i][0][0];
				thisY = vizGlyphBoundaryMap[1][0][i][0][1];
				thisRadius = vizGlyphBoundaryMap[1][0][i][0][2]/2;
				if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
					mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
					activeGlyphMap[1][0][i] = true;
				} else {
					activeGlyphMap[1][0][i] = false;
				}
			}
			for (var i=0;i<vizGlyphBoundaryMap[0][1].length;i++) {
				thisX = vizGlyphBoundaryMap[0][1][i][0][0];
				thisY = vizGlyphBoundaryMap[0][1][i][0][1];
				thisRadius = vizGlyphBoundaryMap[0][1][i][0][2]/2;
				if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
						mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
					activeGlyphMap[0][1][i] = true;
				} else {
					activeGlyphMap[0][1][i] = false;
				}
			}
			for (var i=0;i<vizGlyphBoundaryMap[1][1].length;i++) {
				thisX = vizGlyphBoundaryMap[1][1][i][0][0];
				thisY = vizGlyphBoundaryMap[1][1][i][0][1];
				thisRadius = vizGlyphBoundaryMap[1][1][i][0][2]/2;
				if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
						mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
					activeGlyphMap[1][1][i] = true;
				} else {
					activeGlyphMap[1][1][i] = false;
				}
			}
			for (var i=0;i<vizGlyphBoundaryMap[0][2].length;i++) {
				thisX = vizGlyphBoundaryMap[0][2][i][0][0];
				thisY = vizGlyphBoundaryMap[0][2][i][0][1];
				thisRadius = vizGlyphBoundaryMap[0][2][i][0][2]/2;
				if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
						mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
					activeGlyphMap[0][2][i] = true;
				} else {
					activeGlyphMap[0][2][i] = false;
				}
			}
			for (var i=0;i<vizGlyphBoundaryMap[1][2].length;i++) {
				thisX = vizGlyphBoundaryMap[1][2][i][0][0];
				thisY = vizGlyphBoundaryMap[1][2][i][0][1];
				thisRadius = vizGlyphBoundaryMap[1][2][i][0][2]/2;
				if (mouseX<thisX+thisRadius && mouseX>thisX-thisRadius &&
						mouseY<thisY+thisRadius && mouseY>thisY-thisRadius) {
					activeGlyphMap[1][2][i] = true;
				} else {
					activeGlyphMap[1][2][i] = false;
				}
			}
		}
	};

	p.mouseClicked = function() {
        if ($('#graphTab').hasClass('active')) {
            // connection selection for removal
            for (var i=0;i<activeGlyphMap[2].length;i++) {
                if (activeGlyphMap[2][i]) {
                    selectedRemoveOutput = tables[1][i].output[2];
                    selectedRemoveInput = tables[1][i].input[2];
                    $('#removeConnectionForm').toggle(true);
                }
            }

			// output and input selection for mappings
			var clearSelection = true;
			var thisString = "";
			for (var i=0;i<activeGlyphMap[0][0].length;i++) {
				thisString = "";
				if (activeGlyphMap[0][0][i]) {
					for (var j=vizGlyphBoundaryMap[0][0][i][1].length-1;j>=0;j--) {
						thisString += "/"+vizGlyphBoundaryMap[0][0][i][1][j];
					}
					selectedOutput = thisString;
					clearSelection = false;
					break;
				}
			}

			selectedInput = "";
			for (var i=0;i<activeGlyphMap[1][0].length;i++) {
				thisString = "";
				if (activeGlyphMap[1][0][i]) {
					for (var j=vizGlyphBoundaryMap[1][0][i][1].length-1;j>=0;j--) {
						thisString += "/"+vizGlyphBoundaryMap[1][0][i][1][j];
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
	};

	p.setup = function() {
		//#x designates (universal tag x)
		//&x designates (unique tag x)
		//%x designates (procedure tag x)
		//#x<>#y directional link from (tag x) to (tag y)
		//#x><#y unlinks (tag x) from (tag y)
		//#x->#y tags (tag y) with (tag x) -- pushes tag through chain
		//#x<-#y untags (tag y) with (tag x) -- pushes tag through chain
		//-<#x pulls structure from (tag x)

		//p.println(p.PFont.list());

		p.size(screenSizeX,screenSizeY);
		var font = p.loadFont("monospace");
		p.textFont(font);
	};

	p.draw = function() {

		drawCounter++;
		drawCounter = drawCounter % 240;

		if (!drawCounter) {
			$.getJSON('/data/live.json', function(data) {
					indexLiveData(data);
					updateActiveFilter();
                    updateLayout();
					});
		}

		if ($('#graphTab').hasClass('active')) {
			$('html').toggleClass('graphColor',true);
			$('html').toggleClass('listColor',false);
			$('html').toggleClass('rawColor',false);
            $('#signalsFile').toggle(false);
            $('#mappingsFile').toggle(false);
			p.background(207);
            drawGraph();
            drawConnectionProcess();
            drawMouseFeedback();
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
	};
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
    updateLayout();
}
function removeConnection() {
    for (var j=0;j<masterMappingIndex.length;j++) {
        if (selectedRemoveOutput==masterMappingIndex[j].output[2] &&
                selectedRemoveInput==masterMappingIndex[j].input[2]) {
            masterMappingIndex.splice(j,1);	
        }
    }

    updateActiveFilter();
    updateLayout();
}



function drawMouseFeedback() {
    // mouse over connection glyph feedback
    var thisX = 0;
    var thisY = 0;
    var thisWidth = 500;
    var thisHeight = 75;
    thisX = mouseX+20;
    thisY = mouseY+20;
    if (thisX+thisWidth>screenSizeX) {
        thisX = mouseX-20-thisWidth;
    }
    if (thisY+thisHeight>screenSizeY) {
        thisY = mouseY-20-thisHeight;
    }

    for (var i=0;i<activeGlyphMap[2].length;i++) {
        if (activeGlyphMap[2][i]) {
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
    if (thisX+thisWidth>screenSizeX) {
        thisX = mouseX-20-thisWidth+(thisWidth/2);
        textX = mouseX-10-thisWidth;
    }
    if (thisY+thisHeight>screenSizeY) {
        thisY = mouseY-20-thisHeight+(thisHeight/2);
        textY = mouseY-20-thisHeight;
    }

    // output selection feedback
    for (var i=0;i<activeGlyphMap[0][0].length;i++) {
        thisString = "";
        for (var j=vizGlyphBoundaryMap[0][0][i][1].length-1;j>=0;j--) {
            thisString += "/"+vizGlyphBoundaryMap[0][0][i][1][j];
        }

        if (activeGlyphMap[0][0][i]) {
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
            globalP.ellipse(vizGlyphBoundaryMap[0][0][i][0][0],
                    vizGlyphBoundaryMap[0][0][i][0][1],
                    vizGlyphBoundaryMap[0][0][i][0][2],
                    vizGlyphBoundaryMap[0][0][i][0][2]
                    );
        }
    }

    // input selection feedback
    for (var i=0;i<activeGlyphMap[1][0].length;i++) {
        thisString = "";
        for (var j=vizGlyphBoundaryMap[1][0][i][1].length-1;j>=0;j--) {
            thisString += "/"+vizGlyphBoundaryMap[1][0][i][1][j];
        }

        if (activeGlyphMap[1][0][i]) {
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
            globalP.ellipse(vizGlyphBoundaryMap[1][0][i][0][0],
                    vizGlyphBoundaryMap[1][0][i][0][1],
                    vizGlyphBoundaryMap[1][0][i][0][2],
                    vizGlyphBoundaryMap[1][0][i][0][2]
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
    var cp2x = screenSizeX-450;
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
            for (var i=0;i<activeGlyphMap[0][0].length;i++) {
                thisString = "";
                for (var j=vizGlyphBoundaryMap[0][0][i][1].length-1;j>=0;j--) {
                    thisString += "/"+vizGlyphBoundaryMap[0][0][i][1][j];
                }
                if (thisString == selectedOutput) {
                    thisX = vizGlyphBoundaryMap[0][0][i][0][0];
                    thisY = vizGlyphBoundaryMap[0][0][i][0][1];
                    break;
                }
            }
            for (var i=0;i<activeGlyphMap[1][0].length;i++) {
                if (activeGlyphMap[1][0][i]) {
                    globalP.stroke(255,0,0);
                    globalP.strokeWeight(5);
                    globalP.noFill();
                    globalP.bezier(thisX,
                            thisY,
                            cp1x,cp1y,
                            cp2x,cp2y,
                            vizGlyphBoundaryMap[1][0][i][0][0],
                            vizGlyphBoundaryMap[1][0][i][0][1]);
                    globalP.noStroke();
                }
            }

        }
    }
}

function drawGraph() {
    vizGlyphBoundaryMap = [[[],[],[]],[[],[],[]]];

    // outputs then inputs
    for (var alpha=0;alpha<levels.length;alpha++) {
        if (levels[alpha].length == 0) {
            return;
        }

        var innerPointer1 = 0;
        var innerPointer0 = 0;

        var count2 = levels[alpha][5].length;
        if (count2 > 1) {
            var separationAngle2 = Math.PI/(count2-1);
        } else {
            var separationAngle2 = Math.PI/(count2);
        }
        if (alpha == 0) {
            var xCenter2 = 450;
        } else {
            var xCenter2 = screenSizeX-450;
        }
        if (count2 < 6) {
            var symbolWidth2 = (300*3.1)/6;
        } else {
            var symbolWidth2 = (300*3.1)/count2;
        }
        var layoutRadius2 = 280;
        var yCenter2 = 45+(760/2);

        globalP.noStroke();
        globalP.fill(200,255);
        globalP.ellipse(xCenter2,yCenter2,2*layoutRadius2,2*layoutRadius2);
        globalP.fill(0);
        if (alpha == 0) {
            globalP.textSize(18);
            globalP.textAlign(globalP.RIGHT);
            globalP.text("output signals",xCenter2,yCenter2);
        } else {
            globalP.textSize(18);
            globalP.textAlign(globalP.LEFT);
            globalP.text("input signals",xCenter2,yCenter2);
        }

        for (var i=0;i<count2;i++) {
            if (alpha == 0) {
                var layoutAngle2 = i*separationAngle2 + (Math.PI/2);
            } else {
                var layoutAngle2 = i*separationAngle2 + (3*Math.PI/2);
            }
            if (separationAngle2 == 2*Math.PI) {
                var layoutX2 = xCenter2;
                var layoutY2 = yCenter2;
            } else {
                var layoutX2 = xCenter2 + (layoutRadius2*Math.cos(layoutAngle2));
                var layoutY2 = yCenter2 + (layoutRadius2*Math.sin(layoutAngle2));
            }
            globalP.noStroke();
            if (activeGlyphMap[alpha][2][i]) {
                globalP.fill((2*16)+10,(8*16)+14,(2*16)+10);
            } else {
                globalP.fill(127,255);
            }
            if (vizDepth > 2) {
                globalP.ellipse(layoutX2,layoutY2,symbolWidth2,symbolWidth2);
            }
            vizGlyphBoundaryMap[alpha][2].push([[layoutX2,layoutY2,symbolWidth2],
                    levels[alpha][4][i]]);

            var count1 = levels[alpha][5][i];
            var separationAngle1 = 2*Math.PI/count1;
            if (count1 < 5) {
                var symbolWidth1 = (symbolWidth2*1.5)/5;
            } else {
                var symbolWidth1 = (symbolWidth2*1.5)/count1;
            }
            var layoutRadius1 = symbolWidth2/(3.1);
            var xCenter1 = layoutX2;
            var yCenter1 = layoutY2;
            for (var j=0;j<count1;j++) {
                var layoutAngle1 = j*separationAngle1 + (Math.PI/2);
                if (separationAngle1 == 2*Math.PI) {
                    var layoutX1 = xCenter1;
                    var layoutY1 = yCenter1;
                } else {
                    var layoutX1 = xCenter1 + (layoutRadius1*Math.cos(layoutAngle1));
                    var layoutY1 = yCenter1 + (layoutRadius1*Math.sin(layoutAngle1));
                }
                if (activeGlyphMap[alpha][1][innerPointer1+j]) {
                    globalP.fill((13*16)+11,(3*16)+3,(3*16)+3);
                } else {
                    globalP.fill(255,255);
                }
                if (vizDepth > 1) {
                    globalP.ellipse(layoutX1,layoutY1,symbolWidth1,symbolWidth1);
                }
                vizGlyphBoundaryMap[alpha][1].push([[layoutX1,layoutY1,symbolWidth1],
                        levels[alpha][2][innerPointer1+j]]);

                var count0 = levels[alpha][3][innerPointer1+j];
                var separationAngle0 = 2*Math.PI/count0;
                //var symbolWidth0 = 20;
                if (count0 < 5) {
                    var symbolWidth0 = (symbolWidth1*1.5)/5;
                } else {
                    var symbolWidth0 = (symbolWidth1*1.5)/count0;
                }
                //var layoutRadius0 = 18;
                var layoutRadius0 = symbolWidth1/(3.1);
                var xCenter0 = layoutX1;
                var yCenter0 = layoutY1;
                for (var k=0;k<count0;k++) {
                    var layoutAngle0 = k*separationAngle0 + (Math.PI/2);
                    if (separationAngle0 == 2*Math.PI) {
                        var layoutX0 = xCenter0;
                        var layoutY0 = yCenter0;
                    } else {
                        var layoutX0 = xCenter0 + (layoutRadius0*Math.cos(layoutAngle0));
                        var layoutY0 = yCenter0 + (layoutRadius0*Math.sin(layoutAngle0));
                    }
                    if (activeGlyphMap[alpha][0][innerPointer0+k]) {
                        globalP.fill((3*16)+3,(3*16)+3,(13*16)+11);
                    } else {
                        globalP.fill(0,255);
                    }
                    globalP.ellipse(layoutX0,layoutY0,symbolWidth0,symbolWidth0);
                    vizGlyphBoundaryMap[alpha][0].push([[layoutX0,layoutY0,symbolWidth0],
                            levels[alpha][0][innerPointer0+k]]);
                }

                innerPointer0 += count0;
            }

            innerPointer1 += count1;
        }
    }

    // draw mappings
    mappingVizMap = [[],[]];
    var cp1x = 450;
    var cp1y = 45+(760/2);
    var cp2x = screenSizeX-450;
    var cp2y = 45+(760/2);
    // gather coordinates
    for (var i=0;i<filterMatches[2].length;i++) {
        if (filterMatches[2][i] == 0) {
            continue;
        }	

        // starting point
        for (var j=0;j<vizGlyphBoundaryMap[0][0].length;j++) {
            var thisString = "";
            for (var k=vizGlyphBoundaryMap[0][0][j][1].length-1;k>=0;k--) {
                thisString += "/"+vizGlyphBoundaryMap[0][0][j][1][k];
            }
            if (thisString == filterMatches[2][i].output[2]) {
                mappingVizMap[0].push([thisString,
                        vizGlyphBoundaryMap[0][0][j][0][0],
                        vizGlyphBoundaryMap[0][0][j][0][1],
                        cp1x,cp1y]);
            }
        }
        // ending point
        for (var j=0;j<vizGlyphBoundaryMap[1][0].length;j++) {
            thisString = "";
            for (var k=vizGlyphBoundaryMap[1][0][j][1].length-1;k>=0;k--) {
                thisString += "/"+vizGlyphBoundaryMap[1][0][j][1][k];
            }
            if (thisString == filterMatches[2][i].input[2]) {
                mappingVizMap[1].push([thisString,
                        vizGlyphBoundaryMap[1][0][j][0][0],
                        vizGlyphBoundaryMap[1][0][j][0][1],
                        cp2x,cp2y]);
            }
        }
    }
    // paint bezier curves
    for (var i=0;i<mappingVizMap[0].length;i++) {
        if (activeGlyphMap[2][i]) {
            globalP.stroke(255,0,0);
        } else {
            globalP.stroke(0);
        }
        globalP.strokeWeight(5);
        globalP.noFill();
        globalP.bezier(mappingVizMap[0][i][1],
                mappingVizMap[0][i][2],
                cp1x,cp1y,
                cp2x,cp2y,
                mappingVizMap[1][i][1],
                mappingVizMap[1][i][2]);
        globalP.noStroke();

    }
    /*
       globalP.textAlign(globalP.LEFT);
       globalP.fill((3*16)+3,(3*16)+3,(13*16)+11);
       for (var i=0;i<activeGlyphMap[0][0].length;i++) {
       thisString = "";
       for (var j=vizGlyphBoundaryMap[0][0][i][1].length-1;j>=0;j--) {
       thisString += "/"+vizGlyphBoundaryMap[0][0][i][1][j];
       }
       if (activeGlyphMap[0][0][i]) {
       globalP.text(thisString,10,100);
       }
       if (thisString == selectedOutput) {
       globalP.fill(255,0,0);
       globalP.ellipse(vizGlyphBoundaryMap[0][0][i][0][0],
       vizGlyphBoundaryMap[0][0][i][0][1],
       vizGlyphBoundaryMap[0][0][i][0][2],
       vizGlyphBoundaryMap[0][0][i][0][2]
       );
       globalP.fill((3*16)+3,(3*16)+3,(13*16)+11);
       }
       }
       globalP.textAlign(globalP.RIGHT);
       for (var i=0;i<activeGlyphMap[1][0].length;i++) {
       thisString = "";
       for (var j=vizGlyphBoundaryMap[1][0][i][1].length-1;j>=0;j--) {
       thisString += "/"+vizGlyphBoundaryMap[1][0][i][1][j];
       }
       if (activeGlyphMap[1][0][i]) {
       globalP.text(thisString,1270,100);
       }
       if (thisString == selectedInput) {
       globalP.fill(255,0,0);
       globalP.ellipse(vizGlyphBoundaryMap[1][0][i][0][0],
       vizGlyphBoundaryMap[1][0][i][0][1],
       vizGlyphBoundaryMap[1][0][i][0][2],
       vizGlyphBoundaryMap[1][0][i][0][2]
       );
       globalP.fill((3*16)+3,(3*16)+3,(13*16)+11);
       }
       }
     */
    /*
       globalP.textAlign(globalP.LEFT);
       globalP.fill((13*16)+11,(3*16)+3,(3*16)+3);
       for (var i=0;i<activeGlyphMap[0][1].length;i++) {
       thisString = "";
       if (activeGlyphMap[0][1][i]) {
       for (var j=vizGlyphBoundaryMap[0][1][i][1].length-1;j>=1;j--) {
       thisString += "/"+vizGlyphBoundaryMap[0][1][i][1][j];
       }
       globalP.text(thisString,10,120);
       }
       }
       globalP.textAlign(globalP.RIGHT);
       for (var i=0;i<activeGlyphMap[1][1].length;i++) {
       thisString = "";
       if (activeGlyphMap[1][1][i]) {
       for (var j=vizGlyphBoundaryMap[1][1][i][1].length-1;j>=1;j--) {
       thisString += "/"+vizGlyphBoundaryMap[1][1][i][1][j];
       }
       globalP.text(thisString,1270,120);
       }
       }
       globalP.textAlign(globalP.LEFT);
       globalP.fill((2*16)+10,(8*16)+14,(2*16)+10);
       for (var i=0;i<activeGlyphMap[0][2].length;i++) {
       thisString = "";
       if (activeGlyphMap[0][2][i]) {
       if (vizGlyphBoundaryMap[0][2][i][1].length > 2) {
       for (var j=vizGlyphBoundaryMap[0][2][i][1].length-1;j>=2;j--) {
       thisString += "/"+vizGlyphBoundaryMap[0][2][i][1][j];
       }
       } else {
       for (var j=vizGlyphBoundaryMap[0][2][i][1].length-1;j>=1;j--) {
       thisString += "/"+vizGlyphBoundaryMap[0][2][i][1][j];
       }
       }
       globalP.text(thisString,10,140);
       }
       }
       globalP.textAlign(globalP.RIGHT);
       for (var i=0;i<activeGlyphMap[1][2].length;i++) {
       thisString = "";
       if (activeGlyphMap[1][2][i]) {
       if (vizGlyphBoundaryMap[1][2][i][1].length > 2) {
       for (var j=vizGlyphBoundaryMap[1][2][i][1].length-1;j>=2;j--) {
       thisString += "/"+vizGlyphBoundaryMap[1][2][i][1][j];
       }
       } else {
       for (var j=vizGlyphBoundaryMap[1][2][i][1].length-1;j>=1;j--) {
       thisString += "/"+vizGlyphBoundaryMap[1][2][i][1][j];
       }
       }
       globalP.text(thisString,1270,140);
       }
       }
     */
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
        //globalP.text(executionFeedbackString,280,70);

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

        numberOfItemsPerPage = Math.ceil((screenSizeY-80-topBound)/lineSpacing) + 1;

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
                if (yPos+80 > screenSizeY) {
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
        //globalP.fill(255,0,0);
        globalP.text("output",leftBound+bigColumnSpacing,126);
        //globalP.fill(0,0,255);
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
                if (yPos+80 > screenSizeY) {
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
        $('#rawText').text(JSON.stringify(jsonNetworkBase,null,'\t'));
        $('#signalsFile').toggle(true);
        $('#mappingsFile').toggle(false);
    } else {
        $('#rawText').text(JSON.stringify(jsonMappingBase,null,'\t'));
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
            updateLayout();
			//activateListMode();
		});
		$.getJSON('/data/testerMapping.json', function(data) {
			indexMappingData(data);
			updateActiveFilter();
            updateLayout();
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
            updateLayout();
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
        //update_display();
    });
    command.register("new_device", function(cmd, args) {
        devices.add(args.name, args);
        //update_display();
    });
    command.register("del_device", function(cmd, args) {
        devices.remove(args.name);
        //update_display();
    });

    command.register("all_signals", function(cmd, args) {
        for (d in args)
            signals.add(args[d].name, args[d]);
        //update_display();
    });
    command.register("new_signal", function(cmd, args) {
        signals.add(args.name, args);
        //update_display();
    });
    command.register("del_signal", function(cmd, args) {
        signals.remove(args.name);
        //update_display();
    });

	//add_display_tables();
	command.start();
	//command.send('all_devices');
	//command.send('all_signals');
    // Delay starting polling, because it results in a spinning wait
    // cursor in the browser.
    setTimeout(
        function(){
            command.send('all_devices');
            command.send('all_signals');
			},
        100);
}



function executeSymbols() {
	// add tags
	for (var i=0;i<tables[0].length;i++) {
		for (var j=0;j<masterNetworkIndex.length;j++) {
			if (tables[0][i][0] == masterNetworkIndex[j][0]) {
				for (var k=0;k<compoundOperation[1].length;k++) {
					if (compoundOperation[1][k].slice(1) != "") {
						masterNetworkIndex[j][5].push(compoundOperation[1][k].slice(1));	
						masterNetworkIndex[j][5] = (masterNetworkIndex[j][5].unique())[0];
					}
				}
				break;
			}
		}
	}

	// remove tags
	for (var i=0;i<tables[0].length;i++) {
		for (var j=0;j<masterNetworkIndex.length;j++) {
			if (tables[0][i][0] == masterNetworkIndex[j][0]) {
				for (var k=0;k<compoundOperation[2].length;k++) {
					for (var l=0;l<masterNetworkIndex[j][5].length;l++) {
						if (masterNetworkIndex[j][5][l] == compoundOperation[2][k].slice(2)) {
							masterNetworkIndex[j][5].splice(l,1);	
						}
					}
				}
				break;
			}
		}
	}

	// add/remove expressions
	for (var i=0;i<mappingOperation.length;i++) {
		// add
		var alreadyThere = false;
		if (mappingOperation[i]!="" && selectedOutput!="" && selectedInput!="") {
			for (var j=0;j<masterMappingIndex.length;j++) {
				if (selectedOutput==masterMappingIndex[j].output[2] &&
					selectedInput==masterMappingIndex[j].input[2]) {
					masterMappingIndex[j].expression = mappingOperation[i];	
					alreadyThere = true;
					break;
				}
			}
			if (!alreadyThere) {
				masterMappingIndex.push(
						{"expression":mappingOperation[i],"output":["","",selectedOutput],"input":["","",selectedInput]}
						);
			}
		// remove
		} else if (mappingOperation[i]=="" && selectedOutput!="" && selectedInput!="") {
			for (var j=0;j<masterMappingIndex.length;j++) {
				if (selectedOutput==masterMappingIndex[j].output[2] &&
					selectedInput==masterMappingIndex[j].input[2]) {
					masterMappingIndex.splice(j,1);	
				}
			}
		}
	}

	updateActiveFilter();
    updateLayout();

	$('#executeInput').val("");
	$('#executeText').html("");
}

var debugMode = 0;

var activeFilter = "";
var highlightedFilter = "";
var levels = [[],[]]; // outputs,inputs

var activeExecution = "";
var highlightedExecution = "";
var tables = [[],[]]; // signals,mappings
var tagOperation = [[],[]]; //add,remove
var mappingOperation = [];

var namespaceQuery = [];
var filterMatches = [[],[],[]]; // outputs,inputs,mappings
var vizQuery = [];
var vizMatches = [];
var vizDepth = 3;
var vizType = "circle";
var tagQuery = [];
var mappingQuery = [];

var compoundQuery = [];
var compoundOperation = [];

function updateActiveExecution() {
	activeExecution = $('#executeInput').val();
	activeExecution = activeExecution+'';
	activeExecution = activeExecution.replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
	highlightedExecution = activeExecution;



	/*
		tag matching
	 */
	var matchingExp = new RegExp("(!#\\w+|#\\w+)","ig");
	compoundOperation[0] = activeExecution.match(matchingExp);
	if (compoundOperation[0] != null) {
		compoundOperation[1] = [];
		compoundOperation[2] = [];
		for (var i=0;i<compoundOperation[0].length;i++) {
			if (compoundOperation[0][i][0] == "#") {
				compoundOperation[1].push(compoundOperation[0][i]);
			} else if (compoundOperation[0][i][0] == "!") {
				compoundOperation[2].push(compoundOperation[0][i]);
			}
		}
	} else {
		compoundOperation[0] = [""];
		compoundOperation[1] = [["!#"]];
		compoundOperation[2] = [["#"]];
	}


/*
	if (activeExecution.match(new RegExp("\\B!#\\w+(#\\w+|)*","ig")) == null) {
		tagOperation[1] = [];
	} else {
		tagOperation[1] = activeExecution.match(new RegExp("\\B!#\\w+(#\\w+|)*","ig"));

		for (var i=0;i<tagOperation[1].length;i++) {
			highlightedExecution = highlightedExecution.replace(
					tagOperation[1][i],
					"<span class=\"yellow\">"+tagOperation[1][i]+"</span>");

			tagOperation[1][i] = tagOperation[1][i].match(new RegExp("\\w+","ig"));
		}
	}
	if (activeExecution.match(new RegExp("[^!]#\\w+(#\\w+|)*","ig")) == null) {
		tagOperation[0] = [];
	} else {
		tagOperation[0] = activeExecution.match(new RegExp("[^!]#\\w+(#\\w+|)*","ig"));
		for (var i=0;i<tagOperation[0].length;i++) {
			if (tagOperation[0][i][0] == " ") {
				tagOperation[0][i] = tagOperation[0][i].slice(1);
			}
			highlightedExecution = highlightedExecution.replace(
					tagOperation[0][i],
					"<span class=\"yellow\">"+tagOperation[0][i]+"</span>");

			tagOperation[0][i] = tagOperation[0][i].match(new RegExp("\\w+","ig"));
		}
	}
	*/



	/*
		mapping matching
	 */
	if (activeExecution.match(new RegExp("<.*>","ig")) == null) {
		mappingOperation = [""];
	} else {
		mappingOperation = activeExecution.match(new RegExp("<.*>","ig"));

		for (var i=0;i<mappingOperation.length;i++) {
			mappingOperation[i] = mappingOperation[i].slice(1);
			mappingOperation[i] = mappingOperation[i].slice(0,mappingOperation[i].length-1);
			highlightedExecution = highlightedExecution.replace(
					mappingOperation[i],
					"<span class=\"grey\">"+mappingOperation[i]+"</span>");
		}
	}



	$('#executeText').html(highlightedExecution);
}

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

    test_filterMatches = [[],[],[]];
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
			//tag
			for (var k=0;k<compoundQuery[1][j].length;k++) { 
				var isMatch = false;
				for (var l=0;l<masterNetworkIndex[i][5].length;l++) { 
					if (masterNetworkIndex[i][5][l].match(new RegExp(compoundQuery[1][j][k].slice(1),"ig")) != null) {
						isMatch = true;	
					}
				}
				if (!isMatch) {
					continue o;
				}
			}

			if (masterNetworkIndex[i][5][1] == "output") {	
				filterMatches[0].push(masterNetworkIndex[i][0]);	
                test_filterMatches[0].push([masterNetworkIndex[i][5][0],masterNetworkIndex[i][0]]);
			} else if (masterNetworkIndex[i][5][1] == "input") {	
				filterMatches[1].push(masterNetworkIndex[i][0]);	
                test_filterMatches[1].push([masterNetworkIndex[i][5][0],masterNetworkIndex[i][0]]);
            }
			tables[0].push(masterNetworkIndex[i]);
		}
	}

	//inputs+outputs
	levels = [[],[]];
	activeGlyphMap = [[[],[],[]],[[],[],[]],[]]; //outputs,inputs,connections
	//inputs
	filterMatches[0].sort();
	for (var i=0;i<filterMatches[0].length;i++) {
		var splitArray = filterMatches[0][i].split("/");
		splitArray.reverse();
		
		for (var j=0;j<splitArray.length-1;j++) {
			if (j == 0) {
				levels[0].push([splitArray[j]]);
			} else if (j == 1) {
				levels[0][levels[0].length-1].push(splitArray[j]);
			} else if (j == 2) {
				levels[0][levels[0].length-1].push(splitArray[j]);
			} else {
				levels[0][levels[0].length-1].push(splitArray[j]);
			}
		}
	}
	preProcessedLevels = levels[0];
	levels[0] = levels[0].unique();
	//outputs
	filterMatches[1].sort();
	for (var i=0;i<filterMatches[1].length;i++) {
		var splitArray = filterMatches[1][i].split("/");
		splitArray.reverse();
		
		for (var j=0;j<splitArray.length-1;j++) {
			if (j == 0) {
				levels[1].push([splitArray[j]]);
			} else if (j == 1) {
				levels[1][levels[1].length-1].push(splitArray[j]);
			} else if (j == 2) {
				levels[1][levels[1].length-1].push(splitArray[j]);
			} else {
				levels[1][levels[1].length-1].push(splitArray[j]);
			}
		}
	}
	preProcessedLevels = levels[1];
	levels[1] = levels[1].unique();
	for (var i=0;i<levels[0][0].length;i++) {
		activeGlyphMap[0][0].push(false);
	}
	for (var i=0;i<levels[1][0].length;i++) {
		activeGlyphMap[1][0].push(false);
	}
	for (var i=0;i<levels[0][2].length;i++) {
		activeGlyphMap[0][1].push(false);
	}
	for (var i=0;i<levels[1][2].length;i++) {
		activeGlyphMap[1][1].push(false);
	}
	for (var i=0;i<levels[0][4].length;i++) {
		activeGlyphMap[0][2].push(false);
	}
	for (var i=0;i<levels[1][4].length;i++) {
		activeGlyphMap[1][2].push(false);
	}

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
			activeGlyphMap[2].push(false);
		}
	}



	/*
		viz matching
	 */
	if (activeFilter.match(new RegExp("@\\w+(@\\w+|)*","ig")) == null) {
		vizQuery = [""];
	} else {
		vizQuery = activeFilter.match(new RegExp("@\\w+(@\\w+|)*","ig"));

		for (var i=0;i<vizQuery.length;i++) {
			highlightedFilter = highlightedFilter.replace(
					vizQuery[i],
					"<span class=\"green\">"+vizQuery[i]+"</span>");

			vizQuery[i] = vizQuery[i].match(new RegExp("\\w+","ig"));
		}
	}
	for (var i=0;i<vizQuery.length;i++) {
		if (vizQuery[i] == 1 || vizQuery[i] == 2 || vizQuery[i] == 3) {
			vizDepth = vizQuery[i];	
		}
	}



	/*
		mapping matching
	 */
	if (activeFilter.match(new RegExp("<-\\w+(<-\\w+|)*","ig")) == null) {
		mappingQuery = [""];
	} else {
		mappingQuery = activeFilter.match(new RegExp("<-\\w+(<-\\w+|)*","ig"));

		for (var i=0;i<mappingQuery.length;i++) {
			highlightedFilter = highlightedFilter.replace(
					mappingQuery[i],
					"<span class=\"grey\">"+mappingQuery[i]+"</span>");

			mappingQuery[i] = mappingQuery[i].match(new RegExp("\\w+","ig"));
		}
	}



	/*
		command highlighting
	 */
	//$('#filterText').html(highlightedFilter);

}
function updateLayout() {

}

//inputs+outputs
var test_preLevels_1 = [[],[]];
var test_levels_1 = [[],[]];
var test_filterMatches = [[],[],[]];
function testLayout() {
    test_levels_1 = [[],[]];

	//inputs
	test_filterMatches[0].sort();
	for (var i=0;i<test_filterMatches[0].length;i++) {
        test_levels_1[0].push([test_filterMatches[0][i][0]]);  

		var splitArray = test_filterMatches[0][i][1].split("/");
		for (var j=1;j<splitArray.length;j++) {
            test_levels_1[0][test_levels_1[0].length-1].push(splitArray[j]);
		}
	}
	test_preLevels_1[0] = test_levels_1[0];
    test_levels_1[0] = test_levels_1[0].cluster();
	//test_levels_1[0] = test_levels_1[0].unique();


	//outputs
	test_filterMatches[1].sort();
	for (var i=0;i<test_filterMatches[1].length;i++) {
        test_levels_1[1].push([test_filterMatches[1][i][0]]);

		var splitArray = test_filterMatches[1][i][1].split("/");
		for (var j=1;j<splitArray.length;j++) {
            test_levels_1[1][test_levels_1[1].length-1].push(splitArray[j]);
		}
	}
    test_preLevels_1[1] = test_levels_1[1];
    test_levels_1[1] = test_levels_1[1].cluster(1);
	//test_levels_1[1] = test_levels_1[1].unique();
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


Array.prototype.unique = function() {
	var count0 = new Array();
	var count1 = new Array();
	var count2 = new Array();
	var r0 = new Array();
	var r1 = new Array();
	var r2 = new Array();

	o: for (var i=0,n=this.length;i<n;i++) {
		for (var x=0,y=r0.length;x<y;x++) {
			if (r0[x].toString()==this[i].toString()) {
				count0[x]++;
				continue o;
			}
		}
		count0[r0.length] = 1;
		r0[r0.length] = this[i];
	}
	p: for (var i=0,n=r0.length;i<n;i++) {
		for (var x=0,y=r1.length;x<y;x++) {
			if (r1[x].slice(1).toString()==r0[i].slice(1).toString()) {
				count1[x]++;
				continue p;
			}
		}
		count1[r1.length] = 1;
		r1[r1.length] = r0[i];
	}
	q: for (var i=0,n=r1.length;i<n;i++) {
		for (var x=0,y=r2.length;x<y;x++) {
			if (r1[i].length > 2) {
				if (r2[x].slice(2).toString()==r1[i].slice(2).toString()) {
					count2[x]++;
					continue q;
				}
			} else {
				if (r2[x].slice(1).toString()==r1[i].slice(1).toString()) {
					count2[x]++;
					continue q;
				}
			}
		}
		count2[r2.length] = 1;
		r2[r2.length] = r1[i];
	}

	return [r0,count0,r1,count1,r2,count2];
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








//DATA STACK
//concept structure (internal, intersecting circles metaphor) ->
//concept (tag handle, tags, paths)
//path structure (internal, graph metaphor) ->
//path (list of tags) ->
//tag structure (internal, linked node metaphor)) ->
//tag (string handle, data structure, unique id) ->
//data structure (dynamic)

//var conceptBase = [];
//var tagBase = [];

//data stack is only referenced by strings
//system pointers can only be strings

/*
function concept(initialData) {
	if (!(this instanceof concept)) {
		return new concept(initialData);
	}

	this.tagHandle = [];
	this.lowerTags = [];
	this.higherTags = [];

	this.addLowerTag = function(tagData) {
		for (var i=0;i<this.lowerTags.length;i++) {
			// check if already added
			var isMatch = true;
			if (tagData.length == this.lowerTags[i].length) {
				for (var j=0;j<tagData.length;j++) {
					if (tagData[j] != this.lowerTags[i][j]) {
						isMatch = false;
						break;
					}
				}
			} else {
				isMatch = false;
			}

			if (isMatch) {
				return this;
			}
		}

		this.lowerTags.push(tagData);
		concept(tagData).addHigherTag(this.tagHandle);
		return this;
	};

	this.addHigherTag = function(tagData) {
		for (var i=0;i<this.higherTags.length;i++) {
			// check if already added
			var isMatch = true;
			if (tagData.length == this.higherTags[i].length) {
				for (var j=0;j<tagData.length;j++) {
					if (tagData[j] != this.higherTags[i][j]) {
						isMatch = false;
						break;
						//return this;
					}
				}
			} else {
				isMatch = false;
			}

			if (isMatch) {
				return this;
			}
		}

		this.higherTags.push(tagData);
		concept(tagData).addLowerTag(this.tagHandle);
		return this;
	};

	if (!findAndReturnExactConcept(initialData)) {
		for (var i=0;i<initialData.length;i++) {
			this.tagHandle.push(initialData[i]);
		}
		conceptBase.push(this);		
		return this;
	} else {
		return findAndReturnExactConcept(initialData);
	}
}
*/

/*
var lastId = 0;
function uniqueTag(initialData) {
	tag(initialData+"$"+lastId).addTag(initialData);	
	return findAndReturnExactTag(initialData);
}
function tag(initialData) {
	if (!(this instanceof tag)) {
		return new tag(initialData);
	}

	for (var i=0;i<initialData.length;i++) {
		initialData[i] = initialData[i]+'';
		initialData[i] = initialData[i].replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
	}

	this.data = []; // first element is always primary data and if data is prefixed by '&' other elements are to store terminating data
	this.id = lastId;

	this.addTag = function(tagData) {
		if (tagData.length == 0) {
			return 0;
		}

		for (var i=0;i<tagData.length;i++) {
			tagData[i] = tagData[i]+'';
			tagData[i] = tagData[i].replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
		}
		tag(tagData);
		concept(this.data).addHigherTag(tagData);

		// TODO: traverse concept graph to update path structure from tag structure
		return this;
	};

	if (!findAndReturnExactTag(initialData)) {
		for (var i=0;i<initialData.length;i++) {
			this.data.push(initialData[i]);
		}
		tagBase.push(this);		
		concept(this.data);
		lastId += 1;
		return this;
	} else {
		return findAndReturnExactTag(initialData);
	}
}
*/

/*
function frame(frameArray) {
	var compoundTagee = [];
	var compoundTag = [];
	var compoundIgnore = [];

	//globalP.println(frameArray);

	for (var tagStartIndex=0;tagStartIndex<frameArray.length;tagStartIndex++) {
		compoundTag.push(frameArray[tagStartIndex]);
	}

	//debugTags.push(compoundTag.slice());

	for (var tageeEndIndex=0;tageeEndIndex<frameArray.length;tageeEndIndex++) {
		compoundTagee.push(compoundTag.shift());
		//debugTagees.push(compoundTagee.slice());
		//debugTags.push(compoundTag.slice());

		if (compoundTag.length == 0) {
			tag(compoundTagee.slice());
		} else {
			for (var tagEndIndex=compoundTag.length;tagEndIndex>0;tagEndIndex--) {
				for (var tageeStartIndex=0;tageeStartIndex<compoundTagee.length;tageeStartIndex++) {
					tag(globalP.subset(compoundTagee,tageeStartIndex,compoundTagee.length-tageeStartIndex))
						.addTag(globalP.subset(compoundTag,0,tagEndIndex));
				}
			}
			//globalP.println(compoundTagee+" tag:"+compoundTag+" taglength:"+compoundTag.length);
			//debugTagees.push(compoundTagee.slice());
			//debugTags.push(compoundTag.slice());
			//tag(compoundTagee.slice()).addTag(compoundTag.slice());
		}
	}
}
*/
/*
var debugTags = [];
var debugTagees = [];
var inputSignalBase = [];
var inputSignalPathBase = [];
var outputSignalBase = [];
var debugDistances = [];
var distances = [[],[]];
var currentNode;
*/
/*
// dijkstra's algorithm
function calculateShortestDistanceBetweenConcepts(database,sourceQueryArray,destinationQueryArray) {
	//globalP.println(database.length);

	var sourceConceptIndex = findAndReturnExactConceptIndex(database,sourceQueryArray);
	var destinationConceptIndex = findAndReturnExactConceptIndex(database,destinationQueryArray);

	var dist = [];
	var previous = [];
	for (var i=0;i<database.length;i++) {
		dist[i] = null;
		previous[i] = null;
	}
	dist[sourceConceptIndex] = 0;

	//globalP.println(database.length);
	var q = database.slice();
	var u = sourceConceptIndex;
	var qIndex = 0;


	while (q.length > 0) {
		qIndex = 0;
		u = findAndReturnExactConceptIndex(database,q[qIndex].tagHandle);
		for (var i=0;i<q.length;i++) {
			if (dist[findAndReturnExactConceptIndex(database,q[i].tagHandle)] != null &&
					(dist[u] == null ||
					dist[u] > dist[findAndReturnExactConceptIndex(database,q[i].tagHandle)])) {
				u = findAndReturnExactConceptIndex(database,q[i].tagHandle);
				qIndex = i;
			}
		}

		var currentNodeArray = q.splice(qIndex,1);
		currentNode = currentNodeArray[0];

		if (dist[u] == null) {
			break;
		}
		if (u == destinationConceptIndex) {
			//return dist[u];
		}

		for (var i=0;i<currentNode.higherTags.length;i++) {
			var alt = dist[u] + currentNode.higherTags[i].length;
			var v = findAndReturnExactConceptIndex(database,currentNode.higherTags[i]);
			if (dist[v] == null || alt < dist[v]) {
				dist[v] = alt;
				previous[v] = u;
			}
		}
		for (var i=0;i<currentNode.lowerTags.length;i++) {
			var alt = dist[u] + currentNode.lowerTags[i].length;
			var v = findAndReturnExactConceptIndex(database,currentNode.lowerTags[i]);
			if (dist[v] == null || alt < dist[v]) {
				dist[v] = alt;
				previous[v] = u;
			}
		}

	}

	return dist;
}
*/
/*
function findAndReturnMatchingConcepts(queryArray,negativeQueryArray,lengthConstraint) {
	if (queryArray.length == 0) {
		return [];
	}
	for (var i=0;i<queryArray.length;i++) {
		queryArray[i] = queryArray[i]+'';
		queryArray[i] = queryArray[i].replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
	}

	var matches = [];

	// find concepts that match query constraints
	for (var i=0;i<conceptBase.length;i++) {
		var isMatch = "undecided";

		for (var j=0;j<queryArray.length;j++) {
			isMatch = "undecided";

			for (var k=0;k<conceptBase[i].tagHandle.length;k++) {
				if (queryArray[j] == conceptBase[i].tagHandle[k]) {
					isMatch = "undecided";
					break;
				} else if (k >= conceptBase[i].tagHandle.length-1) {
					isMatch = "false";
					break;
				}
			}

			if (isMatch == "false") {
				break;
			} else if (j >= queryArray.length-1) {
				isMatch = "true";
				break;
			}
		}

		if (isMatch == "true") {
			matches.push(conceptBase[i]);	
		}
	}

	if (arguments.length == 1) {
		return matches;
	}


	// remove concepts that match negative query constraints
	for (var i=0;i<negativeQueryArray.length;i++) {
		negativeQueryArray[i] = negativeQueryArray[i]+'';
		negativeQueryArray[i] = negativeQueryArray[i].replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
	}
	var matchingIndices = [];
	for (var i=0;i<matches.length;i++) {
		isMatch = false;

		for (var j=0;j<negativeQueryArray.length;j++) {

			for (var k=0;k<matches[i].tagHandle.length;k++) {
				if (negativeQueryArray[j] == matches[i].tagHandle[k]) {
					//matches.splice(i,1);	
					matchingIndices.push(i);
					isMatch = true;
					break;
				}
			}

			if (isMatch) {
				break;
			}
		}

	}

	if (arguments.length == 3) {
		for (var i=0;i<matches.length;i++) {
			if (matches[i].tagHandle.length != lengthConstraint) {
				matchingIndices.push(i);
			}
		}
	}
	for (var i=matchingIndices.length-1;i>=0;i--) {
		matches.splice(matchingIndices[i],1);	
	}


	return matches;
}
*/
/*
function findAndReturnExactConcept(queryArray) {
	for (var i=0;i<queryArray.length;i++) {
		queryArray[i] = queryArray[i]+'';
		queryArray[i] = queryArray[i].replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
	}

	for (var i=0;i<conceptBase.length;i++) {
		var isMatch = true;
		if (queryArray.length == conceptBase[i].tagHandle.length) {
			for (var j=0;j<queryArray.length;j++) {
				if (queryArray[j] != conceptBase[i].tagHandle[j]) {
					isMatch = false;
					break;
				}
			}
		} else {
			isMatch = false;
		}

		if (isMatch) {
			return conceptBase[i];
		}
	}
	return 0;
}
*/
/*
function findAndReturnExactConceptIndex(database,queryArray) {
	for (var i=0;i<queryArray.length;i++) {
		queryArray[i] = queryArray[i]+'';
		queryArray[i] = queryArray[i].replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
	}

	for (var i=0;i<database.length;i++) {
		var isMatch = true;
		if (queryArray.length == database[i].tagHandle.length) {
			for (var j=0;j<queryArray.length;j++) {
				if (queryArray[j] != database[i].tagHandle[j]) {
					isMatch = false;
					break;
				}
			}
		} else {
			isMatch = false;
		}

		if (isMatch) {
			return i;
		}
	}
	return null;
}
*/
/*
function findAndReturnExactTag(queryArray) {
	for (var i=0;i<queryArray.length;i++) {
		queryArray[i] = queryArray[i]+'';
		queryArray[i] = queryArray[i].replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();
	}

	for (var i=0;i<tagBase.length;i++) {
		var isMatch = true;
		if (queryArray.length == tagBase[i].data.length) {
			for (var j=0;j<queryArray.length;j++) {
				if (queryArray[j] != tagBase[i].data[j]) {
					isMatch = false;
					break;
				}
			}
		} else {
			isMatch = false;
		}

		if (isMatch) {
			return tagBase[i];
		}
	}
	return 0;
}
*/
