/*
Title: Color Picker
Description: Allows a user to pick or enter custom colors and view related 
colors.
Last Updated: June 8, 2023
Developer: Alexander Beck
Email: beckhv2@gmail.com
Github: https://github.com/bexcoding
*/


// counter for naming id of saved colors
let savedColorCounter = 0;

// updates page on loading to create base appearance 
window.addEventListener('load', () => {
    updateBackground('#66087A');
    updateColorValues('#66087A');
    updateRelated();
});

// monitors dropdown menu for changes
document.getElementById('related').addEventListener('change', updateRelated);

// updates page based on selected color from expanding color picker
document.getElementById('color-picker').addEventListener('change', () => {
    const currentColor = document.getElementById('color-picker').value;
    updateBackground(currentColor);
    updateColorValues(currentColor);
    updateRelated();
    document.getElementById('current-color-display').style.backgroundColor = 
        currentColor;
});

// allows current main displayed color to be saved by clicking on it
document.getElementById('current-color-display').addEventListener('click', () => {
    const current = document.getElementById('color-picker').value;
    saveColor(current.toUpperCase());
});


/**
 * saves a given color at the bottom of the page
 * @param {string} hex - string of hex color (example: '#F33D70')
 */
function saveColor(hex) {
    // counter tracks number of saved colors for unique id naming
    savedColorCounter += 1;
    // creates a rectangle in the save area with the given hex color
    const savedColor = document.createElement('div');
    savedColor.setAttribute('class', 'saved-color');
    savedColor.setAttribute('id', `saved-color-${savedColorCounter}`);
    savedColor.style.backgroundColor = hex;
    savedColor.style.color = hex;       
    document.getElementById('saved-colors').appendChild(savedColor);
    // creates the text/name of the saved color
    const savedColorText = document.createElement('div');
    savedColorText.setAttribute('class', 'saved-text');
    savedColorText.innerHTML = hex;
    document.getElementById(`saved-color-${savedColorCounter}`).appendChild(savedColorText);
}


/**
 * updates the related colors section based on the dropdown menu choice
 */
function updateRelated() {
    // resets the display area before making a new palette
    const color = document.getElementById('color-picker').value;
    resetDisplay(document.getElementById('related-color-display'));
    const mainColor = rgbToHsl(hexToRgb(color));
    const colorType = document.getElementById('related').value;
    makePalette(colorType, mainColor);


    /**
     * resets the display area for the related colors section
     * @param parent - the selector of the area that needs to be cleared
     */
    function resetDisplay(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        };
    }


    /**
     * makes a new color square in the related color area
     * @param {string} hex - string of hex color (example: '#F33D70')
     */
    function makeSquare(hex) {
        // creates a color square
        const square = document.createElement('div');
        square.setAttribute('class', 'color-tile');
        square.setAttribute('id', `${hex}`);
        square.setAttribute('onclick', `saveColor("${hex.toUpperCase()}")`);
        document.getElementById('related-color-display').appendChild(square);
        // creates the top of the square which shows the color
        const top = document.createElement('div');
        top.setAttribute('class', 'tile-top');
        top.style.backgroundColor = hex;
        document.getElementById(`${hex}`).appendChild(top);
        // creates the bottom the square which displays the name of the color
        const bottom = document.createElement('div');
        bottom.setAttribute('class', 'tile-bottom');
        bottom.innerHTML = hex;
        document.getElementById(`${hex}`).appendChild(bottom);
    }


    /**
     * creates the number and color of squares based on the dropdown menu
     * @param {string} relation - any of the dropdown menu choices
     * @param {HSL object} mainColor - the main color as an hsl object
     */
    function makePalette(relation, mainColor) {
        const mainHex = rgbToHex(hslToRgb(mainColor));
        // each if/else creates the number of squares needed for the option
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


/**
 * updates the background of the page with a color similar to the main color 
 * @param {string} color - string of hex color (example: '#F33D70')
 */
function updateBackground(color) {
    // converts hex to hsl
    const converted = rgbToHsl(hexToRgb(color));
    const hue = converted.hue;
    const sat = converted.saturation;
    // updates background colors with same hue and sat but with 90% lightness
    document.getElementById('selection-area').style.backgroundColor = `hsl(${hue}, ${sat * 100}%, 90%)`;
    document.getElementById('saved-colors').style.backgroundColor = `hsl(${hue}, ${sat * 100}%, 90%)`;
    document.getElementById('current-color-values').style.backgroundColor = `hsl(${hue}, ${sat * 100}%, 90%)`;
}


/**
 * changes the displayed rgb, hex, and hsl values for the selected color
 * @param {string} color - string of hex color (example: '#F33D70')
 */
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


/**
 * template for creating an hsl object
 * @param {number} h - value for hue
 * @param {number} s - value for saturation
 * @param {number} l - value for lightness
 */
function Hsl(h, s, l) {
    this.hue = h;
    this.saturation = s;
    this.lightness = l;
}


/**
 * template for creating an rgb object
 * @param {number} r - value for red
 * @param {number} g - value for green
 * @param {number} b - value for blue
 */
function Rgb(r, g, b) {
    this.red = r;
    this.green = g;
    this.blue = b;
}


/**
 * checks if the given hsl object has valid values
 * @param {HSL object} hslObject - the main color as an hsl object
 * @returns {boolean} - returns true if each value is in the correct range
 */
function checkHsl(hslObject) {
    return ((hslObject.hue >= 0 && hslObject.hue <= 360) &&
            (hslObject.saturation >= 0 && hslObject.saturation <= 1) &&
            (hslObject.lightness >= 0 && hslObject.lightness <= 1)); 
}


/**
 * converts an hsl object to an rgb object
 * @param {HSL object} hslValue the main color as an hsl object
 * @returns {RGB object} the converted color in rgb
 */
function hslToRgb(hslValue) {
    // if the given value is a valid hsl object, does the math to convert it
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


/**
 * converts an rgb object to a hex color string
 * @param {RGB object} rgbObject a color represented as an rgb object
 */
function rgbToHex(rgbObject) {
    let hexString = "#";
    hexString += toHexadecimal(rgbObject.red);
    hexString += toHexadecimal(rgbObject.green);
    hexString += toHexadecimal(rgbObject.blue);
    return hexString;


    /**
     * converts a decimal number to hexadecimal
     * @param {number} decimal decimal number (example: 10)
     * @returns {string} two hex characters (example: 'FF')
     */
    function toHexadecimal(decimal) {
        // create first hex string
        let first = Math.floor(decimal / 16);
        first = numToString(first);
        // create second hex string
        let second = decimal % 16;
        second = numToString(second);
        return first + second;
    }


    /**
     * converts hexadecimal numbers to strings
     * @param {number} num the number from the converted rgb value
     * @returns {string} a number as a string or a number 10-15 as a letter
     */
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


/**
 * converts a hex color string to an rgb object
 * @param {string} hexValue a hex string of a color (example: '#A8D900')
 * @returns {RGB object} a converted color as an rgb object
 */
function hexToRgb(hexValue) {
    let rgbValue = hexValue.slice(1);
    const red = toDecimal(rgbValue.slice(0,2));
    const green = toDecimal(rgbValue.slice(2,4));
    const blue = toDecimal(rgbValue.slice(4));
    return new Rgb(red, green, blue);


    /**
     * converts a pair of hexadecimal string characters to a decimal number
     * @param {string} hexadecimal two hex characters (example: 'FF')
     * @returns {number} a decimal number (example: 0 - 255)
     */
    function toDecimal(hexadecimal) {
        let first = stringToNum(hexadecimal[0]) * 16;
        let second = stringToNum(hexadecimal[1]);
        return first + second;
    }


    /**
     * converts a hexadecimal string to a decimal number
     * @param {string} string (example: 'F' or '13')
     * @returns {number} converted number (example: number 0 - 15)
     */
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
        };
    }
}


/**
 * converts an rgb object to an hsl object
 * @param {RGB object} rgbValue a color represented with an rgb object
 * @returns {HSL object} a color represented with an hsl object
 */
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