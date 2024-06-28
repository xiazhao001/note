<template>
  <main class="page-index">
    <!-- 搜索栏 -->
    <Search @search="searchHandle" />
    <!-- 内容区 -->
    <section class="content-container">
      <template v-if="emptyBlockState === 1">
        <!-- 显示内容 -->
        <ul class="edit-list">
          <template v-for="item in viewNotesList" :key="item.uid">
            <li class="edit-item" :class="[item.className]" 
              @dblclick="openEditorWin(item.uid)"
              @contextmenu.prevent="contextMenu($event, item.uid)">
              <span class="update-time">{{getTime(item.updatedAt)}}</span>
              <div class="edit-content module-editor empty-content" v-html="item.interception"></div>
            </li>
          </template>
        </ul>
      </template>
      <template v-else-if="emptyBlockState === 0">
        <!-- 提示无内容 -->
        <div class="index-empty-container flex-center" @dblclick="openNewWindow">
          <div class="index-empty-content">
            <div class="index-empty-content-text" style="margin-top: 0; margin-bottom: 40px;">
              双击此处，或
            </div>
            <div class="index-empty-content-img">
              <img src="../../assets/empty-content.svg" alt="">
            </div>
            <div class="index-empty-content-text">点击上方的"+"按钮创建</div>
            <div class="index-empty-content-text" style="margin-top: 4px;">新的便签内容</div>
          </div>
        </div>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import {ref, onBeforeMount} from "vue";
import {Notes} from "@/service";
import dayjs from "dayjs";
import {DBNotesType, DBNotesListType} from "@/types/notes";
import { browserWindowOption } from "../../../electron/config";
import { createBrowserWindow } from "@/utils";
import RightClick from "@/components/IRightClick";
import { ipcRenderer } from "electron";
import Search from "./components/Search.vue"

let emptyBlockState = ref(0);
let viewNotesList = ref<DBNotesListType[]>([]);
let rightClick = new RightClick();

onBeforeMount(()=>{
  getAllNotes();
  electronIpcEditor();
})

// 拿到所有数据
const getAllNotes = async ()=>{
  const notesAllList = await Notes.findAll({
    raw: true,
    order: [["updatedAt",  "DESC"]]
  })
  console.log(notesAllList);
  viewNotesList.value = (notesAllList as unknown) as DBNotesListType[];

  if (notesAllList.length) {
    emptyBlockState.value = 1;
  } else {
    emptyBlockState.value = 2;
  }
}

// 打开新窗口
const editorWinOpt = browserWindowOption("editor");
const openNewWindow = ()=>{
  createBrowserWindow(editorWinOpt, "/editor");
}

// 根据id打开便签
const openEditorWin = (uid: string) => {
  createBrowserWindow(editorWinOpt, "/editor?uid="+uid);
}

// ============================================便签时间
const year = dayjs().year();
const nowTimeStamp = dayjs().valueOf();
// 当天0点时间戳
const todayZeroTimeStamp = dayjs()
      .hour(0)
      .minute(0)
      .second(0)
      .valueOf();

/**
 * 将更新时间格式化显示
 * @param time 更新时间
 */
const getTime = (time: Date) => {
  const date = dayjs(time);
  const dateYear = date.year();
  const dateTimeStamp = date.valueOf();
  
  // 如果不在这个年份要显示年份
  if (year !== dateYear) return date.format("YYYY-MM-DD");
  // 如果不是当天，则显示年月
  if (nowTimeStamp - dateTimeStamp > todayZeroTimeStamp) return date.format("MM-DD");
  // 是当天写的，则显示时分
  return date.format("HH:mm");
}
// ============================================

const contextMenu = (event: MouseEvent, uid: string) => {
  // 右键
  rightClick.useRightClick(event, [
    {
      text: "打开",
      once: true,
      iconName: ["iconfont", "icon-newopen"],
      handler: ()=>{
        openEditorWin(uid);
      }
    },
    {
      text: "删除",
      once: true,
      iconName: ["iconfont", "icon-delete"],
      handler: ()=>{
        onRemoveConfirm(uid);
      }
    }
  ])
}

const onRemoveConfirm = (uid: string) => {
  removeNoteItem(uid);
  Notes.destroy({
    where: {
      uid: uid
    }
  })
}

// 事件处理
const electronIpcEditor = ():void => {
  ipcRenderer.on("_createNewNote", async (event, noteItem: DBNotesType)=>{
    viewNotesList.value.unshift(noteItem);
    emptyBlockState.value = 1;
  })
  // update content
  ipcRenderer.on("_updateNoteItem_content", async (event, noteItem: DBNotesType)=>{
    const cntIndex = viewNotesList.value.findIndex(x => x.uid === noteItem.uid);
    if (cntIndex === -1) return;
    viewNotesList.value[cntIndex].interception = noteItem.interception as string;
    viewNotesList.value[cntIndex].updatedAt = noteItem.updatedAt;
  })
  // remove empty
  ipcRenderer.on("_removeEmptyNoteItem", (event, uid: string)=>{
    removeNoteItem(uid);
  })
  // update bgcolor
  ipcRenderer.on("_updateNoteItem_className", (event, noteItem: DBNotesType)=>{
    const index = viewNotesList.value.findIndex(x => x.uid === noteItem.uid);
    if (index === -1) return;
    viewNotesList.value[index].className = noteItem.className as string;
  })
}

const removeNoteItem = (uid: string) =>{
  const index = viewNotesList.value.findIndex(x => x.uid === uid);
  if (index === -1) return;
  viewNotesList.value[index].remove = true;
  setTimeout(()=>{
    viewNotesList.value.splice(index, 1);
    if (!viewNotesList.value.length) {
      emptyBlockState.value = 2;
    }
  }, 100)
}

// 模糊搜索结果
const searchHandle = (data: DBNotesType[]) => {
  if (data.length) {
    viewNotesList.value = data;
  } else {
    getAllNotes();
  }
}

</script>

<style lang="less" scoped>
.page-index {
  height: calc(100% - @iconSize);
  background-color: @white-color;
}

// 减去搜索和外边距高度
.content-container {
  height: calc(100% - 58px);
  padding: 6px 12px 20px;
  box-sizing: border-box;
  overflow-y: auto;
  margin-top: 14px;
  position: relative;
  .edit-list {
    @keyframes fadeintop {
      0% {
        opacity: 0;
        min-height: 0;
        padding: 0 14px;
      }
      50% {
        opacity: 0;
        min-height: 30px;
        padding: 24px 14px 14px;
        background-color: @white-color;
      }
      100% {
        opacity: 1;
        min-height: 30px;
        padding: 24px 14px 14px;
        // background-color: @background-sub-color;
      }
    }
    .empty-item {
      animation: fadeintop 0.6s forwards;
      // background-color: @background-sub-color;
      transition: all 0.4s;
    }
    li {
      list-style: none;
      border-radius: 2px;
      padding: 24px 14px 14px;
      margin-bottom: 10px;
      font-size: 14px;
      position: relative;
      cursor: pointer;
      transition: all 0.4s;
      transform: translateZ(0);
      transform: translate3d(0, 0, 0);
      box-sizing: border-box;
      max-height: 164px;
      overflow: hidden;
      box-shadow: 0 0 4px #ddd;
      background-color: @white-color;
      .update-time {
        font-size: 12px;
        position: absolute;
        right: 14px;
        top: 5px;
        transform: scale(0.8);
        color: @text-sub-color;
      }
      .edit-content {
        min-height: 20px;
        word-break: break-all;
        max-height: 126px;
        overflow: hidden;
        line-height: 1.8;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        :deep(*) {
          margin: 0;
          font-size: 14px;
          line-height: 1.8;
          word-break: break-all;
        }
        :deep(pre) {
          background-color: #f8f8f8;
          code {
            border-radius: 5px;
            padding: 0.5em;
          }
        }
      }
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        top: 0;
        left: 0;
        opacity: 0;
        transition: all 0.4s;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        opacity: 0.8;
        box-shadow: 0 0 4px @shadown-color;
        transition: all 0.4s;
        &::before {
          opacity: 1;
        }
      }
      &:active {
        transform: scale(0.97);
        box-shadow: 0 0 6px @shadown-color;
        transition: all 0.4s;
      }
    }
    .black-content {
      .update-time {
        color: @gray-color;
      }
      .empty-content::before {
        color: @gray-color;
      }
    }
    @keyframes removeFadeOut {
      0% {
        opacity: 1;
        margin-top: 0px;
      }
      50% {
        padding: 24px 14px 14px;
        max-height: 164px;
        opacity: 0;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      100% {
        opacity: 0;
        max-height: 0;
        padding: 0;
        margin: 0;
      }
    }
    .remove-item {
      opacity: 1;
      max-height: 164px;
      animation: removeFadeOut 0.4s forwards;
    }
  }
}

.index-empty-container {
  height: 100%;
  cursor: pointer;
  .index-empty-content {
    &-img {
      width: 74%;
      margin: 0 auto;
      img {
        display: block;
        width: 100%;
      }
    }
    &-text {
      font-size: 14px;
      color: @text-color;
      margin-top: 40px;
      text-align: center;
    }
  }
}
</style>