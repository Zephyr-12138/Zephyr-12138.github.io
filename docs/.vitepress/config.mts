import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zephyr's Blog",
  description: "Zephyr's Blog",
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
            text: 'css包含块',
            link: '/technology/containing-block'
          }
        ]
      },
      {
        text: "工作复盘",
        items: [
          { text: "微信小程序长列表性能优化", link: "/work/miniprogram-list-optimization" },
          // { text: "Runtime API Examples", link: "/api-examples" },
          // { text: "Test Doc", link: "/test-doc" },
          // { text: "Doc1 In Folder", link: "/test-folder/test-sub-doc1" },
          // { text: "Doc2 In Folder", link: "/test-folder/test-sub-doc2" },
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
