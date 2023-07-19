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
                    <li key={request._id}>
                        <Link to={`/profile/${request.username}`}>{request.username}</Link>
                        <button onClick={()=>handleAcceptFriendRequest(request._id)}>Accept</button>
                        <button onClick={()=>handleDeclineFriendrequest(request._id)}>Decline</button>
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
        <ul className='flex flex-col w-full flex-grow overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
            {friendRequests.length > 1 ? friendRequests : <div className='w-full h-full text-[#606984] flex justify-center items-center'>No notifications</div>}
        </ul>
    </div>
  )
}

export default Notifications