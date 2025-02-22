<template>
  <div>
    <h3>Kondite</h3>
    <p>Form untuk input data kondite (pengurang poin) karyawan.</p>
    <form @submit.prevent="submitKondite">
      <div class="mb-3">
        <label class="form-label">Nama Karyawan</label>
        <select class="form-select" v-model="selectedEmployee" required>
          <option value="">- Pilih -</option>
          <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
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
        <input type="date" class="form-control" v-model="startDate" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Masa Berlaku (Akhir)</label>
        <input type="date" class="form-control" v-model="endDate" required />
      </div>
      <button class="btn btn-primary" type="submit">Simpan Kondite</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const konditeList = ref([])
const employees = ref([])
const selectedEmployee = ref('')
const selectedCategory = ref('')
const startDate = ref('')
const endDate = ref('')

onMounted(() => {
  loadEmployees()
  loadKonditeList()
})

async function loadEmployees() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/employees', {
      headers: { Authorization: 'Bearer ' + token }
    })
    employees.value = res.data.data
  } catch (err) {
    alert('Gagal memuat karyawan')
  }
}

async function loadKonditeList() {
  // Placeholder: data kondite dari API
  konditeList.value = [
    { id: 1, employeeName: 'Persone One', category: 'SP1', period: '2025-01 s/d 2025-02' }
  ]
}

function submitKondite() {
  alert('Simpan kondite (placeholder).')
}
</script>
