import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

import { IUser, IUserMethods, IUserVirtuals } from "./schema";
import { app_roles } from "../../utils/constants";

type UserModel = mongoose.Model<IUser, {}, IUserMethods, IUserVirtuals>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods, IUserVirtuals>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: app_roles, default: 'editor' }
});

UserSchema.method('generateAuthToken', function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET as string);
    return token;
});

UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

export const User = mongoose.model<IUser, UserModel>('User', UserSchema);


