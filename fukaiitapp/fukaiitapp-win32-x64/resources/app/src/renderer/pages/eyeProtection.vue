<template>
    <div class="eye-protection">
        <el-switch
                v-model="enable"
                active-color="#409EFF"
                active-text="开关"
                inactive-color="#909399">
        </el-switch>
        <p>
            <span>间隔时间：</span>
            <el-input-number :min="1" :max="10" v-model="last" :step="2"></el-input-number>
        </p>
        <el-button type="primary" @click="confirm()">保存</el-button>
    </div>
</template>

<script>
  import work from '../store/modules/work'

  const ipc = require('electron').ipcRenderer;
  let worker = null,
    me = null;
  export default {
    name: 'eyeProtection',
    data() {
      return {
        enable:false,
        last: 5,
        duration: 5
      }
    },
    methods: {
      confirm(){
        worker.postMessage({
          enable: this.enable,
          time: this.last
        });
      }
    },
    mounted () {
      me = this;
      worker = new Worker('/src/renderer/assets/eyeWorker.js');
      console.log(1)
      worker.onmessage = function(e) {

        if (e.data > 0) {
          // 开启弹窗提示，要有眼保了
        } else {
          // 0秒，开启眼保
          ipc.send('eyeProtection-start', me.duration);
        }
      };
      ipc.on('eyeProtection-restart', (e) => {
        // me.confirm();//重新计时
        worker.terminate();
      });
    }
  }
</script>

<style lang="scss" scoped>
    .eye-protection {
        padding: 40px;
        & > p {
            margin: 20px 0;
        }
    }
</style>
