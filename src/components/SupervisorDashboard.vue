<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const currentSection = ref('dashboard')
const games = ref([])
const loading = ref(false)
const showForm = ref(false)
const isEditing = ref(false)
const editingGameId = ref(null)

const formData = ref({
	date: '',
	time: '',
	location: '',
	sportType: ''
})

const API_BASE_URL = 'http://localhost:3000/api'

onMounted(() => {
	const userData = localStorage.getItem('user')
	if (!userData) {
		router.push('/')
		return
	}
	user.value = JSON.parse(userData)
	
	// Check if user is supervisor
	if (user.value.role !== 'Event Staff - Supervisor') {
		router.push('/student-dashboard')
		return
	}
})

const fetchGames = async () => {
	try {
		loading.value = true
		const response = await fetch(`${API_BASE_URL}/games/supervisor/${user.value.id}`)
		const data = await response.json()
		if (data.success) {
			games.value = data.games
		}
	} catch (err) {
		console.error('Error fetching games:', err)
		alert('Error loading games')
	} finally {
		loading.value = false
	}
}

const navigateTo = (section) => {
	currentSection.value = section
	if (section === 'event-management' && games.value.length === 0 && !loading.value) {
		fetchGames()
	}
}

const resetForm = () => {
	formData.value = {
		date: '',
		time: '',
		location: '',
		sportType: ''
	}
	isEditing.value = false
	editingGameId.value = null
	showForm.value = false
}

const openCreateForm = () => {
	resetForm()
	showForm.value = true
}

const openEditForm = (game) => {
	formData.value = {
		date: game.date,
		time: game.time,
		location: game.location,
		sportType: game.sportType
	}
	isEditing.value = true
	editingGameId.value = game.id
	showForm.value = true
}

const submitForm = async () => {
	if (!formData.value.date || !formData.value.time || !formData.value.location || !formData.value.sportType) {
		alert('Please fill in all fields')
		return
	}

	try {
		loading.value = true

		if (isEditing.value) {
			// Update game
			const response = await fetch(`${API_BASE_URL}/games/${editingGameId.value}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData.value)
			})
			const data = await response.json()
			if (data.success) {
				alert('Game updated successfully')
				fetchGames()
				resetForm()
			} else {
				alert('Error updating game: ' + data.error)
			}
		} else {
			// Create new game
			const response = await fetch(`${API_BASE_URL}/games`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData.value,
					supervisorId: user.value.id
				})
			})
			const data = await response.json()
			if (data.success) {
				alert('Game created successfully')
				fetchGames()
				resetForm()
			} else {
				alert('Error creating game: ' + data.error)
			}
		}
	} catch (err) {
		console.error('Error submitting form:', err)
		alert('Error submitting form')
	} finally {
		loading.value = false
	}
}

const deleteGame = async (gameId) => {
	if (!confirm('Are you sure you want to delete this game?')) {
		return
	}

	try {
		loading.value = true
		const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
			method: 'DELETE'
		})
		const data = await response.json()
		if (data.success) {
			alert('Game deleted successfully')
			fetchGames()
		} else {
			alert('Error deleting game: ' + data.error)
		}
	} catch (err) {
		console.error('Error deleting game:', err)
		alert('Error deleting game')
	} finally {
		loading.value = false
	}
}

const handleLogout = () => {
	localStorage.removeItem('user')
	router.push('/')
}
</script>

<template>
	<main class="rm-layout">
		<!-- Sidebar Navigation -->
		<aside class="sidebar">
			<div class="sidebar-header">
				<h2>Event Manager</h2>
			</div>
			<nav class="sidebar-nav">
				<button 
					type="button"
					class="nav-item"
					:class="{ active: currentSection === 'dashboard' }"
					@click="navigateTo('dashboard')"
				>
					<span class="nav-icon">📊</span>
					<span class="nav-label">Dashboard</span>
				</button>
				<button 
					type="button"
					class="nav-item"
					:class="{ active: currentSection === 'event-management' }"
					@click="navigateTo('event-management')"
				>
					<span class="nav-icon">📅</span>
					<span class="nav-label">Event Management</span>
				</button>
			</nav>
			<div class="sidebar-footer">
				<button type="button" class="btn-logout" @click="handleLogout">
					Logout
				</button>
			</div>
		</aside>

		<!-- Main Content -->
		<div class="main-content">
			<!-- Dashboard Section -->
			<section v-if="currentSection === 'dashboard'" class="content-section">
				<div class="section-header">
					<h1>Welcome Back, {{ user?.firstName }}!</h1>
				</div>
				<div class="content-grid">
					<div class="card welcome-card">
						<h3>Your Profile</h3>
						<p><strong>Name:</strong> {{ user?.firstName }} {{ user?.lastName }}</p>
						<p><strong>Email:</strong> {{ user?.email }}</p>
						<p><strong>Phone:</strong> {{ user?.phone }}</p>
						<p><strong>Role:</strong> {{ user?.role }}</p>
					</div>
					<div class="card info-card">
						<h3>Quick Start</h3>
						<p>Welcome to your supervisor portal! Use the navigation menu on the left to:</p>
						<ul>
							<li>Manage your events</li>
							<li>Create new games</li>
							<li>Edit existing games</li>
							<li>Delete games as needed</li>
						</ul>
					</div>
				</div>
			</section>

			<!-- Event Management Section -->
			<section v-if="currentSection === 'event-management'" class="content-section">
				<div class="section-header">
					<h1>Event Management</h1>
					<button 
						v-if="!showForm"
						type="button" 
						class="btn-primary" 
						@click="openCreateForm"
					>
						+ Create New Event
					</button>
				</div>

				<!-- Create/Edit Form -->
				<div v-if="showForm" class="form-container">
					<div class="form-card">
						<h3>{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h3>
						<form @submit.prevent="submitForm">
							<div class="form-group">
								<label for="date">Date:</label>
								<input 
									id="date"
									v-model="formData.date" 
									type="date" 
									required
								/>
							</div>

							<div class="form-group">
								<label for="time">Time:</label>
								<input 
									id="time"
									v-model="formData.time" 
									type="time" 
									required
								/>
							</div>

							<div class="form-group">
								<label for="location">Location:</label>
								<input 
									id="location"
									v-model="formData.location" 
									type="text" 
									placeholder="Enter location"
									required
								/>
							</div>

							<div class="form-group">
								<label for="sport">Sport Type:</label>
								<input 
									id="sport"
									v-model="formData.sportType" 
									type="text" 
									placeholder="Enter sport type (e.g., Basketball, Soccer)"
									required
								/>
							</div>

							<div class="form-actions">
								<button type="submit" class="btn-primary" :disabled="loading">
									{{ loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event') }}
								</button>
								<button type="button" class="btn-secondary" @click="resetForm">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>

				<!-- Events List -->
				<div v-if="!showForm" class="events-container">
					<div v-if="games.length === 0" class="empty-state">
						<p>No events created yet. Click "Create New Event" to get started.</p>
					</div>

					<div v-else class="events-grid">
						<div v-for="game in games" :key="game.id" class="event-card">
							<div class="event-header">
								<h4>{{ game.sportType }}</h4>
								<span class="event-date">{{ game.date }}</span>
							</div>
							<div class="event-details">
								<p><strong>Time:</strong> {{ game.time }}</p>
								<p><strong>Location:</strong> {{ game.location }}</p>
							</div>
							<div class="event-actions">
								<button 
									type="button" 
									class="btn-edit" 
									@click="openEditForm(game)"
									:disabled="loading"
								>
									Edit
								</button>
								<button 
									type="button" 
									class="btn-delete" 
									@click="deleteGame(game.id)"
									:disabled="loading"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</main>
</template>

<style scoped>
* {
	box-sizing: border-box;
}

.rm-layout {
	display: flex;
	height: 100vh;
	background: #f5f5f5;
}

/* Sidebar Styles */
.sidebar {
	width: 280px;
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
	color: white;
	display: flex;
	flex-direction: column;
	box-shadow: 4px 0 16px rgba(27, 94, 63, 0.15);
	overflow-y: auto;
	position: relative;
}

.sidebar-header {
	padding: 2rem 1.5rem;
	border-bottom: 2px solid rgba(255, 255, 255, 0.25);
	background: rgba(0, 0, 0, 0.1);
}

.sidebar-header h2 {
	margin: 0;
	font-size: 1.5rem;
	font-weight: 800;
	letter-spacing: 0.5px;
	text-transform: uppercase;
}

.sidebar-nav {
	flex: 1;
	padding: 1rem 0;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.nav-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.1rem 1.5rem;
	background: none;
	border: none;
	color: rgba(255, 255, 255, 0.85);
	cursor: pointer;
	font-size: 1rem;
	transition: all 0.3s ease;
	text-align: left;
	font-weight: 500;
	margin: 0.25rem 0.5rem;
	border-radius: 8px;
}

.nav-item:hover {
	background: rgba(255, 255, 255, 0.15);
	color: white;
	transform: translateX(4px);
}

.nav-item.active {
	background: rgba(255, 255, 255, 0.25);
	color: white;
	border-left: 4px solid white;
	padding-left: calc(1.5rem - 4px);
	font-weight: 600;
	box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-icon {
	font-size: 1.25rem;
}

.nav-label {
	font-weight: 500;
}

.sidebar-footer {
	padding: 1.5rem;
	border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-logout {
	width: 100%;
	padding: 0.75rem 1rem;
	background: rgba(255, 255, 255, 0.2);
	border: 2px solid rgba(255, 255, 255, 0.5);
	color: white;
	border-radius: 4px;
	cursor: pointer;
	font-weight: 500;
	transition: all 0.3s ease;
}

.btn-logout:hover {
	background: rgba(255, 255, 255, 0.3);
	border-color: white;
}

/* Main Content Styles */
.main-content {
	flex: 1;
	overflow-y: auto;
	padding: 2rem;
	background: var(--color-light);
}

.content-section {
	animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	gap: 1rem;
}

.section-header h1 {
	margin: 0;
	color: var(--color-primary);
	font-size: 2rem;
	font-weight: 700;
}

/* Buttons */
.btn-primary {
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
	color: white;
	border: none;
	padding: 0.85rem 1.75rem;
	border-radius: 10px;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 700;
	transition: all 0.3s ease;
	text-transform: uppercase;
	letter-spacing: 0.6px;
	box-shadow: 0 6px 16px rgba(27, 94, 63, 0.15);
}

.btn-primary:hover:not(:disabled) {
	transform: translateY(-3px);
	box-shadow: 0 10px 28px rgba(27, 94, 63, 0.25);
}

.btn-primary:active:not(:disabled) {
	transform: translateY(-1px);
}

.btn-primary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-secondary {
	background: var(--color-gray-light);
	color: var(--color-primary);
	border: 2px solid var(--color-primary);
	padding: 0.75rem 1.5rem;
	border-radius: 8px;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 600;
	transition: all 0.3s ease;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.btn-secondary:hover:not(:disabled) {
	background: var(--color-primary);
	color: white;
	transform: translateY(-2px);
	box-shadow: var(--shadow-lg);
}

.btn-secondary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-edit {
	background: var(--color-primary);
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 6px;
	cursor: pointer;
	font-size: 0.9rem;
	font-weight: 600;
	transition: all 0.3s ease;
}

.btn-edit:hover:not(:disabled) {
	background: var(--color-primary-light);
	transform: translateY(-1px);
	box-shadow: var(--shadow-md);
}

.btn-edit:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-delete {
	background: var(--color-error);
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 6px;
	cursor: pointer;
	font-size: 0.9rem;
	font-weight: 600;
	transition: all 0.3s ease;
}

.btn-delete:hover:not(:disabled) {
	background: #b91c1c;
	transform: translateY(-1px);
	box-shadow: var(--shadow-md);
}

.btn-delete:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

/* Cards */
.card {
	background: white;
	border-radius: 14px;
	padding: 2rem;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	border-top: 6px solid var(--color-primary);
}

.card:hover {
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
	transform: translateY(-6px);
}

.card h3 {
	margin-top: 0;
	color: var(--color-primary);
	font-size: 1.4rem;
	font-weight: 800;
	letter-spacing: -0.5px;
}

.card p {
	margin: 0.5rem 0;
	color: var(--color-gray);
	line-height: 1.6;
}

.card ul {
	margin: 1rem 0;
	padding-left: 1.5rem;
	color: var(--color-gray);
	line-height: 1.8;
}

.card li {
	margin: 0.5rem 0;
}

.content-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
	margin-bottom: 2rem;
}

/* Form Styles */
.form-container {
	margin-bottom: 2rem;
}

.form-card {
	background: white;
	padding: 2.5rem;
	border-radius: 14px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	max-width: 600px;
	border-top: 6px solid var(--color-primary);
}

.form-card h3 {
	margin-top: 0;
	color: var(--color-primary);
	font-size: 1.6rem;
	font-weight: 800;
	margin-bottom: 2rem;
	letter-spacing: -0.5px;
}

.form-group {
	margin-bottom: 1.5rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	color: var(--color-dark);
	font-weight: 600;
	text-transform: uppercase;
	font-size: var(--font-size-sm);
	letter-spacing: 0.5px;
}

.form-group input {
	width: 100%;
	padding: 0.9rem 1rem;
	border: 2px solid var(--color-gray-light);
	border-radius: 10px;
	font-size: 1rem;
	transition: all 0.3s ease;
	font-family: inherit;
	background: white;
}

.form-group input:focus {
	outline: none;
	border-color: var(--color-primary);
	box-shadow: 0 0 0 6px rgba(27, 94, 63, 0.08);
	transform: translateY(-2px);
}

.form-group input::placeholder {
	color: var(--color-gray);
}

.form-actions {
	display: flex;
	gap: 1rem;
	margin-top: 2rem;
}

.form-actions button {
	flex: 1;
}

/* Events Grid */
.events-container {
	margin-top: 2rem;
}

.empty-state {
	text-align: center;
	padding: 3rem;
	color: var(--color-gray);
	font-size: 1.1rem;
	background: white;
	border-radius: 12px;
	box-shadow: var(--shadow-md);
	border-top: 4px solid var(--color-primary);
}

.events-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 1.5rem;
	animation: fadeIn 0.3s ease;
}

.event-card {
	background: white;
	border-radius: 14px;
	overflow: hidden;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	height: 100%;
	border-top: 6px solid var(--color-primary);
}

.event-card:hover {
	box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
	transform: translateY(-8px);
}

.event-header {
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
	color: white;
	padding: 1.75rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-header h4 {
	margin: 0;
	font-size: 1.3rem;
	font-weight: 800;
	letter-spacing: -0.5px;
}

.event-date {
	font-size: 0.9rem;
	opacity: 0.9;
	background: rgba(255, 255, 255, 0.2);
	padding: 0.25rem 0.75rem;
	border-radius: 20px;
}

.event-details {
	padding: 1.5rem;
	flex: 1;
}

.event-details p {
	margin: 0.75rem 0;
	color: var(--color-gray);
}

.event-details strong {
	color: var(--color-dark);
}

.event-actions {
	padding: 0 1.5rem 1.5rem;
	display: flex;
	gap: 0.75rem;
}

.event-actions button {
	flex: 1;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: var(--color-light);
}

::-webkit-scrollbar-thumb {
	background: var(--color-primary);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: var(--color-primary-light);
}

/* Responsive */
@media (max-width: 768px) {
	.rm-layout {
		flex-direction: column;
	}

	.sidebar {
		width: 100%;
		flex-direction: row;
		max-height: 80px;
	}

	.sidebar-header {
		display: none;
	}

	.sidebar-nav {
		flex-direction: row;
		padding: 0.5rem;
		gap: 0;
	}

	.nav-item {
		flex: 1;
		padding: 0.5rem;
		justify-content: center;
	}

	.nav-label {
		display: none;
	}

	.sidebar-footer {
		display: none;
	}

	.main-content {
		padding: 1rem;
	}

	.section-header {
		flex-direction: column;
		gap: 1rem;
	}

	.section-header h1 {
		font-size: 1.5rem;
	}

	.events-grid {
		grid-template-columns: 1fr;
	}

	.content-grid {
		grid-template-columns: 1fr;
	}
}
</style>
