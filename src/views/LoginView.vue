<template>
  <div
    class="w-100 d-flex align-items-center justify-content-center bg-secondary-subtle"
    style="height: 100vh;"
  >
    <div class="w-50 bg-white rounded shadow h-50">
      <div class="row h-100">
        <!-- Bagian Kiri (Form Login) -->
        <div class="col-5 h-100">
          <div class="p-5">
            <small>Human Capital Information System</small>
            <form class="mt-3" @submit.prevent="doLogin">
              <!-- Input Email -->
              <div class="mb-3">
                <label class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="email"
                />
                <div class="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>

              <!-- Input Password dengan ikon mata (Show/Hide) -->
              <div class="mb-3">
                <label class="form-label">Password</label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="password"
                  />
                  <span
                    class="input-group-text"
                    style="cursor: pointer;"
                    @click="togglePassword"
                  >
                    <i
                      :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
                    ></i>
                  </span>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                <label class="form-check-label" for="exampleCheck1">
                  Remember me
                </label>
              </div>

              <!-- Tombol Submit -->
              <button type="submit" class="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>

        <!-- Bagian Kanan (Ilustrasi) -->
        <div class="col-7 h-100">
          <div
            class="bg-primary w-100 h-100 d-flex flex-column justify-content-center px-5 rounded"
          >
            <h3 class="fw-bold text-white text-center">
              JAKARTA EYE
              <br />
              CENTER
            </h3>
            <img
              src="@/assets/JEC.jpg"
              class="mt-3 rounded w-100"
              alt="JEC.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const router = useRouter()

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function doLogin() {
  try {
    const res = await axios.post('http://localhost:8080/api/login', {
      email: email.value,
      password: password.value
    })

    // Misal respons: { "token": "...", "role": "admin" }
    console.log(res.data);
    

    // Simpan token ke localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('name', res.data.name)
    localStorage.setItem('role', res.data.role)

    // Simpan role ke cookies (misal, berlaku 1 hari)
    // Date.now() / 1000 => detik, x 86400 => 1 hari
    // Atau gunakan library cookies seperti js-cookie agar lebih mudah
    const role = res.data.role || 'guest' // default jika server tidak mengembalikan role
    const maxAgeSeconds = 86400 // 1 hari
    document.cookie = `role=${role}; path=/; max-age=${maxAgeSeconds}`

    // Arahkan ke dashboard
    router.push('/dashboard/kondite')
  } catch (err) {
    alert('Login gagal: ' + (err.response?.data?.error || err.message))
  }
}
</script>
