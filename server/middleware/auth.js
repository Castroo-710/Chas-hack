const jwt = require('jsonwebtoken');

// Fastify decorator/preHandler style
async function authenticateToken(request, reply) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    reply.code(401).send({ error: 'Ingen token tillhandahölls (Unauthorized)' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    request.user = user;
  } catch (err) {
    reply.code(403).send({ error: 'Ogiltig token (Forbidden)' });
  }
}

module.exports = { authenticateToken };