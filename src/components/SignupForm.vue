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
		<section class="signup-panel" aria-label="Add user details form">
			<div class="signup-card">
				<form class="signup-form" @submit.prevent="handleSignupSubmit">
					<h2 class="signup-title">Add User Details</h2>

					<div class="signup-grid">
						<input
							v-model="signupForm.lastName"
							type="text"
							placeholder="Last name *"
							autocomplete="family-name"
						/>
						<input
							v-model="signupForm.firstName"
							type="text"
							placeholder="First name *"
							autocomplete="given-name"
						/>
						<input
							v-model="signupForm.email"
							type="email"
							placeholder="Email *"
							autocomplete="email"
						/>
						<input
							v-model="signupForm.password"
							type="password"
							placeholder="Password"
							autocomplete="new-password"
						/>
						<select v-model="signupForm.role" class="signup-select">
							<option value="" disabled>Role</option>
							<option value="Event Staff - Student">Event Staff - Student</option>
							<option value="Event Staff - Supervisor">Event Staff - Supervisor</option>
						</select>
						<input
							v-model="signupForm.phone"
							type="text"
							placeholder="Phone"
							autocomplete="tel"
						/>
					</div>

					<button type="submit" class="btn-primary" :disabled="isSubmitting">
						{{ isSubmitting ? 'Submitting...' : 'Submit' }}
					</button>
					<button type="button" class="btn-link" @click="backToLogin">Back to Login</button>
					<p v-if="signupError" class="form-message form-message--error">{{ signupError }}</p>
					<p v-if="signupSuccess" class="form-message form-message--success">{{ signupSuccess }}</p>
				</form>
			</div>
		</section>
	</main>
</template>
