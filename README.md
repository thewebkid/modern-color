# modern-color Color Parsing/Manipulation  [![npm version](https://badge.fury.io/js/modern-color.svg)](https://badge.fury.io/js/modern-color) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A color lib (class) that simplifies color parsing and conversion as well as most common color functions. To visually see the channels (rgb / hsl / hsv / alpha) of a color, see [this demo](https://thewebkid.com/modules/v-cpicker).

[Raw Gist](https://gist.github.com/thewebkid/e3a1c969564256aeaf6f5137d03fa401)

## Installation
    npm i --save modern-color

### Initialize
    import {Color} from "modern-color";

## Parsing examples (constructors)

| Constructor    | Example    | Comments                                                |
|:---------------|:-----------|:--------------------------------------------------------|
| [named color](https://www.w3schools.com/colors/colors_names.asp) | `Color.parse('salmon', [alpha])`  | Any known [HTML color name](https://www.w3schools.com/colors/colors_names.asp). <br>This package exports a namedColors object you can also utilize. |
| hex | `Color.parse('#FA8072', [alpha])` | Will parse #RGB, #RRGGBB, and even #RRGGBBAA hexadecimal color formats.|
| rgb (string) | `Color.parse('rgba(250, 128, 114, 0.65)')` | Standard CSS RGB format (either rgb or rgba) |
| rgb (arguments) | `Color.parse(250, 128, 114, 0.65)` | Pass 3 or 4 (for alpha) numeric params as r, g, b, a |
| rgb (object) | `Color.parse({r:250, g:128, b:114, a:0.65})` | Pass a single object param containing r, g, b, <br>and optionally a (alpha) values |
| hsl (object) | `Color.parse({h:6, s:93, l:71, a:0.65})` | Pass a single object param containing h, s, l <br>(hue, saturation, luminosity) and optionally a (alpha) property values.  |
| hsv (object) | `Color.parse({h:6, s:54, v:98, a:0.65})` | Pass a single object param containing h, s, v <br>(hue, saturation, value) and optionally a (alpha) property values.  |
| cmyk (object) | `Color.parse({c:0, m:49, y:54, k:2, a:0.65})` | Pass a single object param containing c, m, y, k <br>(cyan, magenta, yellow, black) and optionally a (alpha) property values.  |
| rgb (array) | `Color.parse([250, 128, 114, 0.65])` | Pass rgb values as a 3 or 4 (if using alpha) member array [r, g, b [, a]].  |

The above examples return color class instances with identical r, g, and b values - they only differ in how they were constructed.

You can use new Color(constructor) or Color.parse(constructor). The alpha channel is optional in all formats (defaults to 1). This document assumes you are familiar with color min / max values per channel. [Read more about colors](https://www.w3schools.com/css/css3_colors.asp).

CYMK is supported in this module, but is not supported by any browsers currently. Thanks to [renevanderlende](https://github.com/renevanderlende) for implementing this contribution.

### Note - Normalized colors
No matter how the color is constructed, it is normalized to always contain r, g, and b values. For example:

```javascript
// our fishy example ('salmon') constructed with h,s,l
const c = Color.parse({{h:6, s:93, l:71});

//constructor channels not there! Use getter!
console.log(c.h, c.hsl.h);//outputs: undefined, 6

// only r, g, and b
const {r, g, b} = c;
console.log({r, g, b});//{r:250, g:128, b:114}

c.b = 255;// directly mutate the color - makes pink salmon!
console.log(c.hsl, c.rgb); // {r:250, g:128, b:255}, {h:298, s:100, l:75}
 ```

## Formats (property getters)
The example values are based on the same base color instance as above: `Color.parse('rgba(250, 128, 114, 0.65)')` or for no alpha `Color.parse('rgb(250, 128, 114)')`

| Getter               | Value Type | Example                                                 |
|:---------------------|:-----------|:--------------------------------------------------------|
| **rgb**              | _Array_    | `[250, 128, 114, 0.65]`                                 |
| **rgba**             | _Array_    | `[250, 128, 114, 0.65]`                                 |
| **rgbObj**           | _Object_   | `{r:250, g:128, b:114, a:0.65}`                         |
| **hsl**              | _Object_   | `{h:6, s:93, l:71}`                                     |
| **hsla**             | _Object_   | `{h:6, s:93, l:71, a:0.65}`                             |
| **hsv**              | _Object_   | `{h:6, s:54, v:98}`                                     |
| **hsva**             | _Object_   | `{h:6, s:54, v:98, a:0.65}`                             |
| **cmyk**             | _Object_   | `{c:0, m:49, y:54, k:2}`                                |
| **cmyka**            | _Object_   | `{c:0, m:49, y:54, k:2, a:0.65}`                        |
| **css**              | _String_   | `rgba(250, 128, 114, 0.65)` or `rgb(250, 128, 114)`     |
| **rgbString**        | _String_   | `rgba(250, 128, 114, 0.65)` or `rgb(250, 128, 114)`     |
| **rgbaString**       | _String_   | `rgba(250, 128, 114, 0.65)` or `rgba(250, 128, 114, 1)` |
| **hex**              | _String_   | `#FA8072`                                               |
| **hexa**/**rgbaHex** | _String_   | `#FA8072A6`                                             |
| **alpha**            | _String_   | `0.65` or defaults to `1` if no alpha channel           |


### toString(_format_)
Accepts a format string ('rgb', 'hex', 'rgbaHex', 'hsl', 'hsla', 'cmyk', 'cmyka') which will return the equivalent of calling the corresponding getter. Defaults to rgb.
```javascript
console.log(color.toString(format));

```

## Color functions
These functions return new color instances and do not modify the original color. The ratio param must be a float (min:0, max:1).

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

Obviously many well-known public algorithms and functions are involved here. Hope you enjoy!
