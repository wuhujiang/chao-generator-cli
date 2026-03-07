import download from "download-git-repo";
import ora from 'ora'
import chalk from 'chalk'

const clone = (remote,name,options = false) => {
  const spinner = ora('正在拉去项目。。。')
  spinner.start()
  return new Promise((reslove,reject) =>{
    download(remote,name,options,err =>{
      if(err){
        // console.error(err)
        spinner.fail(chalk.red(err))
        reject(err)
      }else{
        console.log('拉去成功')
        spinner.succeed(chalk.green('拉取成功'))
        reslove()
      }
    })
  })
}

export default clone;