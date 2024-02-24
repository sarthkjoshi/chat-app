import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface CustomRequest extends Request {
  user?: any; // Define the user property here, the type can be adjusted according to your application's requirements
}
const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]!;

  if (token === undefined || token === null) {
    res.send({ message: "Please Login", success: false });
  }
  const isToken = jwt.verify(token, process.env.JWT_SECRET!);
  if (token) {
    req.user = isToken;
    next();
  }
};
export default authMiddleware;
