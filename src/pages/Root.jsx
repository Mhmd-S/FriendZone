import { useState, useEffect} from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";

import useAuth from '../authentication/useAuth';

import SearchBar from '../components/SearchBar';
import Utilities from '../components/Utilities';
import Logo from '../components/Logo';

// Display the posts
const Root = () => {
  const location = useLocation();
  
  const [displayMenu, setDisplayMenu] = useState(false); // Only for mobile
  
  const { logout, user, generalError } = useAuth();
  
  return (
    <div className='w-screen h-screen grid grid-rows-[7.5%_85%_7.5%] lg:grid lg:grid-cols-[15%_62.5%_22.5%] bg-[#191b22]'>
      
      <div className='w-full justify-self-end order-3 lg:h-screen flex justify-between items-center lg:order-1 lg:flex-col'> {/* Navigation bar */}
        <div className='w-full h-full text-[#d9e1e8] flex items-center lg:flex-col lg:h-2/5'>
          <Link className='hidden w-full p-5 lg:flex justify-center items-center' to={'/home'}>
            <Logo />
          </Link>
          <hr className='hidden border-t-px border-[#464b5f] w-[85%] self-center'/>
          <ul className='w-full h-full text-md flex justify-evenly items-center p-4 lg:flex-col lg:items-start'>
            <li className='p-2'>
              <Link to='home' className={'flex items-center w-full hover:text-[#595aff] ' + (location.pathname === '/home' ? ' text-[#595aff]' : '')} src='./icons/home.svg'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
                <span className='hidden pl-4 lg:inline'>Home</span>
              </Link>
            </li>
            <li className='p-2'>
              <Link to='search'  className={'flex items-center w-full hover:text-[#595aff] ' + (location.pathname === '/search' ? ' text-[#595aff]' : '')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
                <span className='hidden pl-4 lg:inline'>Search</span>
              </Link>
            </li>
            <li className='p-2'>
              <Link to='explore' className={'flex items-center w-full hover:text-[#595aff] ' + (location.pathname === '/explore' ? ' text-[#595aff]' : '')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z" clipRule="evenodd" />
                </svg>
                <span className='hidden pl-4 lg:inline'>Explore</span>
              </Link>
            </li>
            <li className='p-2'>
              <Link to='chat' className={'flex items-center w-full hover:text-[#595aff] ' + (location.pathname === '/chat' ? ' text-[#595aff]' : '')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                </svg>
                <span className='hidden pl-4 lg:inline'>Chat</span>
              </Link>
            </li>
          </ul>
          {user && <button onClick={logout} className='hidden w-3/4 py-2 self-center border-2 border-[#595aff] text-[#595aff] rounded-md'>Log out</button>}
        </div>
      </div>

      <div className='w-full order-2 rounded-md lg:h-screen md:py-3 relative'>
        <Outlet />
          {generalError && <div className='w-[60%] text-center md:w-20% text-white break-word p-4 bg-red-600 border-2 border-red-700 top-[5%] right-[7.5%] md:hidden absolute opacity-90'>{generalError}</div>}
      </div>
      
      <div className='w-full h-full flex justify-between px-3 order-1 lg:order-3 lg:flex-col lg:h-screen'>
        
        <Link className='flex justify-center items-center lg:hidden' to={'/home'}>
          <Logo />
        </Link>
        
        <button className='lg:hidden' onClick={()=>setDisplayMenu(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#595aff" className="w-8 h-8">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </button>

        <div className={`${displayMenu ? 'flex' : 'hidden'} flex-col items-center w-full h-screen absolute top-0 left-0 bg-[#191b22] p-4 lg:flex lg:h-full lg:w-full lg:relative lg:top-auto lg:left-auto`}>
          
          <button onClick={()=>setDisplayMenu(false)} className='w-full flex justify-end lg:hidden'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#595aff" className="w-8 h-8">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          
          {location.pathname !== '/search' && <SearchBar chatMode={false} />}
          <Utilities />
          {generalError && <div className='hidden text-center h-fit break-words w-full md:block md:absolute text-white p-4 bg-red-600 border-2 border-red-700 opacity-90 md:bottom-[10%]'>{generalError}</div>}
        </div>

      </div>

    </div>
  );
};

export default Root;
