const express = require('express')
const cors = require('cors')
const nhlRoutes = require('./routes/nhl')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/nhl', nhlRoutes)

app.listen(5000, () => console.log('Server running on port 5000'))