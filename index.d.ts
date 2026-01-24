export interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
  a?: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
  a?: number;
}

export interface OKLCH {
  l: number;
  c: number;
  h: number;
  a?: number;
}

export type ColorInput = string | RGB | HSL | HSV | CMYK | OKLCH | [number, number, number, number?];

export const namedColors: Record<string, string>;

export class Color {
  r: number;
  g: number;
  b: number;
  a?: number;

  constructor(rgb: RGB);
  constructor(r: number, g: number, b: number, a?: number);

  static parse(rgb: RGB): Color;
  static parse(hsl: HSL): Color;
  static parse(hsv: HSV): Color;
  static parse(cmyk: CMYK): Color;
  static parse(oklch: OKLCH): Color;
  static parse(colorName: string, alpha?: number): Color | null;
  static parse(rgba: [number, number, number, number?]): Color;
  static parse(r: number, g: number, b: number, a?: number): Color;

  static isBaseConstructor(input: any): input is RGB;
  static fromNamed(colorName: string, a?: number): Color | null;
  static fromArray(input: number[]): Color;
  static fromHex(hex: string, a?: number): Color;
  static fromRgbString(s: string): Color;
  static fromHsv(hsv: HSV): Color;
  static fromHsl(hsl: HSL): Color;
  static fromCMYK(cmyk: CMYK): Color;
  static fromOklch(oklch: OKLCH): Color;

  readonly alpha: number;
  readonly rgb: [number, number, number];
  readonly rgba: [number, number, number, number];
  readonly rgbObj: RGB;
  readonly hsl: HSL;
  readonly hsla: HSL;
  readonly hsv: HSV;
  readonly hsva: HSV;
  readonly cmyk: CMYK;
  readonly cmyka: CMYK;
  readonly oklch: OKLCH;
  readonly hex: string;
  readonly hexa: string;
  readonly rgbaHex: string;
  readonly css: string;
  readonly rgbString: string;
  readonly rgbaString: string;
  readonly hslString: string;
  readonly hslaString: string;
  readonly hsvString: string;
  readonly cmykString: string;
  readonly cmykaString: string;
  readonly oklchString: string;
  readonly oklchaString: string;
  readonly isGrayScale: boolean;

  toString(format?: 'rgb' | 'hex' | 'rgbaHex' | 'hsl' | 'hsla' | 'hsv' | 'cmyk' | 'cmyka' | 'oklch' | 'oklcha'): string;
  mix(color: ColorInput, ratio?: number): Color;
  lighten(ratio: number): Color;
  darken(ratio: number): Color;
  saturate(ratio: number): Color;
  desaturate(ratio: number): Color;
  grayscale(): Color;
  rotate(deg: number): Color;
  hue(deg: number): Color;
  fadeIn(ratio: number): Color;
  fadeOut(ratio: number): Color;
  negate(): Color;
  toAlpha(alpha: number): Color;
  toHSVSaturation(saturation: number): Color;
  toHSLSaturation(saturation: number): Color;
  toLuminance(luminance: number): Color;
  toHue(hue: number): Color;
  toValue(value: number): Color;
  toOklchLightness(lightness: number): Color;
  toChroma(chroma: number): Color;
  getShades(n?: number, space?: 'hsl' | 'oklch', startLight?: number, endLight?: number): Color[];
}
