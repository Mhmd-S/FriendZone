import useAuth from '../authentication/useAuth';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    
    const { login, isLoading, error, user } = useAuth();

    const navigate = useNavigate(); 

    useEffect(()=>{
        // If the user is already logged in, redirect them to the home page.
        if(!isLoading && user) {
            navigate('/home');
            console.log('User is already logged in');
        }
    },[isLoading, user])

    const signIn = async(e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const loginCreds = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
            loginCreds.append(key, value);
          }
          
        login(loginCreds.toString());
    }

  return (
    // The default screen will be showing the user in sign in mode.
    <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div> Logo </div>
        <h1>Sign In to FriendZone</h1>
        <form className="w-[40%] flex flex-col" onSubmit={signIn}>
            {error && <div className="text-red-500">{error}</div>}
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" className="border-2 border-blue-800" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className="border-2 border-blue-800" />
            <button type="submit" className='w-1/2 bg-slate-500 self-center'>Sign In</button>
        </form>
        <button>Join as visitor</button>
        <button>Reset Password</button>
        <div>No Account? <button className='underline'>Sign Up!</button></div>
    </div>
  )
}
