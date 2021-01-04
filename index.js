var clone = null;
var screenRatio;
var isLandscape;
var elements = {}

window.addEventListener("mouseup", dropClone);
window.addEventListener("mousemove", updateClone);

var frames = [
    {
        name: "large",
        src: "frames/largeFrame.png",
        width: 12.875,
        height: 16.875,
    },
    {
        name: "medium",
        src: "frames/mediumFrame.png",
        width: 8.875,
        height: 10.875,
    },
    {
        name: "small",
        src: "frames/smallFrame.png",
        width: 6.875,
        height: 8.875,
    },
    {
        name: "lastName",
        src: "frames/crusseFrame.png",
        width: 17.9375,
        height: 17.9375,
    }
]

function getFrame(name) {
    for(frame of frames) {
        if(frame.name == name) {
            return frame;
        }
    }

    return null;
}

function init() {
    elements.wrapper = document.getElementById("wrapper");
    elements.background = document.getElementById("background");
    elements.palette = document.getElementById("palette");
    elements.workspace = document.getElementById("workspace");

    resizeWindow();
}

window.addEventListener('resize', resizeWindow);
function resizeWindow() {
    screenRatio = window.innerWidth / window.innerHeight;
    if(screenRatio > 1.6) {
        isLandscape = true;
    } else {
        isLandscape = false;
    }
    
    //don't question it
    elements.background.style.maxWidth = "1px";
    elements.background.style.maxHeight = "1px";

    if(isLandscape) {
        elements.wrapper.style.flexDirection = "row";
        elements.palette.style.flexDirection = "column";

        elements.background.style.maxWidth = '100%';
        elements.background.style.maxHeight = '100vh';
    } else {
        elements.wrapper.style.flexDirection = "column";
        elements.palette.style.flexDirection = "row";

        if(screenRatio > 1.1) {
            elements.background.style.maxHeight = elements.workspace.clientHeight + "px";
            elements.background.style.maxWidth = (elements.workspace.clientWidth * 1.333) + "px";
        } else {
            elements.background.style.maxWidth = "100%";
            elements.background.style.maxHeight = (elements.workspace.clientWidth / 1.333) + "px";
        }
    }

    addImagesToPalette();
}

function addImagesToPalette() {
    elements.palette.innerHTML = "";
    
    for(let frame of frames) {
        var elem = new Image();
        elem.src = frame.src;
        elem.addEventListener('mousedown', createClone);
        elem.draggable = false;
        if(isLandscape) {
            elem.style.width = (frame.width * elements.palette.clientWidth * 0.045) + "px";
        } else {
            elem.style.height = (frame.height * elements.palette.clientHeight * 0.045) + "px";
        }
        elem.id = frame.name;
        elem.class = "frame";
        elements.palette.appendChild(elem);
        elements[frame.name] = document.getElementById(frame.name);
    }
}

function resizeImage(img) {
    img.width = 10;
    img.height = 10;
}

function createClone(e) {
    var imgName = e.path[0].id;
    var img = getFrame(imgName);

    var rect = elements[imgName].getBoundingClientRect();
    //var dx = e.clientX - rect.x + PADDING;
    //var dy = e.clientY - rect.y;
    var dx = e.clientX;
    var dy = e.clientY;
    console.log(imgName)
    console.log(dx + ", " + dy);
    clone = new Image();
    clone.src = img.src;
    clone.id = "clone";
    Object.assign(clone.style, {
        position: "absolute",
        //left: dx + "px",
        //top: dy + "px",
        left: 0,
        top: 0,
        transform: "translate(" + dx + "px, " + dy + "px)",
        width: "20%"
    });

    document.body.appendChild(clone);
}

function dropClone() {
    console.log('bye clone')
    document.body.removeChild(clone);
    clone = null;
}

function translateClone(x, y) {
    clone.style.transform = "translate(" + x + "px, " + y + "px)";
}

function updateClone(e) {
    translateClone(e.clientX, e.clientY);
}

init();
