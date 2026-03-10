import { execFile } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk'

const CLONE_TIMEOUT = 60_000

const clone = (remote, name) => {
  const spinner = ora('正在拉取项目...')
  spinner.start()

  const repoUrl = `https://github.com/${remote}.git`

  return new Promise((resolve, reject) => {
    const child = execFile(
      'git',
      ['clone', '--depth=1', repoUrl, name],
      { timeout: CLONE_TIMEOUT },
      async (err) => {
        if (err) {
          if (err.killed) {
            spinner.fail(chalk.red(`拉取超时（${CLONE_TIMEOUT / 1000}s），请检查网络`))
          } else {
            spinner.fail(chalk.red(`拉取失败: ${err.message}`))
          }
          return reject(err)
        }

        try {
          await fs.remove(path.join(name, '.git'))
        } catch {
          // .git 目录删除失败不影响主流程
        }

        spinner.succeed(chalk.green('拉取成功'))
        resolve()
      }
    )
  })
}

export default clone
