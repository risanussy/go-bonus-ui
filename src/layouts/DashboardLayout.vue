<template>
  <div class="row g-0">
    <!-- SIDEBAR -->
    <SidebarRoot />

    <!-- CONTENT AREA -->
    <div class="col-10 content-area">
      <!-- Tempat menampilkan child-route (mis. BonusView, dsb.) -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import SidebarRoot from '@/components/SidebarRoot.vue'
</script>

<style scoped>
.content-area {
  background-color: #f8f9fa;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}
</style>
