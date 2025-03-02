<template>
  <div class="container my-4">
    <h3>Input Penilaian KPI</h3>
    <p>Masukkan pencapaian KPI oleh karyawan.</p>

    <!-- FORM PENILAIAN -->
    <form @submit.prevent="submitPenilaian" class="border p-3 mb-4">
      <h5>Form Penilaian</h5>

      <!-- Pilih Karyawan -->
      <div class="mb-3">
        <label class="form-label">Pilih Karyawan</label>
        <select class="form-select" v-model="selectedEmployee" required>
          <option disabled value="">-- Pilih Karyawan --</option>
          <!-- Gunakan emp.id (lowercase) -->
          <option
            v-for="emp in employees"
            :key="emp.ID"
            :value="emp.ID"
          >
            {{ emp.name }}
          </option>
        </select>
      </div>

      <!-- Pilih KPI -->
      <div class="mb-3">
        <label class="form-label">Pilih KPI</label>
        <select class="form-select" v-model="selectedKPI" required>
          <option disabled value="">-- Pilih KPI --</option>
          <!-- Gunakan kpi.id (lowercase) -->
          <option
            v-for="kpi in kpis"
            :key="kpi.ID"
            :value="kpi.ID"
          >
            {{ kpi.title }}
          </option>
        </select>
      </div>

      <!-- Pilihan Hasil (dropdown) -->
      <div class="mb-3">
        <label class="form-label">Pilihan Hasil</label>
        <select class="form-select" v-model="selectedResult" required>
          <option disabled value="">-- Pilih Hasil --</option>
          <option
            v-for="(poin, label) in resultOptions"
            :key="label"
            :value="label"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <!-- Penambah Poin -->
      <div class="mb-3">
        <label class="form-label">Penambah Poin</label>
        <input
          type="number"
          class="form-control"
          v-model="additionalPoint"
          placeholder="Contoh: 0.25"
        />
      </div>

      <!-- Final Score (read-only) -->
      <div class="mb-3">
        <label class="form-label">Final Score</label>
        <input
          type="number"
          class="form-control"
          :value="finalScore"
          disabled
        />
      </div>

      <button class="btn btn-primary" type="submit">Simpan Penilaian</button>
    </form>

    <!-- TABEL DAFTAR PENILAIAN KPI -->
    <h5>Daftar Penilaian KPI</h5>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>KPI ID</th>
            <th>Achievement</th>
            <th>Point</th>
          </tr>
        </thead>
        <tbody>
          <!-- Gunakan evalu.id (lowercase) -->
          <tr v-for="evalu in evaluationList" :key="evalu.id">
            <td>{{ evalu.id }}</td>
            <td>{{ evalu.employee_id }}</td>
            <td>{{ evalu.kpi_id }}</td>
            <td>{{ evalu.achievement }}</td>
            <td>{{ evalu.point }}</td>
          </tr>
          <tr v-if="evaluationList.length === 0">
            <td colspan="5" class="text-center">Belum ada penilaian KPI</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// DAFTAR EMPLOYEE & KPI
const employees = ref([])
const kpis = ref([])

// STATE FORM
const selectedEmployee = ref('')
const selectedKPI = ref('')
const selectedResult = ref('')
const additionalPoint = ref(0)

// DAFTAR PENILAIAN KPI
const evaluationList = ref([])

// Mapping hasil => poin dasar
const resultOptions = {
  'poor 1': 1,
  'fair 2': 2,
  'good 3': 3,
  'outstanding 4': 4,
  'exceptional 5': 5
}

// finalScore = baseScore + additionalPoint
const finalScore = computed(() => {
  const base = resultOptions[selectedResult.value] || 0
  const add = parseFloat(additionalPoint.value) || 0
  return base + add
})

// onMounted => load data
onMounted(() => {
  loadEmployees()
  loadKPIs()
  loadEvaluations()
})

// AMBIL DATA EMPLOYEE
async function loadEmployees() {
  try {
    const res = await axios.get('http://localhost:8080/api/employees')
    employees.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat employees:', err)
    alert('Gagal memuat employees')
  }
}

// AMBIL DATA KPI
async function loadKPIs() {
  try {
    const res = await axios.get('http://localhost:8080/api/kpis')
    kpis.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat kpis:', err)
    alert('Gagal memuat kpis')
  }
}

// AMBIL DAFTAR PENILAIAN KPI
async function loadEvaluations() {
  try {
    const res = await axios.get('http://localhost:8080/api/kpi_evaluations')
    evaluationList.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat penilaian KPI:', err)
    alert('Gagal memuat penilaian KPI')
  }
}

// SUBMIT PENILAIAN KPI
async function submitPenilaian() {
  try {
    // Payload
    // Perhatikan: parseInt(selectedEmployee) -> integer
    // Pastikan JSON key "employee_id", "kpi_id" => sesuai backend
    const payload = {
      employee_id: parseInt(selectedEmployee.value),
      kpi_id: parseInt(selectedKPI.value),
      achievement: selectedResult.value,  // simpan teks aslinya (misal "poor 1")
      point: finalScore.value            // simpan angka final
    }

    // Kirim POST
    await axios.post('http://localhost:8080/api/kpi_evaluations', payload)

    alert('Penilaian KPI berhasil disimpan!')

    // Reset form
    selectedEmployee.value = ''
    selectedKPI.value = ''
    selectedResult.value = ''
    additionalPoint.value = 0

    // Reload daftar penilaian KPI
    loadEvaluations()
  } catch (err) {
    console.error('Gagal menyimpan penilaian KPI:', err)
    alert('Gagal menyimpan penilaian KPI')
  }
}
</script>

<style scoped>
/* Styling opsional */
</style>
