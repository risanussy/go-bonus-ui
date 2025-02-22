import { createRouter, createWebHistory } from 'vue-router'

// Import view & layout
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BonusView from '@/views/BonusView.vue'
import KonditeView from '@/views/KonditeView.vue'
import KonditeInputView from '@/views/KonditeInputView.vue'
import KalibrasiView from '@/views/KalibrasiView.vue'
import InputKPIView from '@/views/InputKPIView.vue'
import InputPenilaianView from '@/views/InputPenilaianView.vue'
import MasterSettingKPIView from '@/views/MasterSettingKPIView.vue'
import KPIView from '@/views/KPIView.vue'
import EmployeeView from '@/views/EmployeeView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: 'bonus', name: 'bonus', component: BonusView },
      { path: 'kondite', name: 'kondite', component: KonditeView },
      { path: 'kondite-input', name: 'konditeInput', component: KonditeInputView },
      { path: 'kalibrasi', name: 'kalibrasi', component: KalibrasiView },
      { path: 'input-kpi', name: 'inputKPI', component: InputKPIView },
      { path: 'input-penilaian', name: 'inputPenilaian', component: InputPenilaianView },
      { path: 'master-setting-kpi', name: 'masterSettingKPI', component: MasterSettingKPIView },
      { path: 'kpi', name: 'masterKPI', component: KPIView },
      { path: 'employee', name: 'employee', component: EmployeeView }
    ]
  },
  { path: '/', redirect: '/dashboard/kondite' },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard/kondite' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard sederhana: cek token
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
