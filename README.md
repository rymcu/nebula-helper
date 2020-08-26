# Nebula Helper
> 使用 Vue + Electron + node-serialport 实现的现代串行端口调试助手  
  A modern serial port debugging assistant implemented using Vue + Electron + node-serialport
## 项目地址
  [GitHub](https://github.com/rymcu/nebula-helper) | [Gitee](https://gitee.com/ronger-x/nebula-helper)
## 功能特性
- [x] 基础串口通信
- [x] 自动发送信息
- [x] 16 进制收发信息
- [x] 停止/恢复显示
- [x] 文件传输
- [x] 保存/加载配置信息
- [x] 刷新串口列表(手动刷新 视图->刷新串口列表)
- [ ] 版本更新(不用每次下载完整的安装包,仅 `app.asar` 文件)
## 未来计划
- [ ] 单片机程序下载(拷录程序到单片机)
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
## 鸣谢
- [Electron](https://github.com/electron/electron) :electron: Build cross-platform desktop apps with JavaScript, HTML, and CSS
- [Vue](https://github.com/vuejs/vue) 🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.
- [node-serialport](https://github.com/serialport/node-serialport) Access serial ports with JavaScript. Linux, OSX and Windows. Welcome your robotic JavaScript overlords. Better yet, program them!
- [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder) Easily Build Your Vue.js App For Desktop With Electron
"# nebula-iot-helper" 
