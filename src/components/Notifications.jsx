import React, { useEffect } from 'react'
import useAuth from '../authentication/useAuth'
import { Link } from 'react-router-dom'
import * as userAPI from '../api/userAPI'

const Notifications = () => {

    const { user } = useAuth();

    const [friendRequests, setFriendRequests] = React.useState([]);

    useEffect(() => {  
        if (!user) {
            return;
        }
        fetchFriends().then(()=>{
            console.log('Friend requests fetched!');
        })
    },[])

    const fetchFriends = async() => {
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
    <div>
          {user ? (
            <> {/* If logged in display this div */}
                <div> {/* User profile */}
                  <p>img</p>
                  <p>{user.username}</p>
                </div>

                <h4>Notifications</h4> {/* Friend Requests */}
                <ul>
                    {friendRequests ? friendRequests : <p>No friend requests</p>}
                </ul>

                <h4>Friend you may know!</h4>
                <ul>
                  <Link>Friend 1</Link>
                  <Link>Friend 2</Link>
                  <Link>Friend 3</Link>
                </ul>
            </>
          ) : ( 
            <div> {/* If not logged in display this div */}
              <Link to='login'>Login</Link>
              <p>OR</p>
              <Link to='signup'>Signup</Link>
            </div>
          )}
        </div>
  )
}

export default Notifications