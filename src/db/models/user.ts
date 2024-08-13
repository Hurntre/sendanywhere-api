import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    isAdmin: boolean;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    },
});

userSchema.set('toObject', {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
