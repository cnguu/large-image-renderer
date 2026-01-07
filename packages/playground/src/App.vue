<script setup lang="ts">
import { largeImageRenderer } from '@cnguu/large-image-renderer'
import { onMounted } from 'vue'

const canvasId = 'test'

onMounted(() => {
  largeImageRenderer({
    // imageUrl: '/eso1208a.png',
    imageUrl: 'https://cdn.jsdelivr.net/gh/cnguu/large-image-renderer@main/packages/playground/src/public/eso1208a.png',
    canvas: canvasId,
  })
})
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <div class="container">
    <canvas :id="canvasId" width="100%" height="100%" />
  </div>
</template>

<style scoped>
.container {
  width: 200px;
  height: 200px;
}
</style>
