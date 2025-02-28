<template>
  <div class="container my-4">
    <h3>Halaman Kondite</h3>
    <p>
      Tambahkan kondite (pengurang poin) dan lihat daftar kondite karyawan.
    </p>

    <!-- Form Input Kondite -->
    <div class="border p-3 mb-4">
      <h5>Input Kondite</h5>
      <form @submit.prevent="createKondite">
        <!-- Jika admin, bisa input employee_id manual (atau dropdown) -->
        <div class="mb-3" v-if="role === 'admin'">
          <label class="form-label">Employee ID</label>
          <input 
            type="number" 
            class="form-control" 
            v-model="newKondite.employee_id"
            placeholder="Misal: 2"
            required
          />
        </div>
        <!-- Jika bukan admin, employee_id diambil dari token (hidden) -->
        <input 
          v-else 
          type="hidden" 
          :value="newKondite.employee_id"
        />

        <div class="mb-3">
          <label class="form-label">Kategori</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="newKondite.category"
            placeholder="Misal: SP1, SP2, dll."
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Start Date</label>
          <input 
            type="date" 
            class="form-control" 
            v-model="newKondite.start_date"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">End Date</label>
          <input 
            type="date" 
            class="form-control" 
            v-model="newKondite.end_date"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Poin Pengurang</label>
          <input 
            type="number"
            class="form-control"
            v-model="newKondite.point"
            placeholder="Misal: 5"
            required
          />
        </div>

        <button class="btn btn-primary" type="submit">
          Tambah Kondite
        </button>
      </form>
    </div>

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
          <tr v-for="item in konditeList" :key="item.ID">
            <td>{{ item.ID }}</td>
            <td>{{ item.employee?.name || '(No Name)' }}</td>
            <td>{{ item.category }}</td>
            <td>{{ formatDate(item.start_date) }}</td>
            <td>{{ formatDate(item.end_date) }}</td>
            <td>{{ item.min_point }}</td>
          </tr>
          <tr v-if="konditeList.length === 0">
            <td colspan="6" class="text-center">Belum ada data kondite</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State
const konditeList = ref([])
const newKondite = ref({
  employee_id: '', // diisi admin, atau di-set otomatis jika user biasa
  category: '',
  start_date: '',
  end_date: '',
  point: ''
})

const role = ref(null)
const myEmployeeId = ref(null)

// onMounted => load data + parse token
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Token tidak ada, silakan login.')
    return
  }
  role.value = parseRoleFromToken(token)
  myEmployeeId.value = parseEmployeeIdFromToken(token)

  // Jika user biasa => set employee_id default
  if (role.value !== 'admin') {
    newKondite.value.employee_id = myEmployeeId.value
  }

  loadKonditeList()
})

// Ambil semua data kondite, filter sesuai role
async function loadKonditeList() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const res = await axios.get('http://localhost:8080/api/kondites', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const allKondites = res.data.data // array data kondite

    if (role.value === 'admin') {
      // Admin => semua data
      konditeList.value = allKondites
    } else {
      // User biasa => hanya data milik employee_id
      konditeList.value = allKondites.filter(item => {
        return item.employee_id === Number(myEmployeeId.value)
      })
    }
  } catch (err) {
    alert('Gagal memuat data kondite: ' + (err.response?.data?.error || err.message))
  }
}

// Buat kondite baru
async function createKondite() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    // Payload sesuai field di backend
    const payload = {
      employee_id: Number(newKondite.value.employee_id),
      category: newKondite.value.category,
      start_date: newKondite.value.start_date,
      end_date: newKondite.value.end_date,
      min_point: Number(newKondite.value.point)
    }

    await axios.post('http://localhost:8080/api/kondites', payload, {
      headers: { Authorization: 'Bearer ' + token }
    })
    alert('Kondite berhasil ditambahkan!')

    // Reset form
    newKondite.value = {
      employee_id: role.value === 'admin' ? '' : myEmployeeId.value,
      category: '',
      start_date: '',
      end_date: '',
      point: ''
    }

    // Reload data
    loadKonditeList()
  } catch (err) {
    alert('Gagal menambah kondite: ' + (err.response?.data?.error || err.message))
  }
}

// Format tanggal (opsional)
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  // yyyy-mm-dd
  return d.toISOString().split('T')[0]
}

// Parse role dari token (JWT)
function parseRoleFromToken(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const obj = JSON.parse(jsonPayload)
    return obj.role || null
  } catch (err) {
    console.error('Gagal parse role:', err)
    return null
  }
}

// Parse employee_id dari token (JWT)
function parseEmployeeIdFromToken(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const obj = JSON.parse(jsonPayload)
    return obj.employee_id ? parseInt(obj.employee_id) : null
  } catch (err) {
    console.error('Gagal parse employee_id:', err)
    return null
  }
}
</script>

<style scoped>
/* Opsional styling tambahan */
</style>
