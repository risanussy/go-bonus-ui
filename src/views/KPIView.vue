<template>
  <div>
    <h3>Master KPI</h3>
    <p>Daftar KPI di sistem (CRUD) dengan modal Edit (kategori diambil dari DB).</p>

    <!-- Tabel KPI -->
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Kategori</th>
            <th>Bobot</th>
            <th>Target</th>
            <th>Poor</th>
            <th>Fair</th>
            <th>Good</th>
            <th>Outstanding</th>
            <th>Exceptional</th>
            <th>Score</th>
            <th>Validated</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kpi in kpis" :key="kpi.ID">
            <td>{{ kpi.ID }}</td>
            <td>{{ parseDescription(kpi.description).kategori }}</td>
            <td>{{ parseDescription(kpi.description).bobot }}</td>
            <td>{{ parseDescription(kpi.description).target }}</td>
            <td>{{ parseDescription(kpi.description).poor }}</td>
            <td>{{ parseDescription(kpi.description).fair }}</td>
            <td>{{ parseDescription(kpi.description).good }}</td>
            <td>{{ parseDescription(kpi.description).outstanding }}</td>
            <td>{{ parseDescription(kpi.description).exceptional }}</td>
            <td>{{ kpi.score }}</td>
            <td>{{ kpi.validated }}</td>
            <td>
              <!-- TOMBOL Edit dan Hapus HANYA MUNCUL JIKA isAdmin = true -->
              <button
                v-if="isAdmin || isStaff"
                class="btn btn-sm btn-warning me-1"
                data-bs-toggle="modal"
                data-bs-target="#editKpiModal"
                @click="prepareEdit(kpi)"
              >
                Edit
              </button>
              <button
                v-if="isAdmin"
                class="btn btn-sm btn-danger"
                @click="deleteKPI(kpi.ID)"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Edit KPI (Bootstrap) -->
    <div
      class="modal fade"
      id="editKpiModal"
      tabindex="-1"
      aria-labelledby="editKpiModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editKpiModalLabel">
              Edit KPI (ID: {{ editForm.id }})
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <!-- Form Edit KPI -->
            <form @submit.prevent="saveEditKPI">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editForm.title"
                  required
                />
              </div>

              <!-- Dropdown Kategori (diambil dari DB /api/kpi-categories) -->
              <div class="mb-3">
                <label class="form-label">Kategori</label>
                <select
                  class="form-select"
                  v-model="editForm.kategori"
                  required
                >
                  <option value="">- Pilih Kategori -</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.ID"
                    :value="cat.name"
                  >
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Bobot (%)</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editForm.bobot"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Target</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editForm.target"
                  required
                />
              </div>

              <!-- Skala penilaian -->
              <div class="row">
                <div class="col">
                  <label class="form-label">Poor</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="editForm.poor"
                  />
                </div>
                <div class="col">
                  <label class="form-label">Fair</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="editForm.fair"
                  />
                </div>
                <div class="col">
                  <label class="form-label">Good</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="editForm.good"
                  />
                </div>
                <div class="col">
                  <label class="form-label">Outstanding</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="editForm.outstanding"
                  />
                </div>
                <div class="col">
                  <label class="form-label">Exceptional</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="editForm.exceptional"
                  />
                </div>
              </div>

              <div class="mt-4 d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
                <button class="btn btn-primary" type="submit">
                  Simpan
                </button>
              </div>
            </form>
          </div>
          <!-- end modal-body -->
        </div>
      </div>
    </div>
    <!-- End Modal -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Daftar KPI
const kpis = ref([])
// Daftar kategori KPI (diambil dari DB)
const categories = ref([])

// Data form edit
const editForm = ref({
  id: '',
  title: '',
  kategori: '',
  bobot: '',
  target: '',
  poor: '',
  fair: '',
  good: '',
  outstanding: '',
  exceptional: ''
})

// **Tambahkan** isAdmin state
const isAdmin = ref(false)
const isStaff = ref(false)

// onMounted: load KPI + load categories + check role
onMounted(() => {
  loadKPIs()
  loadCategories()
  checkRole()
})

// Cek role dari JWT
function checkRole() {
  const token = localStorage.getItem('token')
  if (!token) return

  const role = parseRoleFromToken(token)
  if (role === 'admin') {
    isAdmin.value = true
  } else {
    isAdmin.value = false
  }

  if (role === 'pegawai') {
    isStaff.value = true
  } else {
    isStaff.value = false
  }
}

// Fungsi parse JWT (payload) untuk dapatkan role
function parseRoleFromToken(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const obj = JSON.parse(jsonPayload)
    return obj.role || null
  } catch (err) {
    console.error('Gagal parse token:', err)
    return null
  }
}

async function loadKPIs() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/kpis', {
      headers: { Authorization: 'Bearer ' + token }
    })
    kpis.value = res.data.data
  } catch (err) {
    alert('Gagal load KPI')
  }
}

async function loadCategories() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/kpi-categories', {
      headers: { Authorization: 'Bearer ' + token }
    })
    categories.value = res.data.data
  } catch (err) {
    alert('Gagal load kategori KPI')
  }
}

// Hapus KPI
async function deleteKPI(id) {
  if (!confirm('Yakin hapus KPI ini?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:8080/api/kpis/${id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    alert('KPI berhasil dihapus!')
    loadKPIs()
  } catch (err) {
    alert('Gagal menghapus KPI')
  }
}

// Persiapan data untuk Edit
function prepareEdit(kpi) {
  const parsed = parseDescription(kpi.description)
  editForm.value.id = kpi.ID
  editForm.value.title = kpi.title
  editForm.value.kategori = parsed.kategori
  editForm.value.bobot = parsed.bobot
  editForm.value.target = parsed.target
  editForm.value.poor = parsed.poor
  editForm.value.fair = parsed.fair
  editForm.value.good = parsed.good
  editForm.value.outstanding = parsed.outstanding
  editForm.value.exceptional = parsed.exceptional
}

// Simpan perubahan
async function saveEditKPI() {
  try {
    const token = localStorage.getItem('token')
    const desc = `Kategori: ${editForm.value.kategori}, Bobot: ${editForm.value.bobot}%, Target: ${editForm.value.target}, Skala: poor ${editForm.value.poor}, fair ${editForm.value.fair}, good ${editForm.value.good}, outstanding ${editForm.value.outstanding}, exceptional ${editForm.value.exceptional}`

    await axios.put(`http://localhost:8080/api/kpis/${editForm.value.id}`,
      {
        title: editForm.value.title,
        description: desc
      },
      { headers: { Authorization: 'Bearer ' + token } }
    )

    alert('KPI berhasil diupdate!')
    loadKPIs()
  } catch (err) {
    alert('Gagal update KPI')
  }
}

// Fungsi parse description
function parseDescription(desc) {
  const result = {
    kategori: '',
    bobot: '',
    target: '',
    poor: '',
    fair: '',
    good: '',
    outstanding: '',
    exceptional: ''
  }
  if (!desc) return result

  const splitted = desc.split(',')
  splitted.forEach(part => {
    part = part.trim()
    if (part.startsWith('Kategori:')) {
      result.kategori = part.replace('Kategori:', '').trim()
    } else if (part.startsWith('Bobot:')) {
      result.bobot = part.replace('Bobot:', '').trim()
    } else if (part.startsWith('Target:')) {
      result.target = part.replace('Target:', '').trim()
    } else if (part.startsWith('Skala:')) {
      const scaleStr = part.replace('Skala:', '').trim()
      parseScaleString(scaleStr, result)
    } else if (part.startsWith('poor')) {
      parseScaleString(part, result)
    } else if (part.startsWith('fair')) {
      parseScaleString(part, result)
    } else if (part.startsWith('good')) {
      parseScaleString(part, result)
    } else if (part.startsWith('outstanding')) {
      parseScaleString(part, result)
    } else if (part.startsWith('exceptional')) {
      parseScaleString(part, result)
    }
  })
  return result
}

function parseScaleString(str, result) {
  const [scaleName, scaleValue] = str.split(' ')
  if (scaleName && scaleValue) {
    if (scaleName === 'poor') {
      result.poor = scaleValue
    } else if (scaleName === 'fair') {
      result.fair = scaleValue
    } else if (scaleName === 'good') {
      result.good = scaleValue
    } else if (scaleName === 'outstanding') {
      result.outstanding = scaleValue
    } else if (scaleName === 'exceptional') {
      result.exceptional = scaleValue
    }
  }
}
</script>
