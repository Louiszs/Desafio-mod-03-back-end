const conexao = require('../bancodedados/conexao')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Preencha os campos obrigatórios: email e senha'
            })
        }
        const usuario = await conexao.query("select * from usuarios where email = $1", [email])
        if (usuario.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Email ou senha invalida' })
        }
        const senhavalida = await bcrypt.compare(senha, usuario.rows[0].senha)
        if (!senhavalida) {
            return res.status(400).json({ mensagem: 'Email ou senha invalida' })
        }
        const token = jwt.sign({ id: usuario.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "8h" })
        const { senha: _, ...usuarioLogado } = usuario.rows[0]

        return res.json({ usuario: usuarioLogado, token })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const detalharUsuario = (req, res) => {
    const { senha, ...usuario } = req.usuario;
    try {
        res.status(200).json({ usuario: usuario })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}


module.exports = {
    cadastrar,
    login,
    detalharUsuario
}