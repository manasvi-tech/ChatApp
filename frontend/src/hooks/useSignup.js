import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
    const [loading,setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const signup = async({fullName, username, password, confirmPassword, gender}) => {
        console.log("going in")
        const success = handleInputErrors({fullName,username,password,confirmPassword,gender})

        if(!success) return;

        setLoading(true)   

        try{
            console.log("In try block")
            const res = await fetch('/api/auth/signup',{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({fullName,username,password,confirmPassword,gender})
            })

            console.log("Fetched data");

            const data = await res.json();

            if(data.error){
                throw new Error(data.error)
            }

            //localstorage
            localStorage.setItem("chat-item",JSON.stringify(data));
            //context
            setAuthUser(data);

        } catch(error){
            toast.error(error.message)
        } finally{
            setLoading(false)
        }
    }

    return {loading,signup}

}

function handleInputErrors({fullName,username,password,confirmPassword,gender}){
    if(!fullName || !username || !password || !confirmPassword || !gender){
        toast.error("Please fill up all the fields")
        return false;
    }
    // console.log("passed")

    if(password!==confirmPassword){
        toast.error('Passwords do not match');
        return false;
    }

    if(password.length<6){
        toast.error('Paasword must be at least 6 characters')
        return false;
    }

    return true;
}

export default useSignup
