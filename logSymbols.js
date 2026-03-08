import { isUnicodeSupported } from './isUnicodeSupported.js'
import chalk from 'chalk';

const main = {
  info : chalk.blue('ℹ'),
  success : chalk.green('✔'),
  warning : chalk.yellow('⚠'),
  error : chalk.red('✖'),
  arrow : chalk.blue('→'),
}

const fallback = {
  info : chalk.blue('i'),
  success : chalk.green('√'),
  warning : chalk.yellow('⚠'),
  error : chalk.red('×'),
  arrow : chalk.blue('→'),
}

const logSymbols = isUnicodeSupported() ? main : fallback;

export default logSymbols;