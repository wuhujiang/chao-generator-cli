import { isUnicodeSupported } from './isUnicodeSupported.js'
import chalk from 'chalk';

const main = {
  info: chalk.blue('ℹ'),
  success: chalk.green('✔'),
  warning: chalk.yellow('⚠'),
  error: chalk.red('✖'),
  arrow: chalk.blue('→'),
  star: chalk.yellow('★'),
}

const fallback = {
  info: chalk.blue('i'),
  success: chalk.green('√'),
  warning: chalk.yellow('⚠'),
  error: chalk.red('×'),
  arrow: chalk.blue('→'),
  star: chalk.yellow('*'),
}

const logSymbols = isUnicodeSupported() ? main : fallback;

export default logSymbols;