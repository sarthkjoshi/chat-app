import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import prisma from "./config/db.config";
import bcrypt from "bcryptjs";
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  console.log("Middleware");
  next();
});

io.on("connection", (socket) => {
  console.log("A user connected with id: ", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat", (message) => {
    console.log("Message received : ", message.handle, message.message);

    io.emit("message", message.handle, message.message);
  });
});

app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  bcrypt.genSaltSync(11);
  // await prisma.user.create({
  //   data: {
  //     email,
  //     name,
  //     password: hashedPassword,
  //   },
  //   });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await prisma.user.findUnique({ where: { email: email } });
  if (!foundUser) {
    res.json({ message: "No user found" });
  }
});
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
