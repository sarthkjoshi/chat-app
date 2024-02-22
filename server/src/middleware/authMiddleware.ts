import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt_token;

  if (token === undefined || token === null) {
    res.send({ message: "Please Login", success: false });
  }
  const isToken = jwt.verify(token, process.env.JWT_SECRET!);
  if (token) {
    next();
  }
};
export default authMiddleware;
