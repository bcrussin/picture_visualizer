var screenRatio;
var isLandscape;
var elements = {}

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

        var r = elements.workspace.clientWidth / elements.workspace.clientHeight;
        

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
        if(isLandscape) {
            elem.style.width = (frame.width * elements.palette.clientWidth * 0.045) + "px";
        } else {
            elem.style.height = (frame.height * elements.palette.clientHeight * 0.045) + "px";
        }
        elem.id = frame.name;
        elem.class = "frame";
        elements.palette.appendChild(elem);
    }
}

function resizeImage(img) {
    img.width = 10;
    img.height = 10;
}

init();