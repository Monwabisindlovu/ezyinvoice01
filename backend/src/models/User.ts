import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email?: string;
  phone?: string;
  password: string;
  securityQuestions: Array<{
    question: string;
    answer: string;
  }>;
  googleId?: string; // Optional for Google OAuth integration
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true }, // Unique but sparse to allow NULL values
    phone: { type: String, unique: true, sparse: true }, // Unique but sparse to allow NULL values
    password: { type: String, required: true },
    securityQuestions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    googleId: { type: String, unique: true, sparse: true }, // Optional for OAuth integration
  },
  { timestamps: true }
);

// Create a virtual field for emailOrPhone
UserSchema.virtual('emailOrPhone').get(function (this: IUser) {
  return this.email || this.phone;
});

// Ensure virtuals are included in JSON and object responses
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
