<template>
    <el-container>
        <el-aside style="padding-right: 20px;">
            <el-form :label-position="labelPosition" label-width="80px">
                <el-form-item label="端口">
                    <el-select v-model="com" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="port in ports" :label="port.label" :value="port.value"
                                   :key="port.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="波特率">
                    <el-select v-model="options.baudRate" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="baudRate in baudRateList" :label="baudRate.label" :value="baudRate.value"
                                   :key="baudRate.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="校验位">
                    <el-select v-model="options.parity" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="parity in parityList" :label="parity.label" :value="parity.value"
                                   :key="parity.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据位">
                    <el-select v-model="options.dataBits" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="dataBit in dataBitList" :label="dataBit.label" :value="dataBit.value"
                                   :key="dataBit.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="停止位">
                    <el-select v-model="options.stopBits" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="stopBit in stopBitList" :label="stopBit.label" :value="stopBit.value"
                                   :key="stopBit.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="state == 0">
                    <el-col :span="10">
                        <el-button :size="buttonSize" type="info" circle icon="el-icon-switch-button"></el-button>
                    </el-col>
                    <el-col :span="10">
                        <el-button :size="buttonSize" @click="openCom">打开串口</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item v-else>
                    <el-col :span="10">
                        <el-button :size="buttonSize" type="success" circle icon="el-icon-switch-button"></el-button>
                    </el-col>
                    <el-col :span="10">
                        <el-button :size="buttonSize" @click="closeCom">关闭串口</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-form>
                <el-form-item>
                    <el-col :span="8">
                        <el-button :size="buttonSize" @click="resetPullData">清空接收区</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button :size="buttonSize" v-if="isShowPullDate" @click="updateShowPullDate">停止显示</el-button>
                        <el-button :size="buttonSize" v-else @click="updateShowPullDate">恢复显示</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button :size="buttonSize" @click="writeFile">保存接收数据</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="12">
                        <el-checkbox v-model="autoClean">自动清空</el-checkbox>
                    </el-col>
                    <el-col :span="12">
                        <el-checkbox v-model="hexDisplay">十六进制显示</el-checkbox>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-form style="align-items: center;">
                <el-form-item>
                    <span style="margin-right: 1rem;"><span style="color: red;">{{stateText}}</span></span>
                </el-form-item>
            </el-form>
        </el-aside>
        <el-main style="padding: 0 20px 0 0;">
            <el-form v-model="com">
                <el-form-item>
                    <el-input id="pullDta" type="textarea" resize="none" placeholder="显示区" v-model="pullData" :rows="10" readonly></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="textarea" resize="none" placeholder="输入区" v-model="pushData" :rows="4" @input="hexRegExp"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-col :span="24" style="margin-top: 1rem;">
                        <el-input type="number" v-model="autoSendRate">
                            <template slot="prepend">自动发送周期</template>
                            <template slot="append">毫秒</template>
                        </el-input>
                    </el-col>
                    <el-col :span="12">
                        <el-checkbox v-model="autoSend" @change="autoSendData" style="margin-top: 1rem;">自动发送</el-checkbox>
                        <el-checkbox v-model="hexSend" style="margin-top: 1rem;">十六进制发送</el-checkbox>
                    </el-col>
                    <el-col :span="6" style="padding-top: 1rem;">
                        <span :size="buttonSize" type="text" style="margin-right: 1rem;">
                            Tx: {{pushBit}}
                        </span>
                    </el-col>
                    <el-col :span="6" style="padding-top: 1rem;">
                        <span :size="buttonSize" type="text" style="margin-right: 1rem;">
                            Rx: {{pullBit}}
                        </span>
                    </el-col>
                </el-form-item>
                <el-form-item style="text-align: right;">
                    <el-button :size="buttonSize" @click="readFile">读取文件</el-button>
                    <el-button :size="buttonSize" @click="resetPushData">清空重填</el-button>
                    <el-button :size="buttonSize" @click="resetCountBit">计数清零</el-button>
                    <el-button :size="buttonSize" @click="portWrite">手动发送</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: 'Main',
        watch: {
            autoSendRate(val) {
                let _ts = this;
                if (val > 0) {
                    _ts.autoSendData(_ts.autoSend);
                }
            }
        },
        data() {
            return {
                buttonSize: 'small',
                timer: null,    // 定时器
                port: null, // 串口实体
                isOpen: false,  // 串口打开状态
                isShowPullDate: true,   // 是否显示
                labelPosition: 'right', // 对齐方式
                state: 0,   // 串口状态 0: 未打开, 1: 打开
                com: '',    // 串口路径 COM1
                pullData: '',   // 接收到的数据
                pushData: '',   // 发送的数据
                stateText: '准备就绪',  // 状态提示
                pushBit: 0, // 发送字节数
                pullBit: 0, // 接收字节数
                autoSendRate: 1000, // 自动发送频率 ms
                autoClean: false,   // 自动清空
                hexDisplay: false,  // 16 进制显示
                autoSend: false,    // 自动发送状态
                hexSend: false, // 16 进制发送
                sendState: false, // 16 进制发送
                options: {  // 串口配置信息
                    baudRate: 9600,
                    parity: 'none',
                    dataBits: 8,
                    stopBits: 1,
                    autoOpen: false
                },
                ports: [],  // 本机串口列表
                baudRateList: [
                    {
                        label: '300',
                        value: 300
                    },
                    {
                        label: '600',
                        value: 600
                    },
                    {
                        label: '1200',
                        value: 1200
                    },
                    {
                        label: '2400',
                        value: 2400
                    },
                    {
                        label: '4800',
                        value: 4800
                    },
                    {
                        label: '9600',
                        value: 9600
                    },
                    {
                        label: '19200',
                        value: 19200
                    },
                    {
                        label: '38400',
                        value: 38400
                    },
                    {
                        label: '43000',
                        value: 43000
                    },
                    {
                        label: '56000',
                        value: 56000
                    },
                    {
                        label: '57600',
                        value: 57600
                    },
                    {
                        label: '115200',
                        value: 115200
                    },
                    {
                        label: '128000',
                        value: 128000
                    },
                    {
                        label: '230400',
                        value: 230400
                    },
                    {
                        label: '256000',
                        value: 256000
                    },
                    {
                        label: '460800',
                        value: 460800
                    }
                ],
                parityList: [
                    {
                        label: 'None',
                        value: 'none'
                    },
                    {
                        label: 'Odd',
                        value: 'odd'
                    },
                    {
                        label: 'Even',
                        value: 'even'
                    },
                    {
                        label: 'Mark',
                        value: 'mark'
                    },
                    {
                        label: 'Space',
                        value: 'space'
                    }
                ],
                dataBitList: [
                    {
                        label: '5',
                        value: 5
                    },
                    {
                        label: '6',
                        value: 6
                    },
                    {
                        label: '7',
                        value: 7
                    },
                    {
                        label: '8',
                        value: 8
                    }
                ],
                stopBitList: [
                    {
                        label: '1',
                        value: 1
                    },
                    {
                        label: '1.5',
                        value: 1.5
                    },
                    {
                        label: '2',
                        value: 2
                    }
                ]
            }
        },
        methods: {
            openCom() {
                let _ts = this
                let port = _ts.port;
                if (port) {
                    _ts.closeCom();
                }
                port = new Vue.SerialPort(_ts.com, _ts.options);

                port.open(function (err) {
                    if (err) {
                        _ts.$set(_ts, 'stateText', err);
                        new Notification('Nebula Helper', {
                            body: err
                        })
                        return console.log('Error opening port: ', err)
                    }
                    // Because there's no callback to write, write errors will be emitted on the port:
                    _ts.$set(_ts, 'state', 1);
                    _ts.$set(_ts, 'stateText', '串口已开启');
                    _ts.$set(_ts, 'isOpen', true);
                    _ts.$set(_ts, 'port', port);
                })

                // The open event is always emitted
                port.on('open', function () {
                    // open logic
                    console.log('打开中...');
                    console.log('串口打开状态', port.isOpen);
                })

                port.on('error', (error) => {
                    //捕获错误
                    new Notification('Nebula Helper', {
                        body: error
                    })
                    _ts.$set(_ts, 'stateText', error);
                    console.log('Error: ', error);
                })
                // 串口设备传来的数据 是buffer对象，用toString转一下码
                port.on('data', function (data) {
                    // 判断是否显示接收的数据
                    if (_ts.isShowPullDate) {
                        let pullData;
                        if (_ts.hexDisplay) {
                            pullData = _ts.handlerHexDisplay(data.toString('hex').toLocaleUpperCase());
                        } else {
                            if (_ts.isGBK(data)) {
                                let encoding = 'GB2312';
                                pullData = window.iconv.decode(data, encoding);
                            } else {
                                pullData = data.toString();
                            }
                        }

                        _ts.$set(_ts, 'pullData', _ts.pullData + pullData);
                        // 接收字节数
                        _ts.$set(_ts, 'pullBit', _ts.pullBit + pullData.length);
                        setTimeout(function () {
                            let pullDataElement = document.getElementById('pullDta');
                            pullDataElement.scrollTop = pullDataElement.scrollHeight;
                        }, 400);
                    }
                })
            },
            closeCom() {
                let _ts = this
                let port = _ts.port;
                if (port) {
                    try {
                        if (port.isOpen) {
                            port.close();
                        } else {
                            _ts.genPorts();
                        }
                        _ts.$set(_ts, 'state', 0);
                        _ts.$set(_ts, 'isOpen', false);
                        _ts.$set(_ts, 'stateText', '串口已关闭');
                        console.log('关闭中...');
                        console.log('串口打开状态', port.isOpen);
                    } catch (e) {
                        _ts.$set(_ts, 'stateText', e);
                        console.log(e);
                    }
                }
            },
            portWrite() {
                let _ts = this
                let port = _ts.port;
                if (port && port.isOpen && _ts.pushData) {
                    let encoding = 'utf-8';
                    let pushData;
                    if (_ts.hexSend) {
                        if (!_ts.sendState) {
                            return;
                        }
                        encoding = 'hex';
                        pushData = _ts.handlerHex(_ts.pushData);
                    } else {
                        pushData = window.iconv.encode(_ts.pushData, 'GB2312');
                    }
                    port.write(pushData, encoding, function (err, result) {
                        if (err) {
                            console.log('Error while sending message : ' + err);
                        }
                        if (result) {
                            console.log('Response received after sending message : ' + result);
                        }
                        // 接收字节数
                        _ts.$set(_ts, 'pushBit', _ts.pushBit + _ts.pushData.length);
                        console.log('message written');
                    })
                    port.drain(error => {
                        if (error) {
                            console.log(error)
                        }
                    })
                }
            },
            genPorts() {
                let _ts = this;
                Vue.SerialPort.list().then(
                    ports => {
                        let portList = new Array();
                        for (let i in ports) {
                            let port = {
                                label: ports[i].path,
                                value: ports[i].path
                            }
                            portList.push(port)
                        }
                        if (portList.length > 0) {
                            portList.sort(function (port1, port2) {
                                let s1 = _ts.strToBinary(port1.value, 10);
                                let s2 = _ts.strToBinary(port2.value, 10);
                                return s1 - s2
                            });
                            _ts.$set(_ts, 'stateText', '初始化成功');
                            if (!_ts.com) {
                                _ts.$set(_ts, 'com', portList[0].value);
                            }
                        } else {
                            _ts.$set(_ts, 'stateText', '未获取到串口信息');
                            _ts.$set(_ts, 'com', '');
                        }
                        _ts.$set(_ts, 'ports', portList)
                    },
                    err => console.error(err)
                )
            },
            genRenderer() {
                let _ts = this;
                let ipcRenderer = window.electron.ipcRenderer;
                ipcRenderer.on('saveOptions', (event) => {
                    if (event) {
                        _ts.saveOptions();
                    }
                });
                ipcRenderer.on('loadOptions', (event) => {
                    if (event) {
                        _ts.loadOptions();
                    }
                });
                ipcRenderer.on('reloadPorts', (event) => {
                    if (event) {
                        _ts.genPorts();
                    }
                });
                ipcRenderer.on('writeFile', (event) => {
                    if (event) {
                        _ts.writeFile();
                    }
                });
                ipcRenderer.on('readFile', (event) => {
                    if (event) {
                        _ts.readFile();
                    }
                });
                let remote = window.electron.remote;
                const SerialPort = remote.getGlobal('SerialPort');
                window.iconv = remote.getGlobal('iconv');
                window.fs = remote.getGlobal('fs');
                console.log = remote.getGlobal('log');
                Vue.SerialPort = Vue.prototype.$SerialPort = SerialPort;
                _ts.genPorts();
            },
            resetPushData() {
                this.$set(this, 'pushData', '');
            },
            resetPullData() {
                this.$set(this, 'pullData', '');
            },
            updateShowPullDate() {
                this.$set(this, 'isShowPullDate', !this.isShowPullDate)
            },
            autoSendData(val) {
                let _ts = this;
                if (_ts.timer) {
                    window.clearInterval(_ts.timer);
                }
                if (val) {
                    _ts.timer = setInterval(function () {
                        _ts.portWrite();
                    }, _ts.autoSendRate);
                }
            },
            strToBinary(str, binary) {
                let result = [];
                let list = str.split("");
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    let data = item.charCodeAt(0).toString(binary);
                    result.push(data);
                }
                return result.join("");
            },
            resetCountBit() {
                this.$set(this, 'pushBit', 0);
                this.$set(this, 'pullBit', 0);
            },
            isGBK(data) {
                if (data[0] == 0xff && data[1] == 0xfe) {
                    console.log('unicode');
                    return false;
                } else if (data[0] == 0xfe && data[1] == 0xff) {
                    console.log('unicode');
                    return false;
                } else if (data[0] == 0xef && data[1] == 0xbb) {
                    console.log('utf8');
                    return false;
                } else {
                    return true;
                }
            },
            readFile() {
                let _ts = this;
                let filters = [
                    {name: 'txt', extensions: ['txt']}
                ]
                _ts.read('读取文件', 'loadPushData', filters)
            },
            writeFile() {
                let _ts = this;
                let filters = [
                    {name: 'txt', extensions: ['txt']}
                ];
                _ts.write('保存接收数据', _ts.pullData, filters);
            },
            saveOptions() {
                let _ts = this;
                let filters = [{
                    name: 'json', extensions: ['json']
                }];
                let option = {
                    port: _ts.com,
                    options: _ts.options
                }
                _ts.write('保存配置信息', JSON.stringify(option), filters);
            },
            loadOptions() {
                let _ts = this;
                let filters = [{
                    name: 'json', extensions: ['json']
                }];
                _ts.read('加载配置信息', 'loadOptions', filters);
            },
            read(title, method, filters) {
                let _ts = this;
                const {dialog} = window.electron.remote;
                const win = window.electron.remote.getCurrentWindow();
                dialog.showOpenDialog(win, {
                    title: title,
                    multiSelections: false,
                    filters: filters
                }).then(result => {
                    if (result.canceled) {
                        return;
                    }
                    // 创建可读流
                    let readStream = window.fs.createReadStream(result.filePaths[0], {
                        flags: 'r',       // 设置文件只读模式打开文件
                        encoding: 'utf8'  // 设置读取文件的内容的编码
                    });

                    // 打开文件流的事件。
                    readStream.on('open', fd => {
                        console.log('文件可读流已打开，句柄：%s', fd);
                    });

                    // 可读流打开后，会源源不断的触发此事件方法，回调函数参数就是读取的数据。
                    readStream.on('data', data => {
                        if (method === 'loadOptions') {
                            if (data) {
                                let option = JSON.parse(data.toString());
                                _ts.$set(_ts, 'com', option.port);
                                _ts.$set(_ts, 'options', option.options);
                            }
                        } else {
                            _ts.$set(_ts, 'pushData', data.toString());
                        }
                    });

                    readStream.on('close', () => {
                        console.log('文件可读流结束！');
                    });
                }).catch(err => {
                    console.log(err)
                })
            },
            write(title, data, filters) {
                const {dialog} = window.electron.remote;
                const win = window.electron.remote.getCurrentWindow();
                dialog.showSaveDialog(win, {
                    title: title,
                    filters: filters
                }).then(result => {
                    if (result.canceled) {
                        return;
                    }
                    // 创建一个可以写入的流，写入到文件 output.txt 中
                    const writerStream = window.fs.createWriteStream(result.filePath);
                    // 使用 utf8 编码写入数据
                    writerStream.write(data);
                    // 标记文件末尾
                    writerStream.end();
                    // 处理流事件 --> data, end, and error
                    writerStream.on('finish', function () {
                        console.log("写入完成。");
                    });
                    writerStream.on('error', function (err) {
                        console.log(err.stack);
                    });
                }).catch(err => {
                    console.log(err)
                })
            },
            handlerHex(data) {
                let _ts = this;
                let dataStr = '';
                if (data.trim().indexOf(' ') > -1) {
                    let hexArr = data.trim().split(' ');
                    for(let i in hexArr) {
                        if (hexArr[i].length == 1) {
                            dataStr += '0';
                        }
                        dataStr += hexArr[i];
                    }
                } else {
                    dataStr = _ts.handlerHexDisplay(data.trim());
                }
                return dataStr.replace(/\s+/g,'');
            },
            handlerHexDisplay(data) {
                let dataStr = '';
                let isOdd = true;
                if (data.length % 2 == 0) {
                    isOdd = false;
                }
                for (let i = 0, len = data.length; i < len; i++) {
                    // 自动补零
                    if (isOdd && len - i == 1) {
                        dataStr += '0';
                    }
                    // 字符拼接
                    dataStr += data.charAt(i);
                    // 每两个字符加一个空格
                    if (i % 2 > 0 || len - i == 1) {
                        dataStr += ' ';
                    }
                }
                return dataStr;
            },
            hexRegExp(value) {
                if (!this.hexSend) {
                    return;
                }
                let _ts = this;
                let reg = /^[0-9a-fA-F]*$/
                if (value.indexOf(' ') > -1) {
                    const hexArr = value.split(' ');
                    for (let i in hexArr) {
                        if (hexArr[i].length > 2) {
                            _ts.$set(_ts, 'sendState', false);
                            _ts.$set(_ts, 'stateText', '非法 16 进制值');
                            return;
                        } else {
                            if (!reg.test(hexArr[i])) {
                                _ts.$set(_ts, 'sendState', false);
                                _ts.$set(_ts, 'pushData', value.substring(0, value.length - 1));
                                _ts.$set(_ts, 'stateText', '非法 16 进制值');
                                return;
                            }
                        }
                    }
                } else {
                    if (!reg.test(value)) {
                        _ts.$set(_ts, 'sendState', false);
                        _ts.$set(_ts, 'pushData', value.substring(0, value.length - 1));
                        _ts.$set(_ts, 'stateText', '非法 16 进制值');
                        return;
                    }
                }

                _ts.$set(_ts, 'pushData', value.toLocaleUpperCase());
                _ts.$set(_ts, 'stateText', '');
                _ts.$set(_ts, 'sendState', true);
            }
        },
        mounted() {
            this.genRenderer();
        }
    }
</script>

<style scoped>
</style>
