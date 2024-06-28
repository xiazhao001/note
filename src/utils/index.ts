import { ipcRenderer } from "electron";

/**
 * 生成唯一uuid字符串
 * @returns 
 */
export const uuid = (): string => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};

/**
 * 
 * @param bwopt 创建新窗口
 * @param url 
 */
export const createBrowserWindow = (bwopt = {}, url = "/"): void => {
  ipcRenderer.invoke("openWin", {bwopt, url})
}
/**
 * 关闭当前窗口
 */
export const transitCloseWindow = (): void => {
  ipcRenderer.send("closeCurrentWindow");
}