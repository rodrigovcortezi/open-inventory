import type {Context, Next} from 'koa'
import {ServiceError} from '~/services/error'

export const error = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof ServiceError) {
      const errors = err.errors ?? [err.message]
      ctx.body = {errors}
      ctx.status = err.status
    } else {
      const errors = ['Unexpected error occurred']
      ctx.body = {errors}
      ctx.status = 500
    }
  }
}
