import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Not Authorized" })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('password')
        next()
    } catch (error) {
        return res.status(500).status({ error })
    }
}

export default protect