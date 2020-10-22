import { Document } from "mongoose";
export interface IUser extends Document {
    dateOfBirth: string,
    firstName: string,
    password: string,
    lastName: string,
    email: string,
    createdAt?: string,
    updatedAt?: string
    isDeleted?: boolean
}

