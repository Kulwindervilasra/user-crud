import express, { Request, Response } from "express";
import IControllerBase from "../interfaces/IControllerBase.interface";
import { addNewUser, handleLogin, updatePassword } from "../manager/user.manager";
import { UserModel } from "../models/user.model";
import { validateBody } from "../utils"

export default class UserCtrl implements IControllerBase {
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.route("/login").post(this.login);
    this.router.route("/signup").post(this.signup);
    this.router.route("/user").put(this.updateUser).delete(this.deleteUser);
    this.router.route("/users").get(this.getAllUsers);
    this.router.route("/forgot-password").post(this.forgotPassword);
    this.router.route("/reset-password").post(this.resetPassword);


  }

  public async login(req: Request, res: Response) {
    const error = validateBody(req.body, ["email", "password"])
    if (error) {
      return res.status(500).json({ success: false, error })
    }
    const result = await handleLogin(req.body);
    res.status(result.status).json(result);
  }
  public async signup(req: Request, res: Response) {
    const error = validateBody(req.body, ["email",
      "password",
      "dateOfBirth",
      "firstName",
      "lastName"]);
    if (error) {
      return res.status(500).json({ success: false, error })
    }
    const result = await addNewUser(req.body);
    res.status(result.status).json(result);
  }
  public getAllUsers(req: Request, res: Response) {
    UserModel.find({
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    }).select({ password: 0 })
      .sort({ createdAt: -1 })
      .lean()
      .exec((err: any, result: any) => {
        if (err) {
          res.status(500).json({ message: "Failed to fetch messages" });
        } else {
          res
            .status(200)
            .json({ message: "Messages fetched successfully", data: result });
        }
      });
  }
  public updateUser(req: Request, res: Response) {
    try {
      if (req.body.email) {
        UserModel.findOneAndUpdate({ email: req.body.email }, req.body)
          .lean()
          .exec((err: any, result: any) => {
            if (err) {
              res.status(500).json({ message: "Failed to update user" });
            } else {
              res
                .status(200)
                .json({ message: "User updated successfully", success: true });
            }
          });
      } else {
        res.status(500).json({ message: "Invalid or empty email" });
      }
    } catch (err) {
      res.status(500).json({ message: "Failed to update user" });
    }
  }
  public deleteUser(req: Request, res: Response) {
    try {
      if (req.body.email) {
        UserModel.findOneAndUpdate(
          { email: req.body.email },
          { isDeleted: true }
        )
          .lean()
          .exec((err: any, result: any) => {
            if (err) {
              res.status(500).json({ message: "Failed to delete user", success: false });
            } else {
              res
                .status(200)
                .json({ message: "User deleted successfully", success: true });
            }
          });
      } else {
        res.status(500).json({ message: "Invalid or empty email", success: false });
      }
    } catch (err) {
      res.status(500).json({ message: "Failed to deleted user", success: false });
    }
  }

  public forgotPassword(req: Request, res: Response) {
    try {
      if (req.body.email) {
        UserModel.findOne(
          { email: req.body.email },
          { isDeleted: false }
        )
          .lean()
          .exec((err: any, result: any) => {
            if (!result || err) {
              res.status(500).json({ message: "User with this mail not found", success: false });
            } else {
              res
                .status(200)
                .json({ message: "Use 786 code to reset password, we are not using any mailing service for OTP. This is for testing purpose.", success: true });
            }
          });
      } else {
        res.status(500).json({ message: "Invalid or empty email", success: false });
      }
    } catch (err) {
      res.status(500).json({ message: "Failed to rest password at the moment", success: false });
    }
  }

  public async resetPassword(req: Request, res: Response) {
    const error = validateBody(req.body, ["email", "otp", "newPassword"])
    if (error) {
      return res.status(500).json({ success: false, error })
    }
    const result = await updatePassword(req.body);
    res.status(result.status).json(result);
  }
}
