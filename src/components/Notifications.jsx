import React, { useEffect, useState } from 'react';
import useAuth from '../authentication/useAuth';
import * as userAPI from '../api/userAPI';
import { Link } from 'react-router-dom';


const Notifications = () => {

    const { user } = useAuth();     

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        if (user) {
            fetchFriends();
        }
    }, [user])

    const fetchFriends = async() => {
        setIsLoading
        const userFriendsAndRequests = await userAPI.getUserFriends();
        if (userFriendsAndRequests.data.pendingFriends.length > 0) {
            const requestEle = userFriendsAndRequests.data.pendingFriends.map((request) => {
                return(
                    <li key={request._id} className='flex w-full justify-between items-center bg-[#99acc660] rounded-md p-2'>
                        <Link to={`/profile/${request.username}`}>{request.username}</Link>
                        <div>
                            <button onClick={()=>handleAcceptFriendRequest(request._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button onClick={()=>handleDeclineFriendrequest(request._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-10 h-10">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </li>)
            })
            setFriendRequests(requestEle)
        }        
    }

    const handleAcceptFriendRequest = async (friendId) => {
        const res = await userAPI.acceptFriendRequest(friendId);
        if (res.status === 'success') {
            let newFriendRequests = friendRequests.slice();
            newFriendRequests.filter((request) => request._id !== friendId);
            setFriendRequests(newFriendRequests);
            console.log('Friend added!');
        }
    }

    const handleDeclineFriendrequest = async (friendId) => {        
        const res = await userAPI.declineFriendRequest(friendId);
        if (res.status === 'success') {
            let newFriendRequests = friendRequests.slice();
            newFriendRequests.filter((request) => request._id !== friendId);
            setFriendRequests(newFriendRequests);
            console.log('Friend request declined!');
        }
    }

  return (
    <div className='w-full h-full flex flex-col justify-between  bg-white text-black rounded-lg mt-4'>
        <h1 className='w-full p-2 rounded-t-lg bg-[#e7e9ec] text-[#606984]'>Notifications</h1>
        <ul className='flex flex-col w-full flex-grow p-2 overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
            {friendRequests.length > 0 ? friendRequests : <div className='w-full h-full text-[#606984] flex justify-center items-center'>No notifications</div>}
        </ul>
    </div>
  )
}

export default Notifications