import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zephyr's Blog",
  description: "Zephyr's Blog",
  // Deploy under https://<host>/blog/
  base: "/blog/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      // { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: '技术文档',
        items: [
          {
            text: 'VSCode 中的快捷键',
            link: '/technology/shortcut-keys'
          },
          {
            text: 'CSS 包含块',
            link: '/technology/containing-block'
          },
          {
            text: 'V8 的隐藏类',
            link: '/technology/hidden-class'
          },
          {
            text: 'JS 中的数组模式',
            link: '/technology/array-mode'
          },
        ]
      },
      {
        text: "项目复盘",
        items: [
          { text: "微信小程序长列表性能优化", link: "/work/miniprogram-list-optimization" },
          { text: "提交流程重复点击问题复盘", link: "/work/repeat-submit-and-navigation" },
          // { text: "Runtime API Examples", link: "/api-examples" },
          // { text: "Test Doc", link: "/test-doc" },
          // { text: "Doc1 In Folder", link: "/test-folder/test-sub-doc1" },
          // { text: "Doc2 In Folder", link: "/test-folder/test-sub-doc2" },
          {text: "elpis - 基于“领域模型”的全栈开发框架", items: [
            {text: "基于 NodeJs(Koa) 实现服务端内核引擎", link: "/work/elpis/elpis-core"},
            {text: "基于 Webpack 5 完成工程化建设", link: "/work/elpis/engineering"},
          ]}
        ],
      },
      {
        text: "生活点滴",
        items: [
          { text: "一个程序员的菜谱", link: "/life/menu" },
          // { text: "Runtime API Examples", link: "/api-examples" },
          // { text: "Test Doc", link: "/test-doc" },
          // { text: "Doc1 In Folder", link: "/test-folder/test-sub-doc1" },
          // { text: "Doc2 In Folder", link: "/test-folder/test-sub-doc2" },
        ],
      },
    ],

    socialLinks: [
      // { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
