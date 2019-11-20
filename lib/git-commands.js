const cp = require('child_process');
const gitData = require('git-user-data');
const moment = require('moment');

const escapeDoubleQuotes = function(str) {
  return str.replace(/\\([\s\S])|(")/g, "\\$1$2");
};

module.exports = {
  init: async (cwd) => {
    cwd = cwd || process.cwd();

    return new Promise((resolve, reject) => {
      cp.exec('git init --quiet', {cwd}, ((error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else if (stdout.length) {
          reject(stdout);
        } else if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }));
    });
  },

  config: async (cwd, name, mail) => {
    cwd = cwd || process.cwd();
    name = name || gitData.getName();
    mail = mail || gitData.getEmail();

    return new Promise((resolve, reject) => {
      cp.exec('git config user.name "' + escapeDoubleQuotes(name) + '"', {cwd}, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else if (stdout.length) {
          reject(stdout);
        } else if (stderr) {
          reject(stderr);
        }
        cp.exec('git config user.email "' + escapeDoubleQuotes(mail) + '"', {cwd}, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else if (stdout.length) {
            reject(stdout);
          } else if (stderr) {
            reject(stderr);
          }
          resolve();
        });
      });
    });
  },

  add: function (cwd) {
    cwd = cwd || process.cwd();

    return new Promise((resolve, reject) => {
      cp.exec('git add .', {cwd}, ((error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else if (stdout.length) {
          reject(stdout);
        } else if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }));
    });
  },

  createCommit: function (cwd, msg, name, mail, date) {
    cwd = cwd || process.cwd();
    msg = msg || "Commit message";
    name = name || gitData.getName();
    mail = mail || gitData.getEmail();
    date = date || moment();

    return new Promise((resolve, reject) => {
      cp.exec('git commit --all --message="' + escapeDoubleQuotes(msg) + '" --quiet', {
        cwd,
        env: {
          GIT_AUTHOR_NAME: name,
          GIT_AUTHOR_EMAIL: mail,
          GIT_AUTHOR_DATE: date.format('X ZZ'),
          GIT_COMMITTER_NAME: name,
          GIT_COMMITTER_EMAIL: mail,
          GIT_COMMITTER_DATE: date.format('X ZZ'),
        },
      }, ((error, stdout, stderr) => {
        if (error) {
          reject(error);
          console.log(error);
        } else if (stdout.length) {
          reject(stdout);
        } else if (stderr) {
          if (stderr.toString().search(/Auto packing the repository/g) > -1) {
            resolve(stderr);
          } else {
            reject(stderr);
          }
        }
        resolve(stdout);
      }));
    });
  },

  log: function (cwd) {
    cwd = cwd || process.cwd();

    return new Promise((resolve, reject) => {
      cp.exec('git log', {cwd}, ((error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }));
    });
  },
};
