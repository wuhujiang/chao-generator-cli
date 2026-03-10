import { execFileSync } from 'child_process'
import chalk from 'chalk'
import clone from './gitClone.js'
import logSymbols from './logSymbols.js'
import fs from 'fs-extra'
import { removeDir, changePackageJson, npmInstall } from './utils.js'
import { inquirerConfirm, inquirerChoose, inquirerInputs } from './interactive.js'
import { templates, messages } from './constants.js'

const PROJECT_NAME_RE = /^[a-zA-Z0-9_][a-zA-Z0-9_\-.]*$/

function isGitInstalled() {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export const initAction = async (name, option) => {
  if (!isGitInstalled()) {
    console.log(logSymbols.error + ' ' + '请先安装 git')
    process.exit(1)
  }

  if (!PROJECT_NAME_RE.test(name)) {
    console.log(logSymbols.error + ' ' + '项目名只能包含字母、数字、下划线、中划线和点号，且不能以点号或中划线开头')
    process.exit(1)
  }

  let repository = ''
  if (option.template) {
    const template = templates.find(t => t.name === option.template)
    if (!template) {
      console.log(logSymbols.error + ` 不存在模板${chalk.yellowBright(option.template)}`)
      console.log(`\r\n 运行${logSymbols.arrow}${chalk.cyanBright('chao-cli list')}查看所有可用模板\r\n`)
      return
    }
    repository = template.value
  } else {
    const answer = await inquirerChoose('请选择项目模板', templates)
    repository = answer.choose
  }

  if (fs.existsSync(name) && !option.force) {
    console.log(logSymbols.warning, `已存在项目文件夹${chalk.yellowBright(name)}`)
    const answer = await inquirerConfirm(`是否删除文件夹${chalk.yellowBright(name)}`)
    if (answer.confirm) {
      await removeDir(name)
    } else {
      console.log(logSymbols.error, chalk.redBright(`对不起，项目创建失败，存在同名文件夹${name}`))
      return
    }
  } else if (fs.existsSync(name) && option.force) {
    console.log(logSymbols.warning + ' ' + '项目名已存在，将强制覆盖')
    await removeDir(name)
  }

  try {
    await clone(repository, name)
  } catch (error) {
    console.log(logSymbols.error, chalk.redBright('对不起，项目创建失败'))
    console.log(error)
    process.exit(1)
  }

  if (!option.ignore) {
    const answers = await inquirerInputs(messages)
    await changePackageJson(name, answers)
  }

  npmInstall(name)
}
