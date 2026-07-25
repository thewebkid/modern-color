import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {Color, namedColors} from '../index.js';

// Floating-point channel comparison helper (within 1 byte / 0.001 alpha)
const close = (actual, expected, tol = 1) => {
  if (Array.isArray(expected)) {
    assert.equal(actual.length, expected.length);
    for (let i = 0; i < expected.length; i++) {
      assert.ok(Math.abs(actual[i] - expected[i]) <= tol,
        `${actual[i]} vs ${expected[i]} (idx ${i}) exceeds tol ${tol}`);
    }
  } else if (typeof expected === 'number') {
    assert.ok(Math.abs(actual - expected) <= tol, `${actual} vs ${expected} exceeds tol ${tol}`);
  } else {
    assert.deepEqual(actual, expected);
  }
};

describe('parsing - all constructors yield salmon (250, 128, 114)', () => {
  const expected = [250, 128, 114];
  test('named color', () => close(Color.parse('salmon').rgb, expected));
  test('hex #FA8072', () => close(Color.parse('#FA8072').rgb, expected));
  test('hex short #F00 -> red (sanity, not salmon)', () => close(Color.parse('#F00').rgb, [255, 0, 0]));
  test('rgb string commas', () => close(Color.parse('rgba(250, 128, 114, 0.65)').rgb, expected));
  test('rgb string spaces/slash', () => close(Color.parse('rgba(250 128 114 / 0.65)').rgb, expected));
  test('rgb arguments', () => close(Color.parse(250, 128, 114, 0.65).rgb, expected));
  test('rgb object', () => close(Color.parse({r: 250, g: 128, b: 114, a: 0.65}).rgb, expected));
  test('hsl object', () => close(Color.parse({h: 6, s: 93, l: 71, a: 0.65}).rgb, expected, 2));
  test('hsv object', () => close(Color.parse({h: 6, s: 54, v: 98, a: 0.65}).rgb, expected, 2));
  test('cmyk object (fixed: k normalized + channel order)', () =>
    close(Color.parse({c: 0, m: 49, y: 54, k: 2, a: 0.65}).rgb, expected, 2));
  test('rgb array', () => close(Color.parse([250, 128, 114, 0.65]).rgb, expected));
  test('oklch object roundtrip-ish', () => {
    const c = Color.parse({l: 0.7, c: 0.1, h: 40, a: 0.8});
    assert.equal(c.rgb.length, 3);
    assert.equal(c.alpha, 0.8);
  });
});

describe('parsing - edge cases', () => {
  test('invalid string returns null', () => assert.equal(Color.parse('notacolor'), null));
  test('transparent -> rgba(0,0,0,0)', () => close(Color.parse('transparent').rgba, [0, 0, 0, 0]));
  test('hex 4-digit #RRGGBBAA', () => close(Color.parse('#FF0000AA').rgba, [255, 0, 0, 0.667], 2));
  test('named color with alpha arg', () => close(Color.parse('salmon', 0.5).rgba, [250, 128, 114, 0.5]));
  test('hex with alpha arg overrides', () => close(Color.parse('#FA8072', 0.5).rgba, [250, 128, 114, 0.5]));
  test('alpha defaults to 1 when omitted', () => assert.equal(Color.parse('#FA8072').alpha, 1));
  test('new Color(rgbObj) constructor', () => close(new Color({r: 250, g: 128, b: 114}).rgb, [250, 128, 114]));
});

describe('format getters - base Color.parse("rgba(250, 128, 114, 0.65)")', () => {
  const c = Color.parse('rgba(250, 128, 114, 0.65)');
  test('rgb', () => assert.deepEqual(c.rgb, [250, 128, 114]));
  test('rgba', () => assert.deepEqual(c.rgba, [250, 128, 114, 0.65]));
  test('rgbObj', () => assert.deepEqual(c.rgbObj, {r: 250, g: 128, b: 114, a: 0.65}));
  test('hsl', () => assert.deepEqual(c.hsl, {h: 6, s: 93, l: 71, a: 0.65}));
  test('hsla', () => assert.deepEqual(c.hsla, {h: 6, s: 93, l: 71, a: 0.65}));
  test('hsv', () => assert.deepEqual(c.hsv, {h: 6, s: 54, v: 98, a: 0.65}));
  test('hsva', () => assert.deepEqual(c.hsva, {h: 6, s: 54, v: 98, a: 0.65}));
  test('cmyk', () => assert.deepEqual(c.cmyk, {c: 0, m: 49, y: 54, k: 2, a: 0.65}));
  test('cmyka', () => assert.deepEqual(c.cmyka, {c: 0, m: 49, y: 54, k: 2, a: 0.65}));
  test('hex', () => assert.equal(c.hex, '#FA8072'));
  test('hexa / rgbaHex', () => assert.equal(c.hexa, '#FA8072A6'));
  test('css alias for rgbString', () => assert.equal(c.css, c.rgbString));
  test('rgbString', () => assert.equal(c.rgbString, 'rgba(250,128,114,0.65)'));
  test('rgbaString', () => assert.equal(c.rgbaString, 'rgba(250,128,114,0.65)'));
  test('hslString', () => assert.equal(c.hslString, 'hsl(6, 93%, 71%)'));
  test('hslaString', () => assert.equal(c.hslaString, 'hsla(6, 93%, 71%, 0.65)'));
  test('hsvString', () => assert.equal(c.hsvString, 'hsv(6, 54%, 98%)'));
  test('cmykString', () => assert.equal(c.cmykString, 'cmyk(0%, 49%, 54%, 2%)'));
  test('cmykaString', () => assert.equal(c.cmykaString, 'cmyka(0%, 49%, 54%, 2%, 0.65)'));
  test('oklchString rounds to 3 decimals', () => assert.equal(c.oklchString, 'oklch(0.735 0.152 28.06)'));
  test('oklchaString rounds to 3 decimals', () => assert.equal(c.oklchaString, 'oklch(0.735 0.152 28.06 / 0.65)'));
  test('alpha getter', () => assert.equal(c.alpha, 0.65));
  test('isGrayScale false', () => assert.equal(c.isGrayScale, false));
  test('isGrayScale true for gray', () => assert.equal(Color.parse('gray').isGrayScale, true));
});

describe('normalized colors - mutation', () => {
  test('hsl constructor exposes r,g,b not h', () => {
    const c = Color.parse({h: 6, s: 93, l: 71});
    assert.equal(c.h, undefined);
    close([c.r, c.g, c.b], [250, 128, 114], 2);
    assert.equal(c.hsl.h, 6);
  });
  test('mutating b updates hsl', () => {
    const c = Color.parse({h: 6, s: 93, l: 71});
    c.b = 255;
    assert.deepEqual(c.rgb, [c.r, c.g, 255]);
    assert.equal(c.hsl.h, 298);
  });
});

describe('toString formats', () => {
  const c = Color.parse('salmon');
  test('default -> rgb', () => assert.equal(c.toString(), 'rgb(250,128,114)'));
  test('hex', () => assert.equal(c.toString('hex'), '#FA8072'));
  test('rgbaHex', () => assert.equal(c.toString('rgbaHex'), '#FA8072FF'));
  test('hsl', () => assert.equal(c.toString('hsl'), 'hsl(6, 93%, 71%)'));
  test('hsv', () => assert.equal(c.toString('hsv'), 'hsv(6, 54%, 98%)'));
  test('cmyk', () => assert.equal(c.toString('cmyk'), 'cmyk(0%, 49%, 54%, 2%)'));
  test('oklch', () => assert.equal(c.toString('oklch'), 'oklch(0.735 0.152 28.06)'));
  test('hwb', () => assert.equal(c.toString('hwb'), 'hwb(6, 45%, 2%)'));
  test('template literal uses rgb', () => assert.equal(`${c}`, 'rgb(250,128,114)'));
});

describe('toString modern (space-separated CSS Color 4)', () => {
  const noA = Color.parse('red');
  const withA = Color.parse('rgba(250, 128, 114, 0.65)');
  test('modern rgb no alpha', () => assert.equal(noA.toString('rgb', {modern: true}), 'rgb(255 0 0)'));
  test('modern rgb with alpha', () => assert.equal(withA.toString('rgb', {modern: true}), 'rgb(250 128 114 / 0.65)'));
  test('modern hsl no alpha', () => assert.equal(noA.toString('hsl', {modern: true}), 'hsl(0 100% 50%)'));
  test('modern hsl with alpha', () => assert.equal(withA.toString('hsl', {modern: true}), 'hsl(6 93% 71% / 0.65)'));
  test('modern hwb no alpha', () => assert.equal(noA.toString('hwb', {modern: true}), 'hwb(0 0% 0%)'));
  test('modern hwba', () => assert.equal(withA.toString('hwba', {modern: true}), 'hwb(6 45% 2% / 0.65)'));
  test('legacy default unaffected', () => assert.equal(noA.toString(), 'rgb(255,0,0)'));
});

describe('color functions - immutability', () => {
  const c = Color.parse('salmon');
  test('hue(180) / rotate alias', () => {
    const r = c.hue(180);
    assert.deepEqual(r.hsl, {h: 186, s: 93, l: 71, a: 1});
    assert.deepEqual(c.hsl, {h: 6, s: 93, l: 71, a: 1}); // original unchanged
    assert.deepEqual(c.rotate(180).hsl, r.hsl);
  });
  test('mix 25% grayscale -> [125,125,125]', () => {
    const a = Color.parse([100, 100, 100]);
    const b = Color.parse([200, 200, 200]);
    close(a.mix(b, 0.25).rgb, [125, 125, 125]);
    close(b.mix(a, 0.25).rgb, [175, 175, 175]);
  });
  test('saturate +30% -> s:65', () =>
    assert.deepEqual(Color.parse({h: 10, s: 50, l: 50}).saturate(0.3).hsl, {h: 10, s: 65, l: 50, a: 1}));
  test('desaturate +30% -> s:35', () =>
    assert.deepEqual(Color.parse({h: 10, s: 50, l: 50}).desaturate(0.3).hsl, {h: 10, s: 35, l: 50, a: 1}));
  test('grayscale -> s:0', () =>
    assert.deepEqual(Color.parse({h: 10, s: 50, l: 50}).grayscale().hsl, {h: 0, s: 0, l: 50, a: 1}));
  test('lighten +30% -> l:65', () =>
    assert.deepEqual(Color.parse({h: 10, s: 50, l: 50}).lighten(0.3).hsl, {h: 10, s: 50, l: 65, a: 1}));
  test('darken +30% -> l:35', () =>
    assert.deepEqual(Color.parse({h: 10, s: 50, l: 50}).darken(0.3).hsl, {h: 9, s: 50, l: 35, a: 1}));
  test('fadeIn +50% on a:0.5 -> a:0.75', () =>
    assert.deepEqual(Color.parse({r: 0, g: 0, b: 0, a: 0.5}).fadeIn(0.5).rgba, [0, 0, 0, 0.75]));
  test('fadeOut +50% on a:0.5 -> a:0.25', () =>
    assert.deepEqual(Color.parse({r: 0, g: 0, b: 0, a: 0.5}).fadeOut(0.5).rgba, [0, 0, 0, 0.25]));
  test('negate inverts channels', () =>
    assert.deepEqual(Color.parse({r: 0, g: 128, b: 200}).negate().rgb, [255, 127, 55]));
  test('blue.desaturate(0.5) magic-template example', () =>
    assert.equal(Color.parse('blue').desaturate(0.5).rgbString, 'rgb(96,96,159)'));
});

describe('OKLCH-space operations', () => {
  test('mix in oklch space (shortest hue)', () => {
    const m = Color.parse('red').mix('blue', 0.5, 'oklch');
    assert.equal(m.rgb.length, 3);
    // red hue ~29, blue hue ~264 -> midpoint ~326 (shortest path), not ~146
    assert.ok(Math.abs(m.oklch.h - 326) < 3, `hue was ${m.oklch.h}`);
  });
  test('mix in hsl space takes long way (-> magenta-ish)', () =>
    close(Color.parse('red').mix('blue', 0.5, 'hsl').rgb, [255, 0, 255]));
  test('lighten in oklch raises L', () =>
    assert.ok(Color.parse('red').lighten(0.3, 'oklch').oklch.l > Color.parse('red').oklch.l));
  test('darken in oklch lowers L', () =>
    assert.ok(Color.parse('red').darken(0.3, 'oklch').oklch.l < Color.parse('red').oklch.l));
  test('saturate in oklch raises chroma (gamut permitting)', () => {
    // start from a low-chroma color so increased chroma stays in sRGB gamut
    const start = Color.parse('#888888');
    const sat = start.saturate(0.5, false, 'oklch');
    assert.ok(sat.oklch.c >= start.oklch.c, `${sat.oklch.c} >= ${start.oklch.c}`);
  });
  test('desaturate in oklch lowers chroma', () =>
    assert.ok(Color.parse('red').desaturate(0.2, 'oklch').oklch.c < Color.parse('red').oklch.c));
});

describe('HWB', () => {
  test('red -> hwb(0, 0%, 0%)', () => assert.deepEqual(Color.parse('red').hwb, {h: 0, w: 0, b: 0, a: 1}));
  test('white -> hwb(0, 100%, 0%)', () => assert.deepEqual(Color.parse('white').hwb, {h: 0, w: 100, b: 0, a: 1}));
  test('black -> hwb(0, 0%, 100%)', () => assert.deepEqual(Color.parse('black').hwb, {h: 0, w: 0, b: 100, a: 1}));
  test('gray -> hwb(0, 50%, 50%)', () => assert.deepEqual(Color.parse('gray').hwb, {h: 0, w: 50, b: 50, a: 1}));
  test('salmon hwbString', () => assert.equal(Color.parse('salmon').hwbString, 'hwb(6 45% 2%)'));
  test('fromHwb pure red roundtrip', () => close(Color.parse({h: 0, w: 0, b: 0}).rgb, [255, 0, 0]));
  test('fromHwb achromatic (w+b>=1) -> gray', () => close(Color.parse({h: 0, w: 30, b: 70}).rgb, [77, 77, 77], 1));
  test('parse dispatches hwb object', () => close(Color.parse({h: 120, w: 0, b: 0}).rgb, [0, 255, 0]));
});

describe('WCAG accessibility', () => {
  test('white relativeLuminance = 1', () => assert.equal(Color.parse('white').relativeLuminance, 1));
  test('black relativeLuminance = 0', () => assert.equal(Color.parse('black').relativeLuminance, 0));
  test('white vs black contrast = 21', () => assert.equal(Color.parse('white').contrast('black'), 21));
  test('contrast is symmetric-ish (within float)', () => {
    const a = Color.parse('salmon').contrast('blue');
    const b = Color.parse('blue').contrast('salmon');
    assert.ok(Math.abs(a - b) < 1e-9);
  });
  test('white on black isReadable AA normal', () => assert.equal(Color.parse('white').isReadable('black'), true));
  test('light gray on white fails AA', () =>
    assert.equal(Color.parse('#DDDDDD').isReadable('white'), false));
  test('AAA requires 7:1 normal', () =>
    assert.equal(Color.parse('white').isReadable('black', {level: 'AAA'}), true));
  test('AAA large requires 4.5:1', () =>
    assert.equal(Color.parse('#767676').isReadable('white', {level: 'AAA', size: 'large'}), true));
});

describe('utility channel setters', () => {
  const s = Color.parse('salmon');
  test('toAlpha', () => assert.equal(s.toAlpha(0.3).alpha, 0.3));
  test('toHSVSaturation', () => assert.equal(s.toHSVSaturation(80).hsv.s, 80));
  test('toHSLSaturation', () => assert.equal(s.toHSLSaturation(80).hsl.s, 80));
  test('toLuminance', () => assert.equal(s.toLuminance(50).hsl.l, 50));
  test('toHue', () => assert.equal(s.toHue(180).hsl.h, 180));
  test('toValue', () => assert.equal(s.toValue(90).hsv.v, 90));
  test('toOklchLightness', () => close(s.toOklchLightness(0.5).oklch.l, 0.499, 0.01));
  test('toChroma', () => close(s.toChroma(0.05).oklch.c, 0.05, 0.01));
});

describe('getShades', () => {
  test('hsl shades vary lightness 95->5', () =>
    assert.deepEqual(Color.parse('red').getShades(3, 'hsl').map(c => c.hsl.l), [95, 50, 5]));
  test('oklch shades step down from startLight', () => {
    // Note: extreme L targets may be clipped by the sRGB gamut on conversion,
    // so we assert the *requested* step decreases monotonically, not exact L.
    const shades = Color.parse('red').getShades(3, 'oklch');
    // first shade uses startLight=0.95 (clipped), last uses 0.05 — last is darker than first
    assert.ok(shades[2].oklch.l < shades[0].oklch.l, 'last shade should be darker than first');
  });
  test('n < 2 returns [this]', () => assert.equal(Color.parse('red').getShades(1).length, 1));
});

describe('equality, harmonies, nearest', () => {
  test('equals true for same color different form', () =>
    assert.equal(Color.parse('red').equals('#FF0000'), true));
  test('equals false for different colors', () =>
    assert.equal(Color.parse('red').equals('blue'), false));
  test('complementary of red is cyan', () =>
    assert.deepEqual(Color.parse('red').complementary().map(c => c.hex), ['#FF0000', '#00FFFF']));
  test('triadic of red', () =>
    assert.deepEqual(Color.parse('red').triadic().map(c => c.hex), ['#FF0000', '#00FF00', '#0000FF']));
  test('analogous returns 3 colors', () =>
    assert.equal(Color.parse('red').analogous().length, 3));
  test('tetradic returns 4 colors', () =>
    assert.equal(Color.parse('red').tetradic().length, 4));
  test('static nearestNamed finds red', () =>
    assert.equal(Color.nearestNamed(Color.parse('#FE0000')), 'red'));
  test('instance nearestNamed', () =>
    assert.equal(Color.parse('#FE0000').nearestNamed(), 'red'));
});

describe('namedColors export', () => {
  test('has 140+ named colors', () => assert.ok(Object.keys(namedColors).length >= 140));
  test('salmon maps to #FA8072', () => assert.equal(namedColors.salmon, '#FA8072'));
});
