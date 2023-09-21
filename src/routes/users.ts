import Router from 'koa-router'
import {createUser, loginUser, updateUser} from '~/controllers/users'
import {validate} from '~/middlewares/validate'
import {UserSchema, PartialUserSchema, LoginUserSchema} from '~/dtos/user'

const router = new Router({prefix: '/users'})

router.post('/new', validate(UserSchema), createUser)
router.put('/:id', validate(PartialUserSchema), updateUser)
router.post('/login', validate(LoginUserSchema), loginUser)

export default router
