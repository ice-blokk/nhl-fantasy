const express = require('express')
const cors = require('cors')
const path = require('path')
const nhlRoutes = require('./routes/nhl')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/nhl', nhlRoutes)

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')))

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))