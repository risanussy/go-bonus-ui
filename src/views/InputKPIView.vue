<template>
  <div>
    <h3>Input KPI</h3>
    <p>Tambah data KPI. (Kategori diambil dari DB.)</p>
    <form @submit.prevent="submitKPI">
      <!-- Dropdown kategori KPI dari DB -->
      <div class="mb-3">
        <label class="form-label">Kategori KPI</label>
        <select class="form-select" v-model="kpiCategory" required>
          <option value="">- Pilih Kategori -</option>
          <!-- Loop data categories dari DB -->
          <option 
            v-for="cat in categories" 
            :key="cat.ID" 
            :value="cat.name"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Contoh: Bobot, Target, Skala penilaian -->
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

      <!-- Skala penilaian -->
      <div class="row mb-3">
        <div class="col" v-for="(scale, index) in scales" :key="index">
          <label class="form-label">{{ scale.label }}</label>
          <input
            type="text"
            class="form-control"
            v-model="scale.value"
            required
          />
        </div>
      </div>

      <button class="btn btn-primary mt-3" type="submit">Simpan KPI</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State untuk dropdown kategori KPI
const categories = ref([])       // Berisi data dari DB (GET /api/kpi-categories)
const kpiCategory = ref('')      // Nilai terpilih dari dropdown

// Field lain
const kpiWeight = ref('')
const kpiTarget = ref('')
const scales = ref([
  { label: 'Poor', value: '' },
  { label: 'Fair', value: '' },
  { label: 'Good', value: '' },
  { label: 'Outstanding', value: '' },
  { label: 'Exceptional', value: '' }
])

// Fungsi memuat data kategori KPI dari DB
async function loadCategories() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8080/api/kpi-categories', {
      headers: { Authorization: 'Bearer ' + token }
    })
    // Asumsi respons: { "data": [ { "ID":1, "name":"KPI Individu", "description":"..." }, ... ] }
    categories.value = res.data.data
  } catch (err) {
    console.error(err)
    alert('Gagal memuat kategori KPI dari DB.')
  }
}

// Submit form KPI
async function submitKPI() {
  try {
    const token = localStorage.getItem('token')
    // Buat description gabungan
    const description = `Kategori: ${kpiCategory.value}, Bobot: ${kpiWeight.value}%, Target: ${kpiTarget.value}, 
      Skala: poor ${scales.value[0].value}, fair ${scales.value[1].value}, good ${scales.value[2].value}, 
      outstanding ${scales.value[3].value}, exceptional ${scales.value[4].value}`

    await axios.post('http://localhost:8080/api/kpis',
      {
        title: 'KPI',        // Bisa diganti jika perlu
        description: description,
        score: 0,
        validated: false
      },
      {
        headers: { Authorization: 'Bearer ' + token }
      }
    )

    alert('KPI berhasil disimpan!')

    // Reset form
    kpiCategory.value = ''
    kpiWeight.value = ''
    kpiTarget.value = ''
    scales.value.forEach(s => s.value = '')
  } catch (err) {
    console.error(err)
    alert('Gagal menyimpan KPI')
  }
}

// onMounted: panggil loadCategories() untuk isi dropdown
onMounted(() => {
  loadCategories()
})
</script>
