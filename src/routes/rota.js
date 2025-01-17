const express = require("express")
const usuario = require("../controller/usuarios")
const transacao = require("../controller/transacoes")
const verificarUsuarioLogado = require("../middleware/intermediario")

const rota = express()

rota.post("/usuario", usuario.cadastrar)
rota.post('/login', usuario.login)

rota.use(verificarUsuarioLogado)

rota.put("/usuario", usuario.atualizarUsuario)
rota.get("/usuario", usuario.detalharUsuario)
rota.get("/categoria", usuario.listarCategoria)

rota.post("/transacao", transacao.cadastrarTransacao)
rota.get("/transacao/extrato", transacao.obterExtrato)
rota.get("/transacao/:id", transacao.detalharTransacao)
rota.get("/transacao", transacao.listarTransacoes)
rota.put("/transacao/:id", transacao.atualizarTransacao)
rota.delete("/transacao/:id", transacao.excluirTransacao)



module.exports = rota