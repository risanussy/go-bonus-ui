<template>
    <div>
      <h3>Input Penilaian KPI</h3>
      <p>Masukkan pencapaian KPI oleh karyawan.</p>
      <form @submit.prevent="submitPenilaian">
        <div class="mb-3">
          <label class="form-label">Pilih Karyawan</label>
          <select class="form-select" v-model="selectedEmployee" required>
            <option value="">- Pilih -</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Pilih KPI</label>
          <select class="form-select" v-model="selectedKPI" required>
            <option value="">- Pilih -</option>
            <option v-for="kpi in kpis" :key="kpi.id" :value="kpi.id">{{ kpi.title }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Hasil Pencapaian</label>
          <input type="text" class="form-control" v-model="achievement" placeholder="Contoh: 80 Juta" required />
        </div>
        <button class="btn btn-primary" type="submit">Simpan Penilaian</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const employees = ref([])
  const kpis = ref([])
  const selectedEmployee = ref('')
  const selectedKPI = ref('')
  const achievement = ref('')
  
  onMounted(() => {
    loadEmployeesAndKPI()
  })
  
  async function loadEmployeesAndKPI() {
    try {
      const token = localStorage.getItem('token')
      const empRes = await axios.get('http://localhost:8080/api/employees', {
        headers: { Authorization: 'Bearer ' + token }
      })
      employees.value = empRes.data.data
      const kpiRes = await axios.get('http://localhost:8080/api/kpis', {
        headers: { Authorization: 'Bearer ' + token }
      })
      kpis.value = kpiRes.data.data
    } catch (err) {
      alert('Gagal memuat data karyawan / KPI')
    }
  }
  
  async function submitPenilaian() {
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8080/api/kpi_evaluations', {
        employee_id: parseInt(selectedEmployee.value),
        kpi_id: parseInt(selectedKPI.value),
        achievement: achievement.value
      }, {
        headers: { Authorization: 'Bearer ' + token }
      })
      alert('Penilaian KPI berhasil disimpan!')
      selectedEmployee.value = ''
      selectedKPI.value = ''
      achievement.value = ''
    } catch (err) {
      alert('Gagal menyimpan penilaian KPI')
    }
  }
  </script>
  