import fs from 'fs-extra'
import ora from 'ora';
import chalk from 'chalk';
import path from 'path'
import logSymbols from './logSymbols.js';
import shell from 'shelljs';
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory,relativePath)

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

export async function changePackageJson(name,info){
	try {
		const pkg = await fs.readJson(resolveApp(`${name}/package.json`))
	Object.keys(info).forEach(item => {
		if(item === 'name'){
			pkg[item] = info[item] && info[item].trim() ? info[item].trim() : name
		}else if(item === 'keyword' && info[item] && info[item].trim()){
			pkg.keywords = info[item].split(',')
		}else if( info[item] && info[item].trim()){
			pkg[item] = info[item]
		}
	})
	await fs.writeJson(resolveApp(`${name}/package.json`),pkg,{spaces:2}) 
	} catch (error) {
		console.log(logSymbols.error,chalk.redBright(`修改package.json失败`))
		console.log(error)
	}

}

export function npmInstall(dir){
	const spinner = ora('正在安装依赖...').start();
	if(shell.exec(`cd ${shell.pwd()}/${dir} && npm install --force -d`).code !== 0){
		console.log(logSymbols.error,chalk.yellowBright(`安装依赖失败,请手动安装`))
		shell.exit(1);
	}
	spinner.succeed(chalk.greenBright(`安装依赖成功`))
	spinner.succeed(chalk.greenBright(`项目创建成功`))
}