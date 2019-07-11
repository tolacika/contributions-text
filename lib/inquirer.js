const inquirer = require('inquirer');
const chalk = require('chalk');
const files = require('./files');
const path = require('path');
const gitDetails = require('git-user-data');
const validator = require('validator');
const moment = require('moment');
const CharMap = require('./charMap');
const out = process.stdout;

module.exports = {
  askAppConfig: async () => {
    inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
    return await inquirer.prompt([
      {
        name: 'repoRoot',
        type: 'input',
        message: 'Enter the repo path:',
        default: path.join(files.getCurrentDirectory(), 'repo'),
        validate: function (value) {
          if (files.directoryExists(value)) {
            if (files.directoryEmpty(value)) {
              return true;
            } else {
              return 'Directory must be empty';
            }
          } else {
            return 'Directory must be exists';
          }
        },
      },
      {
        name: 'authorName',
        type: 'input',
        message: 'Enter the author name (nickname) for commits:',
        default: gitDetails.getName(),
        validate: function (val) {
          return val.length ? true : 'Please provide an author name';
        },
      },
      {
        name: 'authorEmail',
        type: 'input',
        message: 'Enter the author email address for commits:',
        default: gitDetails.getEmail(),
        validate: function (val) {
          return val.length && validator.isEmail(val) ? true : 'Please provide a valid author email address';
        },
      },
      {
        name: 'startDate',
        type: 'datetime',
        message: "Enter the starting date for the text (recommended any sundays):",
        default: "",
        format: ['yyyy', '-', 'mm', '-', 'dd', ' (', 'dddd', ')'],
        initial: moment().day(0).hour(3).minute(0).second(0).millisecond(0).subtract(48, 'w').toDate(),
      },
      {
        name: 'numOfCommits',
        type: 'number',
        message: 'Number of commits per day:',
        default: 50,
        validate: function (val) {
          return val === parseInt(val) && val > 0 ? true : 'Please provide a positive integer';
        },
      },
      {
        name: 'mode',
        type: 'list',
        message: 'Choose the rendering mode:',
        choices: [
          {value: 'text', name: 'Generate from text'},
          {value: 'bitmap', name: 'Generate from bitmap'},
        ]
      },
      {
        name: 'bitmapPath',
        type: 'input',
        message: 'Enter the bitmap\'s path:',
        default: path.join(files.getCurrentDirectory(), 'image.bmp'),
        validate: function (value) {
          if (files.fileExists(value)) {
              return true;
          } else {
            return 'Bitmap must be exists';
          }
        },
        when: function (answers) {
          return answers.mode === "bitmap";
        }
      },
    ]);
  },
  askText: async () => {
    let text = "";
    let map = null;
    do {
      text = (await inquirer.prompt({
        type: 'input',
        name: 'text',
        message: "Enter the text for contributions bar:",
        default: gitDetails.getName(),
        validate: function (val) {
          return val.length ? true : "Please provide a text";
        },
      })).text;

      map = new CharMap("text", text);

      out.write("\nGenerated\n\n" + map.getAsPrintable() + "\n");

      if (map.getWidth() > 50) {
        out.write(chalk.bgRed.black("Warning\n")
          + "The generated image is longer than 50.\nThis may cause overflow on contributions bar.\n");
      }

    } while (!(await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: "Do you like it?",
      default: true,
    })).confirm);
    return map;
  },
};
