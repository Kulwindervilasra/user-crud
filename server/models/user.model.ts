import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, { versionKey: false, timestamps: true });

export const UserModel = mongoose.model('users', UserSchema);