<template>
    <el-row  style="height: 100%;">
        <el-col :span="6">
            <MainWork></MainWork>
        </el-col>
        <el-col :span="9" style="height:100%">
            <UnfinishWork></UnfinishWork>
        </el-col>
        <el-col :span="9" style="height:100%">
            <FinishedWork></FinishedWork>
        </el-col>
    </el-row>
</template>
<script>
  import MainWork from '../components/memo/MainWork'
  import UnfinishWork from '../components/memo/UnfinishWork' //未完成
  import FinishedWork from '../components/memo/FinishedWork' // 已完成
  export default {
    components: {
      MainWork,
      UnfinishWork,
      FinishedWork
    }
  }
</script>
