<template>
    <el-container>
        <el-aside style="padding-right: 20px;">
            <el-form v-model="options" :label-position="labelPosition" label-width="80px">
                <el-form-item label="端口">
                    <el-select v-model="options.com" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="com in comList" :label="com.label" :value="com.value" :key="com.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="波特率">
                    <el-select v-model="options.baudRate" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="baudRate in baudRateList" :label="baudRate.label" :value="baudRate.value" :key="baudRate.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="校验位">
                    <el-select v-model="options.parity" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="parity in parityList" :label="parity.label" :value="parity.value" :key="parity.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据位">
                    <el-select v-model="options.dataBit" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="dataBit in dataBitList" :label="dataBit.label" :value="dataBit.value" :key="dataBit.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="停止位">
                    <el-select v-model="options.stopBit" :disabled="isOpen" placeholder="请选择">
                        <el-option v-for="stopBit in stopBitList" :label="stopBit.label" :value="stopBit.value" :key="stopBit.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="com.state == 0">
                    <el-col :span="10">
                        <el-button type="info" circle icon="el-icon-switch-button"></el-button>
                    </el-col>
                    <el-col :span="10">
                        <el-button @click="openCom">打开串口</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item v-else>
                    <el-col :span="10">
                        <el-button type="success" circle icon="el-icon-switch-button"></el-button>
                    </el-col>
                    <el-col :span="10">
                        <el-button @click="closeCom">关闭串口</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-form>
                <el-form-item>
                    <el-col :span="12">
                        <el-button>清空接收区</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button>停止显示</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="12">
                        <el-checkbox v-model="autoClean">自动清空</el-checkbox>
                        <el-checkbox v-model="hexDisplay">十六进制显示</el-checkbox>
                    </el-col>
                    <el-col :span="12">
                        <el-button>接收转向文件</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-form>
                <el-form-item>
                    <el-input v-model="autoSendRate">
                        <template slot="prepend">自动发送周期</template>
                        <template slot="append">毫秒</template>
                    </el-input>
                    <el-checkbox v-model="autoSend">自动发送</el-checkbox>
                    <el-checkbox v-model="hexSend">十六进制发送</el-checkbox>
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :on-change="handleBeforeUpload"
                            :limit="1"
                            accept="txt"
                            :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-aside>
        <el-main style="padding: 0 20px 0 0;">
            <el-form v-model="com">
                <el-form-item>
                    <el-input type="textarea" v-model="com.pullData" :rows="16" readonly></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="textarea" v-model="com.pushData" :rows="9"></el-input>
                </el-form-item>
                <el-form-item style="text-align: right;">
                    <el-button @click="resetPushData">清空重填</el-button>
                    <el-button @click="portWrite">手动发送</el-button>
                    <el-button>计数清零</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" style="margin-right: 5rem;"><span style="color: red;">{{stateText}}</span></el-button>
                    <el-button type="text" style="margin-right: 5rem;"><span style="color: black;">发送字节数:</span> {{pushBit}}</el-button>
                    <el-button type="text" style="margin-right: 5rem;"><span style="color: black;">接收字节数:</span> {{pullBit}}</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
import Vue from 'vue'
export default {
    name: 'Main',
    data() {
        return {
            port: null,
            isOpen: false,
            labelPosition: 'right',
            com: {
                state: 0,
                pullData: '',
                pushData: ''
            },
            fileList: [],
            stateText: '准备就绪',
            pushBit: 0,
            pullBit: 0,
            autoSendRate: 1000,
            autoClean: false,
            hexDisplay: false,
            autoSend: false,
            hexSend: false,
            options: {
                com: '',
                baudRate: 9600,
                parity: 'none',
                dataBit: 8,
                stopBit: 1
            },
            comList: [
            ],
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
                try {
                    port.close();
                } catch (e) {
                    _ts.$set(_ts, 'stateText', e);
                    console.log(e);
                }
            }
            let options = _ts.options;
            port = new Vue.SerialPort(options.com, {
                baudRate: options.baudRate,
                parity: options.parity,
                dataBits: options.dataBit,
                stopBits: options.stopBit,
                autoOpen: false
            })

            port.open(function (err) {
                if (err) {
                    _ts.$set(_ts, 'stateText', err);
                    new Notification('Nebula Helper', {
                        body: err
                    })
                    return console.log('Error opening port: ', err)
                }
                // Because there's no callback to write, write errors will be emitted on the port:
                let com = _ts.com;
                com.state = 1;
                _ts.$set(_ts, 'com', com);
                _ts.$set(_ts, 'stateText', '串口已开启');
                _ts.$set(_ts, 'isOpen', true);
                _ts.$set(_ts, 'port', port);
            })

            // The open event is always emitted
            port.on('open', function() {
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
            port.on('readable', function () {
                console.log('Data:', port.read())
            })
            //串口设备传来的数据 是buffer对象，用toString转一下码
            port.on('data', function (data) {
                let com = _ts.com;
                com.pullData = com.pullData + ' ' + data.toString()
                _ts.$set(_ts, 'com', com);
                console.log(data, data.toString());
            })
        },
        closeCom() {
            let _ts = this
            let port = _ts.port;
            if (port) {
                try {
                    port.close();
                    let com = _ts.com;
                    com.state = 0;
                    _ts.$set(_ts, 'com', com);
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
            if (port && port.isOpen) {
                port.write(_ts.com.pushData)
            }
        },
        handleExceed(files) {
            let fileList = [{
                name: files[0].name,
                size: files[0].size,
                raw: files[0]
            }];
            this.$set(this, 'fileList', fileList);
        },
        handleBeforeUpload(file, fileList) {
            this.$set(this, 'fileList', fileList);
        },
        genPorts () {
            let _ts = this;
            let remote = window.electron.remote;
            const SerialPort = remote.getGlobal('SerialPort');
            Vue.SerialPort = Vue.prototype.$SerialPort = SerialPort;
            SerialPort.list().then(
                ports => {
                    let comList = new Array();
                    for (let i in ports) {
                        let port = {
                            label: ports[i].path,
                            value: ports[i].path
                        }
                        comList.push(port)
                    }
                    if (comList) {
                        _ts.$set(_ts, 'stateText', '初始化成功')
                    } else {
                        _ts.$set(_ts, 'stateText', '初始化失败')
                    }
                    comList.sort(function (e1, e2) {
                        let s1 = Number(e1.value.replace('COM', ''));
                        let s2 = Number(e2.value.replace('COM', ''));
                        return s1 -s2
                    });
                    if (comList) {
                        let options = _ts.options
                        options.com = comList[0].value
                        _ts.$set(_ts, 'options', options)
                    }
                    _ts.$set(_ts, 'comList', comList)
                },
                err => console.error(err)
            )
        },
        resetPushData() {
            window.electron.remote.getCurrentWindow().minimize();
        }
    },
    mounted() {
        let _ts =  this
        if(window.WebSocket){
            let ws = new WebSocket('ws://127.0.0.1:27611');

            ws.onopen = function(e){
                console.log("连接服务器成功", e);
                ws.send("HeartBeat");
            }

            ws.onclose = function(e){
                console.log("服务器关闭", e);
            }

            ws.onerror = function(){
                console.log("连接出错");
            }

            ws.onmessage = function(e){
                console.log(e.data);
                if (e.data === "HeartBeat") {
                    console.log('客户端接收能力正常');
                    _ts.genPorts()
                }
            }
        }
    }
}
</script>

<style scoped>
    .upload-demo {
        text-align: right;
    }
</style>
