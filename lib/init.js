#!/usr/bin/env node

const fs = require('fs')
const { successLog, infoLog, errorLog } = require('../utils/index')
const { deployPath, deployConfigPath, deployConfig } = require('../config/index')

// 检查部署目录及部署配置文件是否存在
const checkDeployExists = () => {
  if (fs.existsSync(deployPath) && fs.existsSync(deployConfigPath)) {
    infoLog('deploy 目录下的 deploy.config.js 配置文件已经存在，请勿重新下载')
    process.exit(1)
  }
  generateConfigFile()
}

// 本地生成部署脚本配置
function generateConfigFile() {
  fs.mkdirSync(deployPath)
  fs.writeFile(deployConfigPath, `module.exports = {${deployConfig}}`, function(err) {
    if(err) {
      errorLog(err)
      process.exit(1)
    }
    successLog('模板下载成功，模板位置：deploy/deploy.config.js')
    infoLog('请配置deploy目录下的deploy.config.js配置文件')
    process.exit(0)
  })
}

module.exports = checkDeployExists
