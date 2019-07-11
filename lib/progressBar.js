const chalk = require('chalk');
const _ = require('lodash');
const out = process.stdout;
const BAR_OFFSET = 30;

module.exports = class ProgressBar {
  constructor (opts) {
    opts = opts || {};
    this.total = opts.total || 100;
    this.current = opts.current || 0;
    this.rowStyle = opts.rowStyle || chalk.white;
    this.barStyle = opts.barStyle || chalk.greenBright;
    this.fillChar = opts.fillChar || '█';
    this.emptyChar = opts.emptyChar || ' ';
    this.prefix = opts.prefix || "Processing...";
    this.lastFilled = 0;
    this.lastEmpty = 0;
    // this.barLength = out.columns - BAR_OFFSET - this.prefix.length;
  }

  init (current) {
    this.current = current || 0;
    this.update(this.current);
  }

  update (current) {
    this.current = current;
    this.draw();
  }

  step (i) {
    this.current += i || 1;
    this.draw();
  }

  updateLength (p, s) {
    this.barLength = out.columns - p - s - 1;
  }

  draw () {
    if (this.current > this.total) {
      this.current = this.total;
    }

    const currentProgress = this.current / this.total;
    const percentage = (currentProgress * 100).toFixed(2);

    const prefix = `${this.prefix} [`;
    const suffix = `] ${this.current}/${this.total} - ${percentage}%`;

    this.updateLength(prefix.length, suffix.length);

    const filledLength = (currentProgress * this.barLength).toFixed(0);
    const emptyLength = this.barLength - filledLength;

    if (this.lastFilled === filledLength && this.lastEmpty === emptyLength) {return;}

    this.lastFilled = filledLength;
    this.lastEmpty = emptyLength;

    const filledBar = this.barStyle(_.pad("", filledLength, this.fillChar));
    const emptyBar = this.barStyle(_.pad("", emptyLength, this.emptyChar));

    out.clearLine();
    out.cursorTo(0);
    out.write(this.rowStyle(prefix) + filledBar + emptyBar + this.rowStyle(suffix));
  }

  finish () {
    this.current = this.total;
    this.draw();
    out.write("\n");
  }

  error (msg, prefix, color) {
    msg = msg || "An error occurred...";
    color = color || chalk.bold.redBright;
    this.prefix = prefix || "ERROR";
    // this.barLength = out.columns - BAR_OFFSET - this.prefix.length;
    this.rowStyle = color;
    this.barStyle = color;
    this.draw();
    out.write("\n" + color(msg) + "\n");
  }
};
