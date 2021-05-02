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

onAppend(out, () => console.log("out已插入到页面中"));
onEntey(out, () => console.log("out已进入到屏幕之中"));
onRemove(out, () => console.log("out已从页面中移除"));

document.body.append(out);
```
