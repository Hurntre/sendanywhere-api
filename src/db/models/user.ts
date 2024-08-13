import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
});

userSchema.pre('validate', async function (next) {
    if (this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = async function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    isAdmin: boolean;
    comparePassword(password: string): Promise<boolean>;
}

const User = mongoose.model<IUser>('User', userSchema);

export default User;
