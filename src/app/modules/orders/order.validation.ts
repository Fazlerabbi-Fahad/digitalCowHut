import { z } from 'zod'

const createOrder = z.object({
  body: z.object({
    cow: z.string({
      required_error: 'Cow id is required',
    }),
    buyer: z.string({
      required_error: 'Buyer id is required',
    }),
  }),
})
export const OrderValidation = { createOrder }
