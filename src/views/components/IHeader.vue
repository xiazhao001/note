<template>
    <header class="header flex-between">
        <!-- 新窗口 -->
        <button class="icon flex-center" @click="openNewWindow" title="新窗口">
            <i class="iconfont flex-center icon-add"></i>
        </button>
        <!-- 标题拖动 -->
        <div class="drag-header flex1 flex-center" >
            <transition name="header-fadein">
                <span :key="title">{{title}}</span>
            </transition>
        </div>
        <!-- 更多 -->
        <button class="icon flex-center" @click="clickOptions" title="选项">
          <i class="iconfont flex-center icon-more"></i>
        </button>
        <!-- 右侧 -->
        <button class="icon flex-center close-window" @click="closeWindow" title="关闭">
            <i class="iconfont flex-center icon-close"></i>
        </button>
    </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {browserWindowOption} from "../../../electron/config"
import {createBrowserWindow, transitCloseWindow} from "@/utils"
import { useRoute } from 'vue-router';

export default defineComponent({
    setup(props, {emit}) {
        // 新窗口打开
        const editorWinOption = browserWindowOption("editor");
        const openNewWindow = () => {
            createBrowserWindow(editorWinOption, "/editor");
        }

        // 工具栏标题
        const title = ref(useRoute().meta.title as string);

        const closeWindow = () => {
            emit("on-close");
            transitCloseWindow();
        }

        const clickOptions = ()=>{
          emit("option-click");
        }

        return {
            title,
            closeWindow,
            clickOptions,
            openNewWindow
        }
    }
})

</script>

<style lang="less" scoped>
.header-fadein-enter,
.header-fadein-leave-to {
  display: none;
  opacity: 0;
  animation: header-fadein 0.4s reverse;
}
.header-fadein-enter-active,
.header-fadein-leave-active {
  opacity: 0;
  animation: header-fadein 0.4s;
}

@keyframes header-fadein {
  from {
    opacity: 0;
    margin-right: -14px;
  }
  to {
    opacity: 1;
    margin-right: 0;
  }
}

.header {
  height: @iconSize;
  background-color: @white-color;
  button {
    padding: 0;
    outline: none;
    border: none;
    background-color: transparent;
  }
  a {
    color: initial;
    width: 100%;
    height: 100%;
    outline: none;
  }
  .icon {
    width: @iconSize;
    height: @iconSize;
    .iconfont {
      // 头部icon大小在这里设置
      font-size: @headerIconFontSize;
      padding-bottom: 2px;
    }
  }
  .close-window:hover {
    background-color: @error-color;
    color: @white-color;
  }
  @keyframes fades {
    30% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .drag-header {
    -webkit-app-region: drag;
    height: 36px;
    margin-top: 5px;
    padding-bottom: 5px;
    color: @text-sub-color;
    font-size: 15px;
    font-weight: bold;
    box-sizing: border-box;
  }
}
.thepin {
  width: 40px;
  height: 40px;
  overflow: hidden;
  position: relative;
  transition: all 0.4s;
  .absolute-box {
    position: absolute;
    top: 0;
    transition: all 0.4s;
  }
}
.thepin-active .absolute-box {
  top: -40px;
}
</style>