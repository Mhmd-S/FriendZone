import React from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";

import useAuth from '../authentication/useAuth';

import SearchBar from '../components/SearchBar';
import UserProfile from '../components/UserProfile';
import Notifications from '../components/Notifications';

const Root = () => {
  const location = useLocation();
  const { login, logout, user, isLoading, error } = useAuth();

  return (
    <div className='w-screen min-h-screen grid grid-cols-[15%_60%_25%]'>
      <div className='w-full h-3/5 flex flex-col items-center justify-evenly'> {/* Navigation bar */}
        <h1>Logo</h1>
        <Link to='home'>Home</Link>
        <Link to='search'>Search</Link>
        <Link to='explore'>Explore</Link>
        {user && (
          <>
            <Link to='profile'>Profile</Link>
            <button>Compose</button> {/* Add functionality */}
            <button onClick={logout}>Log out</button>
          </>
        )}
      </div>
      <Outlet />
      <div>
        {location.pathname !== '/search' && <SearchBar />}
        {user && !user?.verified && (
          <div>
            <h4>Not Verified?</h4>
            <button>Resend Verification Email</button>
          </div>
        )}
        <Notifications />
      </div>
    </div>
  );
};

export default Root;
