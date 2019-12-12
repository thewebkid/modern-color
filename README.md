# modern-color (ES6+ color class)  [![npm version](https://badge.fury.io/js/modern-color.svg)](https://badge.fury.io/js/modern-color) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An ES6+ color class that simplifies color parsing and conversion as well as most common color functions. To visually see the channels (rgb / hsl / hsv / alpha) of a color, see [this demo](http://preview.thewebkid.com/modules/v-cpicker).
 
[Raw Gist](https://gist.github.com/thewebkid/e3a1c969564256aeaf6f5137d03fa401)
 
## Installation
    npm i --save modern-color

### Initialize 
    import {Color} from "modern-color";
  
## Parsing examples (constructors)
The below all return color class instances with identical r, g, and b values - they only differ in how they were constructed.
 
You can use new Color(constructor) or Color.parse(constructor). 
### named colors
```javascript
const colorNamed = Color.parse('salmon');
const colorNamed = Color.parse('salmon', 0.65); //alpha channel as 2nd param
```

### (string) hex, rgbaHex, rgb() 
```javascript
const colorHex = Color.parse('#FA8072')
// add alpha channel
const colorHex = Color.parse('#FA8072', 0.65); //alpha as 2nd param
// -or last 2 hex chars-
const rgbaHex = Color.parse('#FA8072A6');//rgba hex

const fromCssString = Color.parse('rgba(250, 128, 114, 0.65)');
const fromCssString = Color.parse('rgb(250, 128, 114)');
```

### (number params) r, b, g, a 
```javascript
const colorFromParams = Color.parse(250, 128, 114);
const colorFromParams = Color.parse(250, 128, 114, 0.65);//w/alpha
```

### (object) rgb, hsl, hsv, and cmyk  
```javascript
const colorRGB = Color.parse({r:250, g:128, b:114});
const colorHsl = Color.parse({h:6, s:93, l:71});
const colorHsv = Color.parse({h:6, s:54, v:98});
const colorCmyk = Color.parse({c:0, m:49, y:54, k:2});
//with alpha
const colorRGB = Color.parse({r:250, g:128, b:114, a:0.65});
const colorHsl = Color.parse({h:6, s:93, l:71, a:0.65});
const colorHsv = Color.parse({h:6, s:54, v:98, a:0.65});
const colorCmyk = Color.parse({c:0, m:49, y:54, k:2, a:0.65});
```

### (array) rgb and rgba
```javascript
const colorFromArray = Color.parse([250, 128, 114]);
const colorFromArray = Color.parse([250, 128, 114, 0.65]);//arr[3] if present is alpha 
```


#### All constructed colors
No matter how the color is constructed, it is normalized to always contain r, g, and b values. For example:

```javascript 
const c = Color.parse({h:1, s:100, l:50});
const {r, g, b} = c;
console.log({r, g, b});
c.b = 255;
console.log(c.hsl, c.rgb);
 ```


## Formats (property getters)

### (array) rgb, rgba 
```javascript
console.log(color.rgb);
// [250, 128, 114]
console.log(color.rgba);
// [250, 128, 114, 1]
```
### (object) rgb, hsl, hsv, cmyk [alpha chan: rgba, hsla, hsva, cmyka]
```javascript
console.log(color.rgbObj);
//{r:250, g:128, b:114, a:0.65} || {r:250, g:128, b:114, a:1}
console.log(color.hsl);
// {h:6, s:93, l:71}
console.log(color.hsv);
// {h:6, s:54, v:98}
console.log(color.cmyk);
//{c:0, m:49, y:54, k:2}
```
### (string) hex, rgbString, rgbaHex 
```javascript
console.log(color.hex);
//#FA8072 - no alpha channel
console.log(color.rgbaHex);
//#FA8072A6 (#RRGGBBAA) - color.hexa is an alias for rgbaHex
console.log(color.rgbString);
// `rgba(250, 128, 114, 0.65) || rgba(250, 128, 114, 1)
// always returns rgba with alpha channel defaulting to 1
```

### Misc (alpha, toString)
```javascript
console.log(color.alpha);//this.a or 1 if undefined

//not a getter, but can return 7 different formats
//'rgb', 'hex', 'rgbaHex', 'hsl', 'hsla', cmyk, cmyka 
console.log(color.toString(format));

```

## Color functions
These return new color instances and do not modify the original color. The ratio param must be a float (min:0, max:1). 

The examples show hsl objects in places for clarity, but the color instance actually returned will not have these channel values unless you call color.hsl or color.hsv.

### hue (aka rotate)
```javascript
//accepts an int up to 359
//changes hue of a color
const deg = 270;
color.hue(deg);//color.rotate is an alias for hue
```

### mix (aka blend)
Mix 2 colors together
```javascript
//color2 can be a single color constructor (array, hex, rgbString, etc)
//examples using grayscale for simplicity  
color = Color.parse([100,100,100]);
color2 = Color.parse([200,200,200]);
color.mix(color2, 0.25).rgb;//-->[125, 125, 125]
color2.mix(color, 0.25).rgb;//-->[175, 175, 175]
```
### saturate/desaturate/grayscale
increase or decrease saturation by the specified ratio
```javascript
color.saturate(0.3);//{h:10, s:50, l:50} -> {h:10, s:65, l:50}
color.desaturate(0.3);//{h:10, s:50, l:50} -> {h:10, s:35, l:50}

//grayscale() is shorthand for desaturate(1);
color.grayscale();//{h:10, s:50, l:50}->{h:10, s:0, l:50}
```

### darken/lighten
Increase lightness or darkness by specified ratio 
```javascript
color.lighten(0.3);//{h:10, s:50, l:50} -> {h:10, s:50, l:65}
color.darken(0.3);//{h:10, s:50, l:50} -> {h:10, s:50, l:35}
```
### fadeIn/fadeOut
Increase opacity or transparency by a given ratio. 
```javascript
//increase opacity (decrease transparency) by ratio
color.fadeIn(0.5);//{r:0, g:0, b:0, a:0.5}->{r:0, g:0, b:0, a:0.75}

//decrease opacity (increase transparency) by ratio
color.fadeOut(0.5);//{r:0, g:0, b:0, a:0.5}->{r:0, g:0, b:0, a:0.25}
```
### negate
Subtract r, g, and b channel values from max (255) 
```javascript
color.negate(); //{r:0, g:128, b:200}->{r:255, g:127, b:55}
```

Obviously many well-known public algorithms and functions are involved here. I built this class to help me write a [layered css gradient tool](http://preview.thewebkid.com/gradients) (linear, radial, and conic). I think this architecture might be useful to other developers. Please let me know if you find bugs or if you want to share something awesome you created!
