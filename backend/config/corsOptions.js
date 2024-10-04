const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        // allow if req origin in the array or no origin (postman)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true, // allows client to send req with Access-Control-Allow-Credentials header (allows cookies, auth headers, tls client certs, etc)
    optionsSuccessStatus: 200
}

module.exports = corsOptions