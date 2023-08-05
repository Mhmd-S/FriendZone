import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom';
import { createPost } from '../api/postAPI';
import useAuth from '../authentication/useAuth';
import Post from './Post';
import DefaultProfilePicture from './DefaultProfilePicture';

import Spinner from './Spinner';

const PostForm = ({ setPosts, setShowPost }) => {
    const { register, handleSubmit, watch, formState: { errors }, reset, resetField } = useForm();

    const { user } = useAuth();

    const [formError, setFormError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleFileChange = (event) => {
      setImageFile(event.target.files[0]);
    }

    const handleRemoveImage = () => {
      resetField('postImage');
      setImageFile(null);
    };

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
            resetField('content');
            resetField('postImage');           
            setFormError(null);
            setImageFile(null);
            setSuccess('Post created successfully');
            setTimeout(() => {setSuccess(null)}, 3000);
            res.data.author = user;
            setPosts(prevPosts => [ < Post key={res.data._id} postInfo={res.data} setShowPost={setShowPost} />, ...prevPosts]);

          }
        })
        .catch(err => setFormError('Could not proccess your request. Try again later.'))
        .finally(()=> setIsLoading(false));
      }

    return (
      <div className='w-full h-fit text-white border-b-[1px] border-b-[#464b5f] flex justify-center items-center'>
        {isLoading ? <Spinner size={10}/> : 
        <form onSubmit={handleSubmit(onSubmit)} className='w-full h-fit p-4 flex flex-col justify-evenly' >
          
          {formError && <div className='py-px text-sm text-red-500'>{formError}</div>}
          {success && <div className='py-px text-sm text-green-500'>{success}</div>}
          
          <div className='flex'>
          
            <Link className='flex items-center self-start pt-2' to={`/profile/${user.username}`}>
              {user.profilePicture ? <img src={user.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture size={10}/>}
            </Link>

            <label htmlFor="content" className='invisible'>Post</label>
            <textarea className='bg-transparent outline-none text-xl py-4 my-2 w-full resize-none' placeholder='Share your thoughts!' {...register('content', { required: 'Post text is required', minLength: { value: 1, message: 'Post text must be at least 1 character long' }, maxLength: { value: 1000, message: 'Post text must be less than 1000 characters long' } })} />
            {errors?.content && <div className='py-px text-sm text-red-500'>{errors.content.message}</div>}
          
          </div>
          
          {imageFile && 
            <div className='w-[50%] relative self-center flex justify-center items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-6 h-6 right-[2.5%] top-[2.5%] absolute cursor-pointer" onClick={handleRemoveImage}>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
              <img className='w-[95%] aspect-auto rounded-xl' src={URL.createObjectURL(imageFile)} alt='Preview' />
            </div>
          }

          <div className='flex items-center justify-between pt-2'>
            <div className='p-2 h-fit w-fit relative flex justify-center items-center'>
              <label className='h-fit w-fit' htmlFor='postImage'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
              </label>
              <input type='file' accept='.png, .jpg, .jpeg' onInput={handleFileChange} className='opacity-0 absolute w-full h-full' {...register('postImage')} name='postImage'/>
            </div>
            <button type='submit' className='bg-[#595aff] p-2 rounded-md'>Share</button>
          </div>
      </form>
      }
      </div>
  )
}

export default PostForm;