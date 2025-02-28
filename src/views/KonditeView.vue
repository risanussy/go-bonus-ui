<template>
  <div>
    <h3>Data Kondite</h3>
    <p>
      Daftar kondite karyawan (pengurang poin) yang sudah diinput.
      <br />
      <!-- <em>(Admin lihat semua, user biasa lihat miliknya saja)</em> -->
    </p>

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
            <!-- Tampilkan nama karyawan -->
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

// onMounted => panggil loadKonditeList
onMounted(() => {
  loadKonditeList()
})

// Fungsi ambil semua data kondite, lalu filter di client
async function loadKonditeList() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Token tidak ada, silakan login.')
      return
    }

    // 1. Ambil semua data kondite
    const res = await axios.get('http://localhost:8080/api/kondites', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const allKondites = res.data.data // array semua data

    // 2. Parse token untuk dapatkan role & employee_id
    const role = parseRoleFromToken(token)
    const myEmployeeId = parseEmployeeIdFromToken(token)

    // 3. Jika admin => tampilkan semua, jika bukan => filter
    if (role === 'admin') {
      konditeList.value = allKondites
    } else {
      // user biasa => hanya data miliknya
      konditeList.value = allKondites.filter(item => {
        // Asumsi item.employee_id = ID karyawan
        return item.employee_id === myEmployeeId
      })
    }
  } catch (err) {
    alert('Gagal memuat data kondite: ' + (err.response?.data?.error || err.message))
  }
}

// Format tanggal (opsional)
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toISOString().split('T')[0]
}

// Parse role dari token (JWT)
function parseRoleFromToken(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const obj = JSON.parse(jsonPayload)
    return obj.role || null
  } catch (err) {
    console.error('Gagal parse role:', err)
    return null
  }
}

// Parse employee_id dari token (JWT)
function parseEmployeeIdFromToken(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const obj = JSON.parse(jsonPayload)
    // Pastikan di server claims["employee_id"] = ID karyawan
    return obj.employee_id ? parseInt(obj.employee_id) : null
  } catch (err) {
    console.error('Gagal parse employee_id:', err)
    return null
  }
}
</script>
