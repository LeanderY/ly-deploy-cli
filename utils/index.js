const fs = require('fs')
const chalk = require('chalk')

const DEPLOY_SCHEMA = {
  name: '',
  script: '',
  host: '',
  port: 22,
  username: '',
  password: '',
  webDir: ''
}

// 成功日志
function successLog(content) {
  console.log(chalk.green(content))
}

// 错误日志
function errorLog(content) {
  console.log(chalk.red(content))
}

// 信息日志
function infoLog(content) {
  console.log(chalk.blue(content))
}

// 下划线重点输出
function underlineLog(content) {
  return chalk.blue.underline.bold(`${content}`)
}

// 检查deploy配置是否合理
function checkDeployConfig(path) {
  if (fs.existsSync(path)) {
    const config = require(path) // 引入配置文件
    const { privateKey, passphrase } = config
    const keys = Object.keys(config) // [ 'privateKey', 'passphrase', 'dev', 'prod' ]
    const configs = []
    for (let key of keys) {
      if (config[key] instanceof Object) {
        if (!checkConfigScheme(key, config[key])) {
          return false
        }
        Object.assign(config[key], { command: key, privateKey, passphrase })
        configs.push(config[key])
      }
    }
    return configs
  }
  infoLog(`缺少部署相关的配置，请运行${underlineLog('deploy init')}下载部署配置`)
  return false
}

// 检查配置是否符合特定schema
function checkConfigScheme(configKey, configObj) {
  const deploySchemaKeys = Object.keys(DEPLOY_SCHEMA)
  const configKeys = Object.keys(configObj)
  const neededKeys = []
  for (let key of deploySchemaKeys) {
    if (!configKeys.includes(key)) {
      neededKeys.push(key)
    }
  }
  if (neededKeys.length > 0) {
    errorLog(`${configKey} 缺少 ${neededKeys.join(',')} 配置，请检查配置`)
    return false
  }
  for (let key of configKeys) {
    if (key === 'webDir' && configObj[key] === '/') {
      errorLog('webDir 不能是服务器根目录!')
      process.exit(1) // 退出流程
    }
    if (configObj[key] === '') {
      neededKeys.push(key)
    }
  }
  if (neededKeys.length > 0) {
    errorLog(`${configKey} 中的 ${neededKeys.join(', ')} 暂未配置，请设置该配置项`)
    return false
  }
  return true
}

module.exports = {
  successLog,
  errorLog,
  infoLog,
  underlineLog,
  checkDeployConfig
}
