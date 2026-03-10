import { execFileSync } from 'child_process'
import fs from 'fs-extra'
import ora from 'ora'
import chalk from 'chalk'
import path from 'path'
import logSymbols from './logSymbols.js'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

export async function removeDir(dir) {
  const spinner = ora({
    text: `正在删除文件夹 ${chalk.cyan(dir)}`,
    color: 'yellow',
  })
  spinner.start()

  try {
    await fs.remove(resolveApp(dir))
    spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}成功`))
  } catch (err) {
    spinner.fail(chalk.redBright(`删除文件夹${chalk.cyan(dir)}失败`))
    console.log(err)
  }
}

export async function changePackageJson(name, info) {
  try {
    const pkgPath = resolveApp(path.join(name, 'package.json'))
    const pkg = await fs.readJson(pkgPath)

    Object.keys(info).forEach(item => {
      if (item === 'name') {
        pkg[item] = info[item] && info[item].trim() ? info[item].trim() : name
      } else if (item === 'keyword' && info[item] && info[item].trim()) {
        pkg.keywords = info[item].split(',').map(k => k.trim())
      } else if (info[item] && info[item].trim()) {
        pkg[item] = info[item]
      }
    })

    await fs.writeJson(pkgPath, pkg, { spaces: 2 })
  } catch (error) {
    console.log(logSymbols.error, chalk.redBright('修改 package.json 失败'))
    console.log(error)
  }
}

export function npmInstall(dir) {
  const spinner = ora('正在安装依赖...').start()
  const targetDir = resolveApp(dir)

  try {
    execFileSync('npm', ['install'], {
      cwd: targetDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })
    spinner.succeed(chalk.greenBright('安装依赖成功'))
    spinner.succeed(chalk.greenBright('项目创建成功'))
  } catch {
    spinner.fail(chalk.yellowBright('安装依赖失败，请进入项目目录手动执行 npm install'))
    process.exit(1)
  }
}
