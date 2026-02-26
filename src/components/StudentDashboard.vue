<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

onMounted(() => {
	const userData = localStorage.getItem('user')
	if (!userData) {
		router.push('/')
		return
	}
	user.value = JSON.parse(userData)
})

const handleLogout = () => {
	localStorage.removeItem('user')
	router.push('/')
}
</script>

<template>
	<main class="dashboard-page">
		<div class="dashboard-container">
			<div class="dashboard-header">
				<h1>Student Dashboard</h1>
				<button type="button" class="btn-link" @click="handleLogout">Logout</button>
			</div>
			<div class="dashboard-content">
				<div class="welcome-card">
					<h2>Welcome, {{ user?.firstName }} {{ user?.lastName }}!</h2>
					<p>Role: {{ user?.role }}</p>
					<p>Email: {{ user?.email }}</p>
					<p>Phone: {{ user?.phone }}</p>
				</div>
				<div class="info-card">
					<h3>Event Staff - Student Portal</h3>
					<p>This is your student dashboard where you can view and manage your event assignments.</p>
				</div>
			</div>
		</div>
	</main>
</template>
