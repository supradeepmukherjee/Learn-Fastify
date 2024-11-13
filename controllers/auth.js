import bcrypt from 'bcryptjs'
import { User } from '../models/user'
import crypto from 'crypto'

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const hashedP = await bcrypt.hash(password, 12)
        const user = new User({ name, email, password: hashedP })
        await user.save()
        res.code(201).send({ user, msg: 'User Registered Successfully' })
    } catch (err) {
        res.send(err)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.code(400).send({ msg: 'Invalid Email/Password' })
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return res.code(400).send({ msg: 'Invalid Email/Password' })
        const token = req.server.jwt.sign({ id: user._id })
        res.code(200).send({ token, msg: 'Logged In Successfully' })
    } catch (err) {
        res.send(err)
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.notFound('User not Found')
        const token = crypto.randomBytes(27).toString('hex')
        const tokenExpiry = Date.now() + 600000
        user.resetPasswordToken = token
        user.resetPasswordExpiry = tokenExpiry
        await user.save()
        const url = `http://localhost:${process.env.port}/api/auth/reset-password/${token}`
        res.code(200).send({ url })
    } catch (err) {
        res.send(err)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { newP } = req.body
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        })
        if (!user) return res.badRequest('Expired/Invalid Token')
        const password = await bcrypt.hash(newP, 12)
        user.password = password
        user.resetPasswordExpiry = undefined
        user.resetPasswordToken = undefined
        await user.save()
        res.code(200).send({ url })
    } catch (err) {
        res.send(err)
    }
}

const logout = (req, res) => res.send({ msg: 'Logged Out' })

export { register, login, forgotPassword, resetPassword, logout }