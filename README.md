# vanilla-life

> Size < 1kb

给 Element 添加关键的生命周期

## Install

```sh
$ npm install --save vanilla-life
```

## Use

为 Element 添加一次性的生命周期（触发即移除监听）

```js
import { onAppend, onRemove, onLazy } from "vanilla-life";

const out = document.createElement("div");

onRemove(out, () => console.log("out已从页面中移除"));
onEntry(out, () => console.log("out已从屏幕外面进入到屏幕中"));
onAppend(out, () => console.log("out已插入到页面中"));

// 注意以上生命周期都需要在元素在 append 之前声明
document.body.append(out);
```

## Tree

类似 JSX 的树型函数来创建 DOM 树

```js
import { tree, treeUpdate } from "vanilla-life";

tree(document.createElement("div"), {
  className: "contains",
	cssText:"width:100%; height:100%;"
	onclick:()=>{
   alert("hello")
	},
	append:[
		"Hello",
		tree(document.createElement("span"), {
			innerText:"world",
			cssText:"color:red;"
		}),
		tree(document.createElement("span"))
	]
});
```
