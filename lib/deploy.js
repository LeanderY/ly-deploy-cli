#!/usr/bin/env node

const fs = require('fs')
const childProcess = require('child_process')
const node_ssh = require('node-ssh') // ssh连接服务器，执行服务器脚本，上传文件
const zipFile = require('compressing') // 压缩dist
const { successLog, underlineLog, errorLog } = require('../utils/index')
const { distDir, distZipPath } = require('../config/index')

const ssh = new node_ssh() // 生成ssh实例

let deployDir = null

// 部署流程入口
async function deploy(config) {
  const { script, webDir, name } = config
  deployDir = webDir
  await execBuild(script)
  await zipDist()
  await connectSSH(config)
  await clearOldFile()
  await uploadZip()
  await unzipFile()
  await deleteLocalZip()
  successLog(`恭喜您，项目${underlineLog(name)}部署成功了^_^\n`)
  process.exit(0)
}

// 第一步，执行打包脚本
const execBuild = async script => {
  try {
    console.log(`${script}`)
    childProcess.execSync(script, { cwd: process.cwd() })
    successLog('项目打包成功!')
  } catch (error) {
    errorLog('项目打包失败, 请重试!')
    process.exit(1) // 退出流程
  }
}

// 第二步，压缩代码
const zipDist = async () => {
  try {
    console.log('开始压缩代码')
    await zipFile.zip.compressDir(distDir, distZipPath)
    successLog('压缩成功')
  } catch (error) {
    errorLog(error)
    errorLog('压缩失败, 退出程序!')
    process.exit(1) // 退出流程
  }
}

// 第三步，连接SSH
async function connectSSH(config) {
  const { host, port, username, password, privateKey, passphrase } = config
  const sshConfig = {
    host,
    port,
    username,
    password,
    privateKey,
    passphrase
  }
  try {
    console.log(`连接${underlineLog(host)}...`)
    await ssh.connect(sshConfig)
    successLog('SSH连接成功')
  } catch (error) {
    errorLog(`连接失败 ${error}`)
    process.exit(1)
  }
}

// 第四步，清空远端目录
async function clearOldFile() {
  try {
    console.log('清空远端目录')
    await runCommand(`rm -rf *`)
    successLog('远端目录清空成功')
  } catch (error) {
    errorLog(`远端目录清空失败 ${error}`)
    process.exit(1)
  }
}

// 运行命令
const runCommand = async command => {
  await ssh.execCommand(command, { cwd: deployDir }) // cwd 指向当前进程运行目录
}

// 第五步，上传zip文件到服务器
async function uploadZip() {
  try {
    console.log(`上传文件到${underlineLog(deployDir)}`)
    await ssh.putFiles([
      { local: distZipPath, remote: `${deployDir}/dist.zip` } // local 本地  remote 服务器
    ])
    successLog('文件上传成功')
  } catch (error) {
    errorLog(`文件传输异常 ${error}`)
    process.exit(1)
  }
}

// 第六步，解压缩并删除zip文件
async function unzipFile() {
  try {
    await runCommand('unzip ./dist.zip && rm -rf ./dist.zip') // 解压线上压缩包，解压完删除压缩包
    await runCommand(`mv -f ${deployDir}/dist/*  ${deployDir}`) // 将目标目录的dist里面文件移出到目标文件
    await runCommand(`rm -rf ./dist`) // 移出后删除 dist 文件夹
    ssh.dispose() // 断开连接
  } catch (error) {
    errorLog(`操作失败 ${error}`)
    process.exit(1) // 退出流程
  }
}

// 第七步，删除本地dist.zip包
async function deleteLocalZip() {
  return new Promise((resolve, reject) => {
    console.log('开始删除本地zip包')
    fs.unlink(distZipPath, err => {
      if (err) {
        errorLog(`本地zip包删除失败 ${err}`, err)
        reject(err)
        process.exit(1)
      }
      successLog('本地dist.zip删除成功')
      resolve()
    })
  })
}

module.exports = deploy
