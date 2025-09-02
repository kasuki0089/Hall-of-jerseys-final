const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Cadastro de usuário
exports.register = (req, res) => {
    const { nome, email, senha, telefone, endereco, cidade, estado, cep, data_nascimento } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const hashedPassword = bcrypt.hashSync(senha, 10);

    const query = 'INSERT INTO usuarios (nome, email, senha, telefone, endereco, cidade, estado, cep, data_nascimento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, email, hashedPassword, telefone, endereco, cidade, estado, cep, data_nascimento], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
};

// Login de usuário
exports.login = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro no servidor.' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        const usuario = results[0];

        if (!bcrypt.compareSync(senha, usuario.senha)) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'seu_segredo', { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido!', token });
    });
};
