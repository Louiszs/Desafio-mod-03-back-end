const express = require("express")
const usuario = require("../controller/usuarios")
const verificarUsuarioLogado = require("../middleware/intermediario")

const rota = express()

rota.post("/usuario", usuario.cadastrar)
rota.post('/login', usuario.login)

rota.use(verificarUsuarioLogado)

rota.get("/usuario", usuario.detalharUsuario)
rota.get("/categoria", usuario.listarCategoria)



module.exports = rota