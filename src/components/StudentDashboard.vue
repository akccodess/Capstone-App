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
	<main class="student-dashboard">
		<div class="dashboard-container">
			<div class="dashboard-header">
				<div class="header-content">
					<h1>Student Dashboard</h1>
					<p class="header-subtitle">Event Staff Management Portal</p>
				</div>
				<button type="button" class="btn-logout" @click="handleLogout">Logout</button>
			</div>
			<div class="dashboard-content">
				<div class="content-grid">
					<div class="card welcome-card">
						<div class="card-icon">👤</div>
						<h2>Welcome, {{ user?.firstName }}!</h2>
						<div class="user-info">
							<p><strong>Name:</strong> {{ user?.firstName }} {{ user?.lastName }}</p>
							<p><strong>Role:</strong> {{ user?.role }}</p>
							<p><strong>Email:</strong> {{ user?.email }}</p>
							<p v-if="user?.phone"><strong>Phone:</strong> {{ user?.phone }}</p>
						</div>
					</div>
					<div class="card info-card">
						<div class="card-icon">📅</div>
						<h3>Event Assignments</h3>
						<p>This is your student dashboard where you can view and manage your event assignments. Check back regularly for new opportunities to participate in Northwest Athletics events.</p>
						<div class="feature-list">
							<div class="feature-item">
								<span class="checkmark">✓</span>
								<span>View event assignments</span>
							</div>
							<div class="feature-item">
								<span class="checkmark">✓</span>
								<span>Track your hours</span>
							</div>
							<div class="feature-item">
								<span class="checkmark">✓</span>
								<span>Manage your schedule</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>
.student-dashboard {
	min-height: 100vh;
	background: var(--color-light);
	padding-bottom: 2rem;
}

.dashboard-container {
	max-width: 1200px;
	margin: 0 auto;
	background: white;
	border-radius: 0 0 12px 12px;
	box-shadow: var(--shadow-lg);
	overflow: hidden;
}

.dashboard-header {
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
	color: white;
	padding: var(--spacing-2xl);
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--spacing-lg);
}

.header-content h1 {
	margin: 0;
	font-size: var(--font-size-2xl);
	font-weight: 700;
	letter-spacing: -0.5px;
}

.header-subtitle {
	margin: var(--spacing-sm) 0 0 0;
	font-size: var(--font-size-lg);
	opacity: 0.9;
}

.btn-logout {
	padding: var(--spacing-md) var(--spacing-lg);
	background: rgba(255, 255, 255, 0.2);
	border: 2px solid rgba(255, 255, 255, 0.5);
	color: white;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
	transition: all 0.3s ease;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-size: var(--font-size-sm);
}

.btn-logout:hover {
	background: rgba(255, 255, 255, 0.3);
	border-color: white;
	transform: translateY(-2px);
}

.dashboard-content {
	padding: var(--spacing-2xl);
}

.content-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: var(--spacing-2xl);
}

.card {
	background: white;
	border-radius: 12px;
	padding: var(--spacing-2xl);
	box-shadow: var(--shadow-md);
	transition: all 0.3s ease;
	border-left: 6px solid var(--color-primary);
	position: relative;
}

.card:hover {
	box-shadow: var(--shadow-lg);
	transform: translateY(-4px);
}

.card-icon {
	font-size: 2.5rem;
	margin-bottom: var(--spacing-md);
}

.welcome-card h2 {
	margin: 0 0 var(--spacing-lg) 0;
	color: var(--color-primary);
	font-size: var(--font-size-xl);
	font-weight: 700;
}

.user-info {
	background: var(--color-light);
	padding: var(--spacing-lg);
	border-radius: 8px;
	margin-top: var(--spacing-lg);
}

.user-info p {
	margin: var(--spacing-sm) 0;
	color: var(--color-gray);
	line-height: 1.8;
}

.user-info strong {
	color: var(--color-dark);
	font-weight: 700;
}

.info-card h3 {
	margin: 0 0 var(--spacing-md) 0;
	color: var(--color-primary);
	font-size: var(--font-size-lg);
	font-weight: 700;
}

.info-card p {
	color: var(--color-gray);
	line-height: 1.8;
	margin-bottom: var(--spacing-lg);
}

.feature-list {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-md);
	margin-top: var(--spacing-lg);
}

.feature-item {
	display: flex;
	align-items: center;
	gap: var(--spacing-md);
	color: var(--color-gray);
	padding: var(--spacing-md);
	background: var(--color-light);
	border-radius: 8px;
	transition: all 0.3s ease;
}

.feature-item:hover {
	background: var(--color-primary);
	color: white;
}

.checkmark {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	background: var(--color-primary);
	color: white;
	border-radius: 50%;
	font-weight: 700;
	font-size: var(--font-size-sm);
	flex-shrink: 0;
}

.feature-item:hover .checkmark {
	background: white;
	color: var(--color-primary);
}

@media (max-width: 768px) {
	.dashboard-header {
		flex-direction: column;
		align-items: flex-start;
		padding: var(--spacing-lg);
	}

	.btn-logout {
		width: 100%;
	}

	.dashboard-content {
		padding: var(--spacing-lg);
	}

	.content-grid {
		grid-template-columns: 1fr;
		gap: var(--spacing-lg);
	}

	.card {
		padding: var(--spacing-lg);
	}
}
</style>
