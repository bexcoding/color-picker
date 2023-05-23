/*
Title: Color Picker
Description: Allows a user to pick or enter custom colors and view related 
colors.
Last Updated: May 23, 2023
Developer: Alexander Beck
Email: beckhv2@gmail.com
Github: https://github.com/bexcoding
*/


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
        const red = Math.floor((r1 + m) * 255);
        const green = Math.floor((g1 + m) * 255);
        const blue = Math.floor((b1 + m) * 255);
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