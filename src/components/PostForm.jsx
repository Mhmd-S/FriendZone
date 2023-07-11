import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom';
import { createPost } from '../api/postAPI';
import useAuth from '../authentication/useAuth';
import DefaultProfilePicture from './DefaultProfilePicture';

import Spinner from './Spinner';

function PostForm({ fetchPosts }) {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

    const { user } = useAuth();

    const [formError, setFormError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async(data) => {
      setLoading(true);

      const formData = new URLSearchParams();

      formData.set('content', data.content);
          
        createPost(formData)
          .then(res => {
            if (res.status === 'fail') {
              setFormError(res.data.content);
            } else {
              reset();
              fetchPosts(1);
              setFormError(null);
            }
          })
          .catch(err => setFormError('Could not proccess your request. Try again later.'))
          .finally(()=> setLoading(false));
    }

    return (
      <div className='w-full h-[30%] text-white border-b-[1px] border-b-[#464b5f] flex justify-center items-center'>
        {loading ? <Spinner size={10}/> : 
        <form onSubmit={handleSubmit(onSubmit)} className='w-full h-full p-4 flex flex-col justify-evenly' >
          
          {formError && <div className='py-px text-sm text-red-500'>{formError}</div>}
          
          <div className='flex'>
            <Link className='flex items-center self-start pt-2' to={`/profile/${user.username}`}>
              {user.profilePicture ? <img src={user.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture/>}
            </Link>

            <label htmlFor="content" className='invisible'>Post</label>

            <textarea className='bg-transparent outline-none text-xl py-4 w-full resize-none' placeholder='Share your thoughts!' {...register('content', { required: 'Post text is required', minLength: { value: 1, message: 'Post text must be at least 1 character long' }, maxLength: { value: 1000, message: 'Post text must be less than 1000 characters long' } })} />
            {errors?.content && <div className='py-px text-sm text-red-500'>{errors.content.message}</div>}
          </div>
          
          <div className='flex items-center justify-between pt-2'>
            <div className='p-2 h-fit w-fit relative flex justify-center items-center'>
              <label className='h-fit w-fit'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
              </label>
              <input type='file' className='opacity-0 absolute w-full h-full'/>
            </div>
            <button type='submit' className='bg-[#595aff] p-2 rounded-md'>Share</button>
          </div>
      </form>
      }
      </div>
  )
}

export default PostForm;