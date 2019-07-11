const font = require('./font');
// const out = process.stdout;

module.exports = function (mode, str) {
  const rows = [[], [], [], [], [], [], []];

  if (mode === 'text') {
    const splitted = str.split('');
    for (let ch of splitted) {
      if (!font.hasOwnProperty(ch)) {
        ch = font.fallback;
      }
      let chMap = font[ch];
      for (let i = 0; i < rows.length; i++) {
        rows[i].push(chMap[i]);
      }
    }

    for (let i = 0; i < rows.length; i++) {
      rows[i] = rows[i].join('0');
    }
  } else {
    const { imageRows } = require('./image-helper')(str, false);

    for (let i = 0; i < rows.length; i++) {
      rows[i] = imageRows[i];
    }
  }

  const getPixelRaw = function (x, y) {
    return rows[y][x];
  };

  const getPixel = function (x, y) {
    if (mode === 'text') {
      return getPixelRaw(x, y) === '1' ? "█" : " ";
    } else {
      switch (getPixelRaw(x, y)) {
        case '0':
          return " ";
        case '1':
          return "░";
        case '2':
          return "▒";
        case '3':
          return "▓";
        case '4':
          return "█";
      }
    }
    return "";
  };

  const getSource = function () {
    return rows;
  };

  const getAsPrintable = function () {
    // out.write(" ░▒▓█\n");
    return mode === 'text'
      ? rows.join("\n").replace(/0/g, ' ').replace(/1/g, '█')
      : rows.join("\n").replace(/0/g, ' ')
        .replace(/1/g, '░')
        .replace(/2/g, '▒')
        .replace(/3/g, '▓')
        .replace(/4/g, '█');
  };

  const getWidth = function () {
    return rows[0].length;
  };

  const getHeight = function () {
    return rows.length;
  };

  const getLength = function () {
    return mode === 'text' ? str.length : rows[0].length;
  };

  const getSum = function () {
    const sumStr = rows.join("");
    let sum = 0;
    for (let i = 0; i < sumStr.length; i++) {
      sum += parseInt(sumStr[i]);
    }
    return sum;
  };

  return {
    getSource,
    getAsPrintable,
    getWidth,
    getHeight,
    getLength,
    getPixel,
    getPixelRaw,
    getSum,
  };
};
