# ly-deploy-cli

前端轻量化部署脚手架，支持测试、线上等多环境部署，支持环境配置扩展，配置好后仅需一条命令即可完成整个部署流程。

## git 地址：

https://github.com/LeanderY/ly-deploy-cli

## 适用对象

目前还在采用手工部署又期望快速实现轻量化部署的小团队或者个人项目。

## 使用指南

https://github.com/LeanderY/ly-deploy-cli/blob/master/README.md

## 前提条件

能通过 ssh 连上服务器即可

## 全局安装

```
npm i ly-deploy-cli -g
```

## 使用

### 1. 查看版本

```js
deploy - V
```

### 2. 初始化部署模板

```js
deploy init
```

### 3. 配置部署环境

部署配置文件位于 deploy 文件夹下的 `deploy.config.js`,
一般包含 `dev` （测试环境）和 `prod`（线上环境）两个配置，再有多余的环境配置形式与之类似，只有一个环境的可以删除另一个多余的配置（比如只有 `prod` 线上环境，请删除 `dev` 测试环境配置）。

具体配置信息请参考配置文件注释：

```js
module.exports = {
    privateKey: '', // 本地私钥地址，位置一般在C:/Users/xxx/.ssh/id_rsa，非必填，有私钥则配置
    passphrase: '', // 本地私钥密码，非必填，有私钥则配置
    dev: {
        // 测试环境
        name: '测试环境',
        script: 'npm run build-dev', // 测试环境打包脚本
        host: '...', // 开发服务器地址
        port: 22, // ssh port，一般默认22
        username: '...', // 登录服务器用户名
        password: '...', // 登录服务器密码
        distPath: 'dist', // 本地打包dist目录
        webDir: '/var/www/html/dev/hivue' // 测试环境服务器地址
    },
    prod: {
        // 线上环境
        name: '线上环境',
        script: 'npm run build', // 线上环境打包脚本
        host: '...', // 开发服务器地址
        port: 22, // ssh port，一般默认22
        username: '...', // 登录服务器用户名
        password: '...', // 登录服务器密码
        distPath: 'dist', // 本地打包dist目录
        webDir: '/var/www/html/prod/hivue' // 线上环境web目录
    }
    // 再还有多余的环境按照这个格式写即可
}
```

### 4. 查看部署命令

配置好 `deploy.config.js`，运行

```js
deploy --help
```

### 5. 测试环境部署

测试环境部署采用的时 `dev` 的配置

```js
deploy dev
```

### 6. 线上环境部署

线上环境部署采用的时 `prod` 的配置

```js
deploy prod
```
