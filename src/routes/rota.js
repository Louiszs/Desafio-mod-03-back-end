const express = require("express")
const usuário = require("../controller/usuarios")

const rota = express()

rota.post("/usuario", usuário.cadastrar)


module.exports = rota