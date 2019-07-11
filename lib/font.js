const fs = require('fs');
const bmpjs = require('bmp-js');
const _ = require('lodash');

const font = {};

font['?'] = [
  "01110",
  "10001",
  "00001",
  "00010",
  "00100",
  "00000",
  "00100",
];

font[' '] = [
  "000",
  "000",
  "000",
  "000",
  "000",
  "000",
  "000",
];

font.fallback = '?';

const characters = fs.readFileSync('./lib/fonts/normal.txt').toString().replace(/\n/g, '');



const {imageRows, bmpData} = require('./image-helper')('./lib/fonts/normal.bmp');

const getCol = function (x, rows) {
  let ret = "";
  rows.forEach(it => ret += it[x]);
  return ret;
};

let chrIt = 0;
let x = 0;
let charStart = 0;

while (x < bmpData.width) {
  let col = getCol(x, imageRows);
  if (col === "0000000") {
    if (characters.length <= chrIt) {
      break;
    }
    font[characters[chrIt]] = [];
    for (let y in imageRows) {
      font[characters[chrIt]].push(imageRows[y].substr(charStart, x - charStart));
    }
    if (charStart === x) {
      break;
    }
    chrIt++;
    charStart = x + 1;
  }
  x++;
}

module.exports = font;
