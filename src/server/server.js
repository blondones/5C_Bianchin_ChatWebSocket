app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
   console.log("socket connected: " + socket.id);
   io.emit("chat", "new client: " + socket.id);
   socket.on('message', (message) => {
      const response = socket.id + ': ' + message;
      console.log(response);
      io.emit("chat", response);
   });
});