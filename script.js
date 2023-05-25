/*
Title: Color Picker
Description: Allows a user to pick or enter custom colors and view related 
colors.
Last Updated: May 24, 2023
Developer: Alexander Beck
Email: beckhv2@gmail.com
Github: https://github.com/bexcoding
*/

function createCanvas() {
    var colorCanvas = document.getElementById('color-canvas');
    var ColorCtx = colorCanvas.getContext('2d');  // This create a 2D context for the canvas
    var color = 'rgba(0, 0, 255, 1)';
    let gradientH = ColorCtx.createLinearGradient(0, 0, ColorCtx.canvas.width, 0);
    gradientH.addColorStop(0, 'rgba(255, 255, 255, 0');
    gradientH.addColorStop(0.9, color);
    ColorCtx.fillStyle = gradientH;
    ColorCtx.fillRect(0, 0, ColorCtx.canvas.width, ColorCtx.canvas.height);   
    // Create a Vertical Gradient(white to black)
    let gradientV = ColorCtx.createLinearGradient(0, 0, 0, 300);
    gradientV.addColorStop(0, 'rgba(255, 255, 255, 0.2');
    gradientV.addColorStop(0.5, 'rgba(0, 0, 0, 1');
    ColorCtx.fillStyle = gradientV;
    ColorCtx.fillRect(0, 0, ColorCtx.canvas.width, ColorCtx.canvas.height);

}

function updateRelated() {
    resetDisplay(document.getElementById('related-color-display'));
    const mainColor = new Hsl(281,.58,.39);
    const colorType = document.getElementById('related').value;
    makePalette(colorType, mainColor);

    //reset related color display
    function resetDisplay(parent) {
        while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
        };
    }


    //make new color square
    function makeSquare(hex) {
        const square = document.createElement('div');
        square.setAttribute('class', 'color-tile');
        square.setAttribute('id', `${hex}`);
        document.getElementById('related-color-display').appendChild(square);
        const top = document.createElement('div');
        top.setAttribute('class', 'tile-top');
        top.style.backgroundColor = hex;
        const bottom = document.createElement('div');
        bottom.setAttribute('class', 'tile-bottom');
        bottom.innerHTML = hex;
        document.getElementById(`${hex}`).appendChild(top);
        document.getElementById(`${hex}`).appendChild(bottom);
    }


    //decides how many squares to make
    function makePalette(relation, mainColor) {
        const mainHex = rgbToHex(hslToRgb(mainColor));
        if (relation === 'complimentary') {
            const complement = new Hsl(((mainColor.hue + 180) % 360), mainColor.saturation, mainColor.lightness);
            makeSquare(mainHex);
            makeSquare(rgbToHex(hslToRgb(complement)));
        } else if (relation === 'triadic') {
            const second = new Hsl(((mainColor.hue + 120) % 360), mainColor.saturation, mainColor.lightness); 
            const third = new Hsl(((mainColor.hue + 240) % 360), mainColor.saturation, mainColor.lightness);
            makeSquare(mainHex);
            makeSquare(rgbToHex(hslToRgb(second)));
            makeSquare(rgbToHex(hslToRgb(third)));
        } else if (relation === 'tetradic') {
            const tetra2 = new Hsl(((mainColor.hue + 90) % 360), mainColor.saturation, mainColor.lightness);
            const tetra3 = new Hsl(((mainColor.hue + 180) % 360), mainColor.saturation, mainColor.lightness);
            const tetra4 = new Hsl(((mainColor.hue + 270) % 360), mainColor.saturation, mainColor.lightness);
            makeSquare(mainHex);
            makeSquare(rgbToHex(hslToRgb(tetra2)));
            makeSquare(rgbToHex(hslToRgb(tetra3)));
            makeSquare(rgbToHex(hslToRgb(tetra4)));
        } else if (relation === 'hues') {
            let currentHue = mainColor.hue;
            for (let i = 0; i < 8; i++) {
                makeSquare(rgbToHex(hslToRgb(new Hsl((currentHue % 360), mainColor.saturation, mainColor.lightness))));
                currentHue = currentHue + 45;
            };
        } else if (relation === 'saturation') {
            let currentSat = 0;
            for (let i = 0; i < 8; i++) {
                makeSquare(rgbToHex(hslToRgb(new Hsl(mainColor.hue, currentSat, mainColor.lightness))));
                currentSat = currentSat + 0.12;
            };
        } else {
            let currentLight = 0;
            for (let i = 0; i < 8; i++) {
                makeSquare(rgbToHex(hslToRgb(new Hsl(mainColor.hue, mainColor.saturation, currentLight))));
                currentLight = currentLight + 0.12;
            };
        };
    }
}

//creates hsl object
function Hsl(h, s, l) {
    this.hue = h;
    this.saturation = s;
    this.lightness = l;
}


//creates rgb object
function Rgb(r, g, b) {
    this.red = r;
    this.green = g;
    this.blue = b;
}


//check for valid hsl object
function checkHsl(hslObject) {
    return ((hslObject.hue >= 0 && hslObject.hue <= 360) &&
            (hslObject.saturation >= 0 && hslObject.saturation <= 1) &&
            (hslObject.lightness >= 0 && hslObject.lightness <= 1)); 
}


//converts hsl object to rgb object
function hslToRgb(hslValue) {
    if (checkHsl(hslValue)) {
        const c = (1 - Math.abs((2 * hslValue.lightness) - 1)) * hslValue.saturation;
        const hPrime = hslValue.hue / 60;
        const x = c * (1 - Math.abs(hPrime % 2 - 1));
        const m = hslValue.lightness - (c / 2);
        let r1 = 0;
        let g1 = 0;
        let b1 = 0;
        if (hPrime >= 0 && hPrime <= 1) {
            r1 = c;
            g1 = x;
        } else if (hPrime >= 1 && hPrime <= 2) {
            r1 = x;
            g1 = c;
        } else if (hPrime >= 2 && hPrime <= 3) {
            g1 = c;
            b1 = x;
        } else if (hPrime >= 3 && hPrime <= 4) {
            g1 = x;
            b1 = c;
        } else if (hPrime >= 4 && hPrime <= 5) {
            r1 = x;
            b1 = c;
        } else {
            r1 = c;
            b1 = x;
        };
        const red = Math.round((r1 + m) * 255);
        const green = Math.round((g1 + m) * 255);
        const blue = Math.round((b1 + m) * 255);
        return new Rgb(red, green, blue);
    } else {
        console.log("HSL object is invalid");
    };
}


//convert rgb object to hex
function rgbToHex(rgbObject) {
    let hexString = "#";
    hexString += toHexadecimal(rgbObject.red);
    hexString += toHexadecimal(rgbObject.green);
    hexString += toHexadecimal(rgbObject.blue);
    return hexString;


    //convert decimal number to hexadecimal number
    function toHexadecimal(decimal) {
        let first = Math.floor(decimal / 16);
        first = numToString(first);
        let second = decimal % 16;
        second = numToString(second);
        return first + second;
    }


    //convert hexadecimal numbers to strings
    function numToString(num) {
    if (num < 10) {
        return num.toString();
    } else if (num === 10) {
        return "A";
    } else if (num === 11) {
        return "B";
    } else if (num === 12) {
        return "C";
    } else if (num === 13) {
        return "D";
    } else if (num === 14) {
        return "E";
    } else {
        return "F";
    };
    }
}