<template>
  <IHeader class="header-editor" :class="headerClass" @on-close="closeWindow" @option-click="clickOption"/>
  <div class="options-container" :class="showOptionsStatus ? 'options-show' : ''">
    <div class="options-cover" @click="showOptionsStatus = false"></div>
    <div class="options-content">
      <ul>
        <template v-for="item in classNames" :key="item.className">
          <li 
            class="flex1"
            :title="item.title"
            :class="item.className"
            @click="changeBgClassName(item.className)"
          ></li>
        </template>
      </ul>
    </div>
  </div>
  <main class="page-editor">
    <IEditor 
      v-model="iEditorMarkdown"
      :content="iEditorHtml"
      :className="currentBgClassName"
      @on-input="changeEditContent"
    />
  </main>
</template>

<script setup lang="ts">
import { uuid } from '@/utils';
import { defineAsyncComponent, ref, onMounted, computed } from 'vue';

import {Notes} from "@/service"
import { useRoute } from 'vue-router';
import { ipcRenderer } from 'electron';
import {classNames} from "@/config";

const uid = ref("");
const iEditorHtml = ref("");
const iEditorMarkdown = ref("");
const IHeader = defineAsyncComponent(()=> import("../components/IHeader.vue"));
const IEditor = defineAsyncComponent(()=> import("../components/IEditor.vue"));
const showOptionsStatus = ref(false);
const currentBgClassName = ref("");

onMounted(()=>{
  initEditorContent();
})

const initEditorContent = async ()=> {
  // 获取原数据
  const routeUid = useRoute().query.uid as string;
  if (routeUid){
    uid.value = routeUid;
    getCurUidItem(routeUid);
    return;
  }
  // 第一次打开是空白
  const uuidString = uuid();
  uid.value = uuidString;
  const createDefault = {
    uid: uid.value,
    content: "",
    markdown: "",
    className: "",
    interception: ""
  }

  Notes.create(createDefault, {raw: true})
  // ipc
  ipcRenderer.send("createNewNote", createDefault);
}

// 根据uid从db中读取内容
const getCurUidItem = async (uid: string) =>{
  const info = await Notes.findOne({
    where: {
      uid
    }
  })
  if (info) {
    iEditorHtml.value = info.content;
    iEditorMarkdown.value = info.markdown;
  }
}

/**
 * 实时保存编辑数据
 */
const changeEditContent = (contentHtml: string, markdown: string)=>{
  iEditorHtml.value = contentHtml;
  iEditorMarkdown.value = markdown;
  if (!uid.value) return false;
  
  updateData("content");
}

/**
 * 更新便签的数据，包括内容和样式
 * @param updateType 更新类型
 */
const updateData = async (updateType: "className" | "content") => {
  const interceptionHtml = await getInterceptionHtml();
  const dataJson: Record<string, any> = {
    uid: uid.value,
    content: iEditorHtml.value,
    markdown: iEditorMarkdown.value,
    className: currentBgClassName.value,
    interception: interceptionHtml
  }
  // write
  await Notes.update(dataJson, {
    where: {
      uid: uid.value
    }
  })
  // ipc
  if (updateType === 'className') {
    ipcRenderer.send("updateNoteItem_className", {
      uid: uid.value,
      className: currentBgClassName.value
    })
  } else {
    dataJson.updatedAt = new Date();
    ipcRenderer.send("updateNoteItem_content", dataJson);
  }
}

const getInterceptionHtml = async () => {
  const domHtml = new DOMParser().parseFromString(iEditorHtml.value, "text/html");
  let interceptionHtml = "";
  let nodeIndex = 10;
  // 截节前10个
  domHtml.body.childNodes.forEach((item,index)=>{
    // if (item.nodeName === "#text") {
    //   nodeIndex += 1;
    //   return;
    // }
    if (index > nodeIndex) return;
    interceptionHtml += (item as Element).outerHTML;
    // 如果有undefined replace
  })
  return interceptionHtml;
}

/**
 * 若数据为空则删除
 */
const closeWindow = () => {
  if (iEditorHtml.value) return;
  // remove from db
  Notes.destroy({
    where: {
      uid: uid.value
    }
  }).then(()=>{
    ipcRenderer.send("removeEmptyNoteItem", uid.value);
  })
}

// 修改背景色
const changeBgClassName = (className: string) =>{
  currentBgClassName.value = className;
  updateData("className");
  showOptionsStatus.value = false;
}

// 显示选项
const clickOption = ()=>{
  showOptionsStatus.value = true;
}

// 编辑页工具栏颜色
const headerClass = computed(()=>{
  let classArr = [currentBgClassName.value];
  return classArr;
})

</script>


<style lang="less" scoped>
.page-editor {
  height: 100%;
  background-color: @white-color;
  padding-top: @iconSize;
  // padding-bottom: @iconSize;
  box-sizing: border-box;
  transition: padding 0.4s;

  .editor-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    textarea {
      width: 100%;
      height: 370px;
      display: block;
    }
  }
}

.header-editor {
  position: fixed;
  z-index: 0;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  // top: -@iconSize;
  top: -2px;
  transition: all 0.4s;
}

.header-show-style {
  top: 0;
  z-index: 3;
  transition: all 0.4s;
}

.options-container {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: z-index 0.4s;

  .options-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 0;
    bottom: 0;
    left: 0;
    transition: all 0.4s;
  }

  .options-content {
    position: absolute;
    width: 100%;
    z-index: 2;
    top: -300px;
    box-shadow: 0 0 4px @border-color;
    transition: top 0.4s;
    background-color: @white-color;
  }

  .colors {
    height: 50px;
    width: 100%;

    li {
      list-style: none;
      height: 100%;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      &:hover {
        &::before {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }

    .black-content:hover {
      &::before {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .back-list {
    width: 100%;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    color: #333;
    display: block;
    padding: 0 10px;

    .iconfont {
      margin-right: 10px;
    }

    &:hover {
      background-color: @background-sub-color;
    }

    &:active {
      background-color: @background-color;
    }
  }
}

.options-show {
  z-index: 3;
  transition: z-index 0.4s;

  .options-content {
    top: 0;
    transition: top 0.4s;
  }

  .options-cover {
    z-index: 1;
    opacity: 1;
    transition: all 0.4s;
  }
}

.window-blur-hide {
  padding-top: 0;
  padding-bottom: 0;
  transition: padding 0.4s;
}
</style>
