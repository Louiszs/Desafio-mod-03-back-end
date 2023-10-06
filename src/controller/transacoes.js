const conexao = require('../bancodedados/conexao')
require("dotenv").config()

const cadastrarTransacao = async (req, res) => {
    try {
        const { descricao, valor, data, categoria_id, tipo } = req.body

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' })
        }

        const categoriaExistente = await conexao.query('select id from categorias where id =$1', [categoria_id])

        if (categoriaExistente.rowCount === 0) {
            return res.status(400).json({
                mensagem: 'Categoria não encontrada para o ID fornecido'
            })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({
                mensagem: 'O campo "tipo" deve ser "entrada" ou "saida"'
            })
        }

        const usuario_id = req.usuario.id
        const result = await conexao.query(
            'insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) returning id',
            [descricao, valor, data, categoria_id, usuario_id, tipo]
        )

        const transacaoCadastrada = { id: result.rows[0], descricao, valor, data, usuario_id, categoria_id, tipo }

        res.status(201).json(transacaoCadastrada);
    } catch (erro) {
        return res.status(400).json({ mensagem: erro.message })
    }
}

const detalharTransacao = async (req, res) => {
    try {
        const transacao_id = req.params.id;

        if (!Number.isInteger(parseInt(transacao_id))) {
            return res.status(400).json({ mensagem: 'ID inválido' });
        }

        const resultado = await conexao.query('select * from transacoes where id = $1 and usuario_id = $2', [transacao_id, req.usuario.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'transação não encontrada' });
        }
        return res.status(200).json(resultado.rows[0])
    } catch (erro) {
        return res.status(400).json({ mensagem: erro.message })
    }
}

const atualizarTransacao = async (req, res) => {
    try {
        const transacao_id = req.params.id;

        if (!Number.isInteger(parseInt(transacao_id))) {
            return res.status(400).json({ mensagem: 'ID inválido' });
        }

        const { descricao, valor, data, categoria_id, tipo } = req.body

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({
                mensagem: 'O campo "tipo" deve ser "entrada" ou "saida"'
            })
        }
        await conexao.query("update transacoes set descricao=$1, valor=$2, data=$3, categoria_id=$4, tipo=$5 where id=$6 and usuario_id=$7", [descricao, valor, data, categoria_id, tipo, transacao_id, req.usuario.id])

        return res.status(204).send()
    } catch (erro) {
        return res.status(400).json({ mensagem: erro.message })
    }
}

module.exports = {
    cadastrarTransacao,
    detalharTransacao,
    atualizarTransacao
}