const fs = require('fs');
const path = require('path');

module.exports = {
  getCurrentDirectory: () => {
    return process.cwd();
  },

  directoryExists: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  directoryEmpty: (filePath) => {
    try {
      return !fs.readdirSync(filePath).length;
    } catch (err) {
      return false;
    }
  },

  fileExists: (filePath) => {
    try {
      return fs.existsSync(filePath);
    } catch (err) {
      return false;
    }
  },
};
