import { environment } from './environment'

export function getAuth(){
    const json = localStorage.getItem(environment.user.key)
    const userData = JSON.parse(json)
    const auth = {
        headers: {Authorization:'Bearer ' + userData.accessToken} 
    }
    return auth
}

export default {getAuth}