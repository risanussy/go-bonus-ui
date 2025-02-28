<template>
  <div class="col-2 sidebar d-flex flex-column">
    <!-- Foto & Identitas -->
    <div
      class="w-50 mt-3 rounded overflow-hidden"
      style="margin: auto;"
    >
      <img
        src="@/assets/unindra.jpeg"
        class="w-100"
        style="transform: translateY(0px);"
        alt="User Image"
      />
    </div>
    <h6 class="text-center fw-bold mt-3">Nama Karyawan</h6>
    <!-- <small class="text-center d-block">16022025</small> -->
    <hr class="my-3" />

    <!-- Menu umum -->
    <div class="flex-grow-1">
      <router-link to="/dashboard/kondite" class="menu-link">
        <i class="bi bi-exclamation-circle me-2"></i> Kondite
      </router-link>

      <router-link to="/dashboard/kpi" class="menu-link">
        <i class="bi bi-card-checklist me-2"></i> KPI
      </router-link>

      <router-link to="/dashboard/kalibrasi" class="menu-link">
        <i class="bi bi-sliders me-2"></i> Kalibrasi
      </router-link>
      <hr class="text-white" />
      <small>Master</small>

      <router-link to="/dashboard/input-kpi" class="menu-link">
        <i class="bi bi-journal-plus me-2"></i> Input KPI
      </router-link>

      <router-link to="/dashboard/input-penilaian" class="menu-link">
        <i class="bi bi-pencil-square me-2"></i> Input Penilaian KPI
      </router-link>

      <!-- Bagian MASTER hanya tampil jika isAdmin = true -->
      <template v-if="isAdmin">
        <router-link to="/dashboard/kondite-input" class="menu-link">
          <i class="bi bi-archive-fill me-2"></i> Input Kondite
        </router-link>

        <router-link to="/dashboard/master-setting-kpi" class="menu-link">
          <i class="bi bi-gear-fill me-2"></i> Setting KPI
        </router-link>

        <router-link to="/dashboard/employee" class="menu-link">
          <i class="bi bi-people-fill me-2"></i> Data Karyawan
        </router-link>
      </template>
    </div>

    <button
      class="btn btn-outline-light w-100 mt-3"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// State penentu apakah user adalah admin
const isAdmin = ref(false)

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}

// Saat komponen di-mount, kita parse JWT untuk dapatkan role
onMounted(() => {
  checkRole()
})

function checkRole() {
  const token = localStorage.getItem('token')
  if (!token) {
    return
  }
  const role = parseRoleFromToken(token)
  if (role === 'admin') {
    isAdmin.value = true
  } else {
    isAdmin.value = false
  }
}

// Fungsi parse JWT (bagian payload) untuk dapatkan role
function parseRoleFromToken(token) {
  try {
    // Token JWT format: header.payload.signature
    // Kita ambil payload (index 1)
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    const obj = JSON.parse(jsonPayload)
    return obj.role // server menaruh "role" di claims
  } catch (err) {
    console.error('Gagal parse token:', err)
    return null
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #0d6efd; /* warna biru bootstrap */
  color: #fff;
  height: 100vh;
  padding: 20px;
}

.sidebar a {
  text-decoration: none;
  color: #fff;
  display: block;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 8px;
}

.sidebar a:hover,
.sidebar a.router-link-active {
  background-color: #084298;
}
</style>
