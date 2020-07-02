import cache from '../../assets/dataBase';
const state = {
  unfinishWork: [],
  finishedWork: [],
  nextID: 0           // id给work标定
}
const mutations = {
  addID (state) {
    state.nextID++;
  },
  //新增任务
  addNewWork (state, work) {
    console.log(work)
    let i = 0,
        len = state.unfinishWork.length;
    if(!work.isTop){
      // 非置顶的，查找最后一个置顶任务
      for (; i < len; ++i) {
        if (!state.unfinishWork[i]) {
          break;
        }
      }
    }else{
      // 置顶，相当于从0开始插入
      i = 0;
    }
    state.unfinishWork.splice(i,0,work)
  },
//  任务完成
  doFinish (state, workId) {
    let index = findIndex(state.unfinishWork, workId),
      temp = state.unfinishWork.splice(index, 1);

    // 放入完成任务列表
    state.finishedWork.push(...temp);
  },
  //删除任务
  deleteUnfinishWork (state, workId) {
    let index = findIndex(state.unfinishWork, workId);

    state.unfinishWork.splice(index, 1);
  },
//  置顶未完成的工作
  topWork (state, workId) {
    let index = findIndex(state.unfinishWork, workId),
      temp = state.unfinishWork.splice(index, 1);
    // 数组头部插入数据
    state.unfinishWork.unshift(...temp);
  },
//  删除已完成任务
  deleteFinishedWork  (state, workId) {
    let index = findIndex(state.finishedWork, workId);

    state.finishedWork.splice(index, 1);
  },
//  关闭弹窗是保存数据
  writeCache(state){
    cache.saveWorkData({
      unfinishWork: state.unfinishWork,
      finishedWork: state.finishedWork
    });
  },

  readCache(state){
    let data = cache.getWorkData();
    //
    // 检测unfinishWork是否有缓存
    if (data.unfinishWork) {
      state.unfinishWork.length = 0;
      state.unfinishWork.push(...data.unfinishWork);
    }
    // 检测finishedWork是否有缓存
    if (data.finishedWork) {
      state.finishedWork.length = 0;
      state.finishedWork.push(...data.finishedWork);
    }
  }
}
// 根据id属性从arr中检索出他的位置（下标）
function findIndex(arr, id) {
  let ind = 0,
    len = arr.length;

  for (; ind < len; ++ind) {
    if (arr[ind].ID === id) {
      // 匹配成功
      break;
    }
  }

  return ind;
}
const getters = {
  // 获取任务的ID号，唯一标定一个任务
  getID:state=>state.nextID
}
export default {
  state,
  mutations,
  getters
}
