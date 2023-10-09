import type {Context, Next} from 'koa'
import jwt from 'jsonwebtoken'

type JwtPayload = {
  name: string
  email: string
}

export interface UserContext extends Context {
  user?: JwtPayload
}

export const authenticate = async (ctx: Context, next: Next) => {
  if (!ctx.headers.authorization) {
    ctx.throw(403, 'No token')
  }

  const token = ctx.headers.authorization.split(' ')[1]
  try {
    ctx.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
  } catch (err) {
    ctx.throw(401, 'Wrong credentials')
  }
  await next()
}
