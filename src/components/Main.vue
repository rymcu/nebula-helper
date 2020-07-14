<template>
    <el-container>
        <el-aside style="padding-right: 20px;">
            <el-form v-model="options" :label-position="labelPosition" label-width="80px">
                <el-form-item label="端口">
                    <el-select v-model="options.com" placeholder="请选择">
                        <el-option v-for="com in comList" :label="com.label" :value="com.value" :key="com.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="波特率">
                    <el-select v-model="options.baudRate" placeholder="请选择">
                        <el-option v-for="baudRate in baudRateList" :label="baudRate.label" :value="baudRate.value" :key="baudRate.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="校验位">
                    <el-select v-model="options.parityBit" placeholder="请选择">
                        <el-option v-for="parityBit in parityBitList" :label="parityBit.label" :value="parityBit.value" :key="parityBit.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据位">
                    <el-select v-model="options.dataBit" placeholder="请选择">
                        <el-option v-for="dataBit in dataBitList" :label="dataBit.label" :value="dataBit.value" :key="dataBit.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="停止位">
                    <el-select v-model="options.stopBit" placeholder="请选择">
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
                    <el-button>清空重填</el-button>
                    <el-button>手动发送</el-button>
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
export default {
    name: 'Main',
    data() {
        return {
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
                com: 'COM1',
                baudRate: 115200,
                parityBit: 'None',
                dataBit: 8,
                stopBit: 1
            },
            comList: [
                {
                    label: 'COM1',
                    value: 'COM1'
                },
                {
                    label: 'COM2',
                    value: 'COM2'
                },
                {
                    label: 'COM3',
                    value: 'COM3'
                },
                {
                    label: 'COM4',
                    value: 'COM4'
                },
                {
                    label: 'COM5',
                    value: 'COM5'
                },
                {
                    label: 'COM6',
                    value: 'COM6'
                },
                {
                    label: 'COM7',
                    value: 'COM7'
                },
                {
                    label: 'COM8',
                    value: 'COM8'
                }
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
            parityBitList: [
                {
                    label: 'None',
                    value: 'None'
                },
                {
                    label: 'Odd',
                    value: 'Odd'
                },
                {
                    label: 'Even',
                    value: 'Even'
                },
                {
                    label: 'Mark',
                    value: 'Mark'
                },
                {
                    label: 'Space',
                    value: 'Space'
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
            let com = this.com;
            com.state = 1;
            this.$set(this, 'com', com);
            this.$set(this, 'stateText', '串口已开启');
        },
        closeCom() {
            let com = this.com;
            com.state = 0;
            this.$set(this, 'com', com);
            this.$set(this, 'stateText', '串口已关闭');
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
            this.$set(this, 'fileList', fileList)
        }
    }
}
</script>

<style scoped>
    .upload-demo {
        text-align: right;
    }
</style>
