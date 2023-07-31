import React, { useEffect, useState } from 'react'
import useAuth from '../authentication/useAuth';
import DefaultProfilePicture from './DefaultProfilePicture';
import { Link } from 'react-router-dom';
import * as commentAPI from '../api/commentAPI';


const Comment = ({ commentInfo }) => {

  const { user, setGeneralError } = useAuth();
  
  const [ userLiked, setUserLiked ] = useState(false);
  

  useEffect(()=>{
    if (user && commentInfo.likes.includes(user._id)) {
      setUserLiked(true);
    }
  },[])

  const timeStamp = () => {
    const pastDate = new Date(commentInfo.createdAt);
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
      commentAPI.addLike(commentInfo._id)
        .then(result => {
          if (result.status === 'success') {
            setUserLiked(true);
            commentInfo.likes.push(user._id);
          }
        })
        .catch(err => {
          setGeneralError("Couldn't like post");
          setTimeout(()=>setGeneralError(null), 4000);
        })
      }
  }

  const handleUnlike = () => {
    if (userLiked && user) {
      commentAPI.deleteLike(commentInfo._id)
        .then(result => {
          if (result.status === 'success') {
            commentInfo.likes.splice(commentInfo.likes.indexOf(user._id), 1);
            setUserLiked(false);
          }
        })
        .catch(err => {
          setGeneralError("Couldn't unlike post");
          setTimeout(()=>setGeneralError(null), 4000);
        })
    }
  }

  return (
    <div className='w-full p-4 border-[#464b5f] border-b-[1px] text-white flex flex-col' >
        <div className='w-full flex justify-between items-center'>
          <Link className='flex items-center' to={`/profile/${commentInfo.author.username}`}>
            {commentInfo.author.profilePicture ? <img src={commentInfo.author.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture size={10}/>}
            <div className='font-bold pl-3'>{commentInfo.author.username}</div>
          </Link>
            <div>{timeStamp(commentInfo.createdAt)}</div>
        </div>
        <div className='text-sm p-4'>{commentInfo.content}</div>
        <div className='w-fit flex place-self-end'>
            <button className={'hover:bg-[#99acc633] p-1 rounded-md flex ' + (userLiked && 'bg-[#99acc65e]') } onClick={userLiked ? handleUnlike  : handleLike } >
                <span className='pr-2 text-[#606984]'>{commentInfo.likes.length}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9" className="w-5 h-5">
                    <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
            </button>
        </div>
    </div>
  )
}

export default Comment;