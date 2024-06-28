// electron入口  打开新窗口
import {app, protocol, BrowserWindow, globalShortcut, ipcMain} from 'electron';
import {winURL, disabledKeys, browserWindowOption } from './config';

const IS_DEV = process.env.NODE_ENV === 'development';

// 启动app
const startWindow = () => {
    
    const createWindow = (e : any, arg: any) => {
        let win: BrowserWindow | null;
        if (arg && arg.url.includes("editor")) {
            const editorWinOpt = browserWindowOption("editor");
            win = new BrowserWindow(editorWinOpt);
            win.loadURL(`${winURL}#${arg.url}`)
        } else {
            win = new BrowserWindow(browserWindowOption());
            win.loadURL(winURL)
        }

        if (IS_DEV) {
            win.webContents.openDevTools();
        }
    }

    ipcMain.handle("openWin", createWindow);

    ipcMain.on("closeCurrentWindow", closeCurrentWindow);

    function closeCurrentWindow() {
        let currentWin = BrowserWindow.getFocusedWindow();
        setTimeout(()=>{
            if (currentWin && !currentWin.isDestroyed()) {
                currentWin.close();
            }
        }, 200)
    }

    require("./event")

    // app 生命周期
    app.on("window-all-closed", ()=>{
        if(process.platform !== 'darwin') {// for mac
            app.quit();
        }
    })

    app.on("ready", async ()=>{
        // 禁用快捷键
        for( const key of disabledKeys()) {
            globalShortcut.register(key, () => void 0);
        }
        createWindow(null, null);
    })
}

export {
    startWindow
}