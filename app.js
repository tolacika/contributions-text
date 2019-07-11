const chalk = require('chalk');
const clear = require('clear');
const inquirer = require("./lib/inquirer");
const moment = require('moment');
const repo = require('./lib/repo');
const CharMap = require('./lib/charMap');

const out = process.stdout;

clear();

out.write(chalk.yellow(`   ______            __       _ __          __  _
  / ____/___  ____  / /______(_) /_  __  __/ /_(_)___  ____  _____
 / /   / __ \\/ __ \\/ __/ ___/ / __ \\/ / / / __/ / __ \\/ __ \\/ ___/
/ /___/ /_/ / / / / /_/ /  / / /_/ / /_/ / /_/ / /_/ / / / (__  )
\\____/\\____/_/ /_/\\__/_/  /_/_.___/\\__,_/\\__/_/\\____/_/ /_/____/
  ______          __     ______                           __
 /_  __/__  _  __/ /_   / ____/__  ____  ___  _________ _/ /_____  _____
  / / / _ \\| |/_/ __/  / / __/ _ \\/ __ \\/ _ \\/ ___/ __ \`/ __/ __ \\/ ___/
 / / /  __/>  </ /_   / /_/ /  __/ / / /  __/ /  / /_/ / /_/ /_/ / /
/_/  \\___/_/|_|\\__/   \\____/\\___/_/ /_/\\___/_/   \\__,_/\\__/\\____/_/\n\n`));

async function run () {

  const appConf = await inquirer.askAppConfig();
  appConf.startDate = moment(appConf.startDate);

  let charMap;
  if (appConf.mode === "text") {
    charMap = await inquirer.askText();
  } else {
    charMap = new CharMap("bitmap", appConf.bitmapPath);
  }

  out.write("\nGenerated\n\n" + charMap.getAsPrintable() + "\n");

  await repo.setupRepo(appConf);

  await repo.createCommits(appConf, charMap);

  out.write(chalk.redBright("All done. Now you have no other tasks than push the repo to github...\n"))
}

run();
