var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var axios = require("axios");
var cors = require('cors');
app.use(cors());

var port =  process.env.port || 4000

users = [];

app.get("/", function (req, res) {
   res.sendFile(__dirname + "/ui.html");
   console.log("users",users);
 });

app.get("/reset", function (req, res) {
   users = []
   res.send("OK!")
 });

app.get("/news", async function (req, res) {

  const BASE_URL = 'https://newsapi.org/v2/everything?q=technology&apiKey=dee32b64c5754a819b8fb36a8c1c52bf';
   try {
    const response = await axios.get(`${BASE_URL}`);
    const todoItems = response.data;
    console.log(`GET: NEWS`, todoItems);
    const jsonContent = JSON.stringify(todoItems);
    res.end(jsonContent);
    // return todoItems;
  } catch (errors) {
    console.error(errors);
  }

 });

io.on("connection", function (socket) {
  console.log("A user connected");
  socket.on("setUsername", function (data) {
   //  console.log(data);
    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      users.push(data);
      socket.emit("userSet", { username: data });
    }
  });
  socket.on("msg", function (data) {
    //Send message to everyone
    // console.log("--", data);
    io.sockets.emit("newmsg", data);
  });
});
http.listen(port, function () {
  console.log("listening on localhost:4000");
});
