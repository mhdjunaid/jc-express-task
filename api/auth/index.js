const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const { models } = require('../../database/models');
const { JWT_SECRET } = require('../../config');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await models.User.login({ email, password });
    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.email }, JWT_SECRET);
        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

router.post('/register', async (req, res) => {
    const { email, password, lastName, firstName } = req.body;
    const user = await models.User.create({ email, password, first_name: firstName, last_name: lastName });
    if (user) {
        res.send('User created');
    } else {
        res.send('User cannot be registered');
    }
});

module.exports = router;
