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

export interface HWB {
  h: number;
  w: number;
  b: number;
  a?: number;
}

export type ColorSpace = 'rgb' | 'hsl' | 'oklch';
export type ToStringFormat = 'rgb' | 'hex' | 'rgbaHex' | 'hsl' | 'hsla' | 'hsv' | 'cmyk' | 'cmyka' | 'oklch' | 'oklcha' | 'hwb' | 'hwba';
export type ReadabilityLevel = 'AA' | 'AAA';
export type ReadabilitySize = 'normal' | 'large';
export interface ReadabilityOptions { level?: ReadabilityLevel; size?: ReadabilitySize; }
export interface ToStringOptions { modern?: boolean; }

export type ColorInput = string | RGB | HSL | HSV | CMYK | OKLCH | HWB | [number, number, number, number?];

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
  static parse(hwb: HWB): Color;
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
  static fromHwb(hwb: HWB): Color;
  static nearestNamed(input: ColorInput | Color): string;

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
  readonly hwb: HWB;
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
  readonly hwbString: string;
  readonly hwbaString: string;
  readonly isGrayScale: boolean;
  readonly relativeLuminance: number;

  toString(format?: ToStringFormat, options?: ToStringOptions): string;
  mix(color: ColorInput, ratio?: number, space?: ColorSpace): Color;
  lighten(ratio: number, space?: ColorSpace): Color;
  darken(ratio: number, space?: ColorSpace): Color;
  saturate(ratio: number, reverse?: boolean, space?: ColorSpace): Color;
  desaturate(ratio: number, space?: ColorSpace): Color;
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
  contrast(color2: ColorInput): number;
  isReadable(color2: ColorInput, options?: ReadabilityOptions): boolean;
  equals(color2: ColorInput): boolean;
  complementary(): Color[];
  analogous(angle?: number): Color[];
  triadic(): Color[];
  tetradic(angle?: number): Color[];
  nearestNamed(): string;
}
