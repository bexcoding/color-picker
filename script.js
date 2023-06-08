/*
Title: Color Picker
Description: Allows a user to pick or enter custom colors and view related 
colors.
Last Updated: June 8, 2023
Developer: Alexander Beck
Email: beckhv2@gmail.com
Github: https://github.com/bexcoding
*/


let savedColorCounter = 0;
window.addEventListener('load', () => {
    updateBackground('#66087A');
    updateColorValues('#66087A');
    updateRelated();
});
document.getElementById('related').addEventListener('change', updateRelated);
document.getElementById('color-picker').addEventListener('change', () => {
    const currentColor = document.getElementById('color-picker').value;
    updateBackground(currentColor);
    updateColorValues(currentColor);
    updateRelated();
    document.getElementById('current-color-display').style.backgroundColor = currentColor;
});
document.getElementById('current-color-display').addEventListener('click', () => {
    const current = document.getElementById('color-picker').value;
    saveColor(current.toUpperCase());
});


//make new saved color
function saveColor(hex) {
    savedColorCounter += 1;
    const savedColor = document.createElement('div');
    savedColor.setAttribute('class', 'saved-color');
    savedColor.setAttribute('id', `saved-color-${savedColorCounter}`);
    savedColor.style.backgroundColor = hex;
    savedColor.style.color = hex;       
    document.getElementById('saved-colors').appendChild(savedColor);

    const savedColorText = document.createElement('div');
    savedColorText.setAttribute('class', 'saved-text');
    savedColorText.innerHTML = hex;
    document.getElementById(`saved-color-${savedColorCounter}`).appendChild(savedColorText);
}


function updateRelated() {
    const color = document.getElementById('color-picker').value;
    resetDisplay(document.getElementById('related-color-display'));
    const mainColor = rgbToHsl(hexToRgb(color));
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
        square.setAttribute('onclick', `saveColor("${hex.toUpperCase()}")`);
        document.getElementById('related-color-display').appendChild(square);

        const top = document.createElement('div');
        top.setAttribute('class', 'tile-top');
        top.style.backgroundColor = hex;
        document.getElementById(`${hex}`).appendChild(top);

        const bottom = document.createElement('div');
        bottom.setAttribute('class', 'tile-bottom');
        bottom.innerHTML = hex;
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


//update page colors
function updateBackground(color) {
    const converted = rgbToHsl(hexToRgb(color));
    const hue = converted.hue;
    const sat = converted.saturation;
    document.getElementById('selection-area').style.backgroundColor = `hsl(${hue}, ${sat * 100}%, 90%)`;
    document.getElementById('saved-colors').style.backgroundColor = `hsl(${hue}, ${sat * 100}%, 90%)`;
    document.getElementById('current-color-values').style.backgroundColor = `hsl(${hue}, ${sat * 100}%, 90%)`;
}


//updates current color values
function updateColorValues(color) {
    const rgb = hexToRgb(color);
    const red = rgb.red;
    const green = rgb.green;
    const blue = rgb.blue;
    const hsl = rgbToHsl(rgb);
    const hue = hsl.hue;
    const sat = hsl.saturation;
    const light = hsl.lightness;
    document.getElementById('hsl-color-val').innerHTML = `HSL: ${hue}, ${Math.round(sat * 100)}%, ${Math.round(light * 100)}%`;
    document.getElementById('rgb-color-val').innerHTML = `RGB: ${red}, ${green}, ${blue}`;
    document.getElementById('hex-color-val').innerHTML = `HEX: ${color.toUpperCase()}`;
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


//convert hex to rgb object
function hexToRgb(hexValue) {
    let rgbValue = hexValue.slice(1);
    const red = toDecimal(rgbValue.slice(0,2));
    const green = toDecimal(rgbValue.slice(2,4));
    const blue = toDecimal(rgbValue.slice(4));
    return new Rgb(red, green, blue);


    //convert hexadecimal number to decimal number
    function toDecimal(hexadecimal) {
        let first = stringToNum(hexadecimal[0]) * 16;
        let second = stringToNum(hexadecimal[1]);
        return first + second;
    }


    //convert hexadecimal strings to decimal numbers
    function stringToNum(string) {
        string = string.toUpperCase();
        if (string === "A") {
            return 10;
        } else if (string === "B") {
            return 11;
        } else if (string === "C") {
            return 12;
        } else if (string === "D") {
            return 13;
        } else if (string === "E") {
            return 14;
        } else if (string === "F") {
            return 15;
        } else {
            return Number(string);
        }
    }
}


//convert rgb object to hsl object
function rgbToHsl(rgbValue) {
    const r1 = rgbValue.red / 255;
    const g1 = rgbValue.green / 255;
    const b1 = rgbValue.blue / 255;
    const cMax = Math.max(r1, g1, b1);
    const cMin = Math.min(r1, g1, b1);
    const cDelta = cMax - cMin;
    let hue = 0;
    let saturation = 0;
    let lightness = (cMax + cMin) / 2;
    lightness = Math.round(lightness * 100) / 100;
    if (cDelta != 0) {
        saturation = cDelta / (1 - Math.abs((2 * lightness) - 1));
        if (cMax === r1) {
            hue = ((g1 - b1) / cDelta) % 6;
        } else if (cMax === g1) {
            hue = ((b1 - r1) / cDelta) + 2;
        } else if (cMax === b1) {
            hue = ((r1 - g1) / cDelta) + 4;
        };
        hue *= 60;
        if (hue < 0) {
            hue += 360;
        };
        saturation = Math.round(saturation * 100) / 100; 
        hue = Math.round(hue); 
    };
    return new Hsl(hue, saturation, lightness);
}