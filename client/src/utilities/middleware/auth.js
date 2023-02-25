import {Navigate} from 'react-router-dom'
import { useAuthStore } from '../../store/store';



export const AuthorizeUser=({children})=>{
    const token=localStorage.getItem('token')
    if(!token){
        return <Navigate to={'/'} replace={true}></Navigate>
        
    }
    return children;
}

export const RouteProvider=({children})=>{
    const email=useAuthStore.getState().auth.email;
    if(!email) <Navigate replace={true} to={'/'}></Navigate>
    return children;
}