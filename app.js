require("dotenv").config();

const express = require("express");
const userRoute = require("./routes/user")
const findUserRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const Blog = require("./models/blog")
const mongoose = require("mongoose")
const path = require("path");
const app = express();
const PORT  = process.env.PORT;
const cookieParser = require("cookie-parser")
const {checkForAuthenticationCookie} = require("./middleware/authentication")



mongoose.connect(process.env.MONGO_URL).then((e)=>{console.log("mongodb connected")})


app.set('view engine', "ejs")
app.set("views", path.resolve('./views'))


app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.get("/",(async (req,res)=>{
    const allBlogs = await Blog.find({}).sort({createdAt: -1});
    return res.render("home",{
        user: req.user,
        blogs: allBlogs,
    })
}))
app.use("/user",userRoute)
app.use("/blog",blogRoute)


app.listen(PORT,()=>{console.log(`server is running at http://localhost:${PORT} `)})