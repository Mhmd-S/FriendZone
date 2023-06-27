import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../authentication/useAuth';

export default function Signup() {
    const navigate = useNavigate();

    const {signUp, isLoading, error, user} = useAuth();

    useEffect(()=>{
        // If the user is already logged in, redirect them to the home page.
        if(!isLoading && user) {
            navigate('/home');
            console.log('User is already logged in');
        }
    },[isLoading, user])

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const signUpCreds = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
            signUpCreds.append(key, value);
          }
          
        signUp(signUpCreds);
    }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div> Logo </div>
        <h1>Sign Sign Up to FriendZone</h1>
        <form className="w-[40%] flex flex-col" onSubmit={handleSubmit}>
            {error && <div className="text-red-500">{Array.isArray(error) ? error.map(error => {return error.msg}) : error}</div>}
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" className="border-2 border-blue-800"/>

            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className="border-2 border-blue-800"/>
            
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" className="border-2 border-blue-800"/>
            
            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" id="firstName" className="border-2 border-blue-800"/>
            
            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" id="lastName" className="border-2 border-blue-800"/>
            
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" name="phoneNumber" id="phoneNumber" className="border-2 border-blue-800"/>
            
            <label htmlFor='dob'>Date of Birth</label>
            <input type="date" name="dob" id="dob" className="border-2 border-blue-800"/>

            <button type="submit" className='w-1/2 bg-slate-500 self-center'>Sign Up</button>
        </form>
    </div>
  )
}
