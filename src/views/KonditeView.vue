<template>
  <div class="container my-4">
    <h3>Halaman Kondite</h3>
    <p>Tambahkan kondite (pengurang poin) dan lihat daftar kondite karyawan.</p>

    <!-- Tabel Kondite -->
    <h5>Data Kondite</h5>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nama Karyawan</th>
            <th>Kategori</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Poin Pengurang</th>
          </tr>
        </thead>
        <tbody>
          <!-- Gunakan filteredKonditeList untuk v-for -->
          <tr v-for="item in filteredKonditeList" :key="item.ID">
            <td>{{ item.ID }}</td>
            <td>{{ item.employee?.name || '(No Name)' }}</td>
            <td>{{ item.category }}</td>
            <td>{{ formatDate(item.start_date) }}</td>
            <td>{{ formatDate(item.end_date) }}</td>
            <td>{{ item.min_point }}</td>
          </tr>
          <tr v-if="filteredKonditeList.length === 0">
            <td colspan="6" class="text-center">Belum ada data kondite</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// State utama
const konditeList = ref([])

// Data user: role & employee_id dari token
const userRole = ref('')
const userId = ref('')

// onMounted: ambil token, decode, lalu load data
onMounted(() => {
  parseToken()
  loadKonditeList()
})

// 1) Parse token untuk dapatkan userRole & userId
function parseToken() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    // JWT -> header.payload.signature, ambil payload
    const base64Url = token.split('.')[1]
    if (!base64Url) return

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    const payload = JSON.parse(jsonPayload)
    userRole.value = payload.role // 'admin' atau lainnya
    userId.value = payload.employee_id
  } catch (err) {
    console.error('Gagal parse token:', err)
  }
}

// 2) Ambil semua data kondite dari backend (tanpa filter)
async function loadKonditeList() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/kondites', {
      headers: { Authorization: 'Bearer ' + token }
    })
    konditeList.value = res.data.data
  } catch (err) {
    alert('Gagal memuat data kondite: ' + (err.response?.data?.error || err.message))
  }
}

// 3) Filtering manual di frontend via computed
const filteredKonditeList = computed(() => {
  // Jika admin, tampilkan semua data
  if (userRole.value === 'admin') {
    return konditeList.value
  } else {
    // Bukan admin => tampilkan hanya data milik user
    // Pastikan struktur data di 'konditeList' menyesuaikan (cek apakah ID karyawan di item.employee?.ID atau item.employee_id)
    return konditeList.value.filter(item => item.employee?.ID === userId.value)
  }
})

// Helper untuk format tanggal (opsional)
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toISOString().split('T')[0]
}
</script>

<style scoped>
/* Styling opsional */
</style>
