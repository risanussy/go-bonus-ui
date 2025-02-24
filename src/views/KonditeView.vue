<template>
  <div>
    <h3>Data Kondite</h3>
    <p>Daftar kondite karyawan (pengurang poin) yang sudah diinput.</p>

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nama Karyawan</th>
            <th>Kategori</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in konditeList" :key="item.ID">
            <td>{{ item.ID }}</td>
            <!-- Tampilkan nama karyawan dari item.employee.Name -->
            <td>{{ item.employee?.name || '(No Name)' }}</td>
            <td>{{ item.category }}</td>
            <td>{{ formatDate(item.start_date) }}</td>
            <td>{{ formatDate(item.end_date) }}</td>
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

onMounted(() => {
  loadKonditeList()
})

async function loadKonditeList() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/kondites', {
      headers: { Authorization: 'Bearer ' + token }
    })
    // res.data.data = array Kondite + Employee
    konditeList.value = res.data.data
  } catch (err) {
    alert('Gagal memuat data kondite')
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toISOString().split('T')[0]
}
</script>
