<template>
    <el-menu default-active="memo" class="el-menu-vertical-demo left-app-menu" :collapse="true" background-color="#222831" @select="indexChange">
        <el-menu-item index="memo" @click="toWork()" :class="$route.name =='memo'?'is-active-a':''" >
            <i class="el-icon-tickets"></i>
            <span slot="title">备忘录</span>
        </el-menu-item>
         <el-menu-item index="eyeProtection" @click="toEye()" :class="$route.name =='eyeProtection'?'is-active-a':''" >
            <i class="el-icon-view"></i>
            <span slot="title">眼保</span>
        </el-menu-item>
         <el-menu-item index="robot" @click="toRobot()" :class="$route.name =='robot'?'is-active-a':''" >
            <i class="el-icon-hot-water"></i>
            <span slot="title">聊天机器人</span>
        </el-menu-item>
         <el-menu-item index="compression" @click="toCompression()">
            <i class="el-icon-receiving"></i>
            <span slot="title">文件压缩</span>
        </el-menu-item>
        <el-menu-item index="setting" @click="toSetting()" :class="$route.name =='setting'?'is-active-a':''" >
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
const ipc = require('electron').ipcRenderer;
let me = null;

export default {
    data() {
        return {
            nowIndex: '',       // 当前在哪个菜单栏下
            lastIndex: ''       // 前一次index
        };
    },
    methods: {
        indexChange(index) {
            if ('memo' === this.nowIndex && 'memo' !== index) {
                // 切离memo，触发保存到缓存数据中
                this.$store.commit('writeCache');
            } else if ('memo' !== this.nowIndex && 'memo' === index) {
                // 切回memo，加载缓存
                this.$store.commit('readCache');
            }
            // 修改记录值
            this.lastIndex = this.nowIndex;
            this.nowIndex = index;
        },
        toWork() {
            this.$router.push('/');
        },
        toEye() {
            this.$router.push('/eyeProtection');
        },
        toCompression() {
            this.$router.push('/compression');
        },
        toRobot() {
            this.$router.push('/robot');
        },
        toCompression(){
            this.$router.push('/compression');
        },
        toSetting() {
            this.$router.push('/setting');
        }
    },
    mounted() {
        me = this;
        this.indexChange('memo');
        this.nowIndex = 'memo';
    },
    watch: {

      $route(to, from) {
        console.log(this.$route);
      }
    }
};

ipc.on('app-close', (e) => {
  let flag = me.$store.state.setting.all.alwaysTray;
    me.$store.commit('writeCache');
    // // 判断下是否要最小化到托盘
    if (flag) {
        // 最小化
        ipc.send('open-tray');
    } else {
        // 直接通知关闭
        ipc.send('close-app-ok');
    }
});
</script>

<style lang="scss" scoped>
.left-app-menu {
    height: 100%;
    float: left;
}
.el-menu-item i{
    color: white;
}
.el-menu-item.is-active{
    color: white;
}
.el-menu-item.is-active-a i{
    color: #409EFF!important;
}
</style>
