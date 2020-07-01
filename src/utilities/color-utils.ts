
export function hexToRGBValue(hex: string, alpha: number) {
  const convertedHexValue = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb =  convertedHexValue ? {
    r: parseInt(convertedHexValue[1], 16),
    g: parseInt(convertedHexValue[2], 16),
    b: parseInt(convertedHexValue[3], 16)
  } : null;

  if (rgb) {
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
  } else {
    return "rgba(170, 170, 170,1.0)";
  }
}

export function hexToRGB(hex: string) {
  const convertedHexValue = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return convertedHexValue ? {
    r: parseInt(convertedHexValue[1], 16),
    g: parseInt(convertedHexValue[2], 16),
    b: parseInt(convertedHexValue[3], 16)
  } : null;
}

export function colorIsLight(hex: string) {
  const rgb = hexToRGB(hex);
  if (!rgb) return false;
  const brightness = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return brightness > 150;
}
