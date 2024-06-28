import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import main from '../views/main.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "main",
    component: main,
    children: [
      {
        path: "/",
        name: "index",
        component: ()=> import("../views/index/index.vue"),
        meta: {
          title: "小夕便签"
        }
      },
      {
        path: "/editor",
        name: "editor",
        component: ()=> import("../views/editor/index.vue"),
        meta: {
          title: "小夕"
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
