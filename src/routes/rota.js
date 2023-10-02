const express = require("express")
const controller = require("../controller/controlador")

const rota = express()

rota.get("/", controller.test)


module.exports = rota