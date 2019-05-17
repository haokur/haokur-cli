> wflow , web flow ; 将日常开发繁琐的工作用工具替代

### 1.运行

-   源代码安装运行

> 未发布 npm 包,仅支持本地安装.

1.1 下载源码

```
git clone https://github.com/haokur/webflow-cli.git --depth 1
```

1.2 安装本地的全局

```
npm install . -g
```

1.3 创建软链接,支持本地代码修改

```
npm link
```

-   npm 全局安装运行

```shell
# 安装
npm i webflow-cli -g

# 测试
wflow ip
```

### 2.初步构想

2.1 实现功能

-   [ ] 三大前端框架起始项目生成
-   [ ] 自动生成模板

### 3.基本使用

-   `wflow static` 实现静态站点支持 typescript 转 js, scss 转 css.
-   `wflow ip` 查看当前电脑 IP 地址
-   `wflow init` 初始化项目
-   `wflow kill` 杀进程
-   `wflow tree` 文件夹文件树打印查看
-   `wflow g` 生成项目文件

#### `wflow g` 生成项目文件

> g , generate

1. 配置文件示例:

```javascript
const path = require('path');
const sourcePath = path.join(__dirname, 'src');

module.exports = {
    g: {
        getWillCreateDir(order, createName) {
            if (order === 'page') {
                return `${sourcePath}/${order}s/${createName}`;
            } else if (order === 'component') {
                return `${sourcePath}/${order}s`;
            }
        },
        orders: {
            page: {
                source: {
                    page: 'tpl/page.tpl.vue',
                    style: 'tpl/style.tpl.scss',
                },
                target: {
                    page: '{{createName}}.vue',
                    style: '{{createName}}.scss',
                },
            },
            component: {
                source: {
                    component: 'tpl/cpt.tpl.vue',
                },
                target: {
                    component: 'src/{{order}}/{{createName}}.vue',
                },
            },
        },
    },
};
```

2. 需要根据配置在项目下新建一个 `tpl` 文件夹

```shell
tpl/
|   |   ├── cpt.tpl.vue
|   |   ├── page.tpl.vue
|   |   └── style.tpl.scss
```

3. 在项目根目录可运行命令

```shell
# 创建page
wflow g page hello hello2

# 创建component
wflow g component CommonComponent
```
