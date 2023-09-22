import Router from 'koa-router'
import {createUser, loginUser, updateUser} from '~/controllers/users'
import {validate} from '~/middlewares/validate'
import {CreateUserSchema, LoginUserSchema, PartialUserSchema} from '~/dtos/user'

const router = new Router({prefix: '/users'})

router.post('/new', validate(CreateUserSchema), createUser)
router.put('/:id', validate(PartialUserSchema), updateUser)
router.post('/login', validate(LoginUserSchema), loginUser)

export default router
