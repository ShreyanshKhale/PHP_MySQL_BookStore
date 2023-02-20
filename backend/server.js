const express = require("express")
const mongoose = require("mongoose")
const routesUrl = require("../backend/routes/router")
const cors = require("cors")

const app = express()

const port = 4000
const dbUrl = "mongodb://localhost:27017/bookstore"

mongoose.connect(dbUrl, () => {
    console.log("Database connected")
})

app.use(express.json())
app.use(cors())
app.use('/', routesUrl)
app.listen(port, () => {
    console.log("server is up and running on port ", port)
})
