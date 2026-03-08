# chao-cli

一个基于 Node.js 的自定义前端项目脚手架工具，支持从 GitHub 远程模板快速创建项目。

## 功能特性

- 交互式选择项目模板
- 通过命令行参数直接指定模板
- 自动克隆远程 GitHub 仓库
- 自定义项目信息（名称、关键词、描述、作者）并写入 `package.json`
- 自动安装项目依赖
- 同名目录冲突检测与处理
- 查看所有可用模板列表

## 环境要求

- Node.js >= 20
- Git

## 安装

```bash
# 全局安装
npm install -g chao-generator-cli

# 或本地开发
git clone <repo-url>
cd chao-generator-cli
npm install
npm link
```

## 使用

### 创建项目

```bash
# 交互式创建（会弹出模板选择列表）
chao-cli create my-app

# 指定模板创建
chao-cli create my-app -t vite-template

# 强制覆盖已存在的同名目录
chao-cli create my-app -f

# 跳过项目信息录入
chao-cli create my-app -i
```

### 查看可用模板

```bash
chao-cli list
```

### 查看版本

```bash
chao-cli -v
```

### 查看帮助

```bash
chao-cli --help
chao-cli create --help
```

## 可用模板

| 模板名称 | 仓库地址 | 描述 |
|---------|---------|------|
| webpack-template | yingside/webpack-template | 基于 webpack5 自定义初始化 Vue3 项目模板 |
| vue-admin-box | cmdparkour/vue-admin-box | 基于 vue3 的 admin-box 模板 |
| vite-template | yingside/vite-template | 基于 vite3 自定义初始化 Vue3 项目模板 + 前端工具链模板 |

## 命令参数

### `create <app-name>`

| 参数 | 说明 |
|------|------|
| `-t, --template [template]` | 指定模板名称创建项目 |
| `-f, --force` | 强制覆盖已存在的同名目录 |
| `-i, --ignore` | 跳过项目信息录入，直接使用模板默认配置 |

## 技术栈

- [Commander.js](https://github.com/tj/commander.js) - 命令行参数解析
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - 交互式命令行
- [download-git-repo](https://github.com/flipxfx/download-git-repo) - GitHub 仓库下载
- [chalk](https://github.com/chalk/chalk) - 终端文本样式
- [ora](https://github.com/sindresorhus/ora) - 终端 loading 动画
- [shelljs](https://github.com/shelljs/shelljs) - Shell 命令执行
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - 文件系统操作增强
- [table](https://github.com/gajus/table) - 终端表格输出

## License

ISC
