import React, { useEffect } from 'react';
import useAuth from '../authentication/useAuth';
import { Link } from 'react-router-dom';
import * as userAPI from '../api/userAPI';
import DefaultProfilePicture from './DefaultProfilePicture';
import MiniForm from './MiniForm';
import Notifications from './Notifications';

const Utilities = () => {

    const { user } = useAuth();

    
  return (
    <div className='w-full h-[30%] flex flex-col items-center'>
          {user ?
              <>
                <div className='w-[90%] h-full'>
                  <Link to={'profile/' + user.username} className='flex items-center w-full hover:bg-[#424858] bg-[#282c37] rounded-lg p-2 text-[#d9e1e8]'>
                    <div className='flex items-center w-full h-full'>
                        <span className='w-1/5'>
                            {user.profilePicture ? <img src={user.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture size={10}/>}
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
                </div>
              </>
            : 
              <div className='w-[50%] flex flex-col items-center mt-4 ml-[15%]'> {/* If not logged in display this div */}
                <Link to='login' className='w-full bg-[#5053eb] p-2 text-center rounded-md hover:bg-[#3a3dd2] mb-4'>Login</Link>
                <Link to='signup' className='w-full border-2 border-[#595aff] p-2 text-center rounded-md text-[#595aff] hover:border-[#3232b3] hover:text-[#3232b3]'>Signup</Link>
              </div>
            }
        </div>
  )
}

export default Utilities;