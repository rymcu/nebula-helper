# Nebula Helper
> 一款现代化的串口调试助手
## 功能特性
- [x] 基础串口通信
- [ ] 文件传输
- [ ] 自动发送信息
- [ ] 16 进制收发信息
## 开发指南
> 本项目使用 Electron + Vue + Node-serialport 实现，以下步骤是 windows 操作系统环境配置步骤，1-5 步为安装 node-gyp ,其他操作系统请参考[官方教程](https://github.com/nodejs/node-gyp)
1. 安装 LTS 版 NodeJS
2. 安装 Python 2.7
3. 安装 Visitor Studio 2017 及更高版本(我使用的是 2019)
4. 执行 `npm install node-gyp -g`
5. 执行 `node-gyp list` 查看依赖是否全部安装
6. 执行 `git clone https://github.com/rymcu/nebula-helper.git`
7. 执行 `npm install`
8. 执行 `npm run electron:serve`  
## 项目截图
![nebula-helper](https://github.com/rymcu/nebula-helper/blob/master/src/assets/nebula-helper.png?raw=true)
