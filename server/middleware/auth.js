const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Token kommer oftast som "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Ingen token tillhandahölls (Unauthorized)' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Ogiltig token (Forbidden)' });
    }

    // Spara användarinfon i request-objektet så nästa funktion kan använda den
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
