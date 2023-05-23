/*
Title: Color Picker
Description: Allows a user to pick or enter custom colors and view related 
colors.
Last Updated: May 22, 2023
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
        const c = (1 - Math.abs(2 * hslValue.lightness - 1) * hslValue.saturation);
        const hPrime = hslValue.hue / 60;
        const x = c * (1 - Math.abs(hPrime % 2 - 1));
        const m = hslValue.lightness - (c / 2);
        let r1 = 0;
        let g1 = 0;
        let b1 = 0;
        switch(hPrime) {
            case (hPrime <= 0 && hPrime <= 1):
                r1 = c;
                g1 = x;
                break;
            case (hPrime <= 1 && hPrime <= 2):
                r1 = x;
                g1 = c;
                break;           
            case (hPrime <= 2 && hPrime <= 3):
                g1 = c;
                b1 = x;
                break;    
            case (hPrime <= 3 && hPrime <= 4):
                g1 = x;
                b1 = c; 
                break;
            case (hPrime <= 4 && hPrime <= 5):
                r1 = x;
                b1 = c;
                break;
            default:
                r1 = c;
                b1 = x;
                break;
        }
        const red = (r1 + m) * 255;
        const green = (g1 + m) * 255;
        const blue = (b1 + m) * 255;
        return Rgb(red, green, blue);
    } else {
        console.log("HSL object is invalid");
    }
}
