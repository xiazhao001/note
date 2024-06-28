/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./electron/config/electronConfig.ts":
/*!*******************************************!*\
  !*** ./electron/config/electronConfig.ts ***!
  \*******************************************/
/*! exports provided: disabledKeys, browserWindowOption, winURL */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"disabledKeys\", function() { return disabledKeys; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"browserWindowOption\", function() { return browserWindowOption; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"winURL\", function() { return winURL; });\n// electron配置\r\nconst IS_DEV = \"development\" === \"development\";\r\n/**\r\n * 禁用快捷键\r\n */\r\nconst disabledKeys = () => {\r\n    // 开发需要的\r\n    const devShortcuts = [\"F11\", \"Ctrl+R\"];\r\n    // 可以现在禁用的\r\n    const shortcuts = [\"Ctrl+H\"];\r\n    const exportKeys = IS_DEV ? shortcuts : [...devShortcuts, ...shortcuts];\r\n    return exportKeys;\r\n};\r\n/**\r\n * GUI界面的配置项\r\n * 首页，编辑页\r\n */\r\nconst browserWindowOption = (type) => {\r\n    const devWid = IS_DEV ? 950 : 0;\r\n    const devHei = IS_DEV ? 600 : 0;\r\n    // for editor page\r\n    const editorWindowOptions = {\r\n        width: devWid || 290,\r\n        height: devHei || 320,\r\n        minWidth: 290\r\n    };\r\n    // 所有页面适合\r\n    const commonOptions = {\r\n        minHeight: 48,\r\n        frame: false,\r\n        hasShadow: true,\r\n        transparent: true,\r\n        fullscreen: false,\r\n        webPreferences: {\r\n            nodeIntegration: true,\r\n            contextIsolation: false,\r\n            webSecurity: false\r\n        }\r\n    };\r\n    if (!type) { // 首页\r\n        return {\r\n            width: devWid || 350,\r\n            height: devHei || 600,\r\n            minHeight: 320,\r\n            ...commonOptions,\r\n            resizable: IS_DEV ? true : false\r\n        };\r\n    }\r\n    return {\r\n        ...editorWindowOptions,\r\n        ...commonOptions\r\n    };\r\n};\r\n/**\r\n * 开发环境地址\r\n * 发布环境地址\r\n */\r\nconst winURL = IS_DEV ? \"http://localhost:8080\" : `file://${__dirname}/index.html`;\r\n\n\n//# sourceURL=webpack:///./electron/config/electronConfig.ts?");

/***/ }),

/***/ "./electron/config/index.ts":
/*!**********************************!*\
  !*** ./electron/config/index.ts ***!
  \**********************************/
/*! exports provided: winURL, disabledKeys, browserWindowOption */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _electronConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./electronConfig */ \"./electron/config/electronConfig.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"winURL\", function() { return _electronConfig__WEBPACK_IMPORTED_MODULE_0__[\"winURL\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"disabledKeys\", function() { return _electronConfig__WEBPACK_IMPORTED_MODULE_0__[\"disabledKeys\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"browserWindowOption\", function() { return _electronConfig__WEBPACK_IMPORTED_MODULE_0__[\"browserWindowOption\"]; });\n\n\r\n\r\n\n\n//# sourceURL=webpack:///./electron/config/index.ts?");

/***/ }),

/***/ "./electron/event.ts":
/*!***************************!*\
  !*** ./electron/event.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n// 事件处理\r\n\r\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(\"createNewNote\", (event, data) => {\r\n    let wins = electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].getAllWindows();\r\n    if (wins) {\r\n        wins.forEach(b => {\r\n            b.webContents.send(\"_createNewNote\", data);\r\n        });\r\n    }\r\n});\r\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(\"updateNoteItem_content\", (event, data) => {\r\n    let wins = electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].getAllWindows();\r\n    if (wins) {\r\n        wins.forEach(b => {\r\n            b.webContents.send(\"_updateNoteItem_content\", data);\r\n        });\r\n    }\r\n});\r\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(\"removeEmptyNoteItem\", (event, data) => {\r\n    let wins = electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].getAllWindows();\r\n    if (wins) {\r\n        wins.forEach(b => {\r\n            b.webContents.send(\"_removeEmptyNoteItem\", data);\r\n        });\r\n    }\r\n});\r\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(\"updateNoteItem_className\", (event, data) => {\r\n    let wins = electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].getAllWindows();\r\n    if (wins) {\r\n        wins.forEach(b => {\r\n            b.webContents.send(\"_updateNoteItem_className\", data);\r\n        });\r\n    }\r\n});\r\n\n\n//# sourceURL=webpack:///./electron/event.ts?");

/***/ }),

/***/ "./electron/main.ts":
/*!**************************!*\
  !*** ./electron/main.ts ***!
  \**************************/
/*! exports provided: startWindow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"startWindow\", function() { return startWindow; });\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ \"./electron/config/index.ts\");\n// electron入口  打开新窗口\r\n\r\n\r\nconst IS_DEV = \"development\" === 'development';\r\n// 启动app\r\nconst startWindow = () => {\r\n    const createWindow = (e, arg) => {\r\n        let win;\r\n        if (arg && arg.url.includes(\"editor\")) {\r\n            const editorWinOpt = Object(_config__WEBPACK_IMPORTED_MODULE_1__[\"browserWindowOption\"])(\"editor\");\r\n            win = new electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"](editorWinOpt);\r\n            win.loadURL(`${_config__WEBPACK_IMPORTED_MODULE_1__[\"winURL\"]}#${arg.url}`);\r\n        }\r\n        else {\r\n            win = new electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"](Object(_config__WEBPACK_IMPORTED_MODULE_1__[\"browserWindowOption\"])());\r\n            win.loadURL(_config__WEBPACK_IMPORTED_MODULE_1__[\"winURL\"]);\r\n        }\r\n        if (IS_DEV) {\r\n            win.webContents.openDevTools();\r\n        }\r\n    };\r\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].handle(\"openWin\", createWindow);\r\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(\"closeCurrentWindow\", closeCurrentWindow);\r\n    function closeCurrentWindow() {\r\n        let currentWin = electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].getFocusedWindow();\r\n        setTimeout(() => {\r\n            if (currentWin && !currentWin.isDestroyed()) {\r\n                currentWin.close();\r\n            }\r\n        }, 200);\r\n    }\r\n    __webpack_require__(/*! ./event */ \"./electron/event.ts\");\r\n    // app 生命周期\r\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on(\"window-all-closed\", () => {\r\n        if (process.platform !== 'darwin') { // for mac\r\n            electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\r\n        }\r\n    });\r\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on(\"ready\", async () => {\r\n        // 禁用快捷键\r\n        for (const key of Object(_config__WEBPACK_IMPORTED_MODULE_1__[\"disabledKeys\"])()) {\r\n            electron__WEBPACK_IMPORTED_MODULE_0__[\"globalShortcut\"].register(key, () => void 0);\r\n        }\r\n        createWindow(null, null);\r\n    });\r\n};\r\n\r\n\n\n//# sourceURL=webpack:///./electron/main.ts?");

/***/ }),

/***/ "./src/background.ts":
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _electron_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../electron/main */ \"./electron/main.ts\");\n// vue-cli-service electron:serve 入口文件\r\n\r\n\r\n// 单实例锁\r\nconst gotTheLock = electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].requestSingleInstanceLock();\r\nif (!gotTheLock) {\r\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit(); //只允许单个实例\r\n}\r\nelse {\r\n    Object(_electron_main__WEBPACK_IMPORTED_MODULE_1__[\"startWindow\"])();\r\n}\r\n\n\n//# sourceURL=webpack:///./src/background.ts?");

/***/ }),

/***/ 0:
/*!*********************************!*\
  !*** multi ./src/background.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! D:\\public\\vip-course\\electron\\code\\25\\zx-inote\\src\\background.ts */\"./src/background.ts\");\n\n\n//# sourceURL=webpack:///multi_./src/background.ts?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ })

/******/ });