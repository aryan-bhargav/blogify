const { Schema, default: mongoose } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../service/auth")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/user.png",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
},
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    const user = this;

    // If the password isn't modified, skip hashing
    if (!user.isModified("password")) return next();

    // Generate a salt and hash the password
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)    //algorithm sha256
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");


    const userSalt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", userSalt).update(password).digest("hex");
    if (userProvidedHash !== hashedPassword) throw new Error(" Incorrect Password ");
    const token = createTokenForUser(user);
    return token;

})

// Export the model after defining middleware
const User = mongoose.model("user", userSchema);
module.exports = User;
