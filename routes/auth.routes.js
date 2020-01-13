let { Router } = require('express')
let User = require('../models/User')
let router = Router()
let bcryptjs = require('bcryptjs')
let { check, validationResult } = require('express-validator')
let jwt = require('jsonwebtoken')
let config = require('config')

// api/auth/register
router.post(
    '/register',
    [
        check('email', 'bad email').isEmail(),
        check('password', 'Minimal length of password is 6 symbols').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            let error = validationResult(req)

            if (!error.isEmpty()) {
                return req.status(400).json({
                    error: error.array(),
                    message: 'Wrong data on registration'
                })
            }

            let { email, password } = req.body

            let candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: "User exists" })
            }

            let hashedPassword = await bcryptjs.hash(password, 12)
            let user = new User({ email, password: hashedPassword })

            await user.save()

            req.status(201).json({ message: 'User created' })
        }
        catch (e) {
            res.status(500).json({ message: 'Something gone wrong' })
        }
    })

// api/auth/register
router.post(
    '/login',
    [
        check('email', 'bad email').normalizeEmail().isEmail(),
        check('password', 'Inter password').exists()
    ],
    async (req, res) => {
        try {
            let error = validationResult(req)

            if (!error.isEmpty()) {
                return req.status(400).json({
                    error: error.array(),
                    message: 'Wrong data on login'
                })
            }

            let { email, password } = req.body

            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: "User not exists" })
            }

            let isMatch = await bcryptjs.compare(passwoclrd, user.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Wrong password" })
            }

            let token = jwt.sign(
                { userId: user.id },
                config.get('jwt_secret'),
                { expiresIn: '1h' }
            )

            req.json({ token, userId: user.id })
        }
        catch (e) {
            res.status(500).json({ message: 'Something gone wrong' })
        }
    })

module.exports = router