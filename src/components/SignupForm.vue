<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)
const signupError = ref('')
const signupSuccess = ref('')

const signupForm = reactive({
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	role: '',
	phone: '',
})

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const backToLogin = () => {
	router.push('/')
}

const handleSignupSubmit = async () => {
	signupError.value = ''
	signupSuccess.value = ''

	if (!signupForm.firstName.trim() || !signupForm.lastName.trim() || !signupForm.email.trim()) {
		signupError.value = 'First name, last name, and email are required.'
		return
	}

	isSubmitting.value = true

	try {
		const response = await fetch(`${apiBaseUrl}/api/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				firstName: signupForm.firstName.trim(),
				lastName: signupForm.lastName.trim(),
				email: signupForm.email.trim(),
				password: signupForm.password.trim(),
				role: signupForm.role,
				phone: signupForm.phone.trim(),
			}),
		})

		const result = await response.json()

		if (!response.ok) {
			signupError.value = result.error || 'Unable to create account. Please try again.'
			return
		}

		signupSuccess.value = 'Account created successfully. Redirecting to login...'
		signupForm.firstName = ''
		signupForm.lastName = ''
		signupForm.email = ''
		signupForm.password = ''
		signupForm.role = ''
		signupForm.phone = ''
		
		setTimeout(() => {
			router.push('/')
		}, 1500)
	} catch {
		signupError.value = 'Unable to reach server. Please check your connection and try again.'
	} finally {
		isSubmitting.value = false
	}
}
</script>

<template>
	<main class="signup-page">
		<section class="brand-panel-signup">
			<div class="brand-content-signup">
				<h1>Create Your Account</h1>
				<p>Join the Northwest Athletics Event Staffing System</p>
			</div>
		</section>

		<section class="signup-panel">
			<div class="signup-card">
				<form class="signup-form" @submit.prevent="handleSignupSubmit">
					<h2 class="signup-title">Account Information</h2>

					<div class="signup-grid">
						<div class="form-group full-width">
							<label for="firstName">First Name *</label>
							<input
								id="firstName"
								v-model="signupForm.firstName"
								type="text"
								placeholder="John"
								autocomplete="given-name"
								required
							/>
						</div>
						<div class="form-group full-width">
							<label for="lastName">Last Name *</label>
							<input
								id="lastName"
								v-model="signupForm.lastName"
								type="text"
								placeholder="Doe"
								autocomplete="family-name"
								required
							/>
						</div>
						<div class="form-group full-width">
							<label for="email">Email Address *</label>
							<input
								id="email"
								v-model="signupForm.email"
								type="email"
								placeholder="john@example.com"
								autocomplete="email"
								required
							/>
						</div>
						<div class="form-group full-width">
							<label for="password">Password</label>
							<input
								id="password"
								v-model="signupForm.password"
								type="password"
								placeholder="Enter a password"
								autocomplete="new-password"
							/>
						</div>
						<div class="form-group full-width">
							<label for="role">Role *</label>
							<select id="role" v-model="signupForm.role" required>
								<option value="" disabled>Select your role</option>
								<option value="Event Staff - Student">Student Staff</option>
								<option value="Event Staff - Supervisor">Supervisor</option>
							</select>
						</div>
						<div class="form-group full-width">
							<label for="phone">Phone Number</label>
							<input
								id="phone"
								v-model="signupForm.phone"
								type="tel"
								placeholder="(555) 000-0000"
								autocomplete="tel"
							/>
						</div>
					</div>

					<button type="submit" class="btn-primary btn-primary--large" :disabled="isSubmitting">
						{{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
					</button>

					<p v-if="signupError" class="form-message form-message--error">{{ signupError }}</p>
					<p v-if="signupSuccess" class="form-message form-message--success">{{ signupSuccess }}</p>

					<div class="signup-footer">
						<p>Already have an account? <a href="#" class="back-link" @click.prevent="backToLogin">Back to Login</a></p>
					</div>
				</form>
			</div>
		</section>
	</main>
</template>

<style scoped>
.signup-page {
	display: flex;
	min-height: 100vh;
	background: var(--color-light);
}

.brand-panel-signup {
	flex: 1;
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
	color: var(--color-white);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: var(--spacing-2xl);
}

.brand-content-signup {
	text-align: center;
	max-width: 400px;
}

.brand-content-signup h1 {
	font-size: var(--font-size-2xl);
	margin: 0 0 var(--spacing-md) 0;
	font-weight: 700;
	letter-spacing: -0.5px;
}

.brand-content-signup p {
	font-size: var(--font-size-lg);
	opacity: 0.9;
	margin: 0;
}

.signup-panel {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: var(--spacing-2xl);
	overflow-y: auto;
}

.signup-card {
	width: 100%;
	max-width: 500px;
	background: var(--color-white);
	padding: var(--spacing-2xl);
	border-radius: 12px;
	box-shadow: var(--shadow-lg);
}

.signup-title {
	margin: 0 0 var(--spacing-lg) 0;
	font-size: var(--font-size-xl);
	color: var(--color-primary);
}

.signup-form {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-lg);
}

.signup-grid {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-lg);
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);
}

.form-group.full-width {
	grid-column: 1 / -1;
}

.form-group label {
	font-weight: 600;
	color: var(--color-dark);
	font-size: var(--font-size-sm);
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
	padding: var(--spacing-md);
	border: 2px solid var(--color-gray-light);
	border-radius: 8px;
	font-size: var(--font-size-base);
	font-family: inherit;
	transition: all 0.3s ease;
	background: var(--color-white);
}

.form-group input:focus,
.form-group select:focus {
	outline: none;
	border-color: var(--color-primary);
	box-shadow: 0 0 0 4px rgba(27, 94, 63, 0.1);
}

.form-group input::placeholder {
	color: var(--color-gray);
}

.btn-primary {
	padding: var(--spacing-md) var(--spacing-lg);
	background: var(--color-primary);
	color: var(--color-white);
	border: none;
	border-radius: 8px;
	font-size: var(--font-size-base);
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.btn-primary:hover:not(:disabled) {
	background: var(--color-primary-light);
	transform: translateY(-2px);
	box-shadow: var(--shadow-lg);
}

.btn-primary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-primary--large {
	padding: var(--spacing-lg) var(--spacing-xl);
	font-size: var(--font-size-lg);
	width: 100%;
}

.form-message {
	padding: var(--spacing-md);
	border-radius: 8px;
	font-size: var(--font-size-sm);
	margin: 0;
}

.form-message--error {
	background: rgba(220, 38, 38, 0.1);
	color: var(--color-error);
	border-left: 4px solid var(--color-error);
}

.form-message--success {
	background: rgba(5, 150, 105, 0.1);
	color: var(--color-success);
	border-left: 4px solid var(--color-success);
}

.signup-footer {
	text-align: center;
	font-size: var(--font-size-sm);
	color: var(--color-gray);
	margin-top: var(--spacing-lg);
}

.back-link {
	color: var(--color-primary);
	text-decoration: none;
	font-weight: 600;
	transition: color 0.3s ease;
}

.back-link:hover {
	color: var(--color-primary-light);
	text-decoration: underline;
}

@media (max-width: 768px) {
	.signup-page {
		flex-direction: column;
	}

	.brand-panel-signup {
		padding: var(--spacing-lg);
		min-height: 200px;
	}

	.signup-panel {
		padding: var(--spacing-lg);
	}

	.signup-card {
		padding: var(--spacing-lg);
	}
}
</style>
