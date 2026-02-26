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

startServer(port)