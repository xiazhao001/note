// 事件处理

import { BrowserWindow, ipcMain } from "electron";

ipcMain.on("createNewNote", (event, data)=>{
    let wins = BrowserWindow.getAllWindows();
    if (wins) {
        wins.forEach(b => {
            b.webContents.send("_createNewNote", data);
        })
    }
})
ipcMain.on("updateNoteItem_content", (event, data)=>{
    let wins = BrowserWindow.getAllWindows();
    if (wins) {
        wins.forEach(b => {
            b.webContents.send("_updateNoteItem_content", data)
        })
    }
})
ipcMain.on("removeEmptyNoteItem", (event, data)=>{
    let wins = BrowserWindow.getAllWindows();
    if (wins) {
        wins.forEach(b => {
            b.webContents.send("_removeEmptyNoteItem", data);
        })
    }
})
ipcMain.on("updateNoteItem_className", (event, data)=>{
    let wins = BrowserWindow.getAllWindows();
    if (wins) {
        wins.forEach(b => {
            b.webContents.send("_updateNoteItem_className", data)
        })
    }
})