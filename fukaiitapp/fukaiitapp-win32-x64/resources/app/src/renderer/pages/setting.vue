<template>
    <div class="setting-box">
        <el-tabs>
            <el-tab-pane label="设置">
                <div>
                    <el-checkbox v-model="tray">关闭时最小化到托盘</el-checkbox>
                </div>
                <div class="bottom-btn">
                    <el-button type="primary" @click="confirmSetting">保存</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  export default {
    name: 'setting',
    data(){
      return{
        tray:false,
      }
    },
    methods:{
      confirmSetting(){
        this.$store.commit('saveTray', this.tray);
      }
    },
    mounted(){
      this.$store.commit('getAllConfig');
      this.tray = this.$store.state.setting.all.alwaysTray;
    }
  }
</script>

<style lang="scss" scoped>
    .setting-box {
        margin: 10px 40px;
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
    }
    .bottom-btn {
        margin-top: 100px;
    }
    .form-row {
        margin-bottom: 20px;
        & > p {
            margin-bottom: 10px;
        }
    }
</style>

