import { Request, Response, NextFunction } from "express";
import { getDecodedToken } from "../utils";
import { UserModel } from "../models/user.model";
import { IUser } from "../imodel/user.imodel";

declare global {
  namespace Express {
    interface Request {
      context?: IUser;
    }
  }
}
const whiteListedRoutes: Array<string> = [
  "/api/signup",
  "/api/forgot-password",
  "/api/login",
  "/api/reset-password"
];

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let token = req.headers.authorization;
  if (whiteListedRoutes.indexOf(req.url) > -1) {
    next();
  } else if (token && token.startsWith("Bearer ")) {

    token = token.slice(7, token.length);
    const decoded: any = await getDecodedToken(token);
    let currentUser: any;
    if (decoded.userId) {
      currentUser = await UserModel.findOne({ _id: decoded.userId })
        .lean()
        .exec();
      if (currentUser) {
        req.context = <IUser>currentUser;
        next();
      } else {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
