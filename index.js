#! /usr/bin/env node
import figlet from 'figlet'
import chalk  from 'chalk'
import { program } from 'commander'
import {templates} from './constants.js'
import { initAction } from './initAction.js'
import { table } from 'table'
// await clone('yingside/monorepo-template', 'chao-generator-cli')
// await clone('cmdparkour/vue-admin-box', 'vue-admin-box')

// 可用fs-extra库替代，但是这里只用到这个，没必要 
import { readFile } from 'fs/promises'
import logSymbols from './logSymbols.js'



const pkg = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url), 'utf-8')
)
// console.log(pkg)
program.version(pkg.version,'-v,--version')

program
  .name("chao-cli")
  .description("一个简单的脚手架工具")
  .usage("<command> [options]")
  .on('--help', () => {
    console.log(chalk.yellowBright("所有可用的命令"));
  })  

program
  .command("create <app-name>")
  .description("创建一个新的项目")
  .option("-t --template [template]","输入模板名称创建项目")
  .option("-f --force","强制创建项目")
  .option("-i --ignore","忽略已存在的文件")
  .action(initAction)

  program
    .command("list")
    .description("列出所有可用模板")
    .action(() => {
      const data = templates.map(item=>[chalk.greenBright(item.name),chalk.greenBright(item.value),chalk.greenBright(item.desc)])
      data.unshift(["名称","URL","描述"])
      const config = {
        // columnDefault: {
        //   width: 10,
        // },
        header: {     
          alignment: 'center',
          content: chalk.yellowBright(logSymbols.star + " 所有可用的模板"),
          },
        }
        console.log(table(data,config))
      // console.log('列出所有可用模板')
      // console.log(chalk.yellowBright("所有可用的模板"));
      // templates.forEach((item,index)=>{
      //   console.log(chalk.greenBright(index + 1) + " " + chalk.greenBright(item.name) + "" + chalk.greenBright(item.value) + "" + chalk.greenBright(item.desc))
      //   // console.log(`${index+1}. ${item.name} - ${item.desc}`) 

      // })
    })
  // .option("-t --template [template-name]","输入模板名称创建项目")

// console.log('\r\n' + chalk.bgGreenBright.bold(figlet.textSync('chaoma-cli',{
//   font:'Standard',
//   horizontalLayout:'default',
//   verticalLayout:'default',
//   width:80,
//   whitespace:true,
// })))

console.log('\r\n' + `Run ${chalk.cyan.bold('chao-cli <command> --help')} for detailed usage of given command`)

program.parse(process.argv)