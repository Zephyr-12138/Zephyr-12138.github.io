# CSS 包含块
<br>

浏览器渲染页面的过程中有一步叫做样式计算，在这一步骤中，会将我们在 css 中书写的相对值转换为绝对值，例如
```css
/* 相对尺寸 */
width: 50%;
height: 20%

/* 相对位置 */
position: absolute;
top: 10px
```

既然是相对值，意味着一定有一个参照标准，这个参照标准即当前元素所在的包含块（containing-block）



页面上的每个元素（包括根元素 html）都有属于自己的包含块，具有以下类型：

- 根元素所在包含块为初始包含块，尺寸与视口相等
- position 为 relative 或 static 的元素，所在包含块为其最近的块元素的内容区域
- position 为 fixed 的元素，所在包含块为视口
- position 为 absolute 的元素，所在包含块为其最近的 position 为非 static 的祖先元素的 padding 边缘以内的区域
- position 为 absolute 或 fixed 的元素，所在包含块也可能是这些最近父元素的 padding 边缘以内的区域（transform 或 perspective 的值为非 none；will-change 的值为 transform 或 perspective; filter 的值为非 none 或 will-change 的值为 filter）; contain 的值为 paint