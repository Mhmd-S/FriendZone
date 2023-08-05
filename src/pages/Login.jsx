import useAuth from '../authentication/useAuth';
import Spinner from '../components/Spinner';
import Logo from '../components/Logo';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    
    const { login, isLoading, errorLogIn, user} = useAuth();

    const navigate = useNavigate(); 

    useEffect(()=>{
        // If the user is already logged in, redirect them to the home page.
        
        if(!isLoading && user) {
            navigate('/home');
            return;
        }

      },[isLoading, user])

    const signIn = async(e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const loginCreds = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
            loginCreds.append(key, value);
          }
          
        login(loginCreds);
    }

  return (
    // The default screen will be showing the user in sign in mode.
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#282c37] text-white">
      <Link to={'/home'}>
        <Logo/>
      </Link>
      <h1 className='text-xl pt-2'>Login to FriendZone</h1>
      {isLoading ? 
      <div className='w-full h-[80$] flex justify-center items-center'>
        <Spinner size={10} />
      </div> : 
      <form className="w-[80%] h-[50%] flex flex-col items-center justify-evenly relative" onSubmit={signIn}>
        
          {errorLogIn?.auth && <div className="text-red-500">{errorLogIn.auth}</div>}  
          <label htmlFor="email" className='hidden'>Email</label>
          <input type="email" name="email" id="email" placeholder='Email' className={"w-3/4 lg:w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[1px] focus:border-[#787ad9] outline-none " + (errorLogIn?.email ? 'border-red-500 focus:border-red-500' : '')} />
          {errorLogIn?.email && <div className='py-px text-sm text-red-500'>{errorLogIn.email}</div>}

          <label htmlFor="password" className='hidden'>Password</label>
          <input type="password" name="password" id="password" placeholder='Password' className={"w-3/4 lg:w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[1px] focus:border-[#787ad9] outline-none " + (errorLogIn?.password ? 'border-red-500 focus:border-red-500' : '')} />
          {errorLogIn?.password && <div className='py-px text-sm text-red-500'>{errorLogIn.password}</div>}
          
          <button type="submit" className="w-1/3 py-2 bg-[#595aff] rounded-lg mt-2 self-center">Sign In</button>
          {/* <button>Reset Password</button> */}
          <div>No Account? <Link to={'/signup'} className='text-md text-slate-500 underline' >Sign Up!</Link></div>

      </form>
      }
    
    </div>
  )
}
