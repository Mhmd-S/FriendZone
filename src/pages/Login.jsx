import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import useAuth from '../authentication/useAuth';

export default function Login() {
    const { login, isLoading, error } = useAuth();
    const [signUpMode, setSignUpMode] = useState(false);

    const signIn = async(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        
        login(formData.get('email'), formData.get('password'));
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
            {signUpMode && <> {/* This fragement will be displayed when user is signing up instead of signing in. */}
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" className="border-2 border-blue-800"/>
                
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" id="firstName" className="border-2 border-blue-800"/>
                
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" id="lastName" className="border-2 border-blue-800"/>
                
                <label htmlFor="phoneNumber">Phone Number</label>
                <input type="text" name="phoneNumber" id="phoneNumber" className="border-2 border-blue-800"/>
                
                <label htmlFor='dob'>Date of Birth</label>
                <input type="date" name="dob" id="dob" className="border-2 border-blue-800" />
            </>}
            <button type="submit" className='w-1/2 bg-slate-500 self-center'>Sign In</button>
        </form>
        <button>Join as visitor</button>
        <button>Reset Password</button>
        <div>No Account? <button className='underline' onClick={()=>setSignUpMode(!signUpMode)}>Sign In!</button></div>
    </div>
  )
}
