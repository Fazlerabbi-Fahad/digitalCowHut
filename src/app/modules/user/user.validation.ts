import { z } from 'zod'

const createUser = z.object({
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

const updateUser = z.object({
  body: z.object({
    phoneNumber: z.string().optional(),
    role: z.string().optional(),
    password: z.string().optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    address: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
})

export const UserValidation = {
  createUser,
  updateUser,
}
