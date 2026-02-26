<script setup>
import NorthwestHeader from './components/NorthwestHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <NorthwestHeader />
    <RouterView />
  </div>
</template>