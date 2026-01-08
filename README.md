# large-image-renderer

High-performance Large-image Rendering Solution, Compatible with Chromium/Non-Chromium Browsers.

高性能大图渲染解决方案，适配 Chromium / 非 Chromium 浏览器

[![release](https://badgen.net/github/release/cnguu/large-image-renderer)](https://github.com/cnguu/large-image-renderer/releases)
[![license](https://badgen.net/github/license/cnguu/large-image-renderer)](https://github.com/cnguu/large-image-renderer/blob/main/LICENSE)

## 安装

```shell
pnpm i -D @cnguu/large-image-renderer
```

## 使用

```vue
// index.vue
<script setup lang="ts">
import { largeImageRenderer } from '@cnguu/large-image-renderer'
import { onMounted } from 'vue'

onMounted(() => {
  largeImageRenderer({
    imageUrl: 'https://cdn.jsdelivr.net/gh/cnguu/large-image-renderer@main/packages/playground/src/public/eso1208a.png',
    canvas: 'test',
  })
})
</script>

<template>
  <div class="container">
    <canvas id="test" width="100%" height="100%" />
  </div>
</template>

<style scoped>
.container {
  width: 200px;
  height: 200px;
}
</style>
```

## 参数

[DrawBigImageOptions](https://github.com/cnguu/large-image-renderer/blob/main/packages/core/src/types.ts#L17-L67)
