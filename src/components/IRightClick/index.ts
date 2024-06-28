import { createApp, h, App, VNode, RendererElement, RendererNode } from "vue"
import "./index.css";

type ClassName = string | string[];

interface MenuOptions {
    /**
     * 文本
     */
    text: string;

    /**
     * 是否在使用后就关闭
     */
    once?: boolean;

    /**
     * 单独的样式名
     */
    className?: ClassName;

    /**
     * 图标样式名
     */
    iconName?: ClassName;

    /**
     * 函数
     */
    handler(): void;
}

type RenderVNode = VNode<
    RendererNode,
    RendererElement,
    {
        [key: string]: any;
    }
>;

// 右键菜单
class CreateRightClick {
    rightClickEl?: App<Element>;  // app实例
    rightClickElBox?: HTMLDivElement | null; // dom

    constructor(){
        this.removeRightClickHandler();
    }

    /**
     * 渲染
     * @param menu 
     */
    render(menu: MenuOptions[]) : RenderVNode {
        return h(
            'ul',
            {
                class: ["right-click-menu-list"]
            },
            [
                ...menu.map(item => {
                    return h(
                        "li",
                        {
                            class: item.className,
                            onclick: ()=>{
                                // 点击菜单
                                if (item.once) this.remove();
                                return item.handler();
                            }
                        },
                        [
                            //icon
                            h("i", {
                                class: item.iconName
                            }),
                            // text
                            h(
                                "span",
                                {
                                    class: "right-click-menu-list"
                                },
                                item.text
                            )
                        ]
                    )
                })
            ]
        )
    }

    // 清除菜单dom
    remove(): void {
        if (this.rightClickElBox) {
            this.rightClickElBox.remove();
            this.rightClickElBox = null;
        }
    }

    // 右键显示菜单
    useRightClick = (event: MouseEvent, menu: MenuOptions[] = []): void => {
        this.remove();
        if (!this.rightClickElBox || !this.rightClickEl) {
            const createRender = this.render(menu);
            this.rightClickEl = createApp({
                setup(){
                    return ()=> createRender;
                }
            })
        }

        if (!this.rightClickElBox) {
            this.rightClickElBox = document.createElement("div");
            this.rightClickElBox.id = "rightClick";
            document.body.appendChild(this.rightClickElBox);
            // mount
            this.rightClickEl.mount("#rightClick");
        }
        this.setRightClickElStyle(event, menu.length);
    }

    /**
     * 右键的样式
     * @param event 
     * @param len 
     */
    setRightClickElStyle(event: MouseEvent, len: number): void {
        if (!this.rightClickElBox) return;
        this.rightClickElBox.style.height = `${len * 36}px`;
        const {clientX, clientY} = event;
        const {innerWidth, innerHeight} = window;
        const {clientWidth, clientHeight} = this.rightClickElBox;
        let cssText = `height: ${len * 36}px;opacity: 1;transition:all 0.2s;`;
        if (clientX + clientWidth < innerWidth) {
            cssText += `left: ${clientX + 2}px;`
        } else {
            cssText += `left: ${clientX - clientWidth}px;`
        }
        if (clientY + clientHeight < innerHeight) {
            cssText += `top: ${clientY + 2}px;`
        } else {
            cssText += `top: ${clientY - clientHeight}px;`
        }
        this.rightClickElBox.style.cssText = cssText;
    }

    // 取消菜单
    removeRightClickHandler(): void {
        document.addEventListener("click", e=>{
            if (this.rightClickElBox) {
                const currentEl = e.target as Node;
                if (!currentEl || !this.rightClickElBox.contains(currentEl)) {
                    this.remove();
                }
            }
        })
    }
}

export default CreateRightClick;