import type {Context, Next} from 'koa'
import {ControllerError} from '~/server/controllers/error'
import {ServiceError} from '~/usecases/error'
import {buildResponse} from '~/server/response'

export const error = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof ServiceError || err instanceof ControllerError) {
      ctx.status = err.status
      ctx.body = buildResponse({err})
    } else {
      ctx.status = 500
      ctx.body = buildResponse({err: err as Error})
    }
  }
}
