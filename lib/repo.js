const chalk = require("chalk");
const git = require("./git-commands");
const ProgressBar = require("./progressBar");
const out = process.stdout;
const touch = require('touch');
const path = require('path');
const fs = require('fs');

module.exports = {
  setupRepo: async (appConfig) => {
    out.write("Initializing local repository in:\n  " + chalk.cyanBright(appConfig.repoRoot) + "\n");

    try {
      await git.init(appConfig.repoRoot);
    } catch (e) {
      out.write(chalk.redBright("An error occurred in git init") + "\nMessage: " + e + "\n");
      return;
    }

    out.write("Configuring local repository...\nAuthor: " + chalk.cyanBright(appConfig.authorName) + " <"
      + chalk.cyanBright(appConfig.authorEmail) + ">\n");

    try {
      await git.config(appConfig.repoRoot, appConfig.authorName, appConfig.authorEmail);
    } catch (e) {
      out.write(chalk.redBright("An error occurred in git init") + "\nMessage: " + e + "\n");
      return;
    }

    out.write("Configuration done...\n");

  },
  createCommits: async (appConf, charMap) => {
    let allCommits = charMap.getSum() * appConf.numOfCommits;
    let date = appConf.startDate.clone();

    out.write("Generating commits...\n");
    out.write(chalk.greenBright(allCommits) + " commits needed.\nStarting from: "
      + chalk.greenBright(date.format("YYYY-MM-DD HH:mm:ss ZZ")) + "\n");

    const bar = new ProgressBar({
      prefix: "Committing...",
      total: allCommits,
    });

    bar.init();

    touch(path.join(appConf.repoRoot, 'init.txt'));
    try {
      await git.add(appConf.repoRoot);
      await git.createCommit(appConf.repoRoot, "Initial commit", appConf.authorName, appConf.authorEmail, appConf.startDate.clone().subtract(1, 'minute'));
    } catch (e) {
      bar.error(e);
      out.write(chalk.redBright("An error occurred in git init") + "\nMessage: " + e + "\n");
      return;
    }

    // out.write(await git.log(appConf.repoRoot) + "\n");

    let counter = 0;
    let currentDate = date.clone();
    for (let x = 0; x < charMap.getWidth(); x++) {
      for (let y = 0; y < charMap.getHeight(); y++) {
        let p = charMap.getPixelRaw(x, y);
        let commitCount = parseInt(p) * appConf.numOfCommits;
        let commitDate = currentDate.clone().add(1, 'minute');

        fs.appendFileSync(path.join(appConf.repoRoot, 'init.txt'), "For date: " + commitDate.format('YYYY-MM-DD'));

        for (let c = 0; c < commitCount; c++) {
          fs.appendFileSync(path.join(appConf.repoRoot, 'init.txt'), ".");
          try {
          await git.createCommit(appConf.repoRoot, "Commit message no. " + counter,
            appConf.authorName, appConf.authorEmail, commitDate.clone());
          } catch (e) {
            bar.error(e);
            out.write(chalk.redBright("An error occurred in git commit") + "\nMessage: " + e + "\n");
            return;
          }
          commitDate.add(1, 'minute');
          counter++;
          bar.step();
        }
        fs.appendFileSync(path.join(appConf.repoRoot, 'init.txt'), "\n");
        currentDate.add(1, "day");
        // out.write(date.format("X ZZ") + "\n");
      }
      // if (x > 10) return;
    }
    bar.finish();
    out.write("Commits done...\n");
  },
};
