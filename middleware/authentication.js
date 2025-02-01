const { validateToken } = require("../service/auth");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            // If no token is present, do not attach user and proceed
            return next();
        }

        try {
            // Validate the token and attach the user payload to `req.user`
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            next();
        } catch (error) {
            console.error("Invalid token:", error.message); // Optional logging for debugging
            // Clear the invalid token from cookies
            res.clearCookie(cookieName);
            // Redirect or return an error response if needed
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
