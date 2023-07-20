import React, { useEffect, useState, useRef } from 'react'
import * as postAPI from '../api/postAPI';
import * as commentAPI from '../api/commentAPI';
import useAuth from '../authentication/useAuth';
import { useForm } from 'react-hook-form';
import Comment from './Comment'
import { Link } from 'react-router-dom';
import DefaultProfilePicture from './DefaultProfilePicture';
import Spinner from './Spinner';

const PostSingle = ({ postInfo, setShowPost }) => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const { user } = useAuth(); 

    const [page, setPage] = useState(1);
    const [commentsEle, setCommentsEle] = useState([]);
    const [ error, setError ] = useState(null);
    const [ userLiked, setUserLiked ] = useState(false);
    const [fromError, setFormError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ stopFetching, setStopFetching ] = useState(false);
    const containerRef = useRef(null);

    useEffect(()=>{
        if (user && postInfo.likes.includes(user._id)) {
            setUserLiked(true);
          }
        fetchComments(page);
    }, [])

    useEffect(() => {
    
      const container = containerRef.current;
  
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      };
  
      const observer = new IntersectionObserver(
        ([entry]) => {
          console.log(entry.isIntersecting);
          if (entry.isIntersecting) {
            setIsLoading(true);
            fetchComments(page)
              .finally(() => setIsLoading(false));
          }
        },
        options
      );
  
      if (container) {
        observer.observe(container);
      }
  
      return () => {
        observer.disconnect();
      };
    }, [commentsEle]);

    const fetchComments = async(pageNum) => {
      if (stopFetching) {
        return;
      }

      setIsLoading(true);
      const res = await commentAPI.getComments(pageNum, postInfo._id);
      
      if(res.status === 'fail') {
          setError(res.data);
      }

      if (res.status === 'success') {

        if (res.data.length === 0) {
          setStopFetching(true);
          setIsLoading(false);
          return;
        }
        
        const newCommentsEle = res.data.map((comment) => { 
            return <Comment key={comment._id} commentInfo={comment} />;
        });

        if (pageNum === 1) {
          setCommentsEle([...newCommentsEle]);
        } else {
          setCommentsEle([...commentsEle,...newCommentsEle]);
        }
        setPage(pageNum+1);
      }

      setIsLoading(false);
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

      const onSubmit = async(data) => {
        setIsLoading(true);
  
        const formData = new URLSearchParams();
  
        formData.set('content', data.content);
            
          commentAPI.addComment(formData, postInfo._id)
            .then(res => {
              if (res.status === 'fail') {
                setFormError(res.data.content);
              } else {
                if (stopFetching) setStopFetching(false);
                reset();
                setPage(1);
                fetchComments(1);
                setFormError(null);
              }
            })
            .catch(err => setFormError('Could not proccess your request. Try again later.'))
            .finally(()=> setIsLoading(false));
      }

    const dateFormat = (date) => {
        const dateObj = new Date(date);

        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        return formattedDate;
    }

  return (
        <div className='w-full h-full border-[#464b5f] border-b-[1px] text-white flex flex-col '>
            
          <button className='w-full bg-[#282c37] p-3 flex items-center group' onClick={()=>setShowPost(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
            <span className='ml-3 group-hover:underline decoration-[#595aff] underline-offset-4'>Back</span>
          </button>

          <div className=' flex flex-col w-full flex-grow overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
            <div className='w-full bg-[#313543] p-4 border-b-[#464b5f]'>
              
              <div className='w-full flex justify-between items-center'>
                
                <Link className='flex items-center' to={`/profile/${postInfo.author.username}`}>
                  {postInfo.author.profilePicture ? <img src={postInfo.author.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture size={10}/>}
                  <div className='font-bold pl-3'>{postInfo.author.username}</div>
                </Link>
                
                <div>{dateFormat(postInfo.createdAt)}</div>
              
              </div>
                
              <div className='text-sm py-2 px-4'>
                {postInfo.content}
              </div>

              <div className='w-full'>
                {postInfo.image && <img src={postInfo.image} alt='Post Image' />}
              </div>

              <div className='w-full flex justify-end place-self-end pt-4'>
                
                <button className={'hover:bg-[#99acc633] p-1 rounded-md flex mr-6 ' + (userLiked && 'bg-[#99acc6]') } onClick={userLiked ? handleUnlike  : handleLike } >
                  <span className='pr-2 text-[#606984]'>{postInfo.likes.length}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9" className="w-5 h-5">
                    <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                  </svg>
                </button>
                
                <button className='hover:bg-[#99acc633] p-1 rounded-md flex mr-6'>
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

            <h4 className='border-b-[1px] border-b-[#464b5f] text-lg p-2'>Comments</h4>
              {user &&
              <form className='w-full flex justify-center items-center p-2 border-[#464b5f] border-[1px]' onSubmit={handleSubmit(onSubmit)}>
                {isLoading ? <Spinner size={12} /> :
                  <>
                    <textarea type="text" placeholder='Right your comment here!' className='rounded-md bg-transparent resize-none w-full outline-none p-1' {...register('content', { required: 'Comment text is required', minLength: { value: 1, message: 'Comment text must be at least 1 character long' }, maxLength: { value: 1000, message: 'Comment text must be less than 1000 characters long' } })}/>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 p-1 hover:bg-[#99acc633]">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                  </>
                  }
              </form>
              }

              <div className='w-full flex flex-col justify-center items-center'>
                  {commentsEle.length > 0 ? 
                  <>
                    {commentsEle}  
                    {isLoading ? 
                      <Spinner size={12} />
                      :
                      <div ref={containerRef} className='w-fill border-b-1 border-transparent'></div> 
                    }
                    </> 
                  : 
                  <div className='text-[#606984]'>
                    No comments
                  </div>}
              </div>
          </div>
        </div>
  )
}


export default PostSingle;