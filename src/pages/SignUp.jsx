import { useState, useEffect } from 'react';
import useAuth from '../authentication/useAuth';

export default function Login() {
    const {signUp, isLoading, error, user} = useAuth();

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const loginCreds = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
            loginCreds.append(key, value);
          }
          
        signUp(loginCreds.toString());

    }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div> Logo </div>
        <h1>Sign Sign Up to FriendZone</h1>
        <form className="w-[40%] flex flex-col" onSubmit={handleSubmit}>
            {error && <div className="text-red-500">{error}</div>}
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" className="border-2 border-blue-800" onChange={e=>setEmail(e.currentTarget.value)}/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className="border-2 border-blue-800" onChange={e=>setPassword(e.currentTarget.value)}/>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" className="border-2 border-blue-800" onChange={e=>setConfirmPassword(e.currentTarget.value)}/>
            
            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" id="firstName" className="border-2 border-blue-800" onChange={e=>setFirstName(e.currentTarget.value)}/>
            
            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" id="lastName" className="border-2 border-blue-800" onChange={e=>setLastName(e.currentTarget.value)}/>
            
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" name="phoneNumber" id="phoneNumber" className="border-2 border-blue-800" onChange={e=>setPhoneNumber(e.currentTarget.value)}/>
            
            <label htmlFor='dob'>Date of Birth</label>
            <input type="date" name="dob" id="dob" className="border-2 border-blue-800" onChange={e=>setDob(e.currentTarget.value)}/>
            <button type="submit" className='w-1/2 bg-slate-500 self-center'>Sign Up</button>
        </form>
    </div>
  )
}
