const jwt = require('jsonwebtoken');


function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  try {
   

    const dadosToken = jwt.verify(token, process.env.JWT_SECRET);

    
    req.administrador = dadosToken;

    next(); 
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = autenticar;