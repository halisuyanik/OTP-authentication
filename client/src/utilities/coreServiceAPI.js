import axios from 'axios';
import jwtDecode from 'jwt-decode';

const userUriAPI="/api/user";

axios.defaults.baseURL='http://localhost:8080';

export async function authenticate(email){
    try {
        return await axios.post(`${userUriAPI}/auth`,{email})
    } catch (error) {
        return {error:"not auth"}
    }
}

export async function getUser({email}){
    try {
        const {data}=await axios.get(`${userUriAPI}/account/${email}`);
        return {data};
    } catch (error) {
        return {error:""}
    }
}

export async function signUp(userInfo){
    try {
        const {data:{message}, status}=await axios.post(`${userUriAPI}/signup`, userInfo)
        return Promise.resolve(message);

    } catch (error) {
        return Promise.reject({error});
    }
}

export async function signIn({email, password}){
    try {
        if(email){
            const {data}=await axios.post(`${userUriAPI}/signin`,{email, password});
            return Promise.resolve({data});
        }
    } catch (error) {
        return Promise.reject({error:"password does not match"})
    }
}

export async function updateUser(response){
    try {
        const token=await localStorage.getItem('token');
        const data=await axios.put(`${userUriAPI}/updateuser`,response, {headers:{"Authorization":`Bearer ${token}`}})
        return Promise.resolve({data});
    } catch (error) {
        return Promise.reject({error: error.message})
    }
}

export async function generateOTP(email){
    try {
        const {data:{code}, status}=await axios.get(`${userUriAPI}/generateOTP`,{params:{email}})
        if(status===201){
            let {data:{email}}=await getUser({email})
            let text=`Your password recovery OTP code is ${code}`;
            await axios.post(`${userUriAPI}/signupMail`, {email, userMail:email, text, subject:"recovery password"});
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({error})
    }
}

export async function verifyOTP({email, code}){
    try {
        const {data, status}=await axios.get(`${userUriAPI}/verifyOTP`,{params:{email, code}});
        return{data, status};
    } catch (error) {
        return Promise.reject({error});
    }
}

export async function resetPassword({email, password}){
    try {
        const {data, status}=await axios.put(`${userUriAPI}/resetPassword`, {email, password});
        return Promise.resolve({data, status});
    } catch (error) {
        return Promise.reject({error})
    }
}

export async function getEmail(){
    const token=localStorage.getItem('token');
    if(!token) return Promise.reject("Cannot find token");
    let decode=jwtDecode(token);
    return decode;
}