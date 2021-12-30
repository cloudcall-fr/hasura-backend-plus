import { Router } from 'express'
import nocache from 'nocache'
import changeEmail from './change-email'
import getJwks from './jwks'
import loginAccount from './login'
import logout from './logout'
import mfa from './mfa'
import changePassword from './change-password'
import providers from './providers'
import registerAccount from './register'
import token from './token'
import activateAccount from './activate'
import deleteAccount from './delete'
import magicLink from './magic-link'
import { AUTHENTICATION } from '@shared/config'

import { langHint } from '@shared/email'

const router = Router()

router.use(nocache())

router.use((req, res, next) => {
  if (!AUTHENTICATION.ENABLED) {
    console.log(`Please set the AUTH_ENABLED env variable to true to use the auth routes.`)
    return res.boom.notFound()
  } else {
    if (req.body?.email) {
      langHint.email = req.body.email;
    }
    if (req.headers['accept-language']) {
      langHint.language = req.acceptsLanguages()[0].replace(/-.*/, "").toLocaleUpperCase();
    }
    if (req.headers['x-dl-language']) {
      langHint.language = (req.headers['x-dl-language'] as string).toLocaleUpperCase();
    }
    if (req.params?.language) {
      langHint.language = req.params?.language.toLocaleUpperCase();
    }
    return next()
  }
})

router.use('/providers', providers)
router.use('/mfa', mfa)
router.use('/change-email', changeEmail)
router.get('/activate', activateAccount)
router.post('/delete', deleteAccount)
router
  .post('/login', loginAccount)
  .post('/logout', logout)
  .post('/register', registerAccount)
  .use('/change-password', changePassword)
router.get('/jwks', getJwks)
router.use('/token', token)
router.get('/magic-link', magicLink)

export default router
