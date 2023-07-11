import React, { useEffect } from 'react';
import useAuth from '../authentication/useAuth';
import { Link } from 'react-router-dom';
import * as userAPI from '../api/userAPI';
import DefaultProfilePicture from './DefaultProfilePicture';
import MiniForm from './MiniForm';

const Notifications = () => {

    const { user, logout } = useAuth();

    // const fetchFriends = async() => {
    //     const userFriendsAndRequests = await userAPI.getUserFriends();
    //     if (userFriendsAndRequests.data.pendingFriends.length > 0) {
    //         const requestEle = userFriendsAndRequests.data.pendingFriends.map((request) => {
    //             return(
    //                 <li key={request._id}>
    //                     <Link to={`/profile/${request.username}`}>{request.username}</Link>
    //                     <button onClick={()=>handleAcceptFriendRequest(request._id)}>Accept</button>
    //                     <button onClick={()=>handleDeclineFriendrequest(request._id)}>Decline</button>
    //                 </li>)
    //         })
    //         setFriendRequests(requestEle)
    //     }        
    // }

    // const handleAcceptFriendRequest = async (friendId) => {
    //     const res = await userAPI.acceptFriendRequest(friendId);
    //     if (res.status === 'success') {
    //         let newFriendRequests = friendRequests.slice();
    //         newFriendRequests.filter((request) => request._id !== friendId);
    //         setFriendRequests(newFriendRequests);
    //         console.log('Friend added!');
    //     }
    // }

    // const handleDeclineFriendrequest = async (friendId) => {        
    //     const res = await userAPI.declineFriendRequest(friendId);
    //     if (res.status === 'success') {
    //         let newFriendRequests = friendRequests.slice();
    //         newFriendRequests.filter((request) => request._id !== friendId);
    //         setFriendRequests(newFriendRequests);
    //         console.log('Friend request declined!');
    //     }
    // }

    

  return (
    <div className='w-full h-[30%] flex flex-col items-center'>
          {user ?
              <>
                <div className='w-[90%] h-full'>
                  <Link to='profile' className='flex items-center w-full hover:bg-[#424858] bg-[#282c37] rounded-lg p-2 text-[#d9e1e8]'>
                    <div className='flex items-center h-full'>
                        <span>
                            {user.profilePicture ? <img src={user.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture/>}
                        </span>
                        <span className='px-4 text-clip'> 
                          {user.username}
                        </span>
                    </div>
                  </Link>
                  <MiniForm/>
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

export default Notifications