import cache from '../../assets/dataBase';
const state = {
  all: {                  // 总的配置，应用的配置
    alwaysTray: false   // 默认关闭时最小化到托盘
  }
}
const mutations ={
  getAllConfig(state){
    let setting =  cache.getSetting();
    if (setting.all) {
      state.all.alwaysTray = setting.all.alwaysTray;
    }
  },
  saveTray(state, tray) {
    let setting =  cache.getSetting();
    state.all.alwaysTray = tray;

    if (!setting.all) {
      setting.all = {};
    }
    setting.all.alwaysTray = state.all.alwaysTray;

    cache.saveSetting(setting);
  }
}
export default {
  mutations,
  state,
}
