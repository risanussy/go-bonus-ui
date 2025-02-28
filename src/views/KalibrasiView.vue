<template>
  <div class="container my-4">
    <h3>Halaman Kalibrasi Karyawan</h3>
    <p>
      Menampilkan ringkasan KPI (Perusahaan, Departemen, Individu), 
      lalu dikurangi poin (kondite) dan ditambahkan penambah poin 
      (jika ada). Hasil akhirnya ditampilkan dalam kolom 
      <strong>KPI Setelah Kalibrasi</strong>, beserta bonus.
    </p>

    <button 
      class="btn btn-success mb-3"
      @click="loadKalibrasi"
    >
      Muat Data Kalibrasi
    </button>

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>Nama</th>
            <th>KPI Perusahaan</th>
            <th>KPI Depart</th>
            <th>KPI Individu</th>
            <th>Total KPI</th>
            <th>Pengurang Poin</th>
            <th>KPI Setelah Kalibrasi</th>
            <th>Keterangan Skala</th>
            <th>Bonus</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(item, index) in kalibrasiData" 
            :key="index"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.kpi_perusahaan }}</td>
            <td>{{ item.kpi_depart }}</td>
            <td>{{ item.kpi_individu }}</td>
            <td>{{ item.total_kpi }}</td>
            <td>{{ item.pengurang_poin }}</td>
            <td>{{ item.kpi_after_calibration }}</td>
            <td>{{ item.skala }}</td>
            <td>{{ item.bonus }}</td>
          </tr>
          <tr v-if="kalibrasiData.length === 0">
            <td colspan="9" class="text-center">Belum ada data kalibrasi</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import axios from 'axios'  // Jika ingin memanggil API sebenarnya

const kalibrasiData = ref([])

// Fungsi memuat data kalibrasi (contoh placeholder)
async function loadKalibrasi() {
  try {
    // const token = localStorage.getItem('token')
    // const res = await axios.get('http://localhost:8080/api/kalibrasi', {
    //   headers: { Authorization: 'Bearer ' + token }
    // })
    // kalibrasiData.value = res.data.data

    // Contoh data statis:
    kalibrasiData.value = [
      {
        name: 'Anggi',
        kpi_perusahaan: 0.3,
        kpi_depart: 1.2,
        kpi_individu: 0.8,
        total_kpi: 2.3,
        pengurang_poin: 0.1,
        kpi_after_calibration: 2.2,
        skala: 'Outstanding',
        bonus: 8000000
      },
      {
        name: 'Budi',
        kpi_perusahaan: 0.4,
        kpi_depart: 0.9,
        kpi_individu: 1.0,
        total_kpi: 2.3,
        pengurang_poin: 0.3,
        kpi_after_calibration: 2.0,
        skala: 'Good',
        bonus: 5000000
      }
    ]
  } catch (err) {
    alert('Gagal memuat data kalibrasi')
  }
}
</script>

<style scoped>
/* Opsional: styling tambahan */
</style>
