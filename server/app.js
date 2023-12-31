const express = require("express");
const app = express();

const loginRoute = require("./routes/loginRoute")
const usersRoutes = require("./routes/usersRoutes")
const todosRoutes = require("./routes/todosRoutes")
const postsRoutes = require("./routes/postsRoutes")
const commentsRoutes = require("./routes/commentsRoutes")

app.use(express.json());

app.use("/login", loginRoute)
app.use("/api/users", usersRoutes)
app.use("/api/todos", todosRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/comments", commentsRoutes)

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server is up and runningon port " + port);
})