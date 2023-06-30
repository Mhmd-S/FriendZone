import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import useAuth from '../authentication/useAuth';
import * as userAPI from '../api/userAPI';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';

export const loader = async({ params }) => {
  const userInfo = await userAPI.getUser(params.username);
    
  if (userInfo.status === 'fail') {
      return { user: null };
  }

  const userProfile = userInfo.data;

  return { userProfile };
}

const UserProfile = () => {
  const { userProfile } = useLoaderData(); 
  const navigate = useNavigate();
  const { user } = useAuth();

  const [friendStatus, setFriendStatus] = React.useState(0); // 0 - not friends, 1 - waiting for to decide friend, 2-wait for user, 3 - friends

  useEffect(()=>{
    if (userProfile && user && userProfile.username === user.id) {
      navigate('/profile');
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

  return (
    <div>
      <h2>{userProfile ? userProfile.username : "Could't get user!"}</h2>
      {(user && friendStatus === 0) && <button onClick={handleOnFriendClick}>Add as a friend</button>}
      {(user && friendStatus === 1) && <div>Friend Request Sent!</div>}
      {(user && friendStatus === 2) && <button onClick={handleOnFriendClick}>Accept friend request</button>}
      {(user && friendStatus === 3) && <button onClick={handleOnFriendClick}>Remove friend</button>}
      <h3>Posts</h3>
      { userProfile && userProfile.posts.map((post) => { 
        console.log(post)
        return (
          <Post postObj={post} key={post.id}/>
        )
      })}
    </div>
  );
};

export default UserProfile;
