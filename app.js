const express = require('express')
const app = express()
const config = require('config')
const mongoose = require('mongoose')
const port = config.get('port') || 5000
const mongoUri = config.get('mongoUri')

async function start() {
    try {
        await mongoose.connect((mongoUri), { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            connectTimeoutMS: 1000
        })

        app.listen(port, () => console.log(`App has been started on port ${port}`))
    }
    catch (e) {
        console.log(`server error. Message: ${e.message}`)
        process.exit(1)
    }
}

start()

