import React, { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface AuthContextProps{
    isLoggedIn : boolean;
    setIsLoggedIn:(isLoggedIn:boolean)=>void;
    user:IUser|null;
    setUser:(user:IUser | null)=>void;
    login:(user:{email:string;password:string})=>Promise<void>;
    signup:(user:{name:string;email:string;password:string})=>Promise<void>;
    logout:()=>Promise<void>
} 
const AuthContext = createContext<AuthContextProps>({
    isLoggedIn:false,
    setIsLoggedIn:()=>{},
    user:null,
    setUser:()=>{},
    login:async ()=>{},
    signup:async ()=>{},
    logout:async ()=>{},
});

export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const navigate = useNavigate();
    const [user,setUser] = useState<IUser | null>(null);
    const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);

    const signup = async({name,email,password}:{name:string;email:string;password:string})=>{
        try {
            const {data} = await axios.post("/api/auth/register",{name,email,password});
            if(data?.user){
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }
            toast.success(data?.message);
                navigate("/");
        } catch (error) {
            console.log(error)
        }
    }
    const login = async({email,password}:{email:string;password:string})=>{
          try {
            const {data} = await axios.post("/api/auth/login",{email,password});
            if(data?.user){
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }
            toast.success(data?.message);
                navigate("/");
        } catch (error) {
            console.log(error)
        }
    }
    const logout = async()=>{
         try {
            const {data} = await axios.post("/api/auth/logout");
                setUser(null);
                setIsLoggedIn(false);
            toast.success(data?.message);
                navigate("/");
        } catch (error) {
            console.log(error)
        }
    }
    const fetchUser = async()=>{
         try {
            const {data} = await axios.get("/api/auth/verify");
                setUser(data.user as IUser);
                setIsLoggedIn(true);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        (async()=>{
            await fetchUser();
        })()
    },[])

const value={
    user,setUser,
    isLoggedIn,setIsLoggedIn,
    signup,login,logout
}

  return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
)
};

export const userAuth =()=>useContext(AuthContext);
