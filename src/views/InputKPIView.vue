<template>
  <div class="container my-4">
    <h3>Input Penilaian KPI</h3>
    <p>
      Form untuk menambahkan KPI baru (beserta skala penilaiannya), 
      lalu menampilkannya di tabel kalibrasi di bawah.
    </p>

    <!-- Form Input KPI -->
    <form @submit.prevent="submitKPI" class="border p-3 mb-4">
      <h5>Form Penilaian KPI</h5>

      <!-- Dropdown kategori KPI dari DB -->
      <div class="mb-3">
        <label class="form-label">Kategori KPI</label>
        <select class="form-select" v-model="kpiCategory" required>
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

      <!-- Bobot, Target -->
      <div class="mb-3">
        <label class="form-label">Bobot KPI (%)</label>
        <input
          type="number"
          class="form-control"
          v-model="kpiWeight"
          placeholder="Contoh: 20"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Target KPI</label>
        <input
          type="text"
          class="form-control"
          v-model="kpiTarget"
          placeholder="Contoh: 100 Juta"
          required
        />
      </div>

      <!-- Skala penilaian 1–5 -->
      <div class="row">
        <div class="col" v-for="(scale, index) in scales" :key="index">
          <label class="form-label">{{ scale.label }}</label>
          <input
            type="text"
            class="form-control"
            v-model="scale.value"
            placeholder="Contoh: 1"
            required
          />
        </div>
      </div>

      <button class="btn btn-primary mt-3" type="submit">
        Simpan KPI
      </button>
    </form>

    <!-- Tabel Kalibrasi (Daftar KPI yang sudah diinput) -->
    <h5>Daftar KPI (Kalibrasi)</h5>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <!-- Contoh: Nama Karyawan (jika API mengembalikan employee.name) -->
            <th>Kategori</th>
            <th>Bobot</th>
            <th>Target</th>
            <th>Poor</th>
            <th>Fair</th>
            <th>Good</th>
            <th>Outstanding</th>
            <th>Exceptional</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kpi in kpiList" :key="kpi.ID">
            <td>{{ kpi.ID }}</td>
            <!-- Misal: <td>{{ kpi.employee?.name || '-' }}</td> -->
            <td>{{ parseDescription(kpi.description).kategori }}</td>
            <td>{{ parseDescription(kpi.description).bobot }}</td>
            <td>{{ parseDescription(kpi.description).target }}</td>
            <td>{{ parseDescription(kpi.description).poor }}</td>
            <td>{{ parseDescription(kpi.description).fair }}</td>
            <td>{{ parseDescription(kpi.description).good }}</td>
            <td>{{ parseDescription(kpi.description).outstanding }}</td>
            <td>{{ parseDescription(kpi.description).exceptional }}</td>
            <td>{{ kpi.score }}</td>
          </tr>
          <tr v-if="kpiList.length === 0">
            <td colspan="10" class="text-center">Belum ada data KPI</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State: daftar kategori KPI, data input, dan daftar KPI
const categories = ref([])   // data kategori (GET /api/kpi-categories)
const kpiCategory = ref('')  // kategori terpilih
const kpiWeight = ref('')
const kpiTarget = ref('')
const scales = ref([
  { label: 'Poor',        value: '' },
  { label: 'Fair',        value: '' },
  { label: 'Good',        value: '' },
  { label: 'Outstanding', value: '' },
  { label: 'Exceptional', value: '' }
])

// Daftar KPI yang sudah diinput (untuk tabel)
const kpiList = ref([])

// onMounted => load categories & load existing KPI
onMounted(() => {
  loadCategories()
  loadKPI()
})

// Ambil kategori KPI dari DB
async function loadCategories() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/kpi-categories', {
      headers: { Authorization: 'Bearer ' + token }
    })
    categories.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat kategori KPI:', err)
  }
}

// Ambil daftar KPI dari DB => untuk menampilkan di tabel
async function loadKPI() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/kpis', {
      headers: { Authorization: 'Bearer ' + token }
    })
    kpiList.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat KPI:', err)
  }
}

// Submit form => simpan KPI baru ke DB
async function submitKPI() {
  try {
    const token = localStorage.getItem('token')

    // Bangun description dari input
    // "Kategori: X, Bobot: Y%, Target: Z, Skala: poor 1, fair 2, good 3, outstanding 4, exceptional 5"
    const desc = `Kategori: ${kpiCategory.value}, Bobot: ${kpiWeight.value}%, Target: ${kpiTarget.value}, 
      Skala: poor ${scales.value[0].value}, fair ${scales.value[1].value}, 
      good ${scales.value[2].value}, outstanding ${scales.value[3].value}, 
      exceptional ${scales.value[4].value}`

    const payload = {
      title: 'KPI Baru',   // atau bisa ambil input "title" lain
      description: desc,
      score: 0,           // default 0
      validated: false    // default false
    }

    await axios.post('http://localhost:8080/api/kpis', payload, {
      headers: { Authorization: 'Bearer ' + token }
    })

    alert('KPI berhasil disimpan!')
    // Reset form
    kpiCategory.value = ''
    kpiWeight.value = ''
    kpiTarget.value = ''
    scales.value.forEach(s => s.value = '')

    // Reload tabel KPI
    loadKPI()
  } catch (err) {
    console.error(err)
    alert('Gagal menyimpan KPI.')
  }
}

// Fungsi parse description => ambil kategori, bobot, target, dan skala penilaian
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
      // Contoh: "Skala: poor 1, fair 2, good 3, outstanding 4, exceptional 5"
      parseScaleString(part.replace('Skala:', '').trim(), result)
    } else {
      // Mungkin format "poor 1", "fair 2", dsb
      parseScaleString(part, result)
    }
  })
  return result
}

// parse potongan "poor 1", "fair 2", dsb.
function parseScaleString(str, result) {
  // Bisa berisi beberapa sub-bagian dipisah koma
  // misal "poor 1, fair 2, good 3..."
  const parts = str.split(',')
  parts.forEach(p => {
    const sub = p.trim().split(' ')
    if (sub.length === 2) {
      const key = sub[0].toLowerCase()
      const val = sub[1]
      if (key === 'poor') {
        result.poor = val
      } else if (key === 'fair') {
        result.fair = val
      } else if (key === 'good') {
        result.good = val
      } else if (key === 'outstanding') {
        result.outstanding = val
      } else if (key === 'exceptional') {
        result.exceptional = val
      }
    }
  })
}
</script>

<style scoped>
/* Opsional styling tambahan */
</style>
