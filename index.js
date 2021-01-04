const DBL_CLICK = 400;

var clone = null;
var cloneOffset = [0, 0];
var cloneIndex;

var screenRatio;
var isLandscape;
var elements = {}

var dragPosStart;
var lastClick = Date.now();
var firstResize = true;

window.addEventListener("touchstart", function(e) {
    e.preventDefault();
}, { passive: false });

window.addEventListener("mouseup", dropClone);
window.addEventListener("mousemove", updateClone);

window.addEventListener("touchend", dropClone, { passive: false });
window.addEventListener("touchmove", updateClone, { passive: false });

var backgrounds = [
    {
        name: "livingRoomMedium",
        src: "backgrounds/livingRoomMedium.JPG",
        width: 8640 //12181
    },
    {
        name: "livingRoomLarge",
        src: "backgrounds/livingRoomLarge.JPG",
        width: 12181
    }
]

function getBackground(name) {
    for(bkg of backgrounds) {
        if(bkg.name == name) {
            return bkg;
        }
    }

    return null;
}

var frames = [
    {
        name: "large",
        src: "frames/largeFrame.png",
        width: 927, //12.875,
        height: 1215, //16.875,
    },
    {
        name: "medium",
        src: "frames/mediumFrame.png",
        width: 639, //8.875,
        height: 783, //10.875,
    },
    {
        name: "small",
        src: "frames/smallFrame.png",
        width: 495, //6.875,
        height: 639, //8.875,
    },
    {
        name: "lastName",
        src: "frames/crusseFrame.png",
        width: 1295, //17.9375,
        height: 1291, //17.9375,
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
    elements.tooltip = document.getElementById("tooltip");

    elements.tooltip.style.display = "none";

    addBackground("livingRoomLarge");
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

    if(firstResize) {
        firstResize = false;
    } else {
        //elements.tooltip.style.display = "inline-flex";
        unfade(elements.tooltip);
        setTimeout(hideTooltip, 5000);
    }

    window.scrollTo(0, 0);
}

function addImagesToPalette() {
    elements.palette.innerHTML = "";
    
    for(let frame of frames) {
        var elem = new Image();
        elem.src = frame.src;
        elem.addEventListener('mousedown', createClone);
        elem.addEventListener('touchstart', createClone, { passive: false });
        elem.draggable = false;
        if(isLandscape) {
            elem.style.width = (frame.width * elements.palette.clientWidth * 0.0006) + "px";
        } else {
            elem.style.height = (frame.height * elements.palette.clientHeight * 0.00075) + "px";
        }
        elem.id = frame.name;
        elem.class = "frame";
        elements.palette.appendChild(elem);
        elements[frame.name] = document.getElementById(frame.name);
    }
}

function addBackground(name) {
    var bkg = getBackground(name);
    elements.background = new Image();
    elements.background.src = bkg.src;
    elements.background.id = "background";
    elements.workspace.appendChild(elements.background);

    resizeWindow();
}

function resizeImage(img) {
    img.width = 10;
    img.height = 10;
}

function createClone(e) {
    e.preventDefault();

    var imgName;
    if(e.type === "touchstart") {
        e = e.touches[0];
        imgName = e.target.id;
    } else {
        imgName = e.path[0].id;
    }

    var img = getFrame(imgName);

    var rect = elements[imgName].getBoundingClientRect();
    var dx = e.clientX;
    var dy = e.clientY;
    //console.log(imgName)
    //console.log(dx + ", " + dy);
    clone = new Image();
    clone.src = img.src;
    //clone.id = "clone";

    var r = elements.background.width / backgrounds[0].width;
    var w = (r * getFrame(imgName).width) + "px";

    Object.assign(clone.style, {
        position: "absolute",
        //left: dx + "px",
        //top: dy + "px",
        left: 0,
        top: 0,
        transform: "translate(" + dx + "px, " + dy + "px)",
        width: w
    });

    document.body.appendChild(clone);

    cloneOffset = [0, 0];
}

function pickUpClone(e) {
    e.preventDefault();

    /*if(e.detail > 1) {
        clone = null;
        return;
    }*/
    
    if(e.type === "touchstart") {
        e = e.touches[0];
        clone = e.target;
        dragPosStart = [e.clientX, e.clientY];
    } else {
        clone = e.path[0];
    }

    cloneIndex = clone.style.zIndex;
    clone.style.zIndex = 1000;
    var rect = clone.getBoundingClientRect();
    cloneOffset = [e.clientX - rect.x, e.clientY - rect.y];
}

function mouseUpClone(e) {
    var dt = Date.now() - lastClick;
    if(dt > 0 && dt < DBL_CLICK) {
        rotateClone(e);
        lastClick = Date.now() - DBL_CLICK;
        return;
    }
    lastClick -= DBL_CLICK;
    lastClick = Date.now();
}

function dropClone(e) {
    if(e.type === "touchend") {
        e = e.changedTouches[0];
    }

    if(clone != null) {
        clone.style.zIndex = cloneIndex;
        var isValid = true;
        var validRect = elements.background.getBoundingClientRect();
        var cloneRect = clone.getBoundingClientRect();
        if(e.clientX < validRect.x || e.clientX + cloneRect.width > validRect.x + validRect.width) isValid = false;
        if(e.clientY < validRect.y || e.clientY + cloneRect.height > validRect.y + validRect.height) isValid = false;

        if(!isValid) {
            document.body.removeChild(clone);
        } else {
            clone.addEventListener("mousedown", pickUpClone);
            clone.addEventListener("mouseup", mouseUpClone);
            //clone.addEventListener("dblclick", rotateClone);
            clone.addEventListener("touchstart", pickUpClone, { passive: false });
            clone.addEventListener("touchend", rotateClone, { passive: false });
        }
    }
    
    clone = null;
}

function getRotFromTransform(tString) {
    transform = tString.split("rotate(");
    var rot = transform[transform.length - 1];
    rot = rot.replace("deg)", "");

    //console.log("rot: " + rot);

    return rot;
}

function getPosFromTransform(tString) {
    transform = tString.split("rotate(");
    var pos = transform[0].replace("translate(", "").replace(/px/gi, "").replace(") ", ""); //please ignore this
    pos = pos.split(", ");

    //console.log("pos: [" + pos[0] + ", " + pos[1] + "]");

    return pos;
}

function translateClone(x, y) {
    if(clone === clone) {
        var rot = "0";
        if(clone.style.transform.includes("rotate(")) {
            rot = getRotFromTransform(clone.style.transform);
        }
        clone.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + rot + "deg)";
    }
}

function updateClone(e) {
    if(clone != null) {
        e.preventDefault();
        if(e.type === "touchmove") e = e.touches[0];
        translateClone(e.clientX - cloneOffset[0], e.clientY - cloneOffset[1]);
    }
}

function rotateClone(e) {
    e.preventDefault();
    console.log(dragPosStart);
    if(e.type === "touchend") {
        e = e.changedTouches[0];
        console.log(e.clientX + ", " + e.clientY)
        if(Math.abs(e.clientX - dragPosStart[0]) > 10 || Math.abs(e.clientY - dragPosStart[1] > 10)) {
            return;
        }
        clone = e.target;
    } else {
        clone = e.path[0];
    }

    
    var rot = getRotFromTransform(clone.style.transform);
    if(rot === "0") rot = "90";
    else rot = "0";
    var pos = getPosFromTransform(clone.style.transform);
    clone.style.transform = "translate(" + pos[0] + "px, " + pos[1] + "px) rotate(" + rot + "deg)";
    clone = null;
}

function hideTooltip() {
    //elements.tooltip.style.display = "none";
    fade(elements.tooltip);
}

// https://stackoverflow.com/a/6121270/14934860
function fade(element) {
    var op = 1;  // initial opacity
    element.style.opacity = op;
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.2;
    }, 50);
}

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.opacity = op;
    element.style.display = 'inline-flex';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}
// ____________________________________________

init();
