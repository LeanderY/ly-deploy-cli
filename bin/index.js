#!/usr/bin/env node

'use strict'
const fs = require('fs')
const program = require('commander')
const inquirer = require('inquirer') // 用户与命令行交互的工具
const { deployConfigPath } = require('../config/index')
const { checkDeployConfig, underlineLog } = require('../utils/index')

const versionOptions = ['-V', '--version']
const packageJson = require('../package.json')
const version = packageJson.version // 版本信息

program
  .version(version)
  .command('init')
  .description('初始化部署相关配置')
  .action(() => {
    const init = require('../lib/init')
    init()
  })

const agrs = process.argv.slice(2) // 获取配置参数 例：执行 deploy init agrs 参数为 [ 'init' ]

const firstArg = agrs[0]

// 无参数时默认输出help信息
if (!firstArg) {
  program.outputHelp()
}

// 非version选项且有配置文件时，进入部署流程
if (!versionOptions.includes(firstArg) && fs.existsSync(deployConfigPath)) {
  deploy()
}

// 部署流程
function deploy() {
  // 检测部署配置是否合理
  const deployConfigs = checkDeployConfig(deployConfigPath) // [{name: '' ,..., command: 'prod', privateKey: '', passphrase: ''},{}]
  if (!deployConfigs) {
    process.exit(1)
  }

  // 注册部署命令
  deployConfigs.forEach(config => {
    const { command, name } = config // command: dev name: 测试环境
    program
      .command(`${command}`)
      .description(`项目${underlineLog(name)}部署`)
      .action(() => {
        inquirer
          .prompt([
            {
              type: 'confirm',
              message: `项目是否部署到${underlineLog(name)}？`,
              name: 'sure'
            }
          ])
          .then(answers => {
            const { sure } = answers
            if (!sure) {
              process.exit(1)
            }
            if (sure) {
              const deploy = require('../lib/deploy')
              deploy(config)
            }
          })
      })
  })
}

// 解析参数
program.parse(process.argv)
