const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const { models } = require('../../database/models');
const { JWT_SECRET } = require('../../config');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(password);
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


module.exports = router;