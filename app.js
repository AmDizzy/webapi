require('dotenv').config()

const port = process.env.SERVERAPI_PORT
const mongoDB = require('./mongodb_server')
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const app = express ()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// routes
app.use('/api/products', require('./controllers/productsController'))

app.use('/api/users', require('./controllers/usersController'))



// start web api
mongoDB()
app.listen(port, () => console.log(`Web Api is running on http://localhost:${port}`))