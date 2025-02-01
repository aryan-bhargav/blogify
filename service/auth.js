const JWT = require("jsonwebtoken")

const secretKey = "ry5hdr5g5gd7t5$B@$bt441hfx5y44";

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