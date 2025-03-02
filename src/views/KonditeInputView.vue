<template>
  <div class="container my-4">
    <h3>Halaman Kondite</h3>
    <p>Tambahkan kondite (pengurang poin) dan lihat daftar kondite karyawan.</p>

    <!-- FORM INPUT KONDISI (KONDITE) -->
    <div class="mb-4">
      <h5>Tambah Kondite</h5>
      <form @submit.prevent="addKondite">
        <!-- Pilih Karyawan -->
        <div class="mb-3">
          <label class="form-label">Nama Karyawan</label>
          <select v-model="selectedEmployee" class="form-select" required>
            <option disabled value="">-- Pilih Karyawan --</option>
            <option v-for="emp in employees" :key="emp.ID" :value="emp.ID">
              {{ emp.name }}
            </option>
          </select>
        </div>

        <!-- Pilih Kategori -->
        <div class="mb-3">
          <label class="form-label">Kategori</label>
          <select v-model="selectedCategory" class="form-select" required>
            <option disabled value="">-- Pilih Kategori --</option>
            <!-- Looping kategori dari categoryOptions -->
            <option
              v-for="(pointVal, catName) in categoryOptions"
              :key="catName"
              :value="catName"
            >
              {{ catName }}
            </option>
          </select>
        </div>

        <!-- Input Poin Pengurang (disabled, otomatis) -->
        <div class="mb-3">
          <label class="form-label">Poin Pengurang</label>
          <input
            type="number"
            class="form-control"
            v-model="point"
            disabled
          />
        </div>

        <!-- Tanggal Mulai -->
        <div class="mb-3">
          <label class="form-label">Start Date</label>
          <input
            type="date"
            class="form-control"
            v-model="startDate"
            required
          />
        </div>

        <!-- Tanggal Berakhir -->
        <div class="mb-3">
          <label class="form-label">End Date</label>
          <input
            type="date"
            class="form-control"
            v-model="endDate"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary">Simpan</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// ----- STATE UTAMA -----
const employees = ref([])       // Daftar karyawan
const konditeList = ref([])     // Daftar kondite

// Data user (opsional, jika ingin filter data per user):
const userRole = ref('')
const userId = ref('')

// ----- FORM STATE -----
const selectedEmployee = ref('')
const selectedCategory = ref('')
const point = ref(0)
const startDate = ref('')
const endDate = ref('')

// Mapping kategori -> default poin pengurang
const categoryOptions = {
  'Surat Peringatan 1 (Pertama)': 1.25,
  'Surat Peringatan 2 (Kedua)': 1.5,
  'Surat Peringatan 3 (Ketiga)': 2,
  'Surat Peringatan Pertama & Terakhir': 2
}

// ----- LIFECYCLE -----
onMounted(() => {
  parseToken()         // (opsional) untuk role-based filter
  loadEmployees()      // load data karyawan
  loadKonditeList()    // load data kondite
})

// ----- FUNGSI -----
function parseToken() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    // JWT -> header.payload.signature, ambil payload (index 1)
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
    userRole.value = payload.role      // 'admin' atau lainnya
    userId.value = payload.employee_id // ID user
  } catch (err) {
    console.error('Gagal parse token:', err)
  }
}

async function loadEmployees() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/employees', {
      headers: { Authorization: 'Bearer ' + token }
    })
    employees.value = res.data.data
  } catch (err) {
    alert('Gagal memuat data karyawan: ' + (err.response?.data?.error || err.message))
  }
}

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

// Tambah data kondite
async function addKondite() {
  try {
    const token = localStorage.getItem('token')
    const payload = {
      employee_id: selectedEmployee.value,
      category: selectedCategory.value,
      start_date: startDate.value,
      end_date: endDate.value,
      min_point: point.value
    }

    await axios.post('http://localhost:8080/api/kondites', payload, {
      headers: { Authorization: 'Bearer ' + token }
    })

    alert('Kondite berhasil ditambahkan!')

    // Reset form
    selectedEmployee.value = ''
    selectedCategory.value = ''
    point.value = 0
    startDate.value = ''
    endDate.value = ''
  } catch (err) {
    alert('Gagal menambah kondite: ' + (err.response?.data?.error || err.message))
  }
}

// ----- WATCH & COMPUTED -----

// Watch perubahan kategori => otomatis isi point
watch(selectedCategory, (newVal) => {
  if (newVal && categoryOptions[newVal]) {
    point.value = categoryOptions[newVal]
  } else {
    point.value = 0
  }
})
</script>

<style scoped>
/* Styling opsional */
</style>
