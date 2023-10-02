const express = require("express")
const rota = require("./routes/rota")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(rota)


app.listen(process.env.PORT, () => {
    console.log(`servidor iniciado na porta ${process.env.PORT}`)
})