import {Context, Next} from 'koa'
import {z} from 'zod'

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
      ctx.body = {
        errors: err.issues.map(e => ({path: e.path[0], message: e.message})),
      }
    }
  }
