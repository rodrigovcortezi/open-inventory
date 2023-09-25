import {Context, Next} from 'koa'
import {z} from 'zod'
import {buildResponse} from '~/server/response'

class ValidationError extends Error {
  details: unknown

  constructor(details: unknown) {
    super('Invalid request data')
    this.details = details
  }
}

export const validate =
  (schema: z.AnyZodObject) => async (ctx: Context, next: Next) => {
    try {
      ctx.request.body = schema.parse(ctx.request.body)
      await next()
    } catch (err) {
      if (!(err instanceof z.ZodError)) {
        throw err
      }

      ctx.status = 400
      const details = err.issues.map(e => ({
        path: e.path[0],
        message: e.message,
      }))
      const validationErr = new ValidationError(details)
      ctx.body = buildResponse({err: validationErr})
    }
  }
