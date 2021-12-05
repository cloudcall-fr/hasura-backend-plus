import { Router } from 'express'

import github from './github'
import google from './google'
import facebook from './facebook'
import twitter from './twitter'
import apple from './apple'
import windowslive from './windowslive'
import linkedin from './linkedin'
import spotify from './spotify'
import cap_facebook from './cap_facebook'
import cap_apple from './cap_apple'
import cap_google from './cap_google'

const router = Router()

github(router)
google(router)
cap_google(router)
facebook(router)
cap_facebook(router)
twitter(router)
apple(router)
cap_apple(router)
windowslive(router)
linkedin(router)
spotify(router)

export default router
