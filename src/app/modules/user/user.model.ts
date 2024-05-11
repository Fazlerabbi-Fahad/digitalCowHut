import { Schema, model } from 'mongoose'
import { IUser, UserModel } from './user.interface'
import { role } from './user.constant'
import config from '../../../config'
import bcrypt from 'bcrypt'

const UserSchema = new Schema<IUser, Record<string, unknown>, UserModel>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: role },
    password: { type: String, required: true },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

UserSchema.methods.isUserExist = async function (
  id: string,
): Promise<Partial<IUser> | null> {
  const user = await User.findOne({ id }, { id: 1, password: 1 })
  return user
}

UserSchema.pre<IUser>('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )

  next()
})

export const User = model<IUser, UserModel>('User', UserSchema)
