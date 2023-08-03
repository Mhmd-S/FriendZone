import React, { useEffect } from 'react';
import useAuth from '../authentication/useAuth';
import { Link } from 'react-router-dom';
import * as userAPI from '../api/userAPI';
import DefaultProfilePicture from './DefaultProfilePicture';
import MiniForm from './MiniForm';
import Notifications from './Notifications';

const Utilities = ({ displayMenu, setDisplayMenu }) => {

    const { user, logout } = useAuth();
    
  return (
    <div className={'w-full h-[90%] flex flex-col items-center md:h-full'} >
          {user ?
              <>
                <div className='w-full h-full flex flex-col justify-between items-center'>

                  <Link to={'profile/' + user.username} className='flex items-center w-full hover:bg-[#424858] bg-[#282c37] rounded-lg p-2 mt-4 text-[#d9e1e8]'>
                    <div onClick={()=>setDisplayMenu(false)} className='flex items-center w-full h-full'>
                        <span className='w-1/5'>
                            {user.profilePicture ? <img src={user.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture size={8}/>}
                        </span>
                        <span className='text-clip flex w-4/5 justify-between items-center'> 
                          <p>{user.username}</p>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                    </div>
                  </Link>
                  
                  <MiniForm/>
                  
                  <Notifications/>

                {/* Button to log out */}
                <button onClick={logout} className='w-3/5 bg-[#5053eb] p-2 text-center rounded-md hover:bg-[#3a3dd2] justify-self-end'>Logout</button>

                </div>
              </>
            : 
              <div className='w-full h-full items-center flex flex-col mt-12 lg:mt-0'> {/* If not logged in display this div */}
                <Link to='login' className='w-1/3 bg-[#5053eb] p-2 text-center rounded-md hover:bg-[#3a3dd2] mb-4 lg:w-full'>Login</Link>
                <Link to='signup' className='w-1/3 border-2 border-[#595aff] p-2 text-center rounded-md text-[#595aff] hover:border-[#3232b3] hover:text-[#3232b3] lg:w-full'>Signup</Link>
              </div>
            }
        </div>
  )
}

export default Utilities;