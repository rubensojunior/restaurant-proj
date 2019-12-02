import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import {User} from '../users/users.model'
import {NotAuthorizedError} from 'restify-errors'
import {environment} from '../common/environment'

export const authenticate: restify.RequestHandler = (req, resp, next) => {
    const {email, password} = req.body
    User.findByEmail(email, '+password')
        .then(user=>{
            if(user && user.matches(password)){
                const token = jwt.sign({sub: user.email, iss: 'restaurant-api'}, 
                    environment.security.apiSecret)
                resp.json({id: user._id, name: user.name, email: user.email, owner: user.owner, accessToken: token})
                return next(false)
            }else{
                return next(new NotAuthorizedError('Invalid Credentials'))
            }
    }).catch(next)
}