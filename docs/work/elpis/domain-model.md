# 基于 Vue3 完成领域模型架构建设  

对于我们程序员来说，管理后台、CRUD 这种重复性工作，或许是我们最不想做的，但是迫于业务需求又不得不做。那么我们是否能够通过某种方式来优化这个现状呢？

我们先来分析一下所面临的问题：  

首先，导致重复的原因是什么？  

**结构的重复**  
我们所遇到的管理系统，往往都是长这个样子：上面一个头部，左侧是系统 icon，中间有各种菜单（菜单可能直接对应一个模块，也可能当前菜单还有子菜单），头部右侧是登陆人员相关信息，以及各种操作按钮；当我们点击某个菜单后，中间的主体内容区域会根据菜单变化，展示不同的模块，模块可能是左侧有个侧边栏菜单，右侧区域才是模块内容，也可能直接就是展示模块内容。  

**模块内容的重复**  
在一个管理系统的某个模块内容中，往往是长这个样子：上方一个搜索栏，中间一个表格，表格右侧的操作列中有各种操作按钮（查看，编辑，删除等），点击操作按钮执行某些事件，可能是弹出一个弹窗或一个抽屉等。  

**相同领域的模块重复**  
对于相同领域的不同项目，往往具有公共的模块。例如对于电商领域，都需要商品管理、订单管理等模块；对于在线课程领域，都需要视频管理、用户管理等模块。  

以上这些重复的需求导致我们会进行很多重复的工作，有没有一种方式是可以将这些重复的内容沉淀下来呢？或许我们可以通过一种“语言”来描述出我们需要的管理系统，然后通过对应的一个引擎来将解析这份描述，生成一个管理系统。
> 这里的“语言”指的是 领域特定语言 DSL（Domain-Specific Language），不同于 Java, Js, Python 这种通用变成语言，而是专为某个领域或者问题设计的小型语言

或许我们可以这样来描述：
```json
{
    mode: 'dashboard', // 模板类型，不同模板类型对应不一样的模板数据结构
    name: '', // 名称
    desc: '', // 描述
    icon: '', // icon
    homePage: '', // 首页（项目配置）
    // 头部菜单
    menu: [
        {
            key: '',    // 菜单唯一描述
            name: '',   // 菜单名称
            menuType: '', // 菜单类型（枚举值：group - 菜单组 / module - 菜单项）

             // 当 moduleType === group 时，可填
            subMenu: [
                // 可递归 menuItem
                {},
                ...
            ],

            // 当 menuType === module 时，可填（枚举值：sider / iframe / custom / schema）
            moduleType: {},
            // 当 moduleType === sider 时
            siderConfig: {
                menu: [
                    // 可递归 menuItem（除 moduleType === sider）
                    {},
                    ...
                ]
            },
            // 当 moduleType === iframe 时
            iframeConfig: {
                path: '', // iframe 路径
            },
            // 当 moduleType === custom 时
            customConfig: {
                path: '', // 自定义路由路径
            },
            // 当 moduleType === schema 时
            schemaConfig: {
                api: '', // 数据源 api（遵循 RESTFUL 规范）
                schema: { // 板块数据结构
                    type: 'object',
                    properties: {
                        key: {
                            ...schema, // 标准 schema 配置
                            type: '', // 字段类型
                            label: '', // 字段中文名
                            // 字段在 table 中的相关配置
                            tableOption: {
                                ...elTableColumnOption, // 标准 el-table-column 配置
                                toFixed: 2, // 保留几位小数
                                visible: true, // 默认为 true (false时，表示不在表格中展示)
                            },
                            // 字段在 search-bar 中的相关配置
                            searchOption: {
                                ...eleComponentOption, // 标准 el-component 配置
                                comType: '', // 配置空间类型 input/select/ ...
                                default: '', // 默认值

                                // comType === 'select'
                                enumList: [], // 下拉框可选项

                                // comType === 'dynamicSelect'
                                api: ''
                            }
                        },
                        ...
                    },
                },
                // table 相关配置
                tableConfig: {
                    headerButtons: [
                        {
                            label: '', // 按钮中文名
                            eventKey: '', // 按钮事件名
                            eventOption: {}, // 按钮事件具体配置
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
                }, 
                searchConfig: {}, // search-bar 相关配置
                components: {}, // 模块组件
            },
        },
        ...
    ],
}
```
通过这种形式，我们就描述出了我们希望的管理系统长成什么样子。  

<!-- 需要注意的是，虽然同一领域中的各个项目具有公共的部分，但是也会有属于自己特定的部分，为了实现这种定制化能力，上面的这份描述需要分为两个维度：模型维度与项目维度，模型维度承载了某个领域的公共部分，而项目维度是在模型维度的基础上通过扩展（继承）或者覆盖（重写）的方式实现，这里实际上用到了面向对象的思想   -->

我们来看看上面三种重复是怎么体现在这份描述中的：
- 结构的重复：最外层 name 和 icon 组成了头部的左侧部分，menu 是头部的菜单部分
- 模块内容的重复：在 menu 中的每一项中，当 moduleType 为 schema 时，会对应有一份 schemaConfig 配置，这个配置实际上就是在描述我们管理系统最常见的模块：上方一个搜索栏，下方一个表格，其中的 schema 是在 json-schema 规范的基础上扩展而来的，描述了模块中涉及到的字段，以及该字段在搜索栏(searchOption)与表格(tableOption)中的表现形式，为什么这样就可以描述出一整个模块？因为知道了有哪些字段以及这些字段在搜索栏、表格，甚至是数据库中的表现形式，其实我们就已经能够知道这个管理模块的样子了，往往一个管理模块就是基于这些字段对于一份数据进行增删改查。另外值得注意的是，为什么我们只需要指定一个 api 就够了，而不是有四个分别用于增删改查的 api 呢？因为我们是遵循 Restful Api 规范的，这个 api 仅表示一份数据，我们会通过不同的 http 方法来对这份数据做增删改查 
- 相同领域的模块重复： menu 承载了该领域的通用模块

现在我们已经将重复性通过这份描述体现出来了，紧接着又迎来另一个问题：  

虽然同一领域中的各个项目具有公共的部分，但是也会有属于自己特定的部分，这部分定制化能力，应该怎么体现？

实际上，上面的这份描述需要分为两个维度：模型维度与项目维度，模型维度承载了某个领域的公共部分，而项目维度是在模型维度的基础上通过扩展（继承）或者覆盖（重写）的方式实现，这里实际上用到了面向对象的思想。也就是说，每一个最终的项目实际上是由两份这样的描述组成的（所属模型描述 + 项目自身描述），所以，对应上方三种重复，引出三种扩展：
- 结构的扩展：项目的 name 和 icon 可覆盖模型的
- 模块内容的扩展：如果 schema 已经无法描述出当前项目的某个模块，可以通过完全自定义页面（customConfig）或 iframe（iframeConfig）来承载定制化内容
- 模块的扩展：项目的 menuItem 可以覆盖模型中相同 key 的 menuItem，并可添加自己的 menuItem

综上，我们就以这样一种兼顾了重复性与扩展性的方式描述出了一个管理系统

有了这份描述，还需要实现一个对应的解析引擎，解析这份描述并生成一个系统，解析引擎基于 Vue3 + Element Plus 实现，整体实现思路：  

- 获取到模型描述和项目描述后，将两者进行整合：模型中存在而项目中不存在的属性，继承过来；模型中不存在而项目中存在的属性则保留；模型和项目都存在的相同属性，项目的覆盖模型的；menu 中的每个 menuItem 也以 key 为关键字遵循前述方式，这样就得到了一份最终的项目描述
- 基于项目描述，将其中的 icon, name, menu 渲染到头部，menu 中的每个 menuItem 描述决定了点击这个菜单后内容区域会展示的模块，当 menuItem 的 moduleType 为 schema 时，根据 schemaConfig 配置，动态渲染出管理模块的搜索栏和表格部分，搜索栏是基于 schemaConfig.schema.properties 每一项目的 searchOption 与 schemaConfig.searchConfig 生成出来的，searchOption 描述了该字段在搜索栏中的表现形式，例如它是一个 input 或 select，因此，还需要基于 Element Plus 的表单组件封装一个能够解析的 searchOption 的表单组件库，然后在一个统一的入口注册这些组件库并导出，解析引擎中会使用 Vue 中的动态组件 component 与 searchOption 的 comType 从这个统一入口中选择对应的表单控件并进行渲染，值得注意的是，searchOption 中支持配置所有 Element Plus 的组件属性，前面提到的封装的组件库会继承这些属性（通过 v-bind 实现），实现更高的定制化能力。同理，基于schemaConfig.schema.properties 每一项目的 tableOption 与 schemaConfig.tableConfig 可以生成出管理模块的表格部分
- schemaConfig.api 记录了操作管理模块数据的接口地址，对应接口需要遵循 Restful Api 规范，解析引擎会使用 GET, POST, PUT, DELETE 请求方式实现对应语义的数据操作 
