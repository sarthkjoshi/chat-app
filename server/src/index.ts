import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import prisma from "./config/db.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const server = http.createServer(app);
// const io = new SocketIOServer(server, {
//   cors: {
//     origin: "*",
//   },
// });

// io.use((socket, next) => {
//   console.log("Middleware");
//   next();
// });

// io.on("connection", (socket) => {
//   console.log("A user connected with id: ", socket.id);

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });

//   socket.on("chat", (message) => {
//     console.log("Message received : ", message.handle, message.message);

//     io.emit("message", message.handle, message.message);
//   });
// });
app.use(express.json());
app.use(cookieParser());
app.get("/", authMiddleware, (req, res) => {
  res.send("hello");
});

app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  res.json({ message: "Signed up!", success: true });
});

app.post("/login", async (req, res) => {
  const { email, password }: { email: string; password: string } = req.body;
  const foundUser = await prisma.user.findUnique({ where: { email: email } });
  if (!foundUser) {
    return res.json({ message: "No user found" });
  }
  if (!bcrypt.compareSync(password, foundUser?.password!)) {
    res.json({ message: "password dont match" });
  }
  const token = jwt.sign(
    {
      name: foundUser?.name,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  res.cookie("jwt_token", token);
  res.json({ message: "Cookie has been set!", success: true });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
