<template>
  <div class="container my-4">
    <h3 class="text-center">Laporan Bonus Tahunan Jakarta Eye Center</h3>
    <p>Menampilkan data bonus berdasarkan hasil kalibrasi.</p>

    <!-- Tabel Laporan Bonus -->
    <table class="table table-bordered mt-4">
      <thead class="table-light">
        <tr>
          <th>No</th>
          <th>Nama Karyawan</th>
          <th>Penilaian KPI</th>
          <th>Bonus Diterima</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in kalibrasiData" :key="index">
          <td>{{ item.no }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.skala }}</td>
          <td>{{ formatCurrency(item.bonus) }}</td>
        </tr>
        <tr v-if="kalibrasiData.length === 0">
          <td colspan="4" class="text-center">Belum ada data bonus</td>
        </tr>
      </tbody>
    </table>

    <!-- Bagian Tanda Tangan -->
    <div class="mt-5" style="text-align: right;">
      <p>Jakarta, 20 Desember 2024</p>
      <br /><br />
      <p style="margin-bottom: 0;">Djoko Pribado, S.Sos</p>
      <small>Kepala Divisi HC & GA</small>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State untuk menampung data kalibrasi (no, name, skala, bonus, dsb.)
const kalibrasiData = ref([])

// onMounted => load data kalibrasi
onMounted(() => {
  loadKalibrasi()
})

async function loadKalibrasi() {
  try {
    // Jika butuh token JWT:
    // const token = localStorage.getItem('token')
    // const config = { headers: { Authorization: 'Bearer ' + token } }

    // Memanggil endpoint kalibrasi
    const res = await axios.get('http://localhost:8080/api/kalibrasi')
    kalibrasiData.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat data kalibrasi:', err)
    alert('Gagal memuat data kalibrasi')
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
.text-center {
  text-align: center;
}
</style>
