const fs = require('fs');
const bmpjs = require('bmp-js');
const _ = require('lodash');

module.exports = function (filename, mono) {

  if (typeof mono === 'undefined') {
    mono = true;
  }

  const buffer = fs.readFileSync(filename);
  const bmpData = bmpjs.decode(buffer);

  const pixels = _.chunk([...bmpData.data], 4);
  for (let i in pixels) {
    const [a, r, g, b] = pixels[i];
    pixels[i] = 255 - parseInt((r + g + b) / 3);
  }

  const imageData = [];

  for (let p of pixels) {
    if (mono) {
      imageData.push(p ? '1' : '0');
    } else {
      imageData.push(parseInt(p / 63) + "")
    }
  }

  const imageStr = imageData.join('');

  const imageRows = [];
  for (let i = 0; i < bmpData.height; i++) {
    imageRows[i] = imageStr.substr(i * bmpData.width, bmpData.width);
  }
  return {imageRows, bmpData};
};
