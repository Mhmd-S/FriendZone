import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import useAuth from '../authentication/useAuth';
import * as userAPI from '../api/userAPI';
import Post from '../components/Post';
import DefaultProfilePicture from '../components/DefaultProfilePicture';
import Settings from './Settings';
import PostSingle from './PostSingle';

export const loader = async({ params }) => {
  const userInfo = await userAPI.getUser(params.username);

  if (!userInfo || userInfo.status === 'fail') {
      return {userProfile: null };
  }

  const userProfile = userInfo.data;

  return { userProfile };
}

const Profile = () => {
  const { user } = useAuth();
  const { userProfile } = useLoaderData();  
  const [ profilePicture, setProfilePicture ] = React.useState(null);
  const [showPost, setShowPost] = React.useState(null);
  const [showSettings, setShowSettings] = React.useState(false);

  const [friendStatus, setFriendStatus] = React.useState(0); // 0 - not friends, 1 - waiting for to decide friend, 2-wait for user, 3 - friends

  useEffect(()=>{
    if(!userProfile) {
      return;
    }

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
      setFriendStatus(1);
    }
  }

  const handleAcceptFriendRequest = async () => {
    const res = await userAPI.acceptFriendRequest(userProfile._id);
    if (res.status === 'success') {
        setFriendStatus(3);
    }
  }

  const handleDeclineFriendrequest = async () => {        
      const res = await userAPI.declineFriendRequest(userProfile._id);
      if (res.status === 'success') {
          setFriendStatus(0);
      }
  }

  const handleRemoveFriend = async () => {        
    const res = await userAPI.removeFriend(userProfile._id);
    if (res.status === 'success') {
        setFriendStatus(0);
    }
  }

  const displayFriendButtons = () => {
    if (user === null) return;

    if (user._id ===userProfile._id) return (<button className='bg-[#787ad9] hover:bg-[##494aa1] text-white rounded-md w-2/3 py-1 ' onClick={()=>setShowSettings(true)}>Edit Profile</button> )

    return(
    <>
      {(user && friendStatus === 0) && <button className='bg-[#787ad9] hover:bg-[##494aa1] text-white rounded-md w-2/3 py-1' onClick={handleOnFriendClick}>Add Friend</button>}
      {(user && friendStatus === 1) && <div className='bg-[#787ad9] hover:bg-[##494aa1] text-white rounded-md w-2/3 py-1'>Request Sent!</div>}
      {(user && friendStatus === 2) && <div><button className='bg-[#787ad9] hover:bg-[##494aa1] text-white rounded-md w-2/3 py-1' onClick={handleAcceptFriendRequest}>Accept Request</button><button className='bg-[#787ad9] hover:bg-[##494aa1] text-white rounded-md w-2/3 py-1' onClick={handleDeclineFriendrequest  }>Decline Request</button> </div>}
      {(user && friendStatus === 3) && <button className='bg-[#787ad9] hover:bg-[##494aa1] text-white rounded-md w-2/3 py-1' onClick={handleRemoveFriend}>Remove Friend</button>}
      
    </>)
  }
  
  return (
    <div className='h-full w-full bg-[#282c37] flex flex-col'>
      {!userProfile ? <div className='w-full h-full flex justify-center items-center'><h1 className='text-3xl text-slate-400 underline'>Profile Not Found</h1></div> :
      (showPost ? <PostSingle postInfo={showPost} setShowPost={setShowPost}/> : showSettings ? <Settings setShowSettings={setShowSettings}/> :
      <div className='w-full h-full flex-grow overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
      <div className='flex flex-col w-full h-[65%] border-b-[1px] border-b-[#464b5f] items-center bg-[#373b45] rounded-t-lg relative'>
        <div className='w-full h-2/5 bg-[#2f323a]'>
          {userProfile.profileHeader && <img src={userProfile.profileHeader} alt='Header Picture' className='w-full h-full object-cover rounded-t-lg'></img>}
        </div>
        <div className='absolute left-[5%] top-[25%] h-fit rounded-full bg-[#595aff]'>
          {userProfile.profilePicture ? 
            <img src={userProfile.profilePicture} alt='Profile Picture' className='w-24 rounded-full aspect-square'></img>
            : 
            <DefaultProfilePicture customSize={'24'}/>}
        </div>
        <div className='w-full h-3/5 flex'>
          <div className='w-2/3 h-full pt-16 px-4 grid grid-cols-1'>
            <span className='text-xl text-white pb-4'>{userProfile && userProfile.username}</span>
            <span className='text-sm text-white'>{userProfile.bio ? userProfile.bio : <span className='text-slate-400'>No bio found</span> }</span>
            <div className='flex self-end text-white text-sm pb-2'>
              <span><span className='text-slate-400'>Friends:</span> {userProfile.friends.length}</span>
              <span><span className='pl-3 text-slate-400'>Posts:</span> {userProfile.posts.length}</span>
            </div>  
          </div>
          <div className='w-1/3 h-full flex flex-col justify-between items-center py-4'>
            {displayFriendButtons()}
          </div>
        </div>
      </div>

      <div className='flex h-[60%] flex-col w-full'>
        { userProfile && userProfile.posts.length>0 ? userProfile.posts.map((post) => { 
          return (
            <Post postInfo={post} setShowPost={setShowPost} key={post.id}/>
          )
        }) : <div className='text-white text-center w-full h-full flex justify-center items-center'>No posts yet!</div>}
      </div>
    </div>
      )
}

    </div>
  );
};

export default Profile;