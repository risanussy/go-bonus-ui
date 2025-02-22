<template>
    <div>
      <h3>Kalibrasi</h3>
      <p>Menampilkan nilai akhir (KPI) yang sudah ditambah penambah poin & dikurangi kondite.</p>
      <button class="btn btn-success mb-3" @click="loadKalibrasi">Muat Data Kalibrasi</button>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>ID Karyawan</th>
              <th>Nama</th>
              <th>KPI Score</th>
              <th>Pengurang Poin</th>
              <th>Penambah Poin</th>
              <th>Hasil Kalibrasi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in kalibrasiData" :key="item.id">
              <td>{{ item.employee_id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.kpi_score }}</td>
              <td>{{ item.pengurang || '-' }}</td>
              <td>{{ item.penambah || '-' }}</td>
              <td>{{ item.kalibrasi }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
//   import axios from 'axios'
  
  const kalibrasiData = ref([])
  
  async function loadKalibrasi() {
    try {
    //   const token = localStorage.getItem('token')
      // Contoh placeholder data – sesuaikan dengan API Anda
      kalibrasiData.value = [
        { id: 1, employee_id: 'E001', name: 'Persone One', kpi_score: 80, pengurang: '1.25 (SP1)', penambah: '0.25 (BOD)', kalibrasi: 78.5 }
      ]
    } catch (err) {
      alert('Gagal memuat data kalibrasi')
    }
  }
  </script>
  