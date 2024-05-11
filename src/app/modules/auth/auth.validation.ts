import { z } from 'zod'

const signUpZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required',
    }),
    role: z.string({
      required_error: 'Role is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    budget: z.number({
      required_error: 'Budget is required',
    }),
    income: z.number({
      required_error: 'Income is required',
    }),
  }),
})

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Number is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
})

const changePasswordZodSchema = z.object({
  cookies: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
    }),
  }),
})

export const AuthValidation = {
  signUpZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
}
