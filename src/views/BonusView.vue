<template>
    <div>
      <h3>Halaman Bonus</h3>
      <p>Di sini Anda dapat melihat akumulasi bonus (skor KPI dsb.).</p>
      <button class="btn btn-success mb-3" @click="exportExcel">Export Excel</button>
      <button class="btn btn-primary mb-3" @click="calculateBonus">Hitung Bonus</button>
  
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>No</th>
              <th>Employee ID</th>
              <th>Nama</th>
              <th>Tahun</th>
              <th>Total Score</th>
              <th>Bonus</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in bonusData" :key="item.employee_id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.employee_id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ currentYear }}</td>
              <td>{{ item.total_score }}</td>
              <td>{{ item.bonus }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  import { ref } from 'vue'
  
  const bonusData = ref([])
  const currentYear = new Date().getFullYear()
  
  async function calculateBonus() {
    try {
      const token = localStorage.getItem('token')
      const payload = { criteria_weights: { KPI: 1 } }
      const res = await axios.post('http://localhost:8080/api/bonus/calculate', payload, {
        headers: { Authorization: 'Bearer ' + token }
      })
      bonusData.value = res.data.data
    } catch (err) {
      console.error(err)
      alert('Gagal menghitung bonus')
    }
  }
  
  function exportExcel() {
    alert('Fitur export Excel belum diimplementasikan.')
  }
  </script>
  