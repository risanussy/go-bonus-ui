<template>
  <div class="container my-4">
    <h3>Daftar Kalibrasi</h3>
    <p>Menampilkan data kalibrasi (KPI Perusahaan, Depart, Individu, dsb.)</p>

    <button class="btn btn-success mb-3" @click="loadKalibrasi">
      Muat Data Kalibrasi
    </button>

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>KPI Perusahaan</th>
            <th>KPI Depart</th>
            <th>KPI Individu</th>
            <th>Total KPI</th>
            <th>Pengurang Poin</th>
            <th>Penambah Poin</th>
            <th>KPI Setelah Kalibrasi</th>
            <th>Keterangan</th>
            <th>Gaji</th>
            <th>Bonus</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in kalibrasiData" :key="index">
            <td>{{ item.no }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.kpi_perusahaan }}</td>
            <td>{{ item.kpi_depart }}</td>
            <td>{{ item.kpi_individu }}</td>
            <td>{{ item.total_kpi }}</td>
            <td>{{ item.pengurang_poin }}</td>
            <td>{{ item.penambah_poin }}</td>
            <td>{{ item.kpi_setelah_kalibrasi }}</td>
            <td>{{ item.skala }}</td>
            <td>{{ formatCurrency(item.gaji) }}</td>
            <td>{{ formatCurrency(item.bonus) }}</td>
          </tr>
          <tr v-if="kalibrasiData.length === 0">
            <td colspan="12" class="text-center">Belum ada data kalibrasi</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// State menampung data kalibrasi
const kalibrasiData = ref([])

// Fungsi load data kalibrasi dari API
async function loadKalibrasi() {
  try {
    const token = localStorage.getItem('token') // Jika perlu JWT
    const res = await axios.get('http://localhost:8080/api/kalibrasi', {
      headers: { Authorization: 'Bearer ' + token }
    })
    kalibrasiData.value = res.data.data
  } catch (err) {
    alert('Gagal memuat data kalibrasi: ' + (err.response?.data?.error || err.message))
  }
}

// Fungsi format ke Rupiah
function formatCurrency(val) {
  if (!val) return '0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(val)
}
</script>

<style scoped>
/* Opsional styling */
</style>
