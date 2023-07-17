import React, { useEffect, useState } from 'react'
import PostSingle  from './PostSingle';
import useAuth from '../authentication/useAuth';
import * as postAPI from '../api/postAPI';
import { Link } from 'react-router-dom';
import DefaultProfilePicture from './DefaultProfilePicture';

export default function Post({ postInfo, setShowPost }) {

  const { user } = useAuth();
  
  const [ userLiked, setUserLiked ] = useState(false);
  

  useEffect(()=>{
    if (user && postInfo.likes.includes(user._id)) {
      setUserLiked(true);
    }
  },[])

  const timeStamp = () => {
    const pastDate = new Date(postInfo.createdAt);
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDiff = currentDate.getTime() - pastDate.getTime();

    // Convert milliseconds to seconds, minutes, hours, and days
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days) {
      return `${days} d`;
    } else if (hours) {
      return `${hours} h`;
    } else if (minutes) {
      return `${minutes} m`;
    } else {
      return `${seconds} s`;
    }
  }

  const handleLike = () => {
    if (!userLiked && user) {
      postAPI.likePost(postInfo._id)
        .then(result => {
          if (result.status === 'success') {
            setUserLiked(true);
            postInfo.likes.push(user._id);
          }
        })
        .catch(err => console.log(err))
      }
  }

  const handleUnlike = () => {
    if (userLiked && user) {
      postAPI.unlikePost(postInfo._id)
        .then(result => {
          if (result.status === 'success') {
            postInfo.likes.splice(postInfo.likes.indexOf(user._id), 1);
            setUserLiked(false);
          }
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <div className='w-full p-4 border-[#464b5f] border-b-[1px] text-white flex flex-col cursor-pointer' >
        <div className='w-full flex justify-between items-center pb-4' onClick={()=>setShowPost(postInfo)}>
            <Link className='flex items-center' to={`/profile/${postInfo.author.username}`}>
              {postInfo.author.profilePicture ? <img src={postInfo.author.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture/>}
              <div className='font-bold pl-3'>{postInfo.author.username}</div>
            </Link>
            <div className='text-[#99acc633]'>{timeStamp(postInfo.createdAt)}</div>
        </div>
        <div className='text-sm pb-4' onClick={()=>setShowPost(postInfo)}>
          <p>{decodeURI(postInfo.content)}</p>
          {postInfo.image && <img src={postInfo.image} alt='Post Images'/>}
        </div>
        <div className='w-1/3 flex justify-between place-self-end'>
            <button className={'hover:bg-[#99acc633] p-1 rounded-md flex ' + (userLiked && 'bg-[#99acc6]') } onClick={userLiked ? handleUnlike  : handleLike } >
                <span className='pr-2 text-[#606984]'>{postInfo.likes.length}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9" className="w-5 h-5">
  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
            </button>
            <button className='hover:bg-[#99acc633] p-1 rounded-md flex' onClick={()=>setShowPost(postInfo)}>
              <span className='pr-2 text-[#606984]'>{postInfo.comments.length}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9" className="w-5 h-5">
  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
              </svg>
            </button>
            <button className='hover:bg-[#99acc633] p-1 rounded-md'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9" className="w-5 h-5">
  <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
              </svg>
            </button>
        </div>
    </div>
  )
}