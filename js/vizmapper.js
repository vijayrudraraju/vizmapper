//TODO
// stop incessant looping from burning cpu

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

var globalP;
var isAbouting = false;
var isHelping = false;
$(document).ready(function() {
		globalP = new Processing($('#globalCanvas')[0],globalP);

		$('span').hover(function() {
			$(this).toggleClass('normalHelp',false);
			$(this).toggleClass('hoverHelp',true);
            globalP.redraw();
		}, function() {
			$(this).toggleClass('normalHelp',true);
			$(this).toggleClass('hoverHelp',false);
            globalP.redraw();
		});
        $('#viewHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#viewHelp').toggle(true);
            globalP.redraw();
        });
        $('#signalHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#signalHelp').toggle(true);
            globalP.redraw();
        });
        $('#mappingHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#mappingHelp').toggle(true);
            globalP.redraw();
        });
        $('#filteringHelpTrigger').click(function() {
            deactivateHelpMode();
            $('#filteringHelp').toggle(true);
            globalP.redraw();
        });

        $('#viewHelp').click(function() {
            $('#viewHelp').toggle(false);
            globalP.redraw();
        });
        $('#signalHelp').click(function() {
            $('#signalHelp').toggle(false);
            globalP.redraw();
        });
        $('#mappingHelp').click(function() {
            $('#mappingHelp').toggle(false);
            globalP.redraw();
        });
        $('#filteringHelp').click(function() {
            $('#filteringHelp').toggle(false);
            globalP.redraw();
        });

		$('#aboutSwitch').click(function() {
			isAbouting = !isAbouting;
			if (isAbouting) {
				activateAboutMode();
			} else {
				deactivateAboutMode();
			}
            globalP.redraw();
		});
		$('#helpSwitch').click(function() {
			isHelping = !isHelping;
			if (isHelping) {
				activateHelpMode();
			} else {
				deactivateHelpMode();
			}
            globalP.redraw();
		});

        $('#updateConnection').click(function() {
                if (selectedSource != "none" &&
                    selectedDestination != "none") {
                    if (selectedEdge == null) {
                        doConnect();
                    } else {
                        doModifyConnection();
                    }
                }
                globalP.redraw();
        });
        $('#removeConnection').click(function() {
                if (selectedSource != "none" &&
                    selectedDestination != "none") {
                    doDisconnect();
                }
                globalP.redraw();
        });

		$('#viewTab').click(function() {
			activateViewMode();
            updateGraph = true;
            globalP.redraw();
            updateGraph = true;
            globalP.redraw();
		});
		$('#editTab').click(function() {
			activateEditMode();
            updateGraph = true;
            globalP.redraw();
            updateGraph = true;
            globalP.redraw();
		});

		$('#filterInput').keyup(function(event) {
			event.preventDefault();
			//updateActiveFilter();
            updateGraph = true;
            globalP.redraw();
		});

		main();
        activateViewMode();
        globalP.redraw();
});

// register callbacks for webmapper events
function main()
{
    command.register("all_devices", function(cmd, args) {
        for (d in args) {
            updateGraph = true;
            devices.add(args[d].name, args[d]);
        }
        globalP.redraw();
    });
    command.register("new_device", function(cmd, args) {
        updateGraph = true;
        devices.add(args.name, args);
        resetToRootLevel();
        globalP.redraw();
    });
    command.register("del_device", function(cmd, args) {
        updateGraph = true;
        devices.remove(args.name);
        resetToRootLevel();
        globalP.redraw();
    });

    command.register("all_signals", function(cmd, args) {
        for (d in args) {
            updateGraph = true;
            signals.add(args[d].device_name+args[d].name, args[d]);
        }
        globalP.redraw();
    });
    command.register("new_signal", function(cmd, args) {
            updateGraph = true;
            signals.add(args.device_name+args.name, args);
            resetToRootLevel();
            globalP.redraw();
    });
    command.register("del_signal", function(cmd, args) {
            updateGraph = true;
            signals.remove(args.device_name+args.name);
            resetToRootLevel();
            globalP.redraw();
    });

    command.register("all_links", function(cmd, args) {
            for (l in args) {
            updateGraph = true;
            links.add(args[l].src_name+'>'+args[l].dest_name, args[l]);
            }
            globalP.redraw();
    });
    command.register("new_link", function(cmd, args) {
            updateGraph = true;
            links.add(args.src_name+'>'+args.dest_name, args);
            globalP.redraw();
    });
    command.register("del_link", function(cmd, args) {
            updateGraph = true;
            links.remove(args.src_name+'>'+args.dest_name);
            globalP.redraw();
    });

    command.register("all_connections", function(cmd, args) {
            for (d in args) {
            updateGraph = true;
            connections.add(args[d].src_name+'>'+args[d].dest_name, args[d]);
            }
            globalP.redraw();
    });
    command.register("new_connection", function(cmd, args) {
        updateGraph = true;
        connections.add(args.src_name+'>'+args.dest_name, args);
        globalP.redraw();
    });
    command.register("mod_connection", function(cmd, args) {
        updateGraph = true;
        connections.add(args.src_name+'>'+args.dest_name, args);
        globalP.redraw();
    });
    command.register("del_connection", function(cmd, args) {
        updateGraph = true;
        connections.remove(args.src_name+'>'+args.dest_name);
        globalP.redraw();
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

var edgeGlyphMap = [];
var nodeGlyphMap = {outputs:new Assoc(),inputs:new Assoc()};

// output labels, input labels
var listGlyphMap = [[],[]];
var traversalGlyphMap = [[],[]];

var mousedSource = "";
var mousedDestination = "";
var selectedSource = "none";
var selectedDestination = "none";
var selectedEdge;

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

var updateGraph = true;

function globalP(p) {
	p.mouseMoved = function() {
		mouseX = p.mouseX;
		mouseY = p.mouseY;
        p.redraw();
	};

	p.mouseClicked = function() {
		if ($('#viewTab').hasClass('active')) {
            detectNodeClick(false);
            detectTraversalClick();
		} else if ($('#editTab').hasClass('active')) {
            detectNodeClick(true);
            detectEdgeClick();
        }
        p.redraw();
	};

	p.setup = function() {
		//p.println(p.PFont.list());

		p.size(screenWidth,screenHeight);
		var font = p.loadFont("monospace");
		p.textFont(font);
	};

	p.draw = function() {

        if (updateGraph) {
            clearConnectionForm();
            updateActiveFilter();
            updateSignalMatches();
            updateLevelStructure();

            if ($('#viewTab').hasClass('active')) {
                updateNodeGlyphMap(false);
                updateEdgeGlyphMap(false);
            } else {
                updateNodeGlyphMap(true);
                updateEdgeGlyphMap(true);
            }

            if (updateGraph == 2) {
                updateGraph = false;
                p.redraw();
            } else {
                updateGraph = 2;
                p.redraw();
            }
        }

        if ($('#viewTab').hasClass('active')) {
            $('html').toggleClass('viewColor',true);
            $('html').toggleClass('editColor',false);
            $('html').toggleClass('rawColor',false);

            p.background(230);
            drawBackground();
            if (mouseX < 200 || mouseX > screenWidth-200) {
                updateListGlyphMouseState();
            } else {
                updateNodeMouseState();
            }
            drawNodes();
            drawEdges();
            drawListGlyphs();
            drawTraversalGlyphs();

        } else {
            $('html').toggleClass('viewColor',false);
            $('html').toggleClass('editColor',true);
            $('html').toggleClass('rawColor',false);

            p.background(230);
            drawBackground();
            updateNodeMouseState();
            updateEdgeMouseState();
            drawNodes();
            drawEdges();

        }

        globalP.noLoop();
	};
}

function updateNodeMouseState() {
    mousedSource = "";
    mousedDestination = "";

    // hover detection of source nodes and destination nodes 
    if ($('#viewTab').hasClass('active') || $('#editTab').hasClass('active')) {
        var thisX = 0; // input,level,container,drawingNumbers,thisX
        var thisY = 0;
        var thisRadius = 0;

        var keys = nodeGlyphMap.outputs.keys();
        var sourcePaths = getCurrentOutputPathsFromNodes();
        for (var i=0;i<keys.length;i++) {
            if (!nodeGlyphMap.outputs.get(keys[i]).visible) {
                continue;
            }

            thisX = nodeGlyphMap.outputs.get(keys[i]).layoutX;
            thisY = nodeGlyphMap.outputs.get(keys[i]).layoutY;
            thisRadius = nodeGlyphMap.outputs.get(keys[i]).symbolWidth/2;

            // is the mouse within the bounds of the node glyph?
            if (Math.pow(mouseX-thisX,2)+Math.pow(mouseY-thisY,2) < Math.pow(thisRadius,2)) {
                nodeGlyphMap.outputs.get(keys[i]).mouseOver = true;
                mousedSource = sourcePaths[i];
            } else {
                nodeGlyphMap.outputs.get(keys[i]).mouseOver = false;
            }
        }

        keys = nodeGlyphMap.inputs.keys();
        var destinationPaths = getCurrentInputPathsFromNodes();
        for (var i=0;i<keys.length;i++) {
            if (!nodeGlyphMap.inputs.get(keys[i]).visible) {
                continue;
            }

            thisX = nodeGlyphMap.inputs.get(keys[i]).layoutX;
            thisY = nodeGlyphMap.inputs.get(keys[i]).layoutY;
            thisRadius = nodeGlyphMap.inputs.get(keys[i]).symbolWidth/2;

            // is the mouse within the bounds of the node glyph?
            if (Math.pow(mouseX-thisX,2)+Math.pow(mouseY-thisY,2) < Math.pow(thisRadius,2)) {
                nodeGlyphMap.inputs.get(keys[i]).mouseOver = true;
                mousedDestination = destinationPaths[i];
            } else {
                nodeGlyphMap.inputs.get(keys[i]).mouseOver = false;
            }
        }
    }

    if (mousedSource == "") {
        $('#selectedSource').text(selectedSource);
    } else {
        $('#selectedSource').text(mousedSource);
    }
    if (mousedDestination == "") {
        $('#selectedDestination').text(selectedDestination);
    } else {
        $('#selectedDestination').text(mousedDestination);
    }
}

function updateEdgeMouseState() {
    // hover detection of connections
    // check mouse position against where points are on the bezier equation
    // B(t) = ((1-t)^3)*(P0) + (3*(1-t)^2)*(t)*(P1) + (3*(1-t)*t^2)*(P2) + (t^3)*(P3)
    var keys = edgeGlyphMap.keys();
    var x1, y1, x2, y2;
    var cx1, cy1, cx2, cy2;
    var xs;
    var ys;
    for (var i=0;i<keys.length;i++) {
        x1 = edgeGlyphMap.get(keys[i]).x1;
        y1 = edgeGlyphMap.get(keys[i]).y1;
        x2 = edgeGlyphMap.get(keys[i]).x2;
        y2 = edgeGlyphMap.get(keys[i]).y2;
        cx1 = edgeGlyphMap.get(keys[i]).cx1;
        cy1 = edgeGlyphMap.get(keys[i]).cy1;
        cx2 = edgeGlyphMap.get(keys[i]).cx2;
        cy2 = edgeGlyphMap.get(keys[i]).cy2;
        xs = [x1,cx1,cx2,x2];
        ys = [y1,cy1,cy2,y2];
        xs.sort(function(a,b){return a-b;});
        ys.sort(function(a,b){return a-b;});

        if (mouseX<xs[3] && mouseX>xs[0] &&
                mouseY<ys[3] && mouseY>ys[0]) {
            var xLength = Math.abs(Math.round(x1-x2));
            for (var j=0;j<xLength;j++) {
                var t = j/xLength;

                var microX = (Math.pow(1-t,3)*x1) +
                    (3*Math.pow(1-t,2)*t*cx1) +
                    (3*(1-t)*Math.pow(t,2)*cx2) +
                    (Math.pow(t,3)*x2);
                var microY = (Math.pow(1-t,3)*y1) +
                    (3*Math.pow(1-t,2)*t*cy1) +
                    (3*(1-t)*Math.pow(t,2)*cy2) +
                    (Math.pow(t,3)*y2);
                if (mouseX<microX+4 && mouseX>microX-4 &&
                        mouseY<microY+4 && mouseY>microY-4) {
                    edgeGlyphMap.get(keys[i]).mouseOver = true;
                    break;
                }
                if (j==xLength-1) {
                    edgeGlyphMap.get(keys[i]).mouseOver = false;
                }
            }
        } else {
            edgeGlyphMap.get(keys[i]).mouseOver = false;
        }
    }

}

function detectNodeClick(selectionEnabled) {
    var sourcePaths = getCurrentOutputPathsFromNodes();
    var destinationPaths = getCurrentInputPathsFromNodes();

    var isSource = null;

    var keys = nodeGlyphMap.outputs.keys();
    for (var i=0;i<keys.length;i++) {
        if (nodeGlyphMap.outputs.get(keys[i]).mouseOver && nodeGlyphMap.outputs.get(keys[i]).visible) {
            isSource = true;
        }
    }

    var keys = nodeGlyphMap.inputs.keys();
    for (var i=0;i<keys.length;i++) {
        if (nodeGlyphMap.inputs.get(keys[i]).mouseOver && nodeGlyphMap.inputs.get(keys[i]).visible) {
            isSource = false;
        }
    }

    if (isSource == null) {
        var keys = nodeGlyphMap.outputs.keys();
        for (var i=0;i<keys.length;i++) {
            selectedSource = "none";
            nodeGlyphMap.outputs.get(keys[i]).selected = false;
        }
        var keys = nodeGlyphMap.inputs.keys();
        for (var i=0;i<keys.length;i++) {
            selectedDestination = "none";
            nodeGlyphMap.inputs.get(keys[i]).selected = false;
        }
    } else if (isSource) {
        var keys = nodeGlyphMap.outputs.keys();
        for (var i=0;i<keys.length;i++) {
            if (nodeGlyphMap.outputs.get(keys[i]).mouseOver) {
                descendOutputTree(keys[i]);
                if (selectionEnabled) {
                    selectedSource = sourcePaths[i];
                    nodeGlyphMap.outputs.get(keys[i]).selected = true;
                }
            } else {
                nodeGlyphMap.outputs.get(keys[i]).selected = false;

            }
        }
    } else {
        var keys = nodeGlyphMap.inputs.keys();
        for (var i=0;i<keys.length;i++) {
            if (nodeGlyphMap.inputs.get(keys[i]).mouseOver) {
                descendInputTree(keys[i]);
                if (selectionEnabled) {
                    selectedDestination = destinationPaths[i];
                    nodeGlyphMap.inputs.get(keys[i]).selected = true;
                }
            } else {
                nodeGlyphMap.inputs.get(keys[i]).selected = false;
            }
        }
    }

    $('#selectedSource').text(selectedSource);
    $('#selectedDestination').text(selectedDestination);
}

function detectEdgeClick() {
    var select = false;

    var keys = edgeGlyphMap.keys();
    for (var i=0;i<keys.length;i++) {
        if (edgeGlyphMap.get(keys[i]).mouseOver) {
            select = true;
        }
    }

    if (select) {
        var keys = edgeGlyphMap.keys();
        for (var i=0;i<keys.length;i++) {
            if (edgeGlyphMap.get(keys[i]).mouseOver) {
                selectedSource = edgeGlyphMap.get(keys[i]).outputChild;
                selectedDestination = edgeGlyphMap.get(keys[i]).inputChild;
                selectedEdge = keys[i];

                $('#selectedSource').text(selectedSource);
                $('#selectedDestination').text(selectedDestination);
                $('#modeMenu').val(connections.get(keys[i]).mode);
                $('#exprInput').val(connections.get(keys[i]).expression);
                $('#mappingSourceMinInput').val(connections.get(keys[i]).range[0]);
                $('#mappingSourceMaxInput').val(connections.get(keys[i]).range[1]);
                $('#mappingDestMinInput').val(connections.get(keys[i]).range[2]);
                $('#mappingDestMaxInput').val(connections.get(keys[i]).range[3]);
                edgeGlyphMap.get(keys[i]).selected = true;
            } else {
                edgeGlyphMap.get(keys[i]).selected = false;
            }
        }
    } else {
        var keys = edgeGlyphMap.keys();
        for (var i=0;i<keys.length;i++) {
            //selectedDestination = "none";
            //selectedSource = "none";
            selectedEdge = null;

            $('#modeMenu').val(0);
            $('#exprInput').val("");
            $('#mappingSourceMinInput').val("");
            $('#mappingSourceMaxInput').val("");
            $('#mappingDestMinInput').val("");
            $('#mappingDestMaxInput').val("");
            edgeGlyphMap.get(keys[i]).selected = false;
        }
    }
}

function clearConnectionForm() {
    selectedDestination = "none";
    selectedSource = "none";
    selectedEdge = null;

    $('#selectedSource').text(selectedSource);
    $('#selectedDestination').text(selectedDestination);
    $('#modeMenu').val(0);
    $('#exprInput').val("");
    $('#mappingSourceMinInput').val("");
    $('#mappingSourceMaxInput').val("");
    $('#mappingDestMinInput').val("");
    $('#mappingDestMaxInput').val("");
}

function resetToRootLevel() {
    outputBranchTrace = [];
    inputBranchTrace = [];
    outputLabelTrace = ["output signals"];
    inputLabelTrace = ["input signals"];
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
        }
    }
}

function isOutputLeafNode(index) {
    var keys = nodeGlyphMap.outputs.keys();
    if (nodeGlyphMap.outputs.get(keys[index]).subNodes.length() == 0) {
        return true;
    } else {
        return false;
    }
}
function getSubnodesForOutputLevel() {
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
function getCurrentOutputPathsFromNodes() {
    var outputSet = nodeGlyphMap.outputs.keys();
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
        outputLabelTrace.push(key);
        updateGraph = true;
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
    updateGraph = true;
}
function isInputLeafNode(index) {
    var keys = nodeGlyphMap.inputs.keys();
    if (nodeGlyphMap.inputs.get(keys[index]).subNodes.length() == 0) {
        return true;
    } else {
        return false;
    }
}
function getSubnodesForInputLevel() {
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
                } else {
                    isSignal.push({name:inputPaths[i]+"/"+inputPointer[i][0][j],isSignal:0});
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
function getCurrentInputPathsFromNodes() {
    var inputSet = nodeGlyphMap.inputs.keys();
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
        updateGraph = true;
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
    updateGraph = true;
}

function drawBackground() {
    var backgroundWidth = 700;

    if ($('#viewTab').hasClass('active')) {
        centerX1 = 550;
        centerY1 = 45+(760/2);
        centerX2 = screenWidth-550;
        centerY2 = 45+(760/2);

        globalP.noStroke();
        globalP.fill(215);
        globalP.rect(10,150,180,screenHeight+150);

        globalP.noStroke();
        globalP.fill(215);
        globalP.rect(screenWidth-190,150,180,screenHeight+150);
    } else if ($('#editTab').hasClass('active')) {
        centerX1 = 550+190;
        centerY1 = 45+(760/2);
        centerX2 = screenWidth-550+190;
        centerY2 = 45+(760/2);
    }

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

function updateListGlyphMouseState() {
    var outputSet = getCurrentOutputLevelSet();
    var inputSet = getCurrentInputLevelSet();

    var thisX = 0;
    var thisY = 0;
    var thisWidth = 200;
    var thisHeight = 28;

    var keys = nodeGlyphMap.outputs.keys();
    for (var i=0;i<outputSet.length;i++) {
        thisX = 0;
        thisY = 150+(i*32);
        if (mouseX > thisX && mouseX < thisX+thisWidth && mouseY > thisY && mouseY < thisY+thisHeight) {
            nodeGlyphMap.outputs.get(keys[i]).mouseOver = true;
        } else {
            nodeGlyphMap.outputs.get(keys[i]).mouseOver = false;
        }
    }

    keys = nodeGlyphMap.inputs.keys();
    for (var i=0;i<inputSet.length;i++) {
        thisX = screenWidth-200;
        thisY = 150+(i*32);
        if (mouseX > thisX && mouseX < thisX+thisWidth && mouseY > thisY && mouseY < thisY+thisHeight) {
            nodeGlyphMap.inputs.get(keys[i]).mouseOver = true;
        } else {
            nodeGlyphMap.inputs.get(keys[i]).mouseOver = false;

        }
    }
}
function drawListGlyphs() {
    var outputSet = getCurrentOutputLevelSet();
    var inputSet = getCurrentInputLevelSet();

    globalP.textAlign(globalP.LEFT);
    globalP.textSize(12);
    globalP.noStroke();
    for (var i=0;i<outputSet.length;i++) {
        globalP.fill(0,200,130,230);
        if (nodeGlyphMap.outputs.get(outputSet[i]).mouseOver) {
            globalP.rect(0,150+(i*32),200,28);
        }
        globalP.fill(0);
        globalP.text(outputSet[i],10,170+(i*32));
    }
    for (var i=0;i<inputSet.length;i++) {
        globalP.fill(180,180,100,230);
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
        globalP.fill(0,230,0,230);
        globalP.rect(centerX1+80-200,centerY1-120+(i*32),200,28);
        globalP.fill(0);
        globalP.text(outputLabelTrace[i],centerX1+90-200,centerY1-100+(i*32));
        traversalGlyphMap[0].push([[centerX1+80-200,centerY1-120+(i*32),200,28],
            outputLabelTrace[i]]);
    }

    for (var i=0;i<inputLabelTrace.length;i++) {
        globalP.fill(230,230,0,230);
        globalP.rect(centerX2-80,centerY2-120+(i*32),200,28);
        globalP.fill(0);
        globalP.text(inputLabelTrace[i],centerX2-70,centerY2-100+(i*32));
        traversalGlyphMap[1].push([[centerX2-80,centerY2-120+(i*32),200,28],
            inputLabelTrace[i]]);
    }
}

function updateNodeGlyphMap(signalsOnly) {
    nodeGlyphMap = {outputs:new Assoc(), inputs:new Assoc()};

    var outputSet = getCurrentOutputLevelSet();
    var inputSet = getCurrentInputLevelSet();

    var outputChildSet = getSubnodesForOutputLevel();
    var inputChildSet = getSubnodesForInputLevel();

    // outputs
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
    if (count <= 5) {
        symbolWidth = (700*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(6-1))) + (Math.PI/2) ));
    } else {
        symbolWidth = (700*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count-1))) + (Math.PI/2) ));
    }
    var layoutRadius = (700/2)-(symbolWidth/2);

    for (var i=0;i<count;i++) {
        layoutAngle = (3*Math.PI/2) - i*separationAngle;

        layoutX = centerX1 + (layoutRadius*Math.cos(layoutAngle));
        layoutY = centerY1 + (layoutRadius*Math.sin(layoutAngle));

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
        if (count2 <= 5) {
            symbolWidth2 = (symbolWidth*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(6-1))) + (Math.PI/2) ));
        } else {
            symbolWidth2 = (symbolWidth*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count2-1))) + (Math.PI/2) ));
        }
        var layoutRadius2 = (symbolWidth/2)-(symbolWidth2/2);

        var subNodes = new Assoc();
        for (var j=0;j<count2;j++) {
            layoutAngle2 = (3*Math.PI/2) - j*separationAngle2;
            layoutX2 = layoutX + (layoutRadius2*Math.cos(layoutAngle2));
            layoutY2 = layoutY + (layoutRadius2*Math.sin(layoutAngle2));
            subNodes.add(outputChildSet[i][j].name,{layoutX:layoutX2,layoutY:layoutY2,symbolWidth:symbolWidth2,isSignal:outputChildSet[i][j].isSignal});
        }

        if (!signalsOnly || subNodes.length() == 0) {
            nodeGlyphMap.outputs.add(outputSet[i], {layoutX:layoutX,layoutY:layoutY,symbolWidth:symbolWidth,mouseOver:false,subNodes:subNodes,selected:false,visible:true});
        } else {
            nodeGlyphMap.outputs.add(outputSet[i], {layoutX:layoutX,layoutY:layoutY,symbolWidth:symbolWidth,mouseOver:false,subNodes:subNodes,selected:false,visible:false});
        }
    }

    // inputs
    count = inputSet.length;

    if (count > 1) {
        separationAngle = Math.PI/(count-1);
    } else {
        separationAngle = Math.PI/(count);
    }

    if (count <= 5) {
        symbolWidth = (700*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(6-1))) + (Math.PI/2) ));
    } else {
        symbolWidth = (700*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count-1))) + (Math.PI/2) ));
    }
    layoutRadius = (700/2)-(symbolWidth/2);

    for (var i=0;i<count;i++) {
        layoutAngle = i*separationAngle + (3*Math.PI/2);

        layoutX = centerX2 + (layoutRadius*Math.cos(layoutAngle));
        layoutY = centerY2 + (layoutRadius*Math.sin(layoutAngle));

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
        if (count2 <= 5) {
            symbolWidth2 = (symbolWidth*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(6-1))) + (Math.PI/2) ));
        } else {
            symbolWidth2 = (symbolWidth*Math.PI)/(2*( (Math.PI/Math.sin(Math.PI/(count2-1))) + (Math.PI/2) ));
        }
        var layoutRadius2 = (symbolWidth/2)-(symbolWidth2/2);

        var subNodes = new Assoc();
        for (var j=0;j<count2;j++) {
            layoutAngle2 = j*separationAngle2 + (3*Math.PI/2);
            layoutX2 = layoutX + (layoutRadius2*Math.cos(layoutAngle2));
            layoutY2 = layoutY + (layoutRadius2*Math.sin(layoutAngle2));
            subNodes.add(inputChildSet[i][j].name,{layoutX:layoutX2,layoutY:layoutY2,symbolWidth:symbolWidth2,isSignal:inputChildSet[i][j].isSignal});
        }

        if (!signalsOnly || subNodes.length() == 0) {
            nodeGlyphMap.inputs.add(inputSet[i], {layoutX:layoutX,layoutY:layoutY,symbolWidth:symbolWidth,mouseOver:false,subNodes:subNodes,selected:false,visible:true});
        } else {
            nodeGlyphMap.inputs.add(inputSet[i], {layoutX:layoutX,layoutY:layoutY,symbolWidth:symbolWidth,mouseOver:false,subNodes:subNodes,selected:false,visible:false});
        }
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

        if (nodeGlyphMap.outputs.get(keys[i]).selected && nodeGlyphMap.outputs.get(keys[i]).mouseOver) {
            globalP.fill(255,100,130,230);
        } else if (nodeGlyphMap.outputs.get(keys[i]).selected) {
            globalP.fill(255,0,0,230);
        } else if (nodeGlyphMap.outputs.get(keys[i]).mouseOver) {
            globalP.fill(0,200,130,230);
        }
        globalP.ellipse(thisX,thisY,thisWidth,thisWidth);

        subNodes = nodeGlyphMap.outputs.get(keys[i]).subNodes.keys();
        if (nodeGlyphMap.outputs.get(keys[i]).visible) {
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

        if (nodeGlyphMap.inputs.get(keys[i]).selected && nodeGlyphMap.inputs.get(keys[i]).mouseOver) {
            globalP.fill(255,100,130,230);
        } else if (nodeGlyphMap.inputs.get(keys[i]).selected) {
            globalP.fill(255,0,0,230);
        } else if (nodeGlyphMap.inputs.get(keys[i]).mouseOver) {
            globalP.fill(180,180,100,230);
        }
        globalP.ellipse(thisX,thisY,thisWidth,thisWidth);

        subNodes = nodeGlyphMap.inputs.get(keys[i]).subNodes.keys();
        if (nodeGlyphMap.inputs.get(keys[i]).visible) {
        for (var j=0;j<subNodes.length;j++) {
            if (nodeGlyphMap.inputs.get(keys[i]).subNodes.get(subNodes[j]).isSignal) {
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
        }
        }
    }

}

var connectionOutputMatches = [];
var connectionInputMatches = [];
function updateEdgeGlyphMap(signalsOnly) {

    edgeGlyphMap = new Assoc();

    var outputSet = getCurrentOutputPathsFromNodes();
    var inputSet = getCurrentInputPathsFromNodes();

    var outputChildren = getSubnodesForOutputLevel();
    var inputChildren = getSubnodesForInputLevel();
    var outputLevel = getCurrentOutputLevelSet();
    var inputLevel = getCurrentInputLevelSet();

    connectionOutputMatches = [];
    connectionInputMatches = [];
    var connectionKeys = connections.keys();
    var onceFilteredConnectionKeys = [];
    var twiceFilteredConnectionKeys = [];

    // fix for bug involving top level view when the filter match happens at lower levels
    // very likely performs redundant computations that are done latter in this function
    for (var i=0;i<connectionKeys.length;i++) {
        for (var j=0;j<filterMatches[0].length;j++) {
            var exp1 = new RegExp(filterMatches[0][j][0]+filterMatches[0][j][1]+">");
            if (connectionKeys[i].match(exp1)) {
                onceFilteredConnectionKeys.push(connectionKeys[i]);
            }
        }
    }
  
    for (var i=0;i<onceFilteredConnectionKeys.length;i++) {
        for (var j=0;j<filterMatches[1].length;j++) {
            var exp2 = new RegExp(">"+filterMatches[1][j][0]+filterMatches[1][j][1]);
            if (onceFilteredConnectionKeys[i].match(exp2)) {
                twiceFilteredConnectionKeys.push(onceFilteredConnectionKeys[i]);
            }
        }
    }

    for (var i=0;i<twiceFilteredConnectionKeys.length;i++) {
        for (var j=0;j<outputSet.length;j++) {

            var exp1 = new RegExp(outputSet[j]+">");
            var exp2 = new RegExp(outputSet[j]+".*>");
            if (twiceFilteredConnectionKeys[i].match(exp1)) {
                connectionOutputMatches.push(twiceFilteredConnectionKeys[i]); 
                edgeGlyphMap.add(twiceFilteredConnectionKeys[i], {output:outputLevel[j],outputChild:outputSet[j],isOutputSubnode:false});
            } else if (twiceFilteredConnectionKeys[i].match(exp2) && !signalsOnly) {
                connectionOutputMatches.push(twiceFilteredConnectionKeys[i]); 
                for (var k=0;k<outputChildren[j].length;k++) {
                    var exp3 = new RegExp(outputChildren[j][k].name+".*>");
                    if (twiceFilteredConnectionKeys[i].match(exp3)) {
                        edgeGlyphMap.add(twiceFilteredConnectionKeys[i], {output:outputLevel[j],outputChild:outputChildren[j][k].name,isOutputSubnode:true});
                    }
                }
            }
        }
    }

    for (var i=0;i<connectionOutputMatches.length;i++) {
        for (var j=0;j<inputSet.length;j++) {
            var exp1 = new RegExp(">"+inputSet[j]+".+");
            var exp2 = new RegExp(">"+inputSet[j]+".*");
            if (connectionOutputMatches[i].match(exp1) && !signalsOnly) {
                connectionInputMatches.push(connectionKeys[i]); 
                for (var k=0;k<inputChildren[j].length;k++) {
                    var exp3 = new RegExp(">"+inputChildren[j][k].name+".*");
                    if (connectionOutputMatches[i].match(exp3)) {
                        edgeGlyphMap.get(connectionOutputMatches[i]).input = inputLevel[j];
                        edgeGlyphMap.get(connectionOutputMatches[i]).inputChild = inputChildren[j][k].name;
                        edgeGlyphMap.get(connectionOutputMatches[i]).isInputSubnode = true;
                    }
                }
            } else if (connectionOutputMatches[i].match(exp2)) {
                connectionInputMatches.push(connectionOutputMatches[i]); 
                edgeGlyphMap.get(connectionOutputMatches[i]).input = inputLevel[j];
                edgeGlyphMap.get(connectionOutputMatches[i]).inputChild = inputSet[j];
                edgeGlyphMap.get(connectionOutputMatches[i]).isInputSubnode = false;
            }
        }
    }

    var keys = edgeGlyphMap.keys();
    var x1, y1, x2, y2;
    var cx1, cy1, cx2, cy2;
    for (var i=0;i<keys.length;i++) {
        if (edgeGlyphMap.get(keys[i]).input != undefined) {

            if (edgeGlyphMap.get(keys[i]).isOutputSubnode) {
                x1 = nodeGlyphMap.outputs.get(edgeGlyphMap.get(keys[i]).output).subNodes.get(edgeGlyphMap.get(keys[i]).outputChild).layoutX;
                y1 = nodeGlyphMap.outputs.get(edgeGlyphMap.get(keys[i]).output).subNodes.get(edgeGlyphMap.get(keys[i]).outputChild).layoutY;
            } else {
                x1 = nodeGlyphMap.outputs.get(edgeGlyphMap.get(keys[i]).output).layoutX;
                y1 = nodeGlyphMap.outputs.get(edgeGlyphMap.get(keys[i]).output).layoutY;
            }
            if (edgeGlyphMap.get(keys[i]).isInputSubnode) {
                x2 = nodeGlyphMap.inputs.get(edgeGlyphMap.get(keys[i]).input).subNodes.get(edgeGlyphMap.get(keys[i]).inputChild).layoutX;
                y2 = nodeGlyphMap.inputs.get(edgeGlyphMap.get(keys[i]).input).subNodes.get(edgeGlyphMap.get(keys[i]).inputChild).layoutY;
            } else {
                x2 = nodeGlyphMap.inputs.get(edgeGlyphMap.get(keys[i]).input).layoutX;
                y2 = nodeGlyphMap.inputs.get(edgeGlyphMap.get(keys[i]).input).layoutY;
            }
            edgeGlyphMap.get(keys[i]).x1 = x1;
            edgeGlyphMap.get(keys[i]).y1 = y1;
            edgeGlyphMap.get(keys[i]).x2 = x2;
            edgeGlyphMap.get(keys[i]).y2 = y2;

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
            edgeGlyphMap.get(keys[i]).cx1 = cx1;
            edgeGlyphMap.get(keys[i]).cy1 = cy1;
            edgeGlyphMap.get(keys[i]).cx2 = cx2;
            edgeGlyphMap.get(keys[i]).cy2 = cy2;
            edgeGlyphMap.get(keys[i]).mouseOver = false;
            edgeGlyphMap.get(keys[i]).selected = false;
        }
    }

}

function drawEdges() {

    var keys = edgeGlyphMap.keys();
    var x1, y1, x2, y2;
    var cx1, cy1, cx2, cy2;
    globalP.strokeWeight(3);
    globalP.noFill();
    for (var i=0;i<keys.length;i++) {
        if (edgeGlyphMap.get(keys[i]).input != undefined) {
            x1 = edgeGlyphMap.get(keys[i]).x1;
            y1 = edgeGlyphMap.get(keys[i]).y1;
            x2 = edgeGlyphMap.get(keys[i]).x2;
            y2 = edgeGlyphMap.get(keys[i]).y2;
            cx1 = edgeGlyphMap.get(keys[i]).cx1;
            cy1 = edgeGlyphMap.get(keys[i]).cy1;
            cx2 = edgeGlyphMap.get(keys[i]).cx2;
            cy2 = edgeGlyphMap.get(keys[i]).cy2;

            globalP.stroke(0);
            if (edgeGlyphMap.get(keys[i]).selected) {
                globalP.stroke(255,0,0);
            }
            if (edgeGlyphMap.get(keys[i]).mouseOver) {
                globalP.stroke(0,0,255);
            }
            globalP.bezier(x1,y1,cx1,cy1,cx2,cy2,x2,y2);
        }
    }

}

function activateViewMode() {
    $('#addMappingForm').toggle(false);

	$('#globalCanvas').toggle(true);

	$('#viewTab').toggleClass('active',true);
	$('#viewTab').toggleClass('inactive',false);
	$('#editTab').toggleClass('active',false);
	$('#editTab').toggleClass('inactive',true);

    updateGraph = true;
}
function activateEditMode() {
    $('#addMappingForm').toggle(true);

	$('#globalCanvas').toggle(true);

	$('#viewTab').toggleClass('active',false);
	$('#viewTab').toggleClass('inactive',true);
	$('#editTab').toggleClass('active',true);
	$('#editTab').toggleClass('inactive',false);

    updateGraph = true;
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

function doConnect() {
    var sourceDevice = selectedSource.split("/");
    var destinationDevice = selectedDestination.split("/");
    command.send('link', ["/"+sourceDevice[1],"/"+destinationDevice[1]]);
    command.send('connect', [selectedSource,selectedDestination]);

}
function doDisconnect() {
    var sourceDevice = selectedSource.split("/");
    var destinationDevice = selectedDestination.split("/");
    // TODO: check and unlink if no more connection
    //command.send('unlink', ["/"+sourceDevice[1],"/"+destinationDevice[1]]);
    command.send('disconnect', [selectedSource,selectedDestination]);
}
function doModifyConnection() {
    var argCopy = $.extend(true,{},connections.get(selectedEdge));
    argCopy['expression'] = encodeURIComponent($('#exprInput').val());
    argCopy['range'][0] = parseFloat($('#mappingSourceMinInput').val());
    ankrgCopy['range'][1] = parseFloat($('#mappingSourceMaxInput').val());
    argCopy['range'][2] = parseFloat($('#mappingDestMinInput').val());
    argCopy['range'][3] = parseFloat($('#mappingDestMaxInput').val());
    argCopy['mode'] = connectionModeCommands[connectionModes[parseInt($('#modeMenu').val())]];

    command.send('set_connection',argCopy);

    return argCopy;
}

//FIXME all structures seem to have a last element of undefined
devices = new Assoc();
signals = new Assoc();
links = new Assoc();
connections = new Assoc();

connectionModes = ["None", "Byp", "Line", "Expr", "Calib"];
connectionModeCommands = {"Byp": 'bypass',
                          "Line": 'linear',
                          "Calib": 'calibrate',
                          "Expr": 'expression'};

var activeFilter = "";
var latestQuery = [];
var filterMatches = [[],[],[]]; // outputs,inputs,mappings

function updateActiveFilter() {
	signalPagePointer = 0;
	mappingPagePointer = 0;

	activeFilter = $('#filterInput').val();
	activeFilter = activeFilter+'';
	activeFilter = activeFilter.replace(/^\s*(.*?)\s*$/,"$1").toLowerCase();

	/*
	    namespace matching
	*/
    latestQuery = activeFilter.match(/\S+/ig);
	if (latestQuery != null) {
	} else {
        latestQuery = [""];
	}
}

function updateSignalMatches() {
	filterMatches = [[],[],[]];

    var keys = signals.keys();
    for (var i=0;i<keys.length;i++) {
		o: for (var j=0;j<latestQuery.length;j++) {
               //namespace matching
               if (keys[i].match(new RegExp(latestQuery[j],"ig")) == null) {
                   continue o;
               }

               if (signals.get(keys[i]).direction  == 1) {	
                   filterMatches[0].push([signals.get(keys[i]).device_name,signals.get(keys[i]).name]);
                   break;
               } else if (signals.get(keys[i]).direction == 0) {	
                   filterMatches[1].push([signals.get(keys[i]).device_name,signals.get(keys[i]).name]);
                   break;
               }
        }
    }
}

var filterMatches = [[],[],[]];
var levels = [[[]],[[]]];
function updateLevelStructure() {
    levels = [[[]],[[]]];

	//outputs
	filterMatches[0].sort();
	for (var i=0;i<filterMatches[0].length;i++) {
        levels[0].push([filterMatches[0][i][0]]);  

		var splitArray = filterMatches[0][i][1].split("/");
		for (var j=1;j<splitArray.length;j++) {
            levels[0][levels[0].length-1].push(splitArray[j]);
		}
	}
    levels[0] = clusterSignals(levels[0], 0);


	//inputs
	filterMatches[1].sort();
	for (var i=0;i<filterMatches[1].length;i++) {
        levels[1].push([filterMatches[1][i][0]]);

		var splitArray = filterMatches[1][i][1].split("/");
		for (var j=1;j<splitArray.length;j++) {
            levels[1][levels[1].length-1].push(splitArray[j]);
		}
	}
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
