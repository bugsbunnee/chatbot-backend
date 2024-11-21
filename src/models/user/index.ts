import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

import _ from "lodash";

import { IUser, IUserMethods, IUserVirtuals } from "./schema";
import { APP_ROLES, Role } from "../../utils/constants";

type UserModel = mongoose.Model<IUser, {}, IUserMethods, IUserVirtuals>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods, IUserVirtuals>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: APP_ROLES, default: Role.USER }
});

UserSchema.method('generateAuthToken', function () {
    const user = {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        role: this.role,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET as string);
    return token;
});

UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

export const User = mongoose.model<IUser, UserModel>('User', UserSchema);


