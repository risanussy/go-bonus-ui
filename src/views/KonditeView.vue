<template>
    <div>
      <h3>Kondite</h3>
      <p>Data kondite karyawan.</p>
      <h5>List Kondite</h5>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Karyawan</th>
              <th>Kategori</th>
              <th>Periode</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in konditeList" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.employeeName }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.period }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const konditeList = ref([])
  const employees = ref([])
//   const selectedEmployee = ref('')
//   const selectedCategory = ref('')
//   const startDate = ref('')
//   const endDate = ref('')
  
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
  </script>
  