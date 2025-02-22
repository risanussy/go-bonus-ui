<template>
  <div>
    <h3>Data Karyawan</h3>
    <p>Form input data karyawan (nama, email, gaji, dsb.).</p>
    <form @submit.prevent="submitEmployee">
      <div class="mb-3">
        <label class="form-label">Nama</label>
        <input type="text" class="form-control" v-model="name" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="email" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" v-model="password" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Gaji</label>
        <input
          type="number"
          class="form-control"
          v-model="salary"
          placeholder="Contoh: 5000000"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Role</label>
        <select class="form-select" v-model="role" required>
          <option value="">- Pilih -</option>
          <option value="admin">Admin</option>
          <!-- <option value="HRD">HRD</option>
          <option value="manager">Manager</option> -->
          <option value="pegawai">Pegawai</option>
        </select>
      </div>
      <button class="btn btn-primary" type="submit">Simpan Karyawan</button>
    </form>
    <hr />
    <h5>List Karyawan</h5>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Gaji</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in employees" :key="emp.id">
            <td>{{ emp.id }}</td>
            <td>{{ emp.name }}</td>
            <td>{{ emp.email }}</td>
            <td>{{ emp.salary || '-' }}</td>
            <td>{{ emp.role }}</td>
            <td>
              <!-- Ubah @click="editEmployee(emp.id)" menjadi @click="editEmployee(emp)" -->
              <button
                class="btn btn-sm btn-warning me-1"
                @click="editEmployee(emp)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteEmployee(emp.id)"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State untuk form create
const name = ref('')
const email = ref('')
const password = ref('')
const salary = ref('')
const role = ref('')

// Daftar karyawan
const employees = ref([])

// onMounted -> load data karyawan
onMounted(() => {
  loadEmployees()
})

// Memuat data karyawan
async function loadEmployees() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/employees', {
      headers: { Authorization: 'Bearer ' + token }
    })
    employees.value = res.data.data
  } catch (err) {
    alert('Gagal memuat data karyawan')
  }
}

// Submit form create karyawan
async function submitEmployee() {
  try {
    const token = localStorage.getItem('token')
    await axios.post(
      'http://localhost:8080/api/employees',
      {
        name: name.value,
        email: email.value,
        password: password.value,
        salary: salary.value,
        role: role.value
      },
      {
        headers: { Authorization: 'Bearer ' + token }
      }
    )
    alert('Karyawan berhasil disimpan!')
    // Reset form
    name.value = ''
    email.value = ''
    password.value = ''
    salary.value = ''
    role.value = ''
    // Refresh list
    loadEmployees()
  } catch (err) {
    alert('Gagal menyimpan karyawan')
  }
}

/**
 * Fungsi edit karyawan.
 * Kita pakai prompt() berulang untuk input data baru:
 *  - Nama
 *  - Email
 *  - Role
 *  - Salary
 */
async function editEmployee(emp) {
  // Prompt data baru, default diisi data lama
  const newName = prompt('Nama karyawan baru?', emp.name)
  if (newName === null) return

  const newEmail = prompt('Email karyawan baru?', emp.email)
  if (newEmail === null) return

  const newRole = prompt(
    'Role karyawan baru? (admin/HRD/manager/pegawai)',
    emp.role
  )
  if (newRole === null) return

  const newSalary = prompt('Gaji karyawan baru?', emp.salary)
  if (newSalary === null) return

  try {
    const token = localStorage.getItem('token')
    await axios.put(
      `http://localhost:8080/api/employees/${emp.id}`,
      {
        name: newName,
        email: newEmail,
        role: newRole,
        salary: parseInt(newSalary)
      },
      {
        headers: { Authorization: 'Bearer ' + token }
      }
    )
    alert('Karyawan berhasil diupdate!')
    loadEmployees()
  } catch (err) {
    alert('Gagal update karyawan')
  }
}

// Fungsi hapus karyawan
async function deleteEmployee(id) {
  if (!confirm('Yakin hapus karyawan ini?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:8080/api/employees/${id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    alert('Karyawan berhasil dihapus!')
    loadEmployees()
  } catch (err) {
    alert('Gagal menghapus karyawan')
  }
}
</script>
