import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPost } from '../api/postAPI';
import useAuth from '../authentication/useAuth';

import Spinner from './Spinner';

function MiniForm() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

  const { user } = useAuth();

  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async(data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('postImage', data.postImage[0]);
    
    createPost(formData)
      .then(res => {
        if (res.status === 'fail') {
          setFormError(res.data.content);
        } else {
          reset();
          setFormError(null);
        }
      })
      .catch(err => setFormError('Could not proccess your request. Try again later.'))
      .finally(()=> setIsLoading(false));
    }


    return (
      <div className='w-full h-full text-white border-b-[1px] border-b-[#464b5f] mt-3 flex justify-center items-center'>
        {isLoading ? <Spinner size={10}/> : 
        <form onSubmit={handleSubmit(onSubmit)} className='w-full h-full p-4 flex flex-col justify-between  bg-white text-black rounded-lg' >
          
            {formError && <div className='py-px text-sm text-red-500'>{formError}</div>}

            <label htmlFor="content" className='hidden'>Post</label> 
            <textarea className='bg-transparent outline-none text-sm w-full h-[60%] resize-none' placeholder='Share your thoughts!' {...register('content', { required: 'Post text is required', minLength: { value: 1, message: 'Post text must be at least 1 character long' }, maxLength: { value: 500, message: 'Post text must be less than 500 characters long' } })} />
            
            {errors?.content && <div className='py-px text-sm text-red-500'>{errors?.content.message}</div>}
          
            <div className='flex w-full h-[30%] items-center justify-between pt-2'>

                <div className='p-2 h-fit w-fit relative flex justify-center items-center'>
                   
                    <label className='h-fit w-fit'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <input type='file' className='opacity-0 absolute w-full h-full' {...register('postImage')} name='postImage'/>
                
                </div>
                
                <button type='submit' className='bg-[#595aff] hover:bg-[#4c4cf3] p-2 rounded-md'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </form>
      }
      </div>
    )
}

export default MiniForm;