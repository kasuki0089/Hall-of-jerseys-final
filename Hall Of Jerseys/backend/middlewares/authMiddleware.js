const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'seu_segredo', (err, usuario) => {
        if (err) return res.sendStatus(403);
        req.usuario = usuario;
        next();
    });
}

function verificarAdmin(req, res, next) {
    if (req.usuario && req.usuario.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Acesso negado.' });
    }
}

module.exports = { autenticarToken, verificarAdmin };
