import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as userAPI from '../api/userAPI';
import Spinner from './Spinner';

const Settings = ({setShowSettings}) => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const onSubmit = data => { 
        setIsLoading(true);
        const formData = new FormData();
        formData.append('bio', data.bio);
        formData.append('headerPicture', data.headerPicture[0]);
        formData.append('profilePicture', data.profilePicture[0]);
        userAPI.updateProfile(formData)
          .then((res)=>{
            reset();
            setMessage("Profile updated successfully");
            setIsLoading(false);
          })
          .catch((err)=>{
            setMessage("Something went wrong. Try again later");
            setIsLoading(false);
          })
    };


    return (
      <div className='w-full h-full border-[#464b5f] border-b-[1px] text-white flex flex-col justify-center items-center'>
          {isLoading ? <Spinner size={20}/>
          :<>
          <button className='w-full bg-[#282c37] p-3 flex items-center group' onClick={()=>setShowSettings(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
              <span className='ml-3 group-hover:underline decoration-[#595aff] underline-offset-4'>Back</span>
          </button>

          <h1 className='pl-4 text-2xl'>Settings</h1>

          <div className=' flex flex-col w-full flex-grow overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>

            <form className='flex flex-col justify-evenly items-center w-full h-full  px-3' onSubmit={handleSubmit(onSubmit)}>
                <h3>{message}</h3>
                <label className='w-full flex flex-col pl-2'>
                    <span>Bio</span>
                    <span className='text-sm text-slate-400'>Desribe yourself!</span>
                </label>
                <textarea type='text' className='w-full h-1/5 p-3 bg-[#282c37] border-[#464b5f] border-[1px] rounded-xl outline-none resize-none' {...register('bio', { minLength: { value: 1, message: 'Bio must be at least 1 character long' }, maxLength: { value: 160, message: 'Bio must be less than 160 characters long'}})}/>
                {errors.bio && <span className='text-red-500 text-sm'>{errors.bio.message}</span>}

                <label className='w-full flex flex-col pl-2' htmlFor='profilePicture'>
                    <span>Profile Picture</span>
                    <span className='text-sm text-slate-400'>2MB max size.</span>
                </label>
                  <input type='file' className='w-full pl-3' {...register('profilePicture')} name='profilePicture' />

                <label className='w-full flex flex-col pl-2' htmlFor='headerPicture'>
                    <span>Profile Header</span>
                    <span className='text-sm text-slate-400'>2MB max size</span>
                </label>
                <input type='file' className='w-full pl-3' {...register('headerPicture')} name='headerPicture' />

                <button className='w-1/2 py-2 bg-[#595aff] rounded-lg'>Save changes</button>
              </form>


          </div>
          </>
      }

      </div>
    )
}

export default Settings