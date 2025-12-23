# 微信小程序长列表性能优化
<br>

> 需求背景：事务列表数量过多时，列表加载时间较长

### 问题分析

通过理解列表页原先实现逻辑与问题排查，列表初次渲染时间过长主要由两个原因导致：

1. 一次性对所有列表数据执行 setData 操作，数据大小（1243 KB）已远超小程序官方警告上限（1024 KB），页面存在过多 DOM 结构需要渲染，占用内存多，耗时长

![setData数据量过大](/public/miniprogram-list-optimization/set-data-problem.png)

![setData数据量过大](/public/miniprogram-list-optimization/set-data-warn.png)


2. 列表首次渲染前需要按照默认设定的排序以及筛选规则对数据进行处理，原逻辑中 n 个筛选项需要遍历 n 次数据，处理逻辑的 js 执行较为繁琐密集，影响了渲染过程

### 优化方案

**问题 1 优化方案：** 列表渲染采用微信小程序官方虚拟列表实现  ——— recycle-view 组件改造，DOM 元素不会随着数据增长而增长，而是同样的 DOM 元素展示不同的数据，即用户滑动的其实是数据，而不再是组件。对于数据的处理，通过 RecycleContext 对象 append 方法追加数据，而不是每次都一次性 setData 所有数据

**问题 2 优化方案：** 数据的处理可以分为两种类型：1. 筛选；2. 排序。对于筛选，每个筛选项都是通过各自独立的字段判断的，所以一轮遍历即可筛选出符合所有条件的数据，原逻辑中 n 个筛选项遍历 n 次并不合理。对于排序，v8 >= 7.0 版本引擎采用了归并排序和插入排序混合的排序算法，平均时间复杂度为 O(nlogn)，相对于筛选 fiter 的 O(n) 的复杂度，排序的复杂度更高，即随着操作数的增多，排序相对于过滤所消耗的时间增速会更快，所以排序应该在数据量最少的时候进行，也就是排序应该放在所有过滤完成之后

![筛选，排序](/public/miniprogram-list-optimization/sort-filter.png)

### 优化效果
> 测试数据量：1062 条

![测试数据](/public/miniprogram-list-optimization/test-data.png)

列表初次渲染时长（模拟器运行）

优化前：38.654s

![优化前](/public/miniprogram-list-optimization/before-optimization.png)

优化后：2.963s

![优化后](/public/miniprogram-list-optimization/after-optimization.png)
