const JWT = require("jsonwebtoken")

const secretKey = process.env.JWT_SECRET;

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    }

    const token = JWT.sign(payload, secretKey)
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token,secretKey)
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}