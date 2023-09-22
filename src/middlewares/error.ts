import type {Context, Next} from 'koa'
import {ControllerError} from '~/controllers/error'
import {ServiceError} from '~/services/error'

const buildErrorResponse = (err: Error | ControllerError | ServiceError) => {
  if (err instanceof ServiceError || err instanceof ControllerError) {
    return {
      status: err.status,
      body: {
        success: false,
        error: err.message,
      },
    }
  } else {
    return {
      status: 500,
      body: {
        success: false,
        error: 'Unexpected error occurred',
      },
    }
  }
}

export const error = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    const {status, body} = buildErrorResponse(err as Error)
    ctx.status = status
    ctx.body = body
    ctx.app.emit('error', err, ctx)
  }
}
