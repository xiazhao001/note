// vue-cli-service electron:serve 入口文件

import {app} from 'electron';
import {startWindow} from '../electron/main';
// 单实例锁
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();   //只允许单个实例
} else {
    startWindow();
}
