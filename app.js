const express = require('express')
const app = express()

const config = require('config')

let port = config.get('port') || 5000
app.listen(port, () => console.log(`App has been started on port ${port}`))