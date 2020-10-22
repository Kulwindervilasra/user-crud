import { UserModel } from "../models/user.model";
import { hashSync, compareSync } from "bcrypt";
import { createJwtToken } from "../utils";
import { IUser } from "../imodel/user.imodel";

export type IUserInput = {
  email: string;
  password: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
};

export const addNewUser = async (userInfo: IUserInput) => {
  const userExist = <IUser>await UserModel.findOne({ email: userInfo.email })
    .lean()
    .exec();
  if (userExist) {
    let message = "User already exist with this email";
    return {
      message,
      token: "",
      status: 500,
      user: {},
    };
  } else {
    userInfo.password = hashSync(userInfo.password, 10);
    const user = new UserModel(userInfo);
    const result = await user.save();
    const token = await createJwtToken(result._id);
    return { token, message: "Signup successfully", user: result, status: 200 };
  }
};

export const handleLogin = async (
  userInfo: Pick<IUserInput, "email" | "password">
) => {
  const user: any = await UserModel.findOne({
    email: userInfo.email
  })
    .lean()
    .exec();
  if (user) {
    const isSame: boolean = compareSync(userInfo.password, user.password || "");
    if (isSame) {
      const token = await createJwtToken(user._id || "");
      return { token, message: "Login successfully", user, status: 200 };
    } else {
      return {
        token: "",
        message: "Invalid login credentials",
        user: {},
        status: 401,
      };
    }
  } else {
    return {
      token: "",
      message: "Invalid login credentials",
      user: {},
      status: 401,
    };
  }
};



export type IResetInput = {
  email: string;
  otp: string;
  newPassword: string;
};

export const updatePassword = async (data: IResetInput) => {
  const user = <IUser>await UserModel.findOne({ email: data.email })
    .lean()
    .exec();
  if (user) {
    if (data.otp !== '786')
      return { message: "Invalid otp", user: {}, status: 500, success: false };

    const password = hashSync(data.newPassword, 10);
    const result = await UserModel.findOneAndUpdate({ email: data.email }, { $set: { password } }).lean();
    return { message: "Password updated successfully", user: result, status: 200, success: true };
  } else {
    return { message: "User not found", user: {}, status: 500, success: false };
  }
};
