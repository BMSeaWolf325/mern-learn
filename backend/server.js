require('dotenv').config() // loads .env file
require('express-async-errors')
const express = require('express') // imports express framework
const app = express() // creates express instance
const path = require('path')
const { logger, logEvents } = require('./middleware/logger') // logger function
const errorHandler = require('./middleware/errorHandler') // no {} since only 1 export
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500 // check for env var or 3500

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger) // logger function/middleware

app.use(cors(corsOptions))

app.use(express.json()) // parses JSON from req to req object, only if its JSON

app.use(cookieParser()) // parses the Cookie header and populates req.cookies with an object keyed by the cookie names

app.use('/', express.static(path.join(__dirname, 'public'))) // always serve these files

app.use('/', require('./routes/root')) // serves dependent on path
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))

// all() = all http req methods, * = all routes
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

// exec once, once connection established
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) // start server and listen to http reqs
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})