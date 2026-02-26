<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
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
  if (user.value.role !== 'Supervisor') {
    router.push('/student-dashboard')
    return
  }
  
  fetchGames()
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
  <main class="dashboard-page">
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Game Management</h1>
        <button type="button" class="btn-link" @click="handleLogout">Logout</button>
      </div>

      <div class="dashboard-content">
        <div class="welcome-card">
          <h2>Welcome, {{ user?.firstName }} {{ user?.lastName }}!</h2>
          <p>Role: {{ user?.role }}</p>
          <p>Email: {{ user?.email }}</p>
        </div>

        <div class="info-card">
          <h3>Manage Games</h3>
          <button type="button" class="btn-primary" @click="openCreateForm" v-if="!showForm">
            Create New Game
          </button>

          <!-- Create/Edit Form -->
          <div class="form-card" v-if="showForm">
            <h4>{{ isEditing ? 'Edit Game' : 'Create New Game' }}</h4>
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
                  placeholder="Enter sport type"
                  required
                />
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary" :disabled="loading">
                  {{ loading ? 'Saving...' : (isEditing ? 'Update Game' : 'Create Game') }}
                </button>
                <button type="button" class="btn-secondary" @click="resetForm">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Games List -->
          <div class="games-list" v-if="!showForm">
            <div v-if="games.length === 0" class="empty-state">
              <p>No games created yet. {{ showForm ? '' : 'Click "Create New Game" to get started.' }}</p>
            </div>

            <div v-else class="games-grid">
              <div v-for="game in games" :key="game.id" class="game-card">
                <div class="game-details">
                  <h4>{{ game.sportType }}</h4>
                  <p><strong>Date:</strong> {{ game.date }}</p>
                  <p><strong>Time:</strong> {{ game.time }}</p>
                  <p><strong>Location:</strong> {{ game.location }}</p>
                </div>
                <div class="game-actions">
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
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2rem;
}

.btn-link {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;
}

.btn-link:hover {
  opacity: 0.8;
}

.dashboard-content {
  padding: 2rem;
}

.welcome-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.welcome-card h2 {
  margin-top: 0;
  color: #333;
}

.welcome-card p {
  margin: 0.5rem 0;
  color: #666;
}

.info-card {
  background: white;
  border: 1px solid #e0e0e0;
  padding: 2rem;
  border-radius: 8px;
}

.info-card h3 {
  margin-top: 0;
  color: #333;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-secondary:hover:not(:disabled) {
  background: #c0c0c0;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.form-card h4 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.games-list {
  margin-top: 2rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.game-card {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.game-details h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
}

.game-details p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.95rem;
}

.game-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-edit {
  background: #667eea;
  color: white;
}

.btn-edit:hover:not(:disabled) {
  background: #5568d3;
}

.btn-delete {
  background: #e57373;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background: #d32f2f;
}

.btn-edit:disabled,
.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
