import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import useAuth from '../authentication/useAuth';
import * as userAPI from '../api/userAPI';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [friendStatus, setFriendStatus] = React.useState(0); // 0 - not friends, 1 - waiting for to decide friend, 2-wait for user, 3 - friends

  useEffect(()=>{
    if (userProfile && user && userProfile.username === user.id) {
      return;
    }
    // Check if user if friend or there is a pending request between them
    if (userProfile && user) {
      
      const isFriend = userProfile.friends.some((friend) => friend.username === user.username);
      if (isFriend) {
        setFriendStatus(3);
        return;
      }

      const waitingForUser = userProfile.pendingRequests.some((request) => request.username === user.username);
      if (waitingForUser) {
        setFriendStatus(2);
        return;
      }
      
      const waitingForFriend = userProfile.pendingFriends.some((request) => request.username === user.username);
      if (waitingForFriend) {
        setFriendStatus(1);
        return;
      }
      
      setFriendStatus(0);
    }

  }, [])

  const handleOnFriendClick = async () => {
    const res = await userAPI.sendFriendRequest(userProfile._id);

    if (res.status === 'success') {
      console.log('Friend added!');
    }
  }

  const displayFriendButtons = () => {
    return(
    <>
      {(user && friendStatus === 0) && <button onClick={handleOnFriendClick}>Add as a friend</button>}
      {(user && friendStatus === 1) && <div>Friend Request Sent!</div>}
      {(user && friendStatus === 2) && <button onClick={handleOnFriendClick}>Accept friend request</button>}
      {(user && friendStatus === 3) && <button onClick={handleOnFriendClick}>Remove friend</button>}
    </>)
  }

  return (
    <div className='w-full h-full border-[#464b5f] border-b-[1px] text-white flex flex-col'>
      
      <button className='w-full bg-[#282c37] p-3 flex items-center group' onClick={()=>setShowPost(null)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
        </svg>
        <span className='ml-3 group-hover:underline decoration-[#595aff] underline-offset-4'>Back</span>
      </button>

      <div className='w-full bg-[#313543] p-4 border-b-[#464b5f]'>
        {(userProfile && user && userProfile.username !== user.id) && displayFriendButtons()}
        { userProfile && userProfile.posts.map((post) => { 
          console.log(post)
          return (
            <Post postObj={post} key={post.id}/>
          )
        })}
      </div>
    </div>
  );
};

export default UserProfile;
