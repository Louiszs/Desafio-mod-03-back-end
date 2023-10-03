const conexao = require('../bancodedados/conexao')
const bcrypt = require('bcrypt')

const cadastrar = async (req, res) => {
    try {
        let { nome, email, senha } = req.body

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Preencha os campos obrigatórios: nome, email e senha'
            })
        }

        const usuarioEncontrado = await conexao.query(
            'select * from usuarios where email = $1',
            [email]
        )

        if (usuarioEncontrado.rowCount > 0) {
            return res.status(400).json({
                mensagem: 'E-mail informado está vinculado a outro usuário.'
            })
        }

        let senhaCriptografada = await bcrypt.hash(senha, 10)

        const usuarioCriado = await conexao.query(
            'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email',
            [nome, email, senhaCriptografada]
        )

        return res.status(201).json(usuarioCriado.rows[0])
    } catch (erro) {
        return res.status(400).json({ mensagem: erro.message })
    }
}


module.exports = {
    cadastrar
}