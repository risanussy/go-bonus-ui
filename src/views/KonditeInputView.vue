<template>
  <div>
    <h3>Input Kondite</h3>
    <p>Form untuk input data kondite (pengurang poin) karyawan.</p>

    <!-- Form Input Kondite -->
    <form @submit.prevent="submitKondite" class="border p-3 mb-4">
      <div class="mb-3">
        <label class="form-label">Nama Karyawan</label>
        <select class="form-select" v-model="selectedEmployee" required>
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

      <div class="mb-3">
        <label class="form-label">Kategori Kondite</label>
        <select class="form-select" v-model="selectedCategory" required>
          <option value="">- Pilih -</option>
          <option value="SP1">Surat Peringatan 1 (1.25)</option>
          <option value="SP2">Surat Peringatan 2 (1.5)</option>
          <option value="SP3">Surat Peringatan 3 (2)</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Masa Berlaku (Awal)</label>
        <input 
          type="date" 
          class="form-control" 
          v-model="startDate" 
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Masa Berlaku (Akhir)</label>
        <input 
          type="date" 
          class="form-control" 
          v-model="endDate" 
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Point Pengurangan</label>
        <input 
          type="number" 
          class="form-control" 
          v-model="point" 
          required
        />
      </div>

      <button class="btn btn-primary" type="submit">
        Simpan Kondite
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Daftar karyawan
const employees = ref([])

// State form
const selectedEmployee = ref('')
const selectedCategory = ref('')
const startDate = ref('')
const endDate = ref('')
const point = ref('')

onMounted(() => {
  loadEmployees()
})

// Ambil data karyawan (GET /api/employees)
async function loadEmployees() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/employees', {
      headers: { Authorization: 'Bearer ' + token }
    })
    // Asumsi { data: [ { ID, Name, Email, ... }, ... ] }
    employees.value = res.data.data
  } catch (err) {
    alert('Gagal memuat karyawan: ' + (err.response?.data?.error || err.message))
  }
}

// Simpan kondite (POST /api/kondites)
async function submitKondite() {
  try {
    const token = localStorage.getItem('token')
    const payload = {
      employee_id: parseInt(selectedEmployee.value),
      category: selectedCategory.value,
      start_date: startDate.value,
      end_date: endDate.value,
      min_point: point.value
      // description: "opsional"
    }
    await axios.post('http://localhost:8080/api/kondites', payload, {
      headers: { Authorization: 'Bearer ' + token }
    })
    alert('Kondite berhasil disimpan!')

    // Reset form
    selectedEmployee.value = ''
    selectedCategory.value = ''
    startDate.value = ''
    endDate.value = ''
    point.value = ''
  } catch (err) {
    alert('Gagal menyimpan kondite: ' + (err.response?.data?.error || err.message))
  }
}
</script>
