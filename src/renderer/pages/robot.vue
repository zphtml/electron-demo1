<template>
    <div>
        <div class="content-box">
            <div class="content-msg-box" ref="messageInfo" v-for="(mg, index) in talk" :key="index">
                <p :class="[
                mg.beloneTo + '-msg'
                ]">
                    {{ mg.content }}
                </p>
            </div>
        </div>
        <div class="message-input-box">
            <input type="text" v-model="msg" class="message-input" placeholder="input message here" @keypress.enter="sendToRobot" />
            <el-button size="medium" round class="message-button" @click.native="sendToRobot">send</el-button>
        </div>
    </div>
</template>

<script>
  let info = {
      "reqType": 0,
      "perception": {
        "inputText": {
          "text": ''
        }
      },
      "userInfo": {
        "apiKey": "36bff4dc43fe4f10af5d4501a32875bb",
        "userId": ~~(Math.random() * 99999)
      }
    },
    me = null;
  const ipc = require('electron').ipcRenderer;
  export default {
    data () {
      return {
        msg: '',    // 当前用户要问的
        talk: [],   // 所有的聊天记录
        index: 1    // 谈话的id
      }
    },
    methods: {
      sendToRobot(){
        //  提交信息
        ipc.send('http-request', {
          text:this.msg,
          method: 'POST'
        })
        this.talk.push({
          index: this.index,
          content: this.msg,
          beloneTo: 'me'
        });
        this.msg = '';
         ++this.index;
      },
    },
    mounted() {
        this.talk.push({
          index:0,
          content:'你好',
          beloneTo: 'robot'
        })
      me = this;
      //  on 接收
      ipc.on('http-request-data', (e, data) => {
        let returnMsg = JSON.parse(data.dataStr).results[0].values.text;
        me.talk.push({
          index: me.index,
          content: returnMsg,
          beloneTo: 'robot'
        });
        ++me.index;
      })
    }
  }
</script>

<style scoped lang="scss">
    .content-box {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 3em;
        left: 0px;
        padding: 20px;
        overflow: scroll;
    }
    .content-msg-box {
        overflow:hidden;
        width: 100%;
        margin-bottom: 1em;
    }
    .content-box p {
        max-width: 60%;
        padding: 5px 10px;
        border-radius: 5px;
        word-break:break-all;
        word-wrap:break-word;
    }
    .content-box .robot-msg {
        float: left;
        background-color: #67C23A;
    }
    .content-box .me-msg {
        float: right;
        background-color: #DCDFE6;
    }
    .message-input-box {
        padding: 5px;
        position: absolute;
        right: 0px;
        bottom: 0px;
        left: 0px;
        height: 2em;
        line-height: 2em;
        border-top: 1px solid #DCDFE6;
        background-color: #EBEEF5;
    }
    .message-input-box > .message-input {
        border: 1px solid #ccc;
        height: 2em;
        line-height: 2em;
        padding: 0px 10px;
        border-radius: 6px;
        display: block;
        margin-right: 60px;
        width: -webkit-fill-available;
        &:focus {
            outline: none;
        }
    }
    .message-button {
        background-color: #67C23A;
        padding: 0px;
        width: 3.6em;
        height: 2.4em;
        line-height: 28px;
        position: absolute;
        top: 0.2em;
        right: 0.2em;
        color: #fff;
        bottom: 0.2px;
    }
</style>
