<template>
  <div class="container my-4">
    <h3>Halaman Kondite</h3>
    <p>Tambahkan kondite (pengurang poin) dan lihat daftar kondite karyawan.</p>

    <!-- Form Input Kondite -->
    <div class="border p-3 mb-4">
      <h5>Input Kondite</h5>
      <form @submit.prevent="createKondite">
        <!-- Dropdown Nama Karyawan -->
        <div class="mb-3">
          <label class="form-label">Nama Karyawan</label>
          <select 
            class="form-select" 
            v-model="newKondite.employee_id"
            required
          >
            <option value="">- Pilih -</option>
            <option 
              v-for="emp in employees" 
              :key="emp.ID" 
              :value="emp.ID"
            >
              {{ emp.name }}
            </option>
          </select>
        </div>

        <!-- Dropdown Kategori SP -->
        <div class="mb-3">
          <label class="form-label">Kategori SP</label>
          <select 
            class="form-select" 
            v-model="newKondite.category"
            required
          >
            <option value="">- Pilih -</option>
            <option 
              v-for="cat in categories" 
              :key="cat" 
              :value="cat"
            >
              {{ cat }}
            </option>
          </select>
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
            placeholder="Misal: 1.25"
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

// Daftar karyawan & kategori
const employees = ref([])
const categories = ref(['SP1', 'SP2', 'SP3'])

// State form kondite
const newKondite = ref({
  employee_id: '',
  category: '',
  start_date: '',
  end_date: '',
  point: ''
})

// Daftar kondite
const konditeList = ref([])

// onMounted => load employees & kondite
onMounted(() => {
  loadEmployees()
  loadKonditeList()
})

// Ambil data employees => untuk dropdown
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

// Ambil semua data kondite
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

// Simpan kondite baru
async function createKondite() {
  try {
    const token = localStorage.getItem('token')
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
      employee_id: '',
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
  return d.toISOString().split('T')[0]
}
</script>

<style scoped>
/* Opsional styling tambahan */
</style>
