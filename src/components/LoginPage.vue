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
      <div class="brand-content">
        <div class="brand-icon">🎯</div>
        <h1>Northwest Athletics</h1>
        <p>Event Staffing Portal</p>
      </div>
    </section>

    <section class="login-panel" aria-label="Login form">
      <div class="login-card">
        <h2>Sign In</h2>
        <p class="login-subtitle">Access Your Dashboard</p>
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email"
              v-model="loginForm.email"
              type="email" 
              placeholder="your@email.com" 
              autocomplete="username" 
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="loginForm.password"
              type="password" 
              placeholder="••••••••" 
              autocomplete="current-password" 
              required
            />
          </div>
          <button type="submit" class="btn-primary btn-primary--large" :disabled="isSubmitting">
            {{ isSubmitting ? 'Logging in...' : 'Sign In' }}
          </button>
          <p v-if="loginError" class="form-message form-message--error">{{ loginError }}</p>
          <div class="login-footer">
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
        </form>
        <div class="divider">New here?</div>
        <button type="button" class="btn-secondary btn-secondary--large" @click="openSignup">Create Account</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background: var(--color-light);
}

.brand-panel {
  flex: 1;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
}

.brand-panel::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 20s ease-in-out infinite;
}

.brand-panel::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 25s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(30px);
  }
}

.brand-content {
  text-align: center;
  max-width: 500px;
  position: relative;
  z-index: 1;
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.brand-icon {
  font-size: 5rem;
  margin-bottom: var(--spacing-lg);
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.brand-content h1 {
  font-size: 3.5rem;
  margin: 0 0 var(--spacing-md) 0;
  font-weight: 900;
  letter-spacing: -2px;
  line-height: 1.1;
  color: var(--color-white);
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.brand-content p {
  font-size: var(--font-size-lg);
  opacity: 1;
  margin: 0;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-white);
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.login-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: var(--color-white);
  padding: var(--spacing-2xl);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-top: 6px solid var(--color-primary);
}

.login-card h2 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  font-weight: 800;
  letter-spacing: -0.5px;
}

.login-subtitle {
  margin: 0 0 var(--spacing-2xl) 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-weight: 700;
  color: var(--color-dark);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.form-group input {
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--color-gray-light);
  border-radius: 10px;
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 6px rgba(27, 94, 63, 0.08);
  transform: translateY(-2px);
}

.form-group input::placeholder {
  color: var(--color-gray-light);
}

.btn-primary {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--color-white);
  border: none;
  border-radius: 10px;
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 8px 20px rgba(27, 94, 63, 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(27, 94, 63, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary--large {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: var(--font-size-lg);
  width: 100%;
}

.btn-secondary {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-white);
  color: var(--color-primary);
  border: 2.5px solid var(--color-primary);
  border-radius: 10px;
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(27, 94, 63, 0.2);
}

.btn-secondary:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary--large {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: var(--font-size-lg);
  width: 100%;
}

.form-message {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 10px;
  font-size: var(--font-size-sm);
  margin: 0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-message--error {
  background: rgba(220, 38, 38, 0.12);
  color: var(--color-error);
  border-left: 5px solid var(--color-error);
  font-weight: 600;
}

.form-message--success {
  background: rgba(5, 150, 105, 0.12);
  color: var(--color-success);
  border-left: 5px solid var(--color-success);
  font-weight: 600;
}

.login-footer {
  text-align: center;
  margin-top: var(--spacing-lg);
}

.forgot-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.forgot-link:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
  transform: translateX(4px);
}

.divider {
  text-align: center;
  color: var(--color-gray);
  font-size: var(--font-size-sm);
  font-weight: 700;
  position: relative;
  margin: var(--spacing-xl) 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 2rem);
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-gray-light), transparent);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

@media (max-width: 1024px) {
  .brand-content h1 {
    font-size: 2.5rem;
  }

  .login-card {
    padding: var(--spacing-xl);
  }
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .brand-panel {
    padding: var(--spacing-xl);
    min-height: 280px;
  }

  .brand-content h1 {
    font-size: 2rem;
  }

  .brand-content p {
    font-size: 1rem;
  }

  .brand-icon {
    font-size: 3rem;
  }

  .login-panel {
    padding: var(--spacing-lg);
  }

  .login-card {
    padding: var(--spacing-lg);
  }

  .form-group input {
    padding: var(--spacing-md);
    font-size: 16px;
  }

  .btn-primary,
  .btn-secondary {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-base);
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 0;
  }

  .brand-panel {
    padding: var(--spacing-lg);
    min-height: 240px;
  }

  .brand-content h1 {
    font-size: 1.75rem;
  }

  .brand-content p {
    font-size: 0.95rem;
  }

  .brand-icon {
    font-size: 2.5rem;
  }

  .login-card {
    border-radius: 12px;
    padding: var(--spacing-md);
  }

  .login-card h2 {
    font-size: var(--font-size-xl);
  }

  .divider::before,
  .divider::after {
    width: calc(50% - 1rem);
  }
}
</style>
