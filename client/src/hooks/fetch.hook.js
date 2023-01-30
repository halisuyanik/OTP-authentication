import axios from 'axios';
import { useEffect, useState } from 'react';
import { getEmail } from '../utilities/coreServiceAPI';

const userUriAPI="/api/user";

axios.defaults.baseURL=process.env.SERVER_URI;

export default function useFetch(query){

    const [getData, setData]=useState({isLoading:false, apiData:undefined, status:null, serverError:null})

    useEffect(()=>{
        if(!query) return;
        const fetchData=async()=>{
            try {
                setData(prev=>({...prev, isLoading:true}));
                const { email } = !query ? await getEmail() : '';
                const {data, status}=!query ? await axios.get(`/api/user/account/${email}`) : await axios.get(`/api/${query}`);
                if(status===201){
                    setData(prev=>({...prev, isLoading:false}));
                    setData(prev=>({...prev, apiData:data, status:status}));
                }
                setData(prev=>({...prev, isLoading:false}))
            } catch (error) {
                setData(prev=>({...prev, isLoading:false, serverError:error}))
            }
        }
        fetchData();
    }, [query])

    return [getData,setData];

}