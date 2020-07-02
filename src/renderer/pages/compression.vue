<template>
    <div class="compression-box">
        <a href="#" id="drag" @click="pull_file">item</a>
    </div>
</template>
<script>
  const ipc = require('electron').ipcRenderer;
  export default {
    name: 'compression',
    data () {
      return {
        btnType: 'file'
      }
    },
    methods: {
      pull_file(){
        ipc.send('ondragstart', '/path/to/item')
      }
    }
  }
</script>

<style scoped>
    .compression-box {
        width: 100%;
        height: 100%;
        padding-top: 50px;
        text-align: center;
    }
    .push_file {
        margin-top:20px;
    }
</style>
