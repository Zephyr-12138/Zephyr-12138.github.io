# 基于 Vue3 完成动态组件库建设

在上一篇中，我们通过 DSL 描述出了在一个管理模块中的搜索栏与表格，以及通过解析器将它们渲染出来

但是在一个管理模块中，仅有这两部分显然是不够的，为了更高的可扩展性，我们需要支持用户自定义一些组件与事件，例如：点击 “新增” 或 “编辑” 按钮，从侧边弹出一个抽屉，抽屉中有一个表单，用于添加或编辑一条表格中的数据；点击 “详情” 按钮，展示当前行数据的详细信息，等等 ...

我们来补充一下上一篇的 DSL 中的相关信息

```json
tableConfig: {
  headerButtons: [
      {
          label: '', // 按钮中文名
          eventKey: '', // 按钮事件名
          // 按钮事件具体配置
          eventOption: {
              // 当 eventKey === 'showComponent'
              comName: '', // 组件名称
          },
          ...elButtonConfig // 标准 el-button 配置
      },
      ...
  ],
  rowButtons: [
      {
          label: '', // 按钮中文名
          eventKey: '', // 按钮事件名
          // 按钮事件具体配置
          eventOption: {
              // 当 eventKey === 'showComponent'
              comName: '', // 组件名称

              // 当 eventKey === 'remove
              params: {
                  // param = 为参数的键值
                  // rowValueKey = 参数值（当格式为 schema::tableKey 时，到 table 中找响应字段）
                  paramKey: rowValueKey
              }
          }, 
          ...elButtonConfig // 标准 el-button 配置
      },
      ...
  ]
}

// 动态组件相关配置
componentConfig: {
    // create-form 表单相关配置
    createForm: {
        title: '', // 表单标题
        saveBtnTxt: '', // 保存按钮文案
    },
    // edit-form 表单相关配置
    editForm: {
        mainKey: '', // 表单主键，用于唯一标识要修改的数据对象
        title: '', // 表单标题
        saveBtnTxt: '', // 保存按钮文案
    },
    // detail-panel 相关配置
    detailPanel: {
        mainKey: '', // 表单主键，用于唯一标识要修改的数据对象
        title: '', // 表单标题
    }
    // ... 支持用户动态扩展
}
```

首先在 schemaConfig.tableConfig 中，我们先声明触发这些事件的按钮，例如 “新增” 按钮往往是在表格上方，所以可以配置在 tableConfig.headerButtons 中，而 “编辑”，“详情” 按钮往往是针对某一条数据，所以往往是出现在表格的操作列中，因此可以配置在 tableConfig.rowButtons 中，为了能够区分相应不同的事件，每个按钮都应该定义一个事件名，后续解析器能够根据事件名来响应不用事件，即 eventKey，以上这三个按钮的事件往往是调用某个组件显示出来（可能是一个抽屉或者弹窗），在其中执行相关操作，这种事件我们可以将其 eventKey 配置为 "showComponent"，表示点击它们会使某个组件出来，另外，为了区分响应每个不同按钮的不同组件，在按钮的 eventOption.comName 需要配置想要哪个组件来响应当前按钮的事件  

接下来，我们还需要在 schemaConfig.componentConfig 中描述响应这些事件的各种组件，也就是 tableConfig 中各个按钮的 eventOption.comName 中指定的那些组件  

另外，上一篇中 tableConfig 与 tableOption 组合描述出了表格，searchConfig 与 searchOption 组合描述出了搜索栏，同理，每个动态组件也应该有对应的 Option 配置，表示相关字段在该动态组件中的表现，例如： 

```json
// 字段在不同动态 component 中的相关配置，前缀对应 componentConfig 中的键值，
// 如 componentConfig.createForm, 这里对应 createFormOption
// 字段在 createForm 中相关配置
createFormOption: {
    ...eleComponentOption, // 标准 el-component 配置
    comType: '', // 控件类型 input/select/input-number
    visible: true, // 是否展示 (true/false), 默认为 true
    disabled: false, // 是否禁用 (true/false), ，默认为 false
    default: '', // 默认值

    // comType === 'select' 时生效
    enumList: [], // 枚举列表
}
```

这样我们就描述出了动态组件的样子  

解析器中会解析这些配置实现动态组件的响应，schemaConfig.componentConfig 中声明的每个组件都会被封装好之后，在一个统一的模块中注册并导出，schema-view 根据按钮抛出的各种事件，在这个模块中找到对应的组件进行调用，就实现了动态组件的响应