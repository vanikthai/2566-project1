const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const layout = require("express-ejs-layouts");
const part = require("path");
const session = require("express-session");
const parport = require("passport");
const falsh = require("connect-flash");
require("./passport")(parport);

app.use(
  session({
    secret: "112211",
    resave: true,
    saveUninitialized: true,
    rolling: true, // <-- Set `rolling` to `true`
    cookie: {
      httpOnly: true,
      maxAge: 2147483647,
    },
  })
);
// Passport middleware
app.use(parport.initialize());
app.use(parport.session());
app.use(falsh());
app.use(require("./flashmsg"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(layout);
app.use(express.static(part.join(__dirname, "public")));
app.use(require("./routes"));

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    console.log(msg);
    let payload = {
      id: socket.id,
      ...msg,
    };
    io.emit("message", payload);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("http://localhost:3000");
});
