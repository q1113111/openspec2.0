<template>
  <div class="flex h-screen overflow-hidden bg-tattoo-black">
    <AppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <AppHeader />
      <main class="flex-1 overflow-y-auto p-7 bg-tattoo-black">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppSidebar from './AppSidebar.vue'
  import AppHeader from './AppHeader.vue'
</script>
