<script setup>
import logo from '@/assets/logo.png'
</script>

<template>
  <header class="nw-header" aria-label="Northwest University Header">
    <div class="nw-header-inner">
      <div class="nw-brand">
        <div class="nw-brand-mark" aria-hidden="true">
          <img :src="logo" alt="Northwest Logo" />
        </div>
      </div>

      <nav class="nw-nav" aria-label="Header navigation">
        <!-- <a href="#">Textbooks</a>
        <a href="#">Support</a>
        <a href="#">Northwest Home</a> -->
      </nav>
    </div>
  </header>
</template>
