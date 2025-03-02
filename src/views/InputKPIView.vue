<template>
  <div class="container my-4">
    <h3>Manage KPI</h3>
    <p>
      Form ini memungkinkan Anda menambahkan KPI baru dan melihat daftar KPI yang sudah ada.
    </p>

    <!-- Form Tambah KPI -->
    <form @submit.prevent="submitKPI" class="border p-3 mb-4">
      <h5>Form Tambah KPI</h5>

      <!-- Title KPI -->
      <div class="mb-3">
        <label class="form-label">Judul KPI</label>
        <input
          type="text"
          class="form-control"
          v-model="title"
          placeholder="Contoh: KPI Penjualan"
          required
        />
      </div>

      <!-- Kategori -->
      <div class="mb-3">
        <label class="form-label">Kategori</label>
        <input
          type="text"
          class="form-control"
          v-model="category"
          placeholder="Contoh: Perusahaan, Dept, Individu"
          required
        />
      </div>

      <!-- Pilih Karyawan (admin) atau user sendiri (non-admin) -->
      <div class="mb-3" v-if="isAdmin">
        <label class="form-label">Pilih Karyawan (Employee ID)</label>
        <select class="form-select" v-model="selectedEmployeeID" required>
          <option value="">-- Pilih Karyawan --</option>
          <option
            v-for="emp in employees"
            :key="emp.id"
            :value="emp.id"
          >
            {{ emp.name }}
          </option>
        </select>
      </div>
      <div class="mb-3" v-else>
        <label class="form-label">Karyawan</label>
        <!-- Tampilkan nama user, disable agar tidak bisa diubah -->
        <input
          type="text"
          class="form-control"
          :value="userName"
          disabled
        />
      </div>

      <!-- Weight & Target -->
      <div class="mb-3">
        <label class="form-label">Bobot (%)</label>
        <input
          type="number"
          class="form-control"
          v-model="weight"
          placeholder="Contoh: 20"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Target</label>
        <input
          type="text"
          class="form-control"
          v-model="target"
          placeholder="Contoh: 100 Juta"
          required
        />
      </div>

      <!-- Skala Penilaian -->
      <div class="row">
        <div class="col mb-3">
          <label class="form-label">Poor</label>
          <input
            type="text"
            class="form-control"
            v-model="poor"
            placeholder="Contoh: poor 1"
          />
        </div>
        <div class="col mb-3">
          <label class="form-label">Fair</label>
          <input
            type="text"
            class="form-control"
            v-model="fair"
            placeholder="Contoh: fair 2"
          />
        </div>
        <div class="col mb-3">
          <label class="form-label">Good</label>
          <input
            type="text"
            class="form-control"
            v-model="good"
            placeholder="Contoh: good 3"
          />
        </div>
        <div class="col mb-3">
          <label class="form-label">Outstanding</label>
          <input
            type="text"
            class="form-control"
            v-model="outstanding"
            placeholder="Contoh: outstanding 4"
          />
        </div>
        <div class="col mb-3">
          <label class="form-label">Exceptional</label>
          <input
            type="text"
            class="form-control"
            v-model="exceptional"
            placeholder="Contoh: exceptional 5"
          />
        </div>
      </div>

      <button class="btn btn-primary" type="submit">Simpan KPI</button>
    </form>

    <!-- Tabel KPI -->
    <h5>Daftar KPI</h5>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Target</th>
            <th>Poor</th>
            <th>Fair</th>
            <th>Good</th>
            <th>Outstanding</th>
            <th>Exceptional</th>
          </tr>
        </thead>
        <tbody>
          <!-- Gunakan filteredKPIList untuk v-for -->
          <tr v-for="item in filteredKPIList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.employee_id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.weight }}%</td>
            <td>{{ item.target }}</td>
            <td>{{ item.poor }}</td>
            <td>{{ item.fair }}</td>
            <td>{{ item.good }}</td>
            <td>{{ item.outstanding }}</td>
            <td>{{ item.exceptional }}</td>
          </tr>
          <tr v-if="filteredKPIList.length === 0">
            <td colspan="11" class="text-center">Belum ada data KPI</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// State penentu admin / user
const isAdmin = ref(false)
const userId = ref(null)
const userName = ref('')

// Daftar employees
const employees = ref([])

// Daftar KPI (semua data, lalu difilter di computed)
const kpiList = ref([])

// State form KPI
const title = ref('')
const category = ref('')
const weight = ref('')
const target = ref('')
const poor = ref('')
const fair = ref('')
const good = ref('')
const outstanding = ref('')
const exceptional = ref('')
const selectedEmployeeID = ref('')

// onMounted => cek role, load data
onMounted(() => {
  checkRole()
  if (isAdmin.value) {
    loadEmployees() // admin => load semua employees
  }
  loadKPI()
})

// Fungsi ambil role & user info dari localStorage
function checkRole() {
  const role = localStorage.getItem('role') // 'admin' atau 'user'
  if (role === 'admin') {
    isAdmin.value = true
  }
  const uid = localStorage.getItem('employee_id')
  if (uid) {
    userId.value = parseInt(uid)
  }
  const uname = localStorage.getItem('name')
  if (uname) {
    userName.value = uname
  }
}

// Ambil daftar employees
async function loadEmployees() {
  try {
    const res = await axios.get('http://localhost:8080/api/employees')
    employees.value = res.data.data
  } catch (err) {
    console.error('Gagal load employees:', err)
  }
}

// Ambil daftar KPI (semua, nanti difilter di computed)
async function loadKPI() {
  try {
    const res = await axios.get('http://localhost:8080/api/kpis')
    kpiList.value = res.data.data
  } catch (err) {
    console.error('Gagal load KPI:', err)
  }
}

// computed => filter KPI
const filteredKPIList = computed(() => {
  if (isAdmin.value) {
    return kpiList.value
  } else {
    // user => hanya KPI miliknya
    return kpiList.value.filter(item => item.employee_id === userId.value)
  }
})

// Submit form => simpan KPI baru
async function submitKPI() {
  try {
    // Jika admin => ambil dari selectedEmployeeID, jika user => userId
    const empID = isAdmin.value
      ? parseInt(selectedEmployeeID.value)
      : userId.value

    // Buat payload
    const payload = {
      title: title.value,
      category: category.value,
      weight: parseFloat(weight.value),
      target: target.value,
      poor: poor.value,
      fair: fair.value,
      good: good.value,
      outstanding: outstanding.value,
      exceptional: exceptional.value,
      score: 0,
      validated: false,
      employee_id: empID
    }

    // Kirim POST ke backend
    await axios.post('http://localhost:8080/api/kpis', payload)

    alert('KPI berhasil disimpan!')

    // Reset form
    title.value = ''
    category.value = ''
    weight.value = ''
    target.value = ''
    poor.value = ''
    fair.value = ''
    good.value = ''
    outstanding.value = ''
    exceptional.value = ''
    selectedEmployeeID.value = ''

    // Reload tabel KPI
    loadKPI()
  } catch (err) {
    console.error('Gagal membuat KPI:', err)
    alert('Gagal menyimpan KPI.')
  }
}
</script>

<style scoped>
/* Opsional styling tambahan */
</style>
