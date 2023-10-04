const jwt = require('jsonwebtoken')
const pool = require('../bancodedados/conexao')
require("dotenv").config()

const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)

        const { rows, rowCount } = await pool.query(
            'select * from usuarios where id = $1',
            [id]
        )

        if (rowCount < 1) {
            return res.status(401).json({ mensagem: 'Não autorizado' })
        }

        req.usuario = rows[0]

        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'Não autorizado' })
    }
}

module.exports = verificarUsuarioLogado