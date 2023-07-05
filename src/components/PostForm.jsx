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
      <div className='w-full h-[40%] p-4 text-white border-b-[1px] border-b-[#464b5f] flex justify-center items-center'>
        {loading ? <Spinner size={10}/> : 
        <form onSubmit={handleSubmit(onSubmit)} className='w-full h-full' >
          
          {formError && <div className='py-px text-sm text-red-500'>{formError}</div>}
          
          <div className='flex'>
            <Link className='flex items-center' to={`/profile/${user.username}`}>
              {user.profilePicture ? <img src={user.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture/>}
            </Link>

            <label htmlFor="content" className='invisible'>Post</label>

            <textarea className='w-[80%] bg-transparent outline-none text-xl py-4 w-full resize-none' placeholder='Share your thoughts!' {...register('content', { required: 'Post text is required', minLength: { value: 1, message: 'Post text must be at least 1 character long' }, maxLength: { value: 1000, message: 'Post text must be less than 1000 characters long' } })} />
            {errors?.content && <div className='py-px text-sm text-red-500'>{errors.content.message}</div>}
          </div>
          
          <div className='flex items-center justify-between'>
            <input type='file'/>
            <button type='submit' className='bg-[#595aff] p-2 rounded-md'>Share</button>
          
          </div>
      </form>
      }
      </div>
  )
}

export default PostForm;