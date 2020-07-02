'use strict'

import { app, BrowserWindow } from 'electron'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let event = require('./event');

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    minWidth: 800,
    useContentSize: true,
    width: 1000,
    frame:false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  event(mainWindow, app);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
const electron = require('electron');
const ipc = electron.ipcMain;
//关闭弹窗--桥梁连接 AppMenu 页面内方法
ipc.on('close-app', () => {
  mainWindow.webContents.send('app-close');
});
ipc.on('close-app-ok', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});
//最小化--
ipc.on('min-app', () => {
  mainWindow.minimize();
});
//最大化
ipc.on('max-app', () => {
  mainWindow.maximize();
});
let eyeWindow = null,
  eyeTimekeeping = null;
//眼保开始
ipc.on('eyeProtection-start', (e, time) => {
  if (eyeWindow) {
    return;
  }
  eyeWindow = new BrowserWindow({
    width: 200,
    height: 100,
    frame: false,
    // alwaysOnTop: true,   // 保险
    parent: mainWindow //win是主窗口
  });
  eyeWindow.loadURL(`file:///${__dirname}/eyeCover.html`);

  eyeWindow.setFullScreen(true);

  eyeTimekeeping = setTimeout(function() {
    eyeTimeUp();
  }, time * 1000);
})
//node 服务
let server = null;
ipc.on('http-request',(e, config)=>{
  if(!server){
    requestHttp(config)
  }
})
ipc.on('ondragstart',(e, filePath)=>{
  // e.sender.startDrag({
  //   file: filePath,
  //   icon: './app.png'
  // })
})

const http = require('http');
function requestHttp (config) {
  let info = combineInfo(config);
  // 请求的数据内容组装
  var options = {
    hostname: 'openapi.tuling123.com',
    path: '/openapi/api/v2',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  };
  var robotServer = http.request(options, function (roRes) {
    let data = '';

    roRes.setEncoding('utf8');
    console.log('STATUS: ' + roRes.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(roRes.headers));
    roRes.on('data', function (chunk) {
      data = chunk;
    });
    roRes.on('end', function() {
      // 接受完成，发送给页面
      mainWindow.webContents.send('http-request-data', {
        dataStr: data
      });
      // console.log('datadatadatadatadata: ' + data);
    })
  })
  robotServer.write(info);
  robotServer.end();
}
function combineInfo (config) {
  let info = config.text,
    msg = {
      "reqType":0,
      "perception": {
        "inputText": {
          "text": info
        }
      },
      "userInfo": {
        "apiKey": "36bff4dc43fe4f10af5d4501a32875bb",
        "userId": ~~(Math.random() * 99999)
      }
    };
  return JSON.stringify(msg)
}
function eyeTimeUp() {
  if (eyeWindow) {
    eyeWindow.close();
    eyeWindow = null;
    clearTimeout(eyeTimekeeping);
    eyeTimekeeping = null;
    // 结束了，可以重新开始计时了
    mainWindow.webContents.send('eyeProtection-restart');
  }
}


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
