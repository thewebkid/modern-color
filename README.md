# modern-color - Color Parsing/Conversion/Manipulation
[![npm version](https://badge.fury.io/js/modern-color.svg)](https://badge.fury.io/js/modern-color) [![tests](https://img.shields.io/github/actions/workflow/status/thewebkid/modern-color/test.yml?branch=master&label=tests)](https://github.com/thewebkid/modern-color/actions/workflows/test.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An ESNext color lib (class) that simplifies color parsing and conversion as well as most common color functions. To visually see the channels (rgb / hsl / hsv / alpha) of a color, see [this demo](https://thewebkid.com/modules/lit-colorpicker).

This library _modernizes_ older color libs that exist with nicer syntax - making it easier to work with colors!

## Features
✨ Zero dependencies • 🎨 Multiple color spaces (RGB, HSL, HSV, CMYK, OKLCH, HWB) • 🔧 Immutable transformations • 📦 Tree-shakeable • 🎯 TypeScript support • 🌐 140+ named colors • ♿ WCAG contrast checking • 🧪 100% test coverage

## Quick Start
```javascript
import {Color} from 'modern-color';

const salmon = Color.parse('salmon');
const lighter = salmon.lighten(0.2);
const rotated = salmon.hue(180);

// Use directly in templates
document.body.style.background = lighter; // Auto-converts to CSS
```


## Installation
    npm i --save modern-color

> **Note:** This is an ES module. Use with modern bundlers (Vite, Webpack 5+, Rollup) or `<script type="module">` in browsers.

### Initialize
    import {Color} from "modern-color";

### TypeScript
Full TypeScript definitions included:
```typescript
import {Color, type RGB, type HSL, type OKLCH} from 'modern-color';

const color: Color = Color.parse('#FF0000');
const hsl: HSL = color.hsl;
```

## Parsing examples (constructors)

| Constructor    | Example                                                                                   | Comments                                                |
|:---------------|:------------------------------------------------------------------------------------------|:--------------------------------------------------------|
| [named color](https://www.w3schools.com/colors/colors_names.asp) | `Color.parse('salmon', [alpha])`                                                          | Any known [HTML color name](https://www.w3schools.com/colors/colors_names.asp). <br>This package exports a namedColors object you can also utilize. |
| hex | `Color.parse('#FA8072', [alpha])`                                                         | Will parse #RGB, #RRGGBB, and even #RRGGBBAA hexadecimal color formats.|
| rgb (string) | `Color.parse('rgba(250, 128, 114, 0.65)')` or `Color.parse('rgba(250 128 114 / 0.65)')` | Standard CSS RGB format (either rgb or rgba) |
| rgb (arguments) | `Color.parse(250, 128, 114, 0.65)`                                                        | Pass 3 or 4 (for alpha) numeric params as r, g, b, a |
| rgb (object) | `Color.parse({r:250, g:128, b:114, a:0.65})`                                              | Pass a single object param containing r, g, b, <br>and optionally a (alpha) values |
| hsl (object) | `Color.parse({h:6, s:93, l:71, a:0.65})`                                                  | Pass a single object param containing h, s, l <br>(hue, saturation, luminosity) and optionally a (alpha) property values.  |
| hsv (object) | `Color.parse({h:6, s:54, v:98, a:0.65})`                                                  | Pass a single object param containing h, s, v <br>(hue, saturation, value) and optionally a (alpha) property values.  |
| cmyk (object) | `Color.parse({c:0, m:49, y:54, k:2, a:0.65})`                                             | Pass a single object param containing c, m, y, k <br>(cyan, magenta, yellow, black) and optionally a (alpha) property values.  |
| rgb (array) | `Color.parse([250, 128, 114, 0.65])`                                                      | Pass rgb values as a 3 or 4 (if using alpha) member array [r, g, b [, a]].  |
| oklch (object) | `Color.parse({l:0.7, c:0.1, h:40, a:0.8})`                                                | Pass a single object param containing l (0-1), c (0+), h (0-360), and optionally a (alpha 0-1).  |
| hwb (object) | `Color.parse({h:6, w:45, b:2, a:0.65})`                                                  | Pass a single object param containing h (0-360), w (whiteness 0-100), b (blackness 0-100), and optionally a (alpha 0-1).  |

The above examples return color class instances with identical r, g, and b values - they only differ in how they were constructed.

You can use new Color(constructor) or Color.parse(constructor). The alpha channel is optional in all formats (defaults to 1). This document assumes you are familiar with color min / max values per channel. [Read more about colors](https://www.w3schools.com/css/css3_colors.asp). Invalid input returns null. 'transparent' is also supported and parses to rgba(0,0,0,0).

CMYK is supported in this module, but is not supported by any browsers currently. Thanks to [renevanderlende](https://github.com/renevanderlende) for implementing this contribution.

> **Note (1.4.0):** The CMYK parser was fixed — it now correctly normalizes the `k` channel to a 0-1 fraction and assigns `g`/`b` channels in the right order. Previous versions produced incorrect RGB values from CMYK input.

HWB (Hue, Whiteness, Blackness) is a CSS Color Module Level 4 color space. `W` and `B` are percentages (0-100); when `W + B >= 1` the color is achromatic (gray).

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
| **rgb**              | _Array_    | `[250, 128, 114]`                                       |
| **rgba**             | _Array_    | `[250, 128, 114, 0.65]`                                 |
| **rgbObj**           | _Object_   | `{r:250, g:128, b:114, a:0.65}`                         |
| **hsl**              | _Object_   | `{h:6, s:93, l:71}`                                     |
| **hsla**             | _Object_   | `{h:6, s:93, l:71, a:0.65}`                             |
| **hsv**              | _Object_   | `{h:6, s:54, v:98}`                                     |
| **hsva**             | _Object_   | `{h:6, s:54, v:98, a:0.65}`                             |
| **cmyk**             | _Object_   | `{c:0, m:49, y:54, k:2}`                                |
| **cmyka**            | _Object_   | `{c:0, m:49, y:54, k:2, a:0.65}`                        |
| **oklch**            | _Object_   | `{l:0.78, c:0.13, h:20, a:0.65}`                        |
| **hwb**              | _Object_   | `{h:6, w:45, b:2, a:0.65}`                              |
| **hslString**        | _String_   | `hsl(6, 93%, 71%)`                                      |
| **hslaString**       | _String_   | `hsla(6, 93%, 71%, 0.65)`                               |
| **hsvString**        | _String_   | `hsv(6, 54%, 98%)`                                      |
| **cmykString**       | _String_   | `cmyk(0%, 49%, 54%, 2%)`                                |
| **cmykaString**      | _String_   | `cmyka(0%, 49%, 54%, 2%, 0.65)`                         |
| **oklchString**      | _String_   | `oklch(0.735 0.152 28.06)`                              |
| **oklchaString**     | _String_   | `oklch(0.735 0.152 28.06 / 0.65)`                       |
| **hwbString**        | _String_   | `hwb(6 45% 2%)`                                         |
| **hwbaString**       | _String_   | `hwb(6 45% 2% / 0.65)`                                  |
| **css**              | _String_   | `rgba(250, 128, 114, 0.65)` or `rgb(250, 128, 114)`     |
| **rgbString**        | _String_   | `rgba(250, 128, 114, 0.65)` or `rgb(250, 128, 114)`     |
| **rgbaString**       | _String_   | `rgba(250, 128, 114, 0.65)` or `rgba(250, 128, 114, 1)` |
| **hex**              | _String_   | `#FA8072`                                               |
| **hexa**/**rgbaHex** | _String_   | `#FA8072A6`                                             |
| **alpha**            | _Number_   | `0.65` or defaults to `1` if no alpha channel           |
| **isGrayScale**      | _Boolean_  | `false`                                                 |

Note: `css` is an alias for `rgbString`. OKLCH values: l (lightness 0-1), c (chroma 0+), h (hue 0-360). OKLCH string output is rounded to 3 decimal places. The `hsla`/`hsva`/`cmyka`/`hwba` getters are aliases that return the same object as their non-`a` counterparts (which already include `a` when set).

### toString(_format_, _options_)
Accepts a format string (`'rgb'`, `'hex'`, `'rgbaHex'`, `'hsl'`, `'hsla'`, `'hsv'`, `'cmyk'`, `'cmyka'`, `'oklch'`, `'oklcha'`, `'hwb'`, `'hwba'`) which will return the equivalent of calling the corresponding getter. Defaults to rgb.
```javascript
console.log(color.toString(format));
```

The optional second argument `{modern: true}` emits space-separated CSS Color Module Level 4 syntax for `rgb`/`hsl`/`hwb`:
```javascript
Color.parse('red').toString('rgb', {modern: true});      // 'rgb(255 0 0)'
Color.parse('salmon').toString('hsl', {modern: true});   // 'hsl(6 93% 71% / 0.65)'
Color.parse('red').toString('hwb', {modern: true});      // 'hwb(0 0% 0%)'
```

#### Magic in Templates: Direct Color Usage
One of the coolest features of `modern-color` is that Color instances can be dropped directly into string templates or JSX— no need to manually call getters! The JavaScript engine automatically invokes `toString()` to convert them to CSS-friendly 'rgb' or 'rgba' strings. This makes your code cleaner and more intuitive.

Example:
```javascript
const blue = Color.parse('blue');
const desaturatedBlue = blue.desaturate(0.5); // Chain methods for instant variations!

const template = `<div style="background-color: ${desaturatedBlue}; border: solid 1px ${blue}">Content</div>`;
// Renders as: <div style="background-color: rgba(64, 128, 255, 1); border: solid 1px rgba(0, 0, 255, 1)">Content</div>
```

This seamless integration works perfectly in modern frameworks like React, Vue, or Angular—try it and watch your color workflows become effortless and fun!

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
Mix 2 colors together. The optional third `space` argument selects the mixing color space:
- `'rgb'` (default) — linear RGB channel interpolation
- `'hsl'` — HSL interpolation (hue takes the long way around unless shortest path crosses 0/360)
- `'oklch'` — perceptual OKLCH interpolation (hue takes the **shortest** path, recommended for smooth gradients)
```javascript
//color2 can be a single color constructor (array, hex, rgbString, etc)
//examples using grayscale for simplicity
color = Color.parse([100,100,100]);
color2 = Color.parse([200,200,200]);
color.mix(color2, 0.25).rgb;//-->[125, 125, 125]
color2.mix(color, 0.25).rgb;//-->[175, 175, 175]

//perceptual mixing avoids the muddy mid-point of RGB mixing:
Color.parse('red').mix('blue', 0.5, 'oklch').rgb;   //-->[186, 0, 194]  (purple, shortest hue path)
Color.parse('red').mix('blue', 0.5, 'hsl').rgb;     //-->[255, 0, 255]  (magenta, long hue path)
```
### saturate/desaturate/grayscale
Increase or decrease saturation by the specified ratio. Pass `'oklch'` as the final `space` argument to adjust perceptual chroma instead of HSL saturation (keeps perceived lightness stable, better for UI design).
```javascript
color.saturate(0.3);//{h:10, s:50, l:50} -> {h:10, s:65, l:50}
color.desaturate(0.3);//{h:10, s:50, l:50} -> {h:10, s:35, l:50}
color.saturate(0.3, false, 'oklch');  // perceptual chroma increase

//grayscale() is shorthand for desaturate(1);
color.grayscale();//{h:10, s:50, l:50}->{h:10, s:0, l:50}
```

### darken/lighten
Increase lightness or darkness by specified ratio. Pass `'oklch'` as the second `space` argument for perceptual lightness adjustment (preserves hue better than HSL).
```javascript
color.lighten(0.3);//{h:10, s:50, l:50} -> {h:10, s:50, l:65}
color.darken(0.3);//{h:10, s:50, l:50} -> {h:10, s:50, l:35}
color.lighten(0.3, 'oklch');  // perceptual lightness (hue stays truer)
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

## Utility methods
These methods return new Color instances by modifying specific channels:

- `toAlpha(alpha)`: Sets alpha (0-1), e.g. `color.toAlpha(0.5)`
- `toHSVSaturation(saturation)`: Sets HSV saturation (0-100), e.g. `color.toHSVSaturation(80)`
- `toHSLSaturation(saturation)`: Sets HSL saturation (0-100), e.g. `color.toHSLSaturation(80)`
- `toLuminance(luminance)`: Sets HSL luminance (0-100), e.g. `color.toLuminance(50)`
- `toHue(hue)`: Sets hue (0-360), e.g. `color.toHue(180)`
- `toValue(value)`: Sets HSV value (0-100), e.g. `color.toValue(90)`
- `toOklchLightness(lightness)`: Sets OKLCH lightness (0-1), e.g. `color.toOklchLightness(0.7)`
- `toChroma(chroma)`: Sets OKLCH chroma (0+), e.g. `color.toChroma(0.1)`
- `getShades(n = 10, space = 'hsl', startLight = 0.95, endLight = 0.05)`: Generates an array of n shades of the color by varying lightness from startLight to endLight in the specified space ('hsl' or 'oklch'), e.g. `color.getShades(5, 'oklch')`

## HWB (Hue, Whiteness, Blackness)
HWB is a CSS Color Module Level 4 color space that's intuitive for humans: pick a hue, then add whiteness and/or blackness to fade it.
```javascript
const c = Color.parse('salmon');
c.hwb;              // {h:6, w:45, b:2, a:1}
c.hwbString;        // 'hwb(6 45% 2%)'
c.hwbaString;       // 'hwb(6 45% 2% / 1)'
Color.parse({h: 120, w: 0, b: 0}).rgb;   // [0, 255, 0]  (pure green)
Color.parse({h: 0, w: 30, b: 70}).rgb;   // [77, 77, 77] (gray — w+b >= 1 is achromatic)
```

## WCAG Accessibility
Built-in contrast checking per [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum):
```javascript
const bg = Color.parse('white');
bg.contrast('black');              // 21 (max contrast ratio)
bg.relativeLuminance;              // 1 (0=black, 1=white)
bg.isReadable('black');            // true  (AA normal: >= 4.5)
bg.isReadable('#888', {level:'AAA', size:'large'});  // false
```
`isReadable` options: `level` (`'AA'` default | `'AAA'`), `size` (`'normal'` default | `'large'`). AA normal needs 4.5:1, AA large 3:1, AAA normal 7:1, AAA large 4.5:1.

## Color Harmonies & Equality
- `complementary()`: returns `[color, color.rotate(180)]`
- `analogous(angle = 30)`: returns `[color.rotate(-angle), color, color.rotate(angle)]`
- `triadic()`: returns 3 colors 120° apart
- `tetradic(angle = 60)`: returns 4 colors (two complementary pairs)
- `equals(color2)`: value equality on r/g/b/alpha (use instead of `===` since instances are mutable)
- `Color.nearestNamed(input)` / `color.nearestNamed()`: brute-force nearest HTML named color by RGB distance

```javascript
Color.parse('red').complementary().map(c => c.hex);  // ['#FF0000', '#00FFFF']
Color.parse('red').triadic().map(c => c.hex);        // ['#FF0000', '#00FF00', '#0000FF']
Color.parse('#FE0000').nearestNamed();               // 'red'
Color.parse('red').equals('#FF0000');                // true
```

## Testing
```bash
npm test
```
Tests run on Node.js's built-in test runner (`node:test`) — no dependencies required. CI runs on Node 18, 20, and 22.
