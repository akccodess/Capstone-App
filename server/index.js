import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

const startServer = (startPort) => {
  const server = app.listen(startPort, () => {
    console.log(`Backend running on http://localhost:${startPort}`)
  })

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const newPort = startPort + 1
      console.log(`Port ${startPort} is already in use, starting server on ${newPort}...`)
      startServer(newPort)
      return
    }

    console.error('Server error:', error)
    process.exit(1)
  })
}

app.post('/api/users', async(req, res)=>{
  try{

    const {firstName, lastName, email, password, role, phone} = req.body

    if(!firstName || !lastName || !email){
      return res.status(400).json({error : "First name, last name, and email are required"})
    }

    const user = await prisma.user.create({
      data : {
        firstName,
        lastName,
        email,
        password: password || '',
        role: role || '',
        phone: phone || ''
      }
    })

    res.status(201).json({ success: true, user })

  }
  catch(err)
  {
    res.status(500).json({error : err.message})
  }

})

app.post('/api/login', async(req, res)=>{
  try{
    const {email, password} = req.body

    if(!email || !password){
      return res.status(400).json({error : "Email and password are required"})
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if(!user){
      return res.status(401).json({error : "Invalid email or password"})
    }

    // Simple password check (in production, use bcrypt)
    if(user.password !== password){
      return res.status(401).json({error : "Invalid email or password"})
    }

    res.status(200).json({ 
      success: true, 
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    })

  }
  catch(err)
  {
    res.status(500).json({error : err.message})
  }
})

// Game Management API Endpoints (Supervisor only)

// Create game
app.post('/api/games', async(req, res) => {
  try {
    const { date, time, location, sportType, supervisorId } = req.body

    if (!date || !time || !location || !sportType || !supervisorId) {
      return res.status(400).json({ error: "Date, time, location, sport type, and supervisor ID are required" })
    }

    const game = await prisma.game.create({
      data: {
        date,
        time,
        location,
        sportType,
        supervisorId
      }
    })

    res.status(201).json({ success: true, game })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all games for a supervisor
app.get('/api/games/supervisor/:supervisorId', async(req, res) => {
  try {
    const { supervisorId } = req.params

    const games = await prisma.game.findMany({
      where: {
        supervisorId: parseInt(supervisorId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json({ success: true, games })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single game by ID
app.get('/api/games/:id', async(req, res) => {
  try {
    const { id } = req.params

    const game = await prisma.game.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (!game) {
      return res.status(404).json({ error: "Game not found" })
    }

    res.status(200).json({ success: true, game })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update game
app.put('/api/games/:id', async(req, res) => {
  try {
    const { id } = req.params
    const { date, time, location, sportType } = req.body

    // Verify game exists
    const existingGame = await prisma.game.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingGame) {
      return res.status(404).json({ error: "Game not found" })
    }

    const updatedGame = await prisma.game.update({
      where: { id: parseInt(id) },
      data: {
        ...(date && { date }),
        ...(time && { time }),
        ...(location && { location }),
        ...(sportType && { sportType })
      }
    })

    res.status(200).json({ success: true, game: updatedGame })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete game
app.delete('/api/games/:id', async(req, res) => {
  try {
    const { id } = req.params

    // Verify game exists
    const existingGame = await prisma.game.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingGame) {
      return res.status(404).json({ error: "Game not found" })
    }

    await prisma.game.delete({
      where: { id: parseInt(id) }
    })

    res.status(200).json({ success: true, message: "Game deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

startServer(port)