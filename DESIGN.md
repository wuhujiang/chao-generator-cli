# chao-cli 项目说明文档

## 项目概述

`chao-cli` 是一个自定义前端脚手架 CLI 工具，用于从预设的 GitHub 模板仓库快速初始化项目。用户可以通过交互式选择或命令行参数指定模板，工具会自动克隆模板、收集项目信息、修改 `package.json` 并安装依赖。

## 项目结构

```
chao-generator-cli/
├── index.js                  # CLI 入口，注册命令与参数
├── initAction.js             # create 命令核心逻辑
├── interactive.js            # 交互式问答封装（确认、选择、输入）
├── constants.js              # 模板列表与交互提示配置
├── gitClone.js               # Git 仓库克隆（基于 child_process.execFile）
├── utils.js                  # 工具函数（目录删除、package.json 修改、依赖安装）
├── logSymbols.js             # 终端符号（根据终端能力选择 Unicode/ASCII）
├── isUnicodeSupported.js     # Unicode 支持检测
├── build/
│   └── release.sh            # 发布脚本（Bash）
├── package.json              # 项目配置
└── .gitignore
```

## 模块说明

### index.js - CLI 入口

- 使用 `commander` 定义 CLI 名称、版本、描述
- 注册两个命令：
  - `create <app-name>` — 创建新项目，支持 `-t`（模板）、`-f`（强制覆盖）、`-i`（跳过信息录入）选项
  - `list` — 以表格形式展示所有可用模板

### initAction.js - 创建命令核心流程

`create` 命令的完整执行流程：

1. **环境检查** — 通过 `execFileSync` 验证系统是否安装了 Git
2. **项目名校验** — 白名单机制，只允许 `[a-zA-Z0-9_][a-zA-Z0-9_\-.]` 格式，防止命令注入
3. **模板选择** — 通过 `-t` 参数指定或交互式选择
4. **目录冲突处理**
   - 无 `--force`：提示用户确认是否删除已存在的同名目录
   - 有 `--force`：直接删除已存在的同名目录
5. **克隆模板** — 通过 `git clone --depth=1` 浅克隆 GitHub 仓库，克隆后自动删除 `.git` 目录
6. **项目信息收集**（可通过 `-i` 跳过）— 收集项目名称、关键词、描述、作者
7. **修改 package.json** — 将用户输入的信息写入克隆下来的模板
8. **安装依赖** — 自动执行 `npm install`

### interactive.js - 交互模块

基于 `inquirer` v13 封装了四个交互函数：

| 函数 | 用途 | 返回值 |
|------|------|--------|
| `inquirerConfirm(message)` | 是/否确认 | `{ confirm: true/false }` |
| `inquirerChoose(message, choices, type)` | 列表选择（默认 `select` 类型） | `{ choose: value }` |
| `inquirerInput(message)` | 单行输入 | `{ input: value }` |
| `inquirerInputs(messages)` | 批量输入（支持 validate 验证） | `{ name: v, keyword: v, ... }` |

### constants.js - 配置常量

- **templates** — 模板列表，每项包含 `name`（模板名）、`value`（GitHub 仓库路径）、`desc`（描述）
- **messages** — 项目信息收集的提示配置，支持 `validate` 验证函数

### gitClone.js - 仓库克隆

使用 Node.js 原生 `child_process.execFile` 调用 `git clone --depth=1`，特点：

- **安全**：`execFile` 不经过 shell，从根本上杜绝命令注入
- **高效**：`--depth=1` 浅克隆，只拉取最新一次提交
- **超时保护**：默认 60 秒超时，网络异常时自动终止并提示
- **清理历史**：克隆后自动删除 `.git` 目录，项目从零开始

### utils.js - 工具函数

| 函数 | 用途 |
|------|------|
| `removeDir(dir)` | 删除指定目录，带 loading 动画 |
| `changePackageJson(name, info)` | 读取并修改克隆项目的 `package.json`（名称、关键词、描述、作者） |
| `npmInstall(dir)` | 在指定目录通过 `execFileSync` 执行 `npm install` 安装依赖 |

### logSymbols.js / isUnicodeSupported.js - 终端符号

根据终端是否支持 Unicode，选择对应的符号集（`✔` / `√`、`✖` / `×`、`★` / `*` 等），用于美化终端输出。

### build/release.sh - 发布脚本

Bash 脚本，用于版本发布，需在 Git Bash 中运行。流程：

1. 提示输入版本号并确认
2. 检查工作目录是否有未提交更改，如有则自动提交
3. 通过 `npm version` 更新版本号
4. 推送代码和 tag 到远程仓库
5. 执行 `npm publish` 发布

## 依赖说明

| 依赖 | 版本 | 用途 |
|------|------|------|
| commander | ^14.0.3 | 命令行参数解析与命令注册 |
| inquirer | ^13.3.0 | 交互式命令行问答 |
| chalk | ^5.6.2 | 终端文本着色 |
| ora | ^9.3.0 | 终端 loading 动画 |
| fs-extra | ^11.3.4 | 增强版文件系统操作 |
| table | ^6.9.0 | 终端表格渲染 |

## 安全设计

- **无 shell 执行**：所有外部命令通过 `child_process.execFile` 调用，不经过 shell 解释器
- **白名单校验**：项目名只允许安全字符 `[a-zA-Z0-9_-.]`
- **零已知漏洞**：移除了存在安全问题的 `download-git-repo`、`shelljs` 依赖
- **超时保护**：git clone 操作设有 60 秒超时

## 扩展指南

### 添加新模板

在 `constants.js` 的 `templates` 数组中新增一项：

```js
{
  name: "模板名称",
  value: "GitHub用户名/仓库名",
  desc: "模板描述"
}
```

### 添加新的项目信息收集字段

在 `constants.js` 的 `messages` 数组中新增一项：

```js
{
  message: '提示文本',
  name: '字段名',
  validate: (value) => { /* 可选验证函数 */ }
}
```

同时在 `utils.js` 的 `changePackageJson` 中添加对应的写入逻辑。
