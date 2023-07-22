import React, { useEffect, useState } from 'react'
import PostSingle  from './PostSingle';
import useAuth from '../authentication/useAuth';
import * as postAPI from '../api/postAPI';
import { Link } from 'react-router-dom';
import DefaultProfilePicture from './DefaultProfilePicture';
import Spinner from './Spinner';

export default function Post({ postInfo, setShowPost }) {

  const { user } = useAuth();
  
  const [ userLiked, setUserLiked ] = useState(false);
  const [isLoading , setIsLoading ] = useState(false);
  const [ deleted, setDeleted ] = useState(false);
  

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

  const handleDelete = () => {
    postAPI.deletePost(postInfo._id)
      .then(result => {
        if (result.status === 'success') {
         console.log('delete'); 
          setDeleted(true);
        }
      })
      .catch(err => console.log(err))
  }

  return (
    deleted ? null :
    <div className='w-full p-4 border-[#464b5f] border-b-[1px] text-white flex flex-col cursor-pointer' >
      {isLoading ? <Spinner size={10}/> :
      <>
        <div className='w-full flex justify-between items-center' onClick={()=>setShowPost(postInfo)}>
            <Link className='flex items-center' to={`/profile/${postInfo.author.username}`}>
              {postInfo.author.profilePicture ? <img src={postInfo.author.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture size={10}/>}
              <div className='font-bold pl-3'>{postInfo.author.username}</div>
            </Link>
            <div className='text-[#99acc633]'>{timeStamp(postInfo.createdAt)}</div>
        </div>

        <div className='w-[85%] max-h-[80vh] flex flex-col text-sm pb-4 ml-[3.25rem]' onClick={()=>setShowPost(postInfo)}>
          <p className='w-full my-2 text-md'>{decodeURI(postInfo.content)}</p>
          {postInfo.image && <img src={postInfo.image} alt='Post Image' className='w-full h-[90%] object-scale-down rounded-lg'/>}
        </div>
        
        { user && user._id === postInfo.author._id &&
        <button onClick={handleDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-6 h-6">
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
          </svg>
        </button>}

        <div className='w-1/3 flex justify-between place-self-end'>
          <button className={'hover:bg-[#99acc633] p-1 rounded-md flex ' + (userLiked && 'bg-[#99acc63d]') } onClick={userLiked ? handleUnlike  : handleLike } >
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
      </>
      }
    </div>
  )
}