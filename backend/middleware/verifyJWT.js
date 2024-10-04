const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    // get authHeader from either lower or uppercase a - uthorization
    const authHeader = req.headers.authorization || req.headers.Authorization

    // if it doesnt start with Bearer
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    // get the jwt token
    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles
            next() // move on to next middleware or controller
        }
    )
}

module.exports = verifyJWT 