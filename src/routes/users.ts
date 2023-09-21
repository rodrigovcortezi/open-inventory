import Router from 'koa-router'
import {createUser, updateUser} from '~/controllers/usersController'
import {validate} from '~/middlewares/validate'
import {UserSchema, PartialUserSchema} from '~/models/user'

const router = new Router({prefix: '/users'})

router.post('/new', validate(UserSchema), createUser)
router.put('/:id', validate(PartialUserSchema), updateUser)

export default router
