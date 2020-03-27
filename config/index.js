const projectDir = process.cwd()
const deployPath = `${projectDir}/deploy` // 当前目录下的 deploy 文件夹
const deployConfigPath = `${deployPath}/deploy.config.js` // 打包之后文件夹目录
const distDir = `${projectDir}/dist`  // 待打包文件目录，当前目录下的 dist 文件夹
const distZipPath = `${projectDir}/dist.zip` // 打包之后文件夹目录
const deployConfig = `
  privateKey: '', // 本地私钥地址，位置一般在C:/Users/xxx/.ssh/id_rsa，非必填，有私钥则配置
  passphrase: '', // 本地私钥密码，非必填，有私钥则配置
  dev: {
      name: '测试环境',
      script: 'npm run build-dev', // 测试环境打包脚本
      host: '', // 开发服务器地址
      port: 22, // ssh port，一般默认22
      username: '', // 登录服务器用户名
      password: '', // 登录服务器密码
      distPath: 'dist', // 本地打包dist目录
      webDir: '/var/www/html/dev/hivue' // 测试环境服务器地址
  },
  prod: {
      name: '线上环境',
      script: 'npm run build', // 线上环境打包脚本
      host: '', // 开发服务器地址
      port: 22, // ssh port，一般默认22
      username: '', // 登录服务器用户名
      password: '', // 登录服务器密码
      distPath: 'dist', // 本地打包dist目录
      webDir: '/var/www/html/prod/hivue' // 线上环境web目录
  }
  // 再还有多余的环境按照这个格式写即可
`

module.exports = {
  deployPath,
  deployConfigPath,
  distDir,
  distZipPath,
  deployConfig
}
