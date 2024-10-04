const express = require('express') // imports express framework
const router = express.Router() // mini express app used to define routes seperately from main app, used for organization
const path = require('path')

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router