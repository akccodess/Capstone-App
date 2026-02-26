<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)
const loginError = ref('')

const loginForm = reactive({
  email: '',
  password: '',
})

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const openSignup = () => {
  router.push('/signup')
}

const handleLogin = async () => {
  loginError.value = ''

  if (!loginForm.email.trim() || !loginForm.password.trim()) {
    loginError.value = 'Email and password are required.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch(`${apiBaseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginForm.email.trim(),
        password: loginForm.password.trim(),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      loginError.value = result.error || 'Login failed. Please try again.'
      return
    }

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(result.user))

    // Route based on role
    if (result.user.role === 'Event Staff - Student') {
      router.push('/student-dashboard')
    } else if (result.user.role === 'Event Staff - Supervisor') {
      router.push('/supervisor-dashboard')
    } else {
      loginError.value = 'Invalid user role.'
    }
  } catch {
    loginError.value = 'Unable to reach server. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="brand-panel" aria-label="Northwest Athletics Event Staffing Platform">
      <h1>Northwest Athletics Event Staffing</h1>
    </section>

    <section class="login-panel" aria-label="Login form">
      <div class="login-card">
        <form class="login-form" @submit.prevent="handleLogin">
          <input 
            v-model="loginForm.email"
            type="text" 
            placeholder="Email address" 
            autocomplete="username" 
          />
          <input 
            v-model="loginForm.password"
            type="password" 
            placeholder="Password" 
            autocomplete="current-password" 
          />
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Logging in...' : 'Log In' }}
          </button>
          <p v-if="loginError" class="form-message form-message--error">{{ loginError }}</p>
          <a href="#" class="forgot-link">Forgot password?</a>
          <hr />
          <button type="button" class="btn-secondary" @click="openSignup">Create New Account</button>
        </form>
      </div>
    </section>
  </main>
</template>
