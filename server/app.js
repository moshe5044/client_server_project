const express = require("express");
const app = express();
const cors = require("cors")

app.use(cors());

const loginRoute = require("./routes/loginRoute")
const todosRoutes = require("./routes/todosRoutes")
const postsRoutes = require("./routes/postsRoutes")
const commentsRoutes = require("./routes/commentsRoutes");
//const authenticate = require("./routes/validations/authentication");

app.use(express.json());

app.use("/login", loginRoute)

// app.use(authenticate)

app.use("/todos", todosRoutes)
app.use("/posts", postsRoutes)
app.use("/comments", commentsRoutes)

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server is up and running on port " + port);
})