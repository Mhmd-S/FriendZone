import React from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";

import useAuth from '../authentication/useAuth';

import SearchBar from '../components/SearchBar';
import Notifications from '../components/Notifications';
import Logo from '../components/Logo';

// Display the posts
const Root = () => {
  const location = useLocation();
  const { login, logout, user, isLoading, error } = useAuth();

  return (
    <div className='w-screen grid grid-cols-[20%_55%_25%] bg-[#191b22]'>
      <div className='w-full h-screen flex flex-col '> {/* Navigation bar */}
        <div className='w-full h-4/6 text-[#d9e1e8] flex flex-col'>
          <Link className='w-full p-5 flex justify-center items-center' to={'/home'}>
            <Logo />
          </Link>
          <hr className='border-t-px border-[#464b5f] w-[85%] self-center'/>
          <ul className='w-3/4 text-md flex flex-col items-start p-4'>
            <li className='p-2'>
              <Link to='home' className='flex items-center w-full hover:text-[#595aff]' src='./icons/home.svg'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
                <span className='pl-4'>Home</span>
              </Link>
            </li>
            <li className='p-2'>
              <Link to='search' className='flex items-center w-full hover:text-[#595aff]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
                <span className='pl-4'>Search</span>
              </Link>
            </li>
            <li className='p-2'>
              <Link to='explore' className='flex items-center w-full hover:text-[#595aff]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z" clipRule="evenodd" />
                </svg>
                <span className='pl-4'>Explore</span>
              </Link>
            </li>
            {user ?
                <li className='p-2'><button onClick={logout}>Log out</button></li>
            : 
              <li className='w-full flex flex-col items-center mt-4 ml-[15%]'> {/* If not logged in display this div */}
                <Link to='login' className='w-full bg-[#5053eb] p-2 text-center rounded-md hover:bg-[#3a3dd2] mb-4'>Login</Link>
                <Link to='signup' className='w-full border-2 border-[#595aff] p-2 text-center rounded-md text-[#595aff] hover:border-[#3232b3] hover:text-[#3232b3]'>Signup</Link>
              </li>
            }
          </ul>
        </div>
      </div>
      <div className='w-full h-screen py-2 rounded-md'>
        <Outlet />
      </div>
      <div className='w-full h-screen bg-[#191b22] relative'>
        {location.pathname !== '/search' && <SearchBar />}
        <Notifications />
      </div>
    </div>
  );
};

export default Root;
