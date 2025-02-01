const { Router } = require("express");
const User = require("../models/user")
const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
})
router.get("/signup", (req, res) => {
    return res.render("signup");
})
router.get("/findUsers",(req,res)=>{
    console.log("come..")
    res.render("findUser")
})
router.post("/findUsers", async (req , res) => {
    const{fullName} = req.body;
    const users = User.find({fullName:`fullName`});
    res.render(findUser,{
        users: users,
    })
})
router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    })
    return res.redirect("/")
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        // Pass the error variable to the `signin` view
        return res.render("signin", {
            error: "Please check your password or email",
        });
    }
});

router.get("/logout" ,(req,res) => {
    res.clearCookie("token").redirect("/")
})

module.exports = router;