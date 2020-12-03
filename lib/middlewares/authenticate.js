const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
/**
 * Authentication Middleware for update/delete/create
 */
function authenticate() {
    return async function authenticateUser(req, res, next) {
        try {
            // Authorization header is of the form `JWT [token]` so splitting
            let authorizationToken = req.headers.authorization;
            const token = authorizationToken.split(' ')[1];
            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        }
        catch (ex) {
            // failing and throwing 401 in case of no auth
            res.sendStatus(401);
        }
    };
}

module.exports = authenticate;
