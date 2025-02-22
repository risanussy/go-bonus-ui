<template>
  <div>
    <h3>Setting KPI</h3>
    <!-- <p>KPI Individu, Departemen, Perusahaan harus total 100%.</p> -->

    <!-- Bagian Input Setting KPI (individu, departemen, perusahaan) -->
    <!-- <form @submit.prevent="submitSetting" class="mb-4">
      <div class="mb-3">
        <label class="form-label">KPI Individu (%)</label>
        <input type="number" class="form-control" v-model="individu" required />
      </div>
      <div class="mb-3">
        <label class="form-label">KPI Departemen (%)</label>
        <input type="number" class="form-control" v-model="departemen" required />
      </div>
      <div class="mb-3">
        <label class="form-label">KPI Perusahaan (%)</label>
        <input type="number" class="form-control" v-model="perusahaan" required />
      </div>
      <button class="btn btn-primary" type="submit">Simpan Setting</button>
    </form> -->

    <!-- Bagian Input & Tabel Kategori KPI -->
    <!-- <hr /> -->
    <h5>Kategori KPI</h5>
    <form @submit.prevent="createCategory" class="row g-3 mb-3">
      <div class="col-md-4">
        <label class="form-label">Nama Kategori</label>
        <input
          type="text"
          class="form-control"
          v-model="newCategoryName"
          placeholder="Misal: KPI Individu"
          required
        />
      </div>
      <div class="col-md-6">
        <label class="form-label">Deskripsi</label>
        <input
          type="text"
          class="form-control"
          v-model="newCategoryDesc"
          placeholder="Opsional"
        />
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button class="btn btn-success w-100" type="submit">Tambah</button>
      </div>
    </form>

    <!-- Tabel Kategori KPI -->
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.ID">
            <td>{{ cat.ID }}</td>
            <td>{{ cat.name }}</td>
            <td>{{ cat.description }}</td>
            <td>
              <!-- Contoh aksi Edit/Hapus -->
              <button class="btn btn-sm btn-warning me-1" @click="editCategory(cat)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteCategory(cat.ID)">Hapus</button>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="4" class="text-center">Belum ada kategori</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

/** Bagian Setting KPI */
// const individu = ref(0)
// const departemen = ref(0)
// const perusahaan = ref(0)

// function submitSetting() {
//   // Placeholder
//   // Di sini Anda bisa memanggil endpoint mis. PUT /api/setting_kpi
//   // yang menyimpan individu, departemen, perusahaan
//   const total = Number(individu.value) + Number(departemen.value) + Number(perusahaan.value)
//   if (total !== 100) {
//     alert('Total persentase harus 100%.')
//     return
//   }
//   alert('Setting KPI (individu, departemen, perusahaan) belum dihubungkan ke server.')
// }

/** Bagian Kategori KPI */
const categories = ref([])           // Daftar kategori KPI
const newCategoryName = ref('')
const newCategoryDesc = ref('')

// Memuat kategori KPI dari server
async function loadCategories() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/kpi-categories', {
      headers: { Authorization: 'Bearer ' + token }
    })
    // Asumsi respons { "data": [ { "ID":1, "name":"KPI Individu", "description":"..." }, ... ] }
    categories.value = res.data.data
  } catch (err) {
    console.error(err)
    alert('Gagal memuat kategori KPI.')
  }
}

// Menambahkan kategori baru
async function createCategory() {
  if (!newCategoryName.value) {
    alert('Nama kategori harus diisi.')
    return
  }
  try {
    const token = localStorage.getItem('token')
    const payload = {
      name: newCategoryName.value,
      description: newCategoryDesc.value
    }
    await axios.post('http://localhost:8080/api/kpi-categories', payload, {
      headers: { Authorization: 'Bearer ' + token }
    })
    alert('Kategori berhasil ditambahkan.')
    newCategoryName.value = ''
    newCategoryDesc.value = ''
    loadCategories() // refresh data
  } catch (err) {
    console.error(err)
    alert('Gagal menambah kategori.')
  }
}

// Menghapus kategori
async function deleteCategory(id) {
  if (!confirm('Yakin hapus kategori ini?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:8080/api/kpi-categories/${id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    alert('Kategori berhasil dihapus.')
    loadCategories()
  } catch (err) {
    console.error(err)
    alert('Gagal menghapus kategori.')
  }
}

// Edit kategori (contoh prompt sederhana)
async function editCategory(cat) {
  const newName = prompt('Nama kategori baru:', cat.name)
  if (!newName) return
  const newDesc = prompt('Deskripsi baru:', cat.description || '')
  if (newDesc === null) return

  try {
    const token = localStorage.getItem('token')
    const payload = {
      name: newName,
      description: newDesc
    }
    await axios.put(`http://localhost:8080/api/kpi-categories/${cat.ID}`, payload, {
      headers: { Authorization: 'Bearer ' + token }
    })
    alert('Kategori berhasil diupdate.')
    loadCategories()
  } catch (err) {
    console.error(err)
    alert('Gagal update kategori.')
  }
}

// Memuat data awal saat komponen di-mount
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
/* Styling opsional */
</style>
