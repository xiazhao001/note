// electron配置

const IS_DEV = process.env.NODE_ENV === "development";

/**
 * 禁用快捷键
 */
export const disabledKeys = () => {
    // 开发需要的
    const devShortcuts = ["F11", "Ctrl+R"];
    // 可以现在禁用的
    const shortcuts = ["Ctrl+H"]

    const exportKeys = IS_DEV ? shortcuts : [...devShortcuts, ...shortcuts];
    return exportKeys;
}

/**
 * GUI界面的配置项
 * 首页，编辑页
 */
export const browserWindowOption = (type?: "editor"): Electron.BrowserWindowConstructorOptions => {
    const devWid = IS_DEV ? 950 : 0;
    const devHei = IS_DEV ? 600 : 0;

    // for editor page
    const editorWindowOptions = {
        width: devWid || 290,
        height: devHei || 320,
        minWidth: 290
    }

    // 所有页面适合
    const commonOptions: Electron.BrowserWindowConstructorOptions = {
        minHeight: 48,
        frame: false,          // 边框
        hasShadow: true,       // 阴影
        transparent: true,     // 透明
        fullscreen: false,     // 全屏
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    }

    if (!type) { // 首页
        return {
            width: devWid || 350,
            height: devHei || 600,
            minHeight: 320,
            ...commonOptions,
            resizable: IS_DEV ? true : false
        }
    }
    return { // 其它页
        ...editorWindowOptions,
        ...commonOptions
    }
}

/**
 * 开发环境地址
 * 发布环境地址
 */
export const winURL = IS_DEV ? "http://localhost:8080" : `file://${__dirname}/index.html`;