import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './components/LoginPage.vue'
import SignupForm from './components/SignupForm.vue'
import StudentDashboard from './components/StudentDashboard.vue'
import SupervisorDashboard from './components/SupervisorDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupForm,
    },
    {
      path: '/student-dashboard',
      name: 'student-dashboard',
      component: StudentDashboard,
    },
    {
      path: '/supervisor-dashboard',
      name: 'supervisor-dashboard',
      component: SupervisorDashboard,
    },
  ],
})

export default router
