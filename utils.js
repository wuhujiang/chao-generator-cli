import fs from 'fs-extra'
import ora from 'ora';
import chalk from 'chalk';
import path from 'path'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory,relativePath)

export function isUnicodeSupported() {
	const {env} = process;
	const {TERM, TERM_PROGRAM} = env;

	if (process.platform !== 'win32') {
		return TERM !== 'linux'; // Linux console (kernel)
	}

	return Boolean(env.WT_SESSION) // Windows Terminal
		|| Boolean(env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
		|| env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
		|| TERM_PROGRAM === 'Terminus-Sublime'
		|| TERM_PROGRAM === 'vscode'
		|| TERM === 'xterm-256color'
		|| TERM === 'alacritty'
		|| TERM === 'rxvt-unicode'
		|| TERM === 'rxvt-unicode-256color'
		|| env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}

export async function removeDir(dir){
  const spinner = ora({
    text: `正在删除文件夹 ${chalk.cyan(dir)}`,
    color: 'yellow',
  });
  spinner.start();

  try{
    await fs.remove(resolveApp(dir))
    spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}成功`));
  }catch(err){
    spinner.fail(chalk.redBright(`删除文件夹${chalk.cyan(dir)}失败`));
    console.log(err)
    return;
  }

}