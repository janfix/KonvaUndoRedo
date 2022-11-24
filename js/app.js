/* Cases to follow for the undo redo project 
    - cancel element creation
    - cancel element modification <----- we are focus here for the moment !
    - cancel element deletion

    Warning : This program is a work in progress don't use it for production !!!!!
*/


/* Preparing the Pile */
var pile = [];
var pilePointer = 1
var storageCapacity = 30;

/* Storing objects state*/
function storingKObject(KObject) {
    pilePointer = 1;
    if (pile.length < storageCapacity) {
        var KOJson = JSON.stringify(KObject) //Preparing the object state storage
        pile.push(KOJson);
    } else {
        pile.shift();
        var KOJson = JSON.stringify(KObject) //Preparing the object state storage
        pile.push(KOJson);
    }
}

/* Stage and Layer */
var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
});

var layer = new Konva.Layer();

/* Konva Objects */
var objGroup = new Konva.Group({
    id: "Group1",
    x: stage.width() / 4,
    y: stage.height() / 4,
    draggable: true
});

var rect1 = new Konva.Rect({
    id: 'rect1',
    width: 300,
    height: 50,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4,
});

var groupHandler = new Konva.Rect({
    id: "GHandler",
    x: 0,
    y: 100,
    width: 300,
    height: 10,
    fill: 'cyan',
    stroke: 'green',
    strokeWidth: 1,
    //draggable: true
});

var circle1 = new Konva.Circle({
    id: "Circle1",
    x: 100,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
})

objGroup.add(rect1, circle1, groupHandler)
storingKObject(rect1);
storingKObject(circle1);

/* Listeners on Objects */

rect1.on("click", function() {
    var randomColor = getRandomColor();
    this.fill(randomColor)
    this.draggable(true)
    layer.draw();
    storingKObject(this)
})

circle1.on("click", function() {
    var randomColor = getRandomColor();
    this.fill(randomColor)
    this.draggable(true)
    layer.draw();
    storingKObject(this)
})


/* Special Listener for Undo-Redo
   The example is on position but it could be also on scaling, filtering...

   Position management */
circle1.on("dragend", function() {
    storingKObject(this)
})

rect1.on("dragend", function() {
    storingKObject(this)
})

//This is done to isolate Groupe Move. If not : each element of the group can trigger also the dragstart event. It adds more event and inflate artificially the pile. 
var controlGroup = [];
objGroup.on("dragstart", function() {
    controlGroup = [this.x(), this.y()];
})

objGroup.on("dragend", function() {
    if (controlGroup[0] == this.x() && controlGroup[1] == this.y()) {
        storingKObject(this)
            //console.log(controlGroup + " - Not registered because no group move")
    } else {
        storingKObject(this)
    }
})

// add the group to the layer
layer.add(objGroup);
storingKObject(objGroup)
console.log(pile)

// add the layer to the stage
stage.add(layer);


/* Undo Listener */
const undoBT = document.getElementById("undo");
undoBT.addEventListener("click", undo);

const redoBT = document.getElementById("redo");
redoBT.addEventListener("click", redo);


function undo() {
    //Rebuild the Last element of the array as an object
    console.log("Pile Length = " + pile.length)
    if (pilePointer < pile.length - 1) {
        pilePointer++;
        console.log("Pile Pointer = " + pilePointer)
    } else {
        pilePointer = 0
    }

    changeState(pilePointer)
}


function redo() {
    //Rebuild the Last element of the array as an object
    console.log("Pile Pointer = " + pilePointer)
    pilePointer--;
    if (pilePointer < 0) {
        console.log("INF à 0")
        pilePointer = pile.length - 1
    }

    changeState(pilePointer)
}

function changeState(pilePointer) {
    console.log(pile)
    try {
        var lastActionState = JSON.parse(pile[pile.length - pilePointer]) //Clean to text
    } catch (error) {
        console.log("error")

        var lastActionState = JSON.parse(pile[0])
    }
    lastActionState = JSON.parse(lastActionState) // Build the object
    var objToRestore = stage.findOne("#" + lastActionState.attrs.id);
    console.log(objToRestore)
    if (objToRestore.nodeType == "Group") {
        objToRestore.x(lastActionState.attrs.x)
        objToRestore.y(lastActionState.attrs.y)
    } else {
        objToRestore.fill(lastActionState.attrs.fill)
        objToRestore.x(lastActionState.attrs.x)
        objToRestore.y(lastActionState.attrs.y)
    }

    layer.draw()
}


// Random Color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}