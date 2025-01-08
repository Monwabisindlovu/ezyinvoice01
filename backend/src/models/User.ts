import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  emailOrPhone: string;
  password: string;
  countryOfResidency: string;
  isEmail: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  emailOrPhone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  countryOfResidency: { type: String, required: true },
  isEmail: { type: Boolean, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
